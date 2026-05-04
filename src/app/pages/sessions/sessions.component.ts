import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressService, UserProgress } from '../../services/progress.service';
import { AuthService } from '../../services/auth.service';

interface MissionCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  xp: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  completedAt?: string | null;
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit, OnDestroy {

  missions: MissionCard[] = [
    { id: 1, title: 'Introducción',             icon: '🎯', xp: 150, description: 'Conoce los fundamentos de la Realidad Aumentada y la ruta de aprendizaje.',              status: 'locked' },
    { id: 2, title: 'Merge Cube',               icon: '🧊', xp: 150, description: 'Explora objetos 3D y simulaciones en la palma de tu mano.',                              status: 'locked' },
    { id: 3, title: 'QuiverVision',             icon: '🎨', xp: 150, description: 'Dale vida a páginas para colorear con realidad aumentada interactiva.',                   status: 'locked' },
    { id: 4, title: 'Actionbound',              icon: '🗺️', xp: 150, description: 'Recorridos, búsquedas del tesoro y aventuras de aprendizaje gamificadas.',              status: 'locked' },
    { id: 5, title: 'Metaverso Meta',           icon: '🌐', xp: 150, description: 'Conéctate, colabora y aprende en entornos virtuales inmersivos.',                        status: 'locked' },
    { id: 6, title: 'RA Propia – Generador 3D', icon: '🔬', xp: 150, description: 'Escanea patrones QR y genera modelos 3D interactivos por asignatura.',                  status: 'locked' },
    { id: 7, title: 'Modelo con Geoposición',   icon: '📍', xp: 150, description: 'Ancla modelos 3D a marcadores AR físicos con posición y nivelación en tiempo real.',    status: 'locked' },
  ];

  userProgress!: UserProgress;
  globalPercent = 0;
  totalXP = 0;
  level = 1;
  completedCount = 0;

  private sub!: Subscription;

  constructor(private progressService: ProgressService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.sub = this.progressService.progress$.subscribe(p => {
      this.userProgress = p;
      this.globalPercent = this.progressService.globalPercent;
      this.totalXP = p.totalXP;
      this.level = p.level;
      this.completedCount = p.labs.filter(l => l.status === 'completed').length;
      this.missions = this.missions.map(m => {
        const lab = p.labs.find(l => l.id === m.id);
        return lab ? { ...m, status: lab.status as any, completedAt: lab.completedAt } : m;
      });
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  goToMission(id: number): void {
    if (!this.progressService.isAvailable(id)) return;
    const user = this.authService.getCurrentUser();
    this.progressService.startLab(id, user?.userId, user?.displayName);
    this.router.navigate(['/laboratories', id, 'inicio']);
  }

  getLevelName(level: number): string {
    const names = ['', 'Explorador', 'Aprendiz AR', 'Investigador', 'Especialista', 'Maestro AR', 'Leyenda RA', 'Pionero RA'];
    return names[Math.min(level, names.length - 1)];
  }

  xpToNextLevel(): number { return (this.level * 300) - this.totalXP; }
  xpLevelPercent(): number {
    const xpInLevel = this.totalXP - ((this.level - 1) * 300);
    return Math.min(100, Math.round((xpInLevel / 300) * 100));
  }

  statusLabel(status: string): string {
    const m: Record<string,string> = { locked: 'Bloqueada', available: 'Disponible', 'in-progress': 'En progreso', completed: 'Completada' };
    return m[status] ?? status;
  }

  statusIcon(status: string): string {
    const m: Record<string,string> = { locked: '🔒', available: '🚀', 'in-progress': '⚡', completed: '✅' };
    return m[status] ?? '?';
  }

  resetProgress(): void {
    if (confirm('¿Reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
      const user = this.authService.getCurrentUser();
      this.progressService.resetProgress(user?.userId);
    }
  }
}
