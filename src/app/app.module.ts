import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { LaboratoriesComponent } from './pages/laboratories/laboratories.component';
import { UsersComponent } from './pages/users/users.component';
import { ResultsComponent } from './pages/results/results.component';
import { LabLayoutComponent } from './pages/laboratories/lab-layout/lab-layout.component';
import { LabInicioComponent } from './pages/laboratories/lab-inicio/lab-inicio.component';
import { LabDesarrolloComponent } from './pages/laboratories/lab-desarrollo/lab-desarrollo.component';
import { LabCierreComponent } from './pages/laboratories/lab-cierre/lab-cierre.component';
import { LabEvaluacionComponent } from './pages/laboratories/lab-evaluacion/lab-evaluacion.component';
import { TrophiesComponent } from './pages/trophies/trophies.component';
import { CollectiblesComponent } from './pages/collectibles/collectibles.component';
import { IntroComponent } from './components/intro/intro.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IntroComponent,
    LayoutComponent,
    HomeComponent,
    SessionsComponent,
    LaboratoriesComponent,
    UsersComponent,
    ResultsComponent,
    LabLayoutComponent,
    LabInicioComponent,
    LabDesarrolloComponent,
    LabCierreComponent,
    LabEvaluacionComponent,
    TrophiesComponent,
    CollectiblesComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
