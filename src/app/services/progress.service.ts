import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LabProgress {
  id: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  completedAt?: string | null;
  xpEarned?: number;
}

export interface UserProgress {
  labs: LabProgress[];
  totalXP: number;
  level: number;
  lastActivity?: string | null;
}

// ── CORRECCIÓN: clave por usuario para evitar mezcla de progresos ──────────────
// Antes: 'rainclass_progress' (global → cualquier usuario leía el mismo cache)
// Ahora: 'rainclass_progress_<userId>' (aislado por usuario)
const STORAGE_KEY_PREFIX = 'rainclass_progress_';
const TOTAL_LABS         = 6;
const XP_PER_LAB         = 150;
const API_URL            = `${environment.apiUrl}/progress`;

const STATUS_RANK: Record<string, number> = {
  locked: 0, available: 1, 'in-progress': 2, completed: 3
};

@Injectable({ providedIn: 'root' })
export class ProgressService {

  // Estado inicial SIEMPRE limpio al arrancar la app.
  // No se lee localStorage hasta saber quién es el usuario (en loadFromBackend).
  // Esto garantiza que el usuario nuevo vea solo la misión 1 disponible.
  private _progress$ = new BehaviorSubject<UserProgress>(this.defaultProgress());
  progress$ = this._progress$.asObservable();

  // userId activo — se fija al hacer login
  private _currentUserId: string | null = null;

  get snapshot(): UserProgress { return this._progress$.getValue(); }

  constructor(private http: HttpClient) {}

  /**
   * Se llama desde el login tras autenticar al usuario.
   * 1. Fija el userId para aislar el localStorage.
   * 2. Lee el caché LOCAL de ese usuario (aislado por userId).
   * 3. Lo fusiona con el estado del BACKEND (siempre gana el más avanzado).
   * 4. Si el local estaba más adelante, lo empuja al backend.
   */
  loadFromBackend(userId: string): Observable<UserProgress> {
    this._currentUserId = userId;
    return this.http.get<UserProgress>(`${API_URL}/${userId}`).pipe(
      tap(backendData => {
        const local  = this.loadLocal();       // lee caché de ESTE usuario
        const merged = this.mergeProgress(local, backendData);
        this.saveLocal(merged);
        this._progress$.next(merged);

        if (this.isLocalAhead(local, backendData)) {
          this.http.put(`${API_URL}/${userId}`, { ...merged, username: '' })
            .pipe(catchError(() => of(null))).subscribe();
        }
      }),
      catchError(() => {
        const local = this.loadLocal();
        this._progress$.next(local);
        return of(local);
      })
    );
  }

  startLab(labId: number, userId?: string, username?: string): void {
    const p   = this.cloneProgress();
    const lab = p.labs.find(l => l.id === labId);

    if (lab && lab.status === 'available') {
      lab.status = 'in-progress';
      this.saveLocal(p);
      this._progress$.next(p);

      if (userId) {
        this.http.patch(`${API_URL}/${userId}/start/${labId}`, { username, currentLabs: p.labs })
          .pipe(catchError(() => of(null)))
          .subscribe(remote => {
            if (remote) {
              const merged = this.mergeProgress(p, remote as UserProgress);
              this.saveLocal(merged);
              this._progress$.next(merged);
            }
          });
      }
    }
  }

  completeLab(labId: number, userId?: string, username?: string, percentage?: number): void {
    const p   = this.cloneProgress();
    const lab = p.labs.find(l => l.id === labId);
    if (!lab) return;

    if (lab.status !== 'completed') {
      lab.status      = 'completed';
      lab.completedAt = new Date().toISOString();
      lab.xpEarned    = percentage != null
        ? Math.round((percentage / 100) * XP_PER_LAB)
        : XP_PER_LAB;
    }

    // Siempre desbloquear el siguiente
    const next = p.labs.find(l => l.id === labId + 1);
    if (next && next.status === 'locked') next.status = 'available';

    p.totalXP      = p.labs.reduce((sum, l) => sum + (l.xpEarned || 0), 0);
    p.level        = Math.floor(p.totalXP / 300) + 1;
    p.lastActivity = new Date().toISOString();

    this.saveLocal(p);
    this._progress$.next(p);

    if (userId) {
      this.http.patch(`${API_URL}/${userId}/complete/${labId}`, { username, percentage, currentLabs: p.labs })
        .pipe(catchError(() => of(null)))
        .subscribe(remote => {
          if (remote) {
            const merged = this.mergeProgress(p, remote as UserProgress);
            this.saveLocal(merged);
            this._progress$.next(merged);
          }
        });
    }
  }

  syncToBackend(userId: string, username: string): Observable<UserProgress> {
    const p = this.snapshot;
    return this.http.put<UserProgress>(`${API_URL}/${userId}`, { ...p, username }).pipe(
      tap(remote => {
        const merged = this.mergeProgress(p, remote);
        this.saveLocal(merged);
        this._progress$.next(merged);
      }),
      catchError(() => of(p))
    );
  }

  resetProgress(userId?: string): void {
    const fresh = this.defaultProgress();
    this.saveLocal(fresh);
    this._progress$.next(fresh);
    if (userId) {
      this.http.delete(`${API_URL}/${userId}`)
        .pipe(catchError(() => of(null))).subscribe();
    }
  }

  /** Limpia el estado en memoria al hacer logout — el próximo usuario arranca limpio */
  clearSession(): void {
    this._currentUserId = null;
    this._progress$.next(this.defaultProgress());
  }

  get globalPercent(): number {
    const completed = this.snapshot.labs.filter(l => l.status === 'completed').length;
    return Math.round((completed / TOTAL_LABS) * 100);
  }

  isAvailable(labId: number): boolean {
    const lab = this.snapshot.labs.find(l => l.id === labId);
    return !!lab && lab.status !== 'locked';
  }

  // ── Helpers privados ──────────────────────────────────────────────────────────

  private storageKey(): string {
    // Clave específica por usuario: ningún otro usuario toca este caché
    return this._currentUserId
      ? `${STORAGE_KEY_PREFIX}${this._currentUserId}`
      : `${STORAGE_KEY_PREFIX}anonymous`;
  }

  private mergeProgress(local: UserProgress, remote: UserProgress): UserProgress {
    const localLabs  = local?.labs  || [];
    const remoteLabs = remote?.labs || [];

    const mergedMap = new Map<number, LabProgress>();
    remoteLabs.forEach(lab => mergedMap.set(lab.id, { ...lab }));

    localLabs.forEach(localLab => {
      const remoteLab = mergedMap.get(localLab.id);
      if (!remoteLab) {
        mergedMap.set(localLab.id, { ...localLab });
      } else {
        const lRank = STATUS_RANK[localLab.status]  ?? 0;
        const rRank = STATUS_RANK[remoteLab.status] ?? 0;
        if (lRank > rRank) mergedMap.set(localLab.id, { ...localLab });
      }
    });

    const mergedLabs = Array.from(mergedMap.values()).sort((a, b) => a.id - b.id);

    // Garantizar consistencia secuencial
    for (let i = 0; i < mergedLabs.length - 1; i++) {
      if (mergedLabs[i].status === 'completed' && mergedLabs[i + 1].status === 'locked') {
        mergedLabs[i + 1] = { ...mergedLabs[i + 1], status: 'available' };
      }
    }

    const totalXP = mergedLabs.reduce((sum, l) => sum + (l.xpEarned || 0), 0);
    const level   = Math.floor(totalXP / 300) + 1;
    return { ...(remote || {}), labs: mergedLabs, totalXP, level };
  }

  private isLocalAhead(local: UserProgress, remote: UserProgress): boolean {
    const localLabs  = local?.labs  || [];
    const remoteLabs = remote?.labs || [];
    return localLabs.some(localLab => {
      const remoteLab = remoteLabs.find(r => r.id === localLab.id);
      if (!remoteLab) return false;
      return (STATUS_RANK[localLab.status] ?? 0) > (STATUS_RANK[remoteLab.status] ?? 0);
    });
  }

  defaultProgress(): UserProgress {
    const labs: LabProgress[] = Array.from({ length: TOTAL_LABS }, (_, i) => ({
      id:          i + 1,
      status:      i === 0 ? 'available' : 'locked',
      xpEarned:    0,
      completedAt: null
    }));
    return { labs, totalXP: 0, level: 1, lastActivity: null };
  }

  private loadLocal(): UserProgress {
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migrar si tiene menos labs de los esperados
        if (parsed.labs && parsed.labs.length < TOTAL_LABS) {
          while (parsed.labs.length < TOTAL_LABS) {
            parsed.labs.push({ id: parsed.labs.length + 1, status: 'locked', xpEarned: 0 });
          }
        }
        return parsed;
      }
    } catch {}
    return this.defaultProgress();
  }

  private saveLocal(p: UserProgress): void {
    try { localStorage.setItem(this.storageKey(), JSON.stringify(p)); } catch {}
  }

  private cloneProgress(): UserProgress {
    return { ...this.snapshot, labs: this.snapshot.labs.map(l => ({ ...l })) };
  }
}
