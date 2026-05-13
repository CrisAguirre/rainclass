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

const STORAGE_KEY = 'rainclass_progress';
const TOTAL_LABS = 7;
const XP_PER_LAB = 150;
const API_URL = `${environment.apiUrl}/progress`;

// Orden de estados: cuanto mayor el número, más avanzado
const STATUS_RANK: Record<string, number> = {
  locked: 0,
  available: 1,
  'in-progress': 2,
  completed: 3
};

@Injectable({ providedIn: 'root' })
export class ProgressService {

  private _progress$ = new BehaviorSubject<UserProgress>(this.loadLocal());
  progress$ = this._progress$.asObservable();

  get snapshot(): UserProgress { return this._progress$.getValue(); }

  constructor(private http: HttpClient) {}

  /**
   * FIX #1: loadFromBackend ahora COMBINA el estado local con el del backend
   * en lugar de sobreescribir. Preserva el estado más avanzado por cada lab.
   * Esto evita que datos obsoletos del backend (p.ej. cuando Render estaba dormido
   * durante una sesión anterior) borren el progreso completado localmente.
   */
  loadFromBackend(userId: string): Observable<UserProgress> {
    return this.http.get<UserProgress>(`${API_URL}/${userId}`).pipe(
      tap(backendData => {
        const local = this.loadLocal();
        const merged = this.mergeProgress(local, backendData);
        this.saveLocal(merged);
        this._progress$.next(merged);

        // Si el local tenía datos más avanzados, sincronizarlos al backend
        if (this.isLocalAhead(local, backendData)) {
          this.http.put(`${API_URL}/${userId}`, { ...merged, username: '' })
            .pipe(catchError(() => of(null)))
            .subscribe();
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
    const p = this.cloneProgress();
    const lab = p.labs.find(l => l.id === labId);

    if (lab && lab.status === 'available') {
      lab.status = 'in-progress';
      this.saveLocal(p);
      this._progress$.next(p);

      if (userId) {
        // FIX #3: Se envía currentLabs para que el backend pueda reconstruir
        // el estado correcto si no existía registro previo en MongoDB.
        this.http.patch(`${API_URL}/${userId}/start/${labId}`, { username, currentLabs: p.labs })
          .pipe(catchError(() => of(null)))
          .subscribe(remote => {
            if (remote) {
              const rp = remote as UserProgress;
              const merged = this.mergeProgress(p, rp);
              this.saveLocal(merged);
              this._progress$.next(merged);
            }
          });
      }
    }
  }

  /**
   * FIX #2: Se eliminó el guard `lab.status === 'completed'` que impedía
   * que el PATCH al backend se llamara cuando el lab ya estaba marcado
   * como completado en el estado local. Ahora siempre se garantiza que:
   * 1) El lab quede marcado como completado.
   * 2) El siguiente lab quede desbloqueado (available).
   * 3) El backend reciba la actualización para persistirla.
   */
  completeLab(labId: number, userId?: string, username?: string, percentage?: number): void {
    const p = this.cloneProgress();
    const lab = p.labs.find(l => l.id === labId);
    if (!lab) return;

    // Marcar como completado (incluso si ya lo estaba, para garantizar consistencia)
    if (lab.status !== 'completed') {
      lab.status = 'completed';
      lab.completedAt = new Date().toISOString();
      lab.xpEarned = percentage != null ? Math.round((percentage / 100) * XP_PER_LAB) : XP_PER_LAB;
    }

    // SIEMPRE desbloquear el siguiente lab si aún está bloqueado
    const next = p.labs.find(l => l.id === labId + 1);
    if (next && next.status === 'locked') next.status = 'available';

    p.totalXP = p.labs.reduce((sum, l) => sum + (l.xpEarned || 0), 0);
    p.level = Math.floor(p.totalXP / 300) + 1;
    p.lastActivity = new Date().toISOString();

    this.saveLocal(p);
    this._progress$.next(p);

    if (userId) {
      // FIX #3: currentLabs se envía para que el backend use el estado
      // correcto al crear un nuevo registro si no existía previamente.
      this.http.patch(`${API_URL}/${userId}/complete/${labId}`, { username, percentage, currentLabs: p.labs })
        .pipe(catchError(() => of(null)))
        .subscribe(remote => {
          if (remote) {
            const rp = remote as UserProgress;
            // Merge para no perder progreso local más avanzado
            const merged = this.mergeProgress(p, rp);
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
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }

  get globalPercent(): number {
    const completed = this.snapshot.labs.filter(l => l.status === 'completed').length;
    return Math.round((completed / TOTAL_LABS) * 100);
  }

  isAvailable(labId: number): boolean {
    const lab = this.snapshot.labs.find(l => l.id === labId);
    return !!lab && lab.status !== 'locked';
  }

  // ─── Helpers privados ────────────────────────────────────────────────────────

  /**
   * Combina dos estados de progreso eligiendo el más avanzado para cada lab.
   * También garantiza la regla de desbloqueo: si lab N está 'completed',
   * el lab N+1 no puede estar 'locked'.
   */
  private mergeProgress(local: UserProgress, remote: UserProgress): UserProgress {
    const localLabs = local?.labs || [];
    const remoteLabs = remote?.labs || [];

    const mergedMap = new Map<number, LabProgress>();
    remoteLabs.forEach(lab => mergedMap.set(lab.id, { ...lab }));

    localLabs.forEach(localLab => {
      const remoteLab = mergedMap.get(localLab.id);
      if (!remoteLab) {
        mergedMap.set(localLab.id, { ...localLab });
      } else {
        const localRank = STATUS_RANK[localLab.status] ?? 0;
        const remoteRank = STATUS_RANK[remoteLab.status] ?? 0;
        if (localRank > remoteRank) {
          mergedMap.set(localLab.id, { ...localLab });
        }
      }
    });

    const mergedLabs = Array.from(mergedMap.values()).sort((a, b) => a.id - b.id);

    // Regla de consistencia: lab completado → siguiente debe ser al menos 'available'
    for (let i = 0; i < mergedLabs.length - 1; i++) {
      if (mergedLabs[i].status === 'completed' && mergedLabs[i + 1].status === 'locked') {
        mergedLabs[i + 1] = { ...mergedLabs[i + 1], status: 'available' };
      }
    }

    const totalXP = mergedLabs.reduce((sum, l) => sum + (l.xpEarned || 0), 0);
    const level = Math.floor(totalXP / 300) + 1;

    return { ...(remote || {}), labs: mergedLabs, totalXP, level };
  }

  private isLocalAhead(local: UserProgress, remote: UserProgress): boolean {
    const localLabs = local?.labs || [];
    const remoteLabs = remote?.labs || [];
    return localLabs.some(localLab => {
      const remoteLab = remoteLabs.find(r => r.id === localLab.id);
      if (!remoteLab) return false;
      return (STATUS_RANK[localLab.status] ?? 0) > (STATUS_RANK[remoteLab.status] ?? 0);
    });
  }

  private defaultProgress(): UserProgress {
    const labs: LabProgress[] = Array.from({ length: TOTAL_LABS }, (_, i) => ({
      id: i + 1,
      status: i === 0 ? 'available' : 'locked',
      xpEarned: 0,
      completedAt: null
    }));
    return { labs, totalXP: 0, level: 1, lastActivity: null };
  }

  private loadLocal(): UserProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  }

  private cloneProgress(): UserProgress {
    return { ...this.snapshot, labs: this.snapshot.labs.map(l => ({ ...l })) };
  }
}
