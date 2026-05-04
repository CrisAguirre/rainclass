import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressService } from '../../services/progress.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-laboratories',
  templateUrl: './laboratories.component.html',
  styleUrls: ['./laboratories.component.css']
})
export class LaboratoriesComponent implements OnInit, OnDestroy {

  labs = [
    { id: 1, title: 'Introducción',             icon: '🎯', description: 'Conoce los fundamentos de la Realidad Aumentada y la ruta de aprendizaje que recorrerás.',          status: 'locked' as const },
    { id: 2, title: 'Merge Cube',               icon: '🧊', description: 'Explora objetos 3D y simulaciones en la palma de tu mano.',                                         status: 'locked' as const },
    { id: 3, title: 'QuiverVision',             icon: '🎨', description: 'Dale vida a páginas para colorear con realidad aumentada interactiva.',                              status: 'locked' as const },
    { id: 4, title: 'Actionbound',              icon: '🗺️', description: 'Recorridos, búsquedas del tesoro y aventuras de aprendizaje gamificadas.',                         status: 'locked' as const },
    { id: 5, title: 'Metaverso Meta',           icon: '🌐', description: 'Conéctate, colabora y aprende en entornos virtuales inmersivos.',                                   status: 'locked' as const },
    { id: 6, title: 'RA Propia – Generador 3D', icon: '🔬', description: 'Escanea patrones QR y genera modelos 3D interactivos por asignatura.',                             status: 'locked' as const },
    { id: 7, title: 'Modelo con Geoposición',   icon: '📍', description: 'Ancla modelos 3D a marcadores AR físicos con posición y nivelación en tiempo real.',               status: 'locked' as const },
  ] as { id: number; title: string; icon: string; description: string; status: string }[];

  private sub!: Subscription;

  constructor(private progressService: ProgressService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.sub = this.progressService.progress$.subscribe(p => {
      this.labs = this.labs.map(lab => {
        const prog = p.labs.find(l => l.id === lab.id);
        return prog ? { ...lab, status: prog.status } : lab;
      });
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  enter(lab: any): void {
    if (lab.status === 'locked') return;
    const user = this.authService.getCurrentUser();
    this.progressService.startLab(lab.id, user?.userId, user?.displayName);
    this.router.navigate(['/laboratories', lab.id, 'inicio']);
  }

  isLocked(lab: any): boolean { return lab.status === 'locked'; }

  btnLabel(status: string): string {
    const m: Record<string,string> = { available: '🚀 Comenzar misión', 'in-progress': '⚡ Continuar', completed: '🔁 Repetir', locked: '🔒 Bloqueada' };
    return m[status] ?? 'Ingresar';
  }
}
