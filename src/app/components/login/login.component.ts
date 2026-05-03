import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(event: Event) {
    event.preventDefault();
    const user = this.authService.login(this.username, this.password);
    if (user) {
      this.error = '';
      this.router.navigate(['/home']);
    } else {
      this.error = 'Credenciales incorrectas. Intente nuevamente.';
    }
  }
}
