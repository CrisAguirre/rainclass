import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppUser {
  username: string;
  role: 'admin' | 'docente';
  userId: string;
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Observable<AppUser | null> {
    return this.http.post<AppUser>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(() => {
        return of(null);
      })
    );
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
  
  pingServer(): void {
    // Petición temprana para despertar el servidor gratuito (Render)
    this.http.get(`${environment.apiUrl}`).pipe(catchError(() => of(null))).subscribe();
  }

  isLoggedIn(): boolean { return !!this.getCurrentUser(); }
}
