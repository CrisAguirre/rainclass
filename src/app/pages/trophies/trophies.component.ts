import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EvaluationService } from '../../services/evaluation.service';
import { ProgressService } from '../../services/progress.service';
import { environment } from '../../../environments/environment';

export type MedalType = 'platinum' | 'gold' | 'silver' | 'bronze' | 'none';

export interface MissionMedal {
  missionId: number;
  missionName: string;
  missionIcon: string;
  medal: MedalType;
  percentage: number | null;
  hasEval: boolean;
}

interface DocenteRow {
  userId: string;
  displayName: string;
  medals: MissionMedal[];
  totalEarned: number;
}

const MISSIONS: { id: number; name: string; icon: string; hasEval: boolean }[] = [
  { id: 1, name: 'Introducción',              icon: '🎯', hasEval: true  },
  { id: 2, name: 'Merge Cube',                icon: '🧊', hasEval: true  },
  { id: 3, name: 'QuiverVision',              icon: '🎨', hasEval: true  },
  { id: 4, name: 'Actionbound',               icon: '🗺️', hasEval: true  },
  { id: 5, name: 'Metaverso Meta',            icon: '🌐', hasEval: true  },
  { id: 6, name: 'Visualizador Modelos 3D',   icon: '🔬', hasEval: false },
  { id: 7, name: 'Modelo 3D con Geoposición', icon: '📍', hasEval: true  },
];

function medalFromPercentage(pct: number | null): MedalType {
  if (pct === null) return 'none';
  if (pct === 100) return 'platinum';
  if (pct >= 90)   return 'gold';
  if (pct >= 80)   return 'silver';
  if (pct >= 70)   return 'bronze';
  return 'none';
}

function buildMedals(bestScores: Map<number, number>): MissionMedal[] {
  return MISSIONS.map(m => {
    const pct = m.hasEval ? (bestScores.get(m.id) ?? null) : null;
    return {
      missionId:   m.id,
      missionName: m.name,
      missionIcon: m.icon,
      medal:       m.hasEval ? medalFromPercentage(pct) : 'none',
      percentage:  pct,
      hasEval:     m.hasEval,
    };
  });
}

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.css']
})
export class TrophiesComponent implements OnInit {
  isAdmin = false;
  loading  = true;

  myMedals: MissionMedal[] = [];
  docenteRows: DocenteRow[] = [];

  readonly totalMissionsWithEval = MISSIONS.filter(m => m.hasEval).length;

  constructor(
    private authService:  AuthService,
    private evalService:  EvaluationService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    // Show the grid immediately (all medals as "none") before the API responds
    if (!this.isAdmin) {
      this.myMedals = buildMedals(new Map());
    }
    this.isAdmin ? this.loadAdminView() : this.loadDocenteView();
  }

  // ─── Docente ──────────────────────────────────────────────────
  private loadDocenteView(): void {
    const user = this.authService.getCurrentUser()!;
    this.evalService.getResultsByUser(user.userId).subscribe({
      next: (results) => {
        const best = new Map<number, number>();
        results.forEach(r => {
          const prev = best.get(r.labId) ?? 0;
          if (r.percentage > prev) best.set(r.labId, r.percentage);
        });
        this.myMedals = buildMedals(best);
        this.loading = false;
      },
      error: () => {
        this.myMedals = buildMedals(new Map());
        this.loading = false;
      }
    });
  }

  // ─── Admin ────────────────────────────────────────────────────
  private loadAdminView(): void {
    // Seed all registered docentes so they appear even with 0 evaluations
    const registered: { userId: string; displayName: string }[] =
      ((environment as any).users as any[])
        .filter((u: any) => u.role === 'docente')
        .map((u: any)    => ({ userId: u.userId, displayName: u.displayName }));

    const userBest = new Map<string, { name: string; scores: Map<number, number> }>();
    registered.forEach(d => userBest.set(d.userId, { name: d.displayName, scores: new Map() }));

    this.evalService.getAllResults().subscribe({
      next: (results) => {
        results.forEach(r => {
          if (!userBest.has(r.userId))
            userBest.set(r.userId, { name: r.username, scores: new Map() });
          const scores = userBest.get(r.userId)!.scores;
          const prev   = scores.get(r.labId) ?? 0;
          if (r.percentage > prev) scores.set(r.labId, r.percentage);
        });
        this.docenteRows = Array.from(userBest.entries()).map(([uid, d]) => {
          const medals = buildMedals(d.scores);
          return { userId: uid, displayName: d.name, medals, totalEarned: medals.filter(m => m.medal !== 'none').length };
        });
        this.loading = false;
      },
      error: () => {
        this.docenteRows = registered.map(d => ({
          userId: d.userId, displayName: d.displayName,
          medals: buildMedals(new Map()), totalEarned: 0
        }));
        this.loading = false;
      }
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────
  medalEmoji(type: MedalType): string {
    const map: Record<MedalType, string> = { platinum:'💎', gold:'🥇', silver:'🥈', bronze:'🥉', none:'⬜' };
    return map[type];
  }
  medalLabel(type: MedalType): string {
    const map: Record<MedalType, string> = { platinum:'Platino', gold:'Oro', silver:'Plata', bronze:'Bronce', none:'Sin obtener' };
    return map[type];
  }
  medalColor(type: MedalType): string {
    const map: Record<MedalType, string> = { platinum:'#b2f5ea', gold:'#fbd38d', silver:'#e2e8f0', bronze:'#f6ad55', none:'transparent' };
    return map[type];
  }
  countMedalForDocente(d: DocenteRow, type: MedalType): number {
    return d.medals.filter(m => m.medal === type).length;
  }

  // Docente summary
  get myEarned(): number { return this.myMedals.filter(m => m.medal !== 'none').length; }
  get myTotal():  number { return this.myMedals.filter(m => m.hasEval).length; }
  countMedal(type: MedalType): number { return this.myMedals.filter(m => m.medal === type).length; }

  // Admin summary
  get adminTotalDocentes(): number { return this.docenteRows.length; }
  get adminTotalTrophies(): number { return this.docenteRows.reduce((s, d) => s + d.totalEarned, 0); }
  adminCountMedal(type: MedalType): number {
    return this.docenteRows.reduce((s, d) => s + this.countMedalForDocente(d, type), 0);
  }
}
