import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  onLogin(event: Event) {
    event.preventDefault();
    if (this.username === 'adminrainclass' && this.password === 'r@inClass2620') {
      this.error = '';
      this.router.navigate(['/home']);
    } else {
      this.error = 'Credenciales incorrectas. Intente nuevamente.';
    }
  }
}
