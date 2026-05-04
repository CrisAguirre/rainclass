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
    const user = this.authService.login(this.username, this.password);
    if (user) {
      this.error = '';
      // Cargar progreso desde el backend al iniciar sesión
      this.progressService.loadFromBackend(user.userId).subscribe(() => {
        this.router.navigate(['/intro']);
      });
    } else {
      this.error = 'Credenciales incorrectas. Intente nuevamente.';
    }
  }
}
