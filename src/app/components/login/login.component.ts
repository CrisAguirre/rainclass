import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProgressService } from '../../services/progress.service';

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
    private authService: AuthService,
    private progressService: ProgressService,
    private router: Router
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
        // Cargar progreso desde el backend al iniciar sesión
        this.progressService.loadFromBackend(user.userId).subscribe(() => {
          this.router.navigate(['/intro']);
        });
      } else {
        this.isLoading = false;
        this.error = 'Credenciales incorrectas o el servidor tardó demasiado. Intente nuevamente.';
      }
    });
  }
}
