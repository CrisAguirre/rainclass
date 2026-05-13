import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProgressService } from '../../services/progress.service';
import { GamificationService } from '../../services/gamification.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private authService:       AuthService,
    private progressService:   ProgressService,
    private gamification:      GamificationService,
    private router:            Router,
  ) {}

  ngOnInit(): void {
    // Despierta el servidor de Render apenas carga la pantalla de login
    this.authService.pingServer();
  }

  onLogin(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    const cleanUsername = this.username.trim();
    const cleanPassword = this.password.trim();

    this.authService.login(cleanUsername, cleanPassword).subscribe(user => {
      if (user) {
        this.error = '';

        // ── 1. Cargar progreso del backend y fusionar con local ─────────────
        this.progressService.loadFromBackend(user.userId).subscribe(() => {

          // ── 2. Cargar trofeos y coleccionables del usuario en tiempo real ──
          //    GamificationService los expone como BehaviorSubjects reactivos,
          //    así cualquier componente suscrito (Trofeos, Coleccionables) se
          //    actualiza automáticamente sin recargar la página.
          this.gamification.loadAll(user.userId);

          // ── 3. Navegar a intro ──────────────────────────────────────────────
          this.router.navigate(['/intro']);
        });

      } else {
        this.isLoading = false;
        this.error = 'Credenciales incorrectas o el servidor tardó demasiado. Intente nuevamente.';
      }
    });
  }
}
