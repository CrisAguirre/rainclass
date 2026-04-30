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
      localStorage.setItem('currentUser', JSON.stringify({ 
        username: this.username, 
        role: 'admin',
        userId: 'u_' + Math.random().toString(36).substr(2, 9) // Simulated ID
      }));
      this.router.navigate(['/home']);
    } else {
      this.error = 'Credenciales incorrectas. Intente nuevamente.';
    }
  }
}
