import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface UserRow {
  userId: string;
  displayName: string;
  username: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  docentes: UserRow[] = [];

  ngOnInit(): void {
    this.docentes = environment.users
      .filter((u: any) => u.role === 'docente')
      .map((u: any) => ({
        userId: u.userId,
        displayName: u.displayName,
        username: u.username,
        role: u.role,
        status: 'Activo'
      }));
  }
}
