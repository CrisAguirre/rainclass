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

  // Estado inicial: todo bloqueado.
  // Se actualiza reactivamente cuando el BehaviorSubject del ProgressService
  // emite datos (que llegan del backend al hacer login).
  labs = [
    { id: 1, title: 'Introducción',               icon: '🎯', description: 'Conoce los fundamentos de la RA y la ruta de aprendizaje.',                        status: 'locked' },
    { id: 2, title: 'Merge Cube',                 icon: '🧊', description: 'Explora objetos 3D y simulaciones en la palma de tu mano.',                        status: 'locked' },
    { id: 3, title: 'QuiverVision',               icon: '🎨', description: 'Dale vida a páginas para colorear con realidad aumentada interactiva.',             status: 'locked' },
    { id: 4, title: 'Actionbound',                icon: '🗺️', description: 'Recorridos, búsquedas del tesoro y aventuras de aprendizaje gamificadas.',         status: 'locked' },
    { id: 5, title: 'Metaverso Meta',             icon: '🌐', description: 'Conéctate, colabora y aprende en entornos virtuales inmersivos.',                  status: 'locked' },
    { id: 6, title: 'Visualizador de Modelos 3D', icon: '🔬', description: 'Visualiza modelos 3D propios en realidad aumentada desde cualquier asignatura.',   status: 'locked' },
  ];

  private sub!: Subscription;

  constructor(
    private progressService: ProgressService,
    private router:          Router,
    private authService:     AuthService
  ) {}

  ngOnInit(): void {
    const isAdmin = this.authService.isAdmin();

    this.sub = this.progressService.progress$.subscribe(p => {
      this.labs = this.labs.map(lab => {
        // Admin: siempre puede entrar a todo
        if (isAdmin) return { ...lab, status: 'available' };

        // Docente: estado real desde el BehaviorSubject
        // (que fue cargado del backend en el login, aislado por userId)
        const prog = p.labs.find(l => l.id === lab.id);
        return { ...lab, status: prog ? prog.status : 'locked' };
      });
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  enter(lab: any): void {
    if (this.isLocked(lab)) return;
    const user = this.authService.getCurrentUser();
    this.progressService.startLab(lab.id, user?.userId, user?.displayName);
    this.router.navigate(['/laboratories', lab.id, 'inicio']);
  }

  isLocked(lab: any): boolean {
    return !this.authService.isAdmin() && lab.status === 'locked';
  }

  btnLabel(status: string): string {
    const m: Record<string, string> = {
      available:     '🚀 Comenzar misión',
      'in-progress': '⚡ Continuar',
      completed:     '🔁 Repetir',
      locked:        '🔒 Bloqueada',
    };
    return m[status] ?? 'Ingresar';
  }

  missionLabel(id: number): string { return `Misión ${id}`; }
}
