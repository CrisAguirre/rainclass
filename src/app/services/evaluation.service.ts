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

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:3000/api/evaluations';

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
}
