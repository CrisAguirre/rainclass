import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EvaluationService } from '../../services/evaluation.service';
import { ProgressService } from '../../services/progress.service';

interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  category: 'mision' | 'evaluacion' | 'progreso';
}

interface DocenteTrophies {
  userId: string;
  username: string;
  displayName: string;
  trophies: Trophy[];
  earned: number;
}

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.css']
})
export class TrophiesComponent implements OnInit {
  isAdmin = false;
  myTrophies: Trophy[] = [];
  docenteList: DocenteTrophies[] = [];
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

  private buildTrophies(completedMissions: number[], passedEvals: number[]): Trophy[] {
    return [
      { id: 't1', name: 'Primera Misión', description: 'Completaste tu primera misión', icon: '🏅', earned: completedMissions.length >= 1, category: 'mision' },
      { id: 't2', name: 'Explorador AR', description: 'Completaste 3 misiones', icon: '🥈', earned: completedMissions.length >= 3, category: 'mision' },
      { id: 't3', name: 'Maestro AR', description: 'Completaste todas las misiones', icon: '🥇', earned: completedMissions.length >= 7, category: 'mision' },
      { id: 't4', name: 'Primera Evaluación', description: 'Aprobaste tu primera evaluación', icon: '📋', earned: passedEvals.length >= 1, category: 'evaluacion' },
      { id: 't5', name: 'Evaluador Experto', description: 'Aprobaste 3 evaluaciones', icon: '🎓', earned: passedEvals.length >= 3, category: 'evaluacion' },
      { id: 't6', name: 'Docente Digital', description: 'Aprobaste todas las evaluaciones', icon: '🏆', earned: passedEvals.length >= 5, category: 'evaluacion' },
    ];
  }

  private loadDocenteView(): void {
    const user = this.authService.getCurrentUser()!;
    const progress = this.progressService.snapshot;
    const completedMissions = progress.labs.filter(l => l.status === 'completed').map(l => l.id);

    this.evalService.getResultsByUser(user.userId).subscribe({
      next: (results) => {
        const passedEvals = results.filter(r => r.percentage >= 70).map(r => r.labId);
        this.myTrophies = this.buildTrophies(completedMissions, passedEvals);
        this.loading = false;
      },
      error: () => {
        this.myTrophies = this.buildTrophies(completedMissions, []);
        this.loading = false;
      }
    });
  }

  private loadAdminView(): void {
    this.evalService.getAllResults().subscribe({
      next: (results) => {
        const userMap = new Map<string, { username: string; passedEvals: number[] }>();
        results.forEach(r => {
          if (!userMap.has(r.userId)) userMap.set(r.userId, { username: r.username, passedEvals: [] });
          if (r.percentage >= 70) userMap.get(r.userId)!.passedEvals.push(r.labId);
        });

        this.docenteList = Array.from(userMap.entries()).map(([userId, data]) => ({
          userId,
          username: data.username,
          displayName: data.username,
          trophies: this.buildTrophies([], data.passedEvals),
          earned: this.buildTrophies([], data.passedEvals).filter(t => t.earned).length
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get earnedCount(): number { return this.myTrophies.filter(t => t.earned).length; }
}
