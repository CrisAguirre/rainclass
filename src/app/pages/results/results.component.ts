import { Component, OnInit } from '@angular/core';
import { EvaluationService, EvaluationResult } from '../../services/evaluation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: EvaluationResult[] = [];
  stats: any[] = [];
  loading = true;
  isAdmin = false;

  constructor(private evalService: EvaluationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();

    if (this.isAdmin) {
      this.evalService.getAllResults().subscribe({
        next: (data) => { this.results = data; this.loading = false; },
        error: () => { this.loading = false; }
      });
      this.evalService.getStats().subscribe({
        next: (data) => { this.stats = data; },
        error: (err) => console.error('Error stats:', err)
      });
    } else {
      // Docente: only their own results
      if (user) {
        this.evalService.getResultsByUser(user.userId).subscribe({
          next: (data) => { this.results = data; this.loading = false; },
          error: () => { this.loading = false; }
        });
      }
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
