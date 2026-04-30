import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { LaboratoriesComponent } from './pages/laboratories/laboratories.component';
import { UsersComponent } from './pages/users/users.component';
import { ResultsComponent } from './pages/results/results.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: 'laboratories', component: LaboratoriesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'results', component: ResultsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
