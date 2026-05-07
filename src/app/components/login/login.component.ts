import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  onLogin(event: Event) {
    event.preventDefault();
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
        this.error = 'Credenciales incorrectas. Intente nuevamente.';
      }
    });
  }
}
