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

@Injectable({ providedIn: 'root' })
export class ProgressService {

  private _progress$ = new BehaviorSubject<UserProgress>(this.loadLocal());
  progress$ = this._progress$.asObservable();

  get snapshot(): UserProgress { return this._progress$.getValue(); }

  constructor(private http: HttpClient) {}

  // Llama este método al iniciar sesión para cargar el progreso del usuario desde el backend
  loadFromBackend(userId: string): Observable<UserProgress> {
    return this.http.get<UserProgress>(`${API_URL}/${userId}`).pipe(
      tap(p => {
        this.saveLocal(p);
        this._progress$.next(p);
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
        this.http.patch(`${API_URL}/${userId}/start/${labId}`, { username })
          .pipe(catchError(() => of(null)))
          .subscribe(remote => {
            if (remote) {
              const rp = remote as UserProgress;
              this.saveLocal(rp);
              this._progress$.next(rp);
            }
          });
      }
    }
  }

  completeLab(labId: number, userId?: string, username?: string): void {
    const p = this.cloneProgress();
    const lab = p.labs.find(l => l.id === labId);
    if (!lab || lab.status === 'completed') return;

    lab.status = 'completed';
    lab.completedAt = new Date().toISOString();
    lab.xpEarned = XP_PER_LAB;

    const next = p.labs.find(l => l.id === labId + 1);
    if (next && next.status === 'locked') next.status = 'available';

    p.totalXP = p.labs.reduce((sum, l) => sum + (l.xpEarned || 0), 0);
    p.level = Math.floor(p.totalXP / 300) + 1;
    p.lastActivity = new Date().toISOString();

    this.saveLocal(p);
    this._progress$.next(p);

    if (userId) {
      this.http.patch(`${API_URL}/${userId}/complete/${labId}`, { username })
        .pipe(catchError(() => of(null)))
        .subscribe(remote => {
          if (remote) {
            const rp = remote as UserProgress;
            this.saveLocal(rp);
            this._progress$.next(rp);
          }
        });
    }
  }

  syncToBackend(userId: string, username: string): Observable<UserProgress> {
    const p = this.snapshot;
    return this.http.put<UserProgress>(`${API_URL}/${userId}`, { ...p, username }).pipe(
      tap(remote => {
        this.saveLocal(remote);
        this._progress$.next(remote);
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
