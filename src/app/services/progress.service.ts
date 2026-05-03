import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LabProgress {
  id: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  completedAt?: string;
  xpEarned?: number;
}

export interface UserProgress {
  labs: LabProgress[];
  totalXP: number;
  level: number;
  lastActivity?: string;
}

const STORAGE_KEY = 'rainclass_progress';
const TOTAL_LABS = 7;
const XP_PER_LAB = 150;

@Injectable({ providedIn: 'root' })
export class ProgressService {

  private _progress$ = new BehaviorSubject<UserProgress>(this.load());
  progress$ = this._progress$.asObservable();

  get snapshot(): UserProgress { return this._progress$.getValue(); }

  private defaultProgress(): UserProgress {
    const labs: LabProgress[] = Array.from({ length: TOTAL_LABS }, (_, i) => ({
      id: i + 1,
      status: i === 0 ? 'available' : 'locked',
      xpEarned: 0
    }));
    return { labs, totalXP: 0, level: 1 };
  }

  private load(): UserProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migrate if old save had 6 labs → expand to 7
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

  private save(p: UserProgress): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
    this._progress$.next(p);
  }

  startLab(labId: number): void {
    const p = { ...this.snapshot, labs: [...this.snapshot.labs] };
    const lab = p.labs.find(l => l.id === labId);
    if (lab && lab.status === 'available') {
      lab.status = 'in-progress';
      this.save(p);
    }
  }

  completeLab(labId: number): void {
    const p = { ...this.snapshot, labs: this.snapshot.labs.map(l => ({ ...l })) };
    const lab = p.labs.find(l => l.id === labId);
    if (!lab || lab.status === 'completed') return;

    lab.status = 'completed';
    lab.completedAt = new Date().toISOString();
    lab.xpEarned = XP_PER_LAB;
    p.totalXP = p.labs.reduce((sum, l) => sum + (l.xpEarned || 0), 0);
    p.level = Math.floor(p.totalXP / 300) + 1;
    p.lastActivity = new Date().toISOString();

    const next = p.labs.find(l => l.id === labId + 1);
    if (next && next.status === 'locked') next.status = 'available';

    this.save(p);
  }

  get globalPercent(): number {
    const completed = this.snapshot.labs.filter(l => l.status === 'completed').length;
    return Math.round((completed / TOTAL_LABS) * 100);
  }

  isAvailable(labId: number): boolean {
    const lab = this.snapshot.labs.find(l => l.id === labId);
    return !!lab && lab.status !== 'locked';
  }

  resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.save(this.defaultProgress());
  }
}
