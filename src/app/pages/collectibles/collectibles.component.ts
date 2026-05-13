import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { EvaluationService } from '../../services/evaluation.service';
import { GamificationService } from '../../services/gamification.service';
import { ProgressService } from '../../services/progress.service';
import { environment } from '../../../environments/environment';

interface Collectible {
  id:          string;
  name:        string;
  icon:        string;
  description: string;
  earned:      boolean;
  rarity:      'comun' | 'raro' | 'epico' | 'legendario';
  earnedAt?:   string;
}

interface DocenteCollectibles {
  userId:       string;
  username:     string;
  collectibles: Collectible[];
  earned:       number;
}

@Component({
  selector:    'app-collectibles',
  templateUrl: './collectibles.component.html',
  styleUrls:   ['./collectibles.component.css']
})
export class CollectiblesComponent implements OnInit, OnDestroy {
  isAdmin        = false;
  myCollectibles: Collectible[] = [];
  docenteList:    DocenteCollectibles[] = [];
  loading        = true;

  // Suscripción reactiva al GamificationService
  private gamSub!: Subscription;

  constructor(
    private authService:   AuthService,
    private evalService:   EvaluationService,
    private gamification:  GamificationService,
    private progressService: ProgressService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.loadAdminView();
    } else {
      // ── Suscripción reactiva: coleccionables se actualizan en tiempo real
      //    cuando GamificationService otorga uno nuevo (al completar evaluación)
      this.gamSub = this.gamification.collectibles$.subscribe(() => {
        this.loadDocenteView();
      });
      this.loadDocenteView();
    }
  }

  ngOnDestroy(): void { this.gamSub?.unsubscribe(); }

  private buildCollectibles(
    completedLabIds: number[],
    scores: { labId: number; percentage: number }[],
    earnedDates: Map<string, string> = new Map()
  ): Collectible[] {
    const list = [
      { id:'c1', name:'Cubo Mágico',      icon:'🧊', description:'Completa la misión Merge Cube',        rarity:'comun'     as const, labId: 2 },
      { id:'c2', name:'Pincel Digital',    icon:'🖌️', description:'Completa la misión QuiverVision',     rarity:'comun'     as const, labId: 3 },
      { id:'c3', name:'Mapa del Tesoro',   icon:'🗺️', description:'Completa la misión Actionbound',      rarity:'raro'      as const, labId: 4 },
      { id:'c4', name:'Visor VR',          icon:'🥽', description:'Completa la misión Metaverso Meta',   rarity:'raro'      as const, labId: 5 },
      { id:'c5', name:'Generador RA',      icon:'🔬', description:'Completa la misión RA Propia',        rarity:'epico'     as const, labId: 6 },
      { id:'c6', name:'Ancla Geoespacial', icon:'📍', description:'Completa la misión Geoposición',      rarity:'epico'     as const, labId: 7 },
      { id:'c7', name:'Mente Brillante',   icon:'💡', description:'Obtén 100% en cualquier evaluación',  rarity:'legendario'as const, labId: -1 },
      { id:'c8', name:'Coleccionista',     icon:'🌟', description:'Obtén todos los coleccionables',      rarity:'legendario'as const, labId: -2 },
    ];

    // Usar coleccionables del GamificationService si están disponibles (sesión actual)
    const gamEarned = this.gamification.earnedCollectibles;

    return list.map(item => {
      let earned = false;
      if (item.labId > 0) {
        earned = completedLabIds.includes(item.labId)
          || gamEarned.some(g => g.collectibleId === `carta_${this.idMap(item.labId)}`);
      } else if (item.labId === -1) {
        earned = scores.some(s => s.percentage === 100)
          || gamEarned.some(g => g.collectibleId === 'c7');
      } else if (item.labId === -2) {
        earned = completedLabIds.length >= 6 && scores.some(s => s.percentage === 100)
          || gamEarned.some(g => g.collectibleId === 'c8');
      }
      return { ...item, earned, earnedAt: earnedDates.get(item.id) };
    });
  }

  private idMap(labId: number): string {
    const m: Record<number,string> = { 2:'merge', 3:'quiver', 4:'action', 5:'meta', 6:'ra', 7:'geo' };
    return m[labId] ?? '';
  }

  private loadDocenteView(): void {
    const user = this.authService.getCurrentUser()!;
    this.evalService.getResultsByUser(user.userId).subscribe({
      next: (results) => {
        const completedIds = [...new Set(results.map(r => r.labId))];
        const scores       = results.map(r => ({ labId: r.labId, percentage: r.percentage }));
        this.myCollectibles = this.buildCollectibles(completedIds, scores);
        this.loading = false;
      },
      error: () => {
        const progress     = this.progressService.snapshot;
        const completedIds = progress.labs.filter(l => l.status === 'completed').map(l => l.id);
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
          const completedIds = data.scores.map(s => s.labId);
          const cols = this.buildCollectibles(completedIds, data.scores);
          return { userId, username: data.username, collectibles: cols, earned: cols.filter(c => c.earned).length };
        });
        this.loading = false;
      },
      error: () => {
        this.docenteList = registered.map((d: any) => ({
          userId: d.userId, username: d.displayName,
          collectibles: this.buildCollectibles([], []), earned: 0
        }));
        this.loading = false;
      }
    });
  }

  rarityLabel(r: string): string {
    return ({ comun:'Común', raro:'Raro', epico:'Épico', legendario:'Legendario' } as any)[r] ?? r;
  }

  get earnedCount(): number { return this.myCollectibles.filter(c => c.earned).length; }
}
