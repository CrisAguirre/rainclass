import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EvaluationService } from '../../services/evaluation.service';
import { ProgressService } from '../../services/progress.service';
import { environment } from '../../../environments/environment';

interface Collectible {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
}

interface DocenteCollectibles {
  userId: string;
  username: string;
  collectibles: Collectible[];
  earned: number;
}

@Component({
  selector: 'app-collectibles',
  templateUrl: './collectibles.component.html',
  styleUrls: ['./collectibles.component.css']
})
export class CollectiblesComponent implements OnInit {
  isAdmin = false;
  myCollectibles: Collectible[] = [];
  docenteList: DocenteCollectibles[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private evalService: EvaluationService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.loadAdminView();
    } else {
      this.loadDocenteView();
    }
  }

  private buildCollectibles(completedIds: number[], scores: { labId: number; percentage: number }[]): Collectible[] {
    return [
      { id: 'c1', name: 'Cubo Mágico', icon: '🧊', description: 'Completa la misión Merge Cube', rarity: 'comun', earned: completedIds.includes(2) },
      { id: 'c2', name: 'Pincel Digital', icon: '🖌️', description: 'Completa la misión QuiverVision', rarity: 'comun', earned: completedIds.includes(3) },
      { id: 'c3', name: 'Mapa del Tesoro', icon: '🗺️', description: 'Completa la misión Actionbound', rarity: 'raro', earned: completedIds.includes(4) },
      { id: 'c4', name: 'Visor VR', icon: '🥽', description: 'Completa la misión Metaverso Meta', rarity: 'raro', earned: completedIds.includes(5) },
      { id: 'c5', name: 'Generador RA', icon: '🔬', description: 'Completa la misión RA Propia', rarity: 'epico', earned: completedIds.includes(6) },
      { id: 'c6', name: 'Ancla Geoespacial', icon: '📍', description: 'Completa la misión Geoposición', rarity: 'epico', earned: completedIds.includes(7) },
      { id: 'c7', name: 'Mente Brillante', icon: '💡', description: 'Obtén 100% en cualquier evaluación', rarity: 'legendario', earned: scores.some(s => s.percentage === 100) },
      { id: 'c8', name: 'Coleccionista', icon: '🌟', description: 'Obtén todos los coleccionables anteriores', rarity: 'legendario', earned: completedIds.length >= 6 && scores.some(s => s.percentage === 100) },
    ];
  }

  private loadDocenteView(): void {
    const user = this.authService.getCurrentUser()!;
    const progress = this.progressService.snapshot;
    const completedIds = progress.labs.filter(l => l.status === 'completed').map(l => l.id);

    this.evalService.getResultsByUser(user.userId).subscribe({
      next: (results) => {
        this.myCollectibles = this.buildCollectibles(completedIds, results);
        this.loading = false;
      },
      error: () => {
        this.myCollectibles = this.buildCollectibles(completedIds, []);
        this.loading = false;
      }
    });
  }

  private loadAdminView(): void {
    const registered = (environment as any).users
      .filter((u: any) => u.role === 'docente')
      .map((u: any) => ({ userId: u.userId, displayName: u.displayName }));

    this.evalService.getAllResults().subscribe({
      next: (results) => {
        const userMap = new Map<string, { username: string; scores: { labId: number; percentage: number }[] }>();
        
        registered.forEach((d: any) => userMap.set(d.userId, { username: d.displayName, scores: [] }));

        results.forEach(r => {
          if (!userMap.has(r.userId)) userMap.set(r.userId, { username: r.username, scores: [] });
          userMap.get(r.userId)!.scores.push({ labId: r.labId, percentage: r.percentage });
        });

        this.docenteList = Array.from(userMap.entries()).map(([userId, data]) => {
          // Infer completed missions from evaluations
          const completedIds = data.scores.map(s => s.labId);
          const cols = this.buildCollectibles(completedIds, data.scores);
          return { userId, username: data.username, collectibles: cols, earned: cols.filter(c => c.earned).length };
        });
        this.loading = false;
      },
      error: () => {
        this.docenteList = registered.map((d: any) => ({
          userId: d.userId, username: d.displayName, collectibles: this.buildCollectibles([], []), earned: 0
        }));
        this.loading = false; 
      }
    });
  }

  rarityLabel(r: string): string {
    const m: Record<string, string> = { comun: 'Común', raro: 'Raro', epico: 'Épico', legendario: 'Legendario' };
    return m[r] ?? r;
  }

  get earnedCount(): number { return this.myCollectibles.filter(c => c.earned).length; }
}
