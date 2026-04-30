import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EvaluationResult {
  userId: string;
  username: string;
  labId: number;
  labName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: { [key: number]: number };
  attemptNumber?: number;
  createdAt?: string;
}

export interface ConclusionResult {
  userId: string;
  username: string;
  labId: number;
  labName: string;
  conclusionText: string;
  scannedModels: string[];
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  // Cuando despliegues en Railway, cambia esta URL por la que te proporcione Railway.
  // Ejemplo: private BASE_URL = 'https://rainclassbkn-production.up.railway.app/api';
  private BASE_URL = 'https://rainclassbkn-production.up.railway.app/api';
  
  private apiUrl = `${this.BASE_URL}/evaluations`;
  private conclusionsUrl = `${this.BASE_URL}/conclusions`;

  constructor(private http: HttpClient) {}

  saveResult(result: EvaluationResult): Observable<EvaluationResult> {
    return this.http.post<EvaluationResult>(this.apiUrl, result);
  }

  getAllResults(): Observable<EvaluationResult[]> {
    return this.http.get<EvaluationResult[]>(this.apiUrl);
  }

  getResultsByUser(userId: string): Observable<EvaluationResult[]> {
    return this.http.get<EvaluationResult[]>(`${this.apiUrl}/user/${userId}`);
  }

  getResultsByLab(labId: number): Observable<EvaluationResult[]> {
    return this.http.get<EvaluationResult[]>(`${this.apiUrl}/lab/${labId}`);
  }

  getStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stats`);
  }

  // Lab 5 - Conclusions
  saveConclusion(conclusion: ConclusionResult): Observable<ConclusionResult> {
    return this.http.post<ConclusionResult>(this.conclusionsUrl, conclusion);
  }

  getAllConclusions(): Observable<ConclusionResult[]> {
    return this.http.get<ConclusionResult[]>(this.conclusionsUrl);
  }

  getConclusionsByUser(userId: string): Observable<ConclusionResult[]> {
    return this.http.get<ConclusionResult[]>(`${this.conclusionsUrl}/user/${userId}`);
  }
}

