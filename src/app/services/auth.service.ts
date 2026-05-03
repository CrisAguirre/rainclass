import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AppUser {
  username: string;
  role: 'admin' | 'docente';
  userId: string;
  displayName: string;
}

const USERS = [
  {
    username: 'adminrainclass',
    password: 'r@inClass2620',
    role: 'admin' as const,
    displayName: 'Administrador',
    userId: 'admin_001'
  },
  {
    username: 'Docente',
    password: 'RAInClA$$2026',
    role: 'docente' as const,
    displayName: 'Docente',
    userId: 'docente_001'
  }
];

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) {}

  login(username: string, password: string): AppUser | null {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      const user: AppUser = { username: found.username, role: found.role, userId: found.userId, displayName: found.displayName };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): AppUser | null {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  isAdmin(): boolean { return this.getCurrentUser()?.role === 'admin'; }
  isDocente(): boolean { return this.getCurrentUser()?.role === 'docente'; }
  isLoggedIn(): boolean { return !!this.getCurrentUser(); }
}
