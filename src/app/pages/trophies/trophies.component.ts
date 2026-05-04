import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EvaluationService } from '../../services/evaluation.service';
import { ProgressService } from '../../services/progress.service';

export type MedalType = 'platinum' | 'gold' | 'silver' | 'bronze' | 'none';

export interface MissionMedal {
  missionId: number;
  missionName: string;
  missionIcon: string;
  medal: MedalType;
  percentage: number | null;   // best score achieved, null = not attempted
  hasEval: boolean;            // missions 1–5 and 7 have evals; 6 does not
}

interface DocenteRow {
  userId: string;
  displayName: string;
  medals: MissionMedal[];
  totalEarned: number;
}

const MISSIONS: { id: number; name: string; icon: string; hasEval: boolean }[] = [
  { id: 1, name: 'Introducción',            icon: '🎯', hasEval: true  },
  { id: 2, name: 'Merge Cube',              icon: '🧊', hasEval: true  },
  { id: 3, name: 'QuiverVision',            icon: '🎨', hasEval: true  },
  { id: 4, name: 'Actionbound',             icon: '🗺️', hasEval: true  },
  { id: 5, name: 'Metaverso Meta',          icon: '🌐', hasEval: true  },
  { id: 6, name: 'Visualizador Modelos 3D', icon: '🔬', hasEval: false },
  { id: 7, name: 'Modelo 3D con Geoposición', icon: '📍', hasEval: true },
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
      missionId: m.id,
      missionName: m.name,
      missionIcon: m.icon,
      medal: m.hasEval ? medalFromPercentage(pct) : 'none',
      percentage: pct,
      hasEval: m.hasEval,
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
  loading = true;

  // Docente view
  myMedals: MissionMedal[] = [];

  // Admin view
  docenteRows: DocenteRow[] = [];

  constructor(
    private authService: AuthService,
    private evalService: EvaluationService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isAdmin ? this.loadAdminView() : this.loadDocenteView();
  }

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

  private loadAdminView(): void {
    this.evalService.getAllResults().subscribe({
      next: (results) => {
        const userBest = new Map<string, { name: string; scores: Map<number, number> }>();
        results.forEach(r => {
          if (!userBest.has(r.userId))
            userBest.set(r.userId, { name: r.username, scores: new Map() });
          const scores = userBest.get(r.userId)!.scores;
          const prev = scores.get(r.labId) ?? 0;
          if (r.percentage > prev) scores.set(r.labId, r.percentage);
        });
        this.docenteRows = Array.from(userBest.entries()).map(([uid, d]) => {
          const medals = buildMedals(d.scores);
          return {
            userId: uid,
            displayName: d.name,
            medals,
            totalEarned: medals.filter(m => m.medal !== 'none').length
          };
        });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  medalEmoji(type: MedalType): string {
    const map: Record<MedalType, string> = {
      platinum: '💎', gold: '🥇', silver: '🥈', bronze: '🥉', none: '⬜'
    };
    return map[type];
  }

  medalLabel(type: MedalType): string {
    const map: Record<MedalType, string> = {
      platinum: 'Platino', gold: 'Oro', silver: 'Plata', bronze: 'Bronce', none: 'Sin obtener'
    };
    return map[type];
  }

  medalColor(type: MedalType): string {
    const map: Record<MedalType, string> = {
      platinum: '#b2f5ea', gold: '#fbd38d', silver: '#e2e8f0', bronze: '#f6ad55', none: 'transparent'
    };
    return map[type];
  }

  get myEarned(): number { return this.myMedals.filter(m => m.medal !== 'none').length; }
  get myTotal(): number  { return this.myMedals.filter(m => m.hasEval).length; }
  countMedal(type: MedalType): number { return this.myMedals.filter(m => m.medal === type).length; }
}
