import { Component, OnInit } from '@angular/core';
import { EvaluationService, EvaluationResult } from '../../services/evaluation.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: EvaluationResult[] = [];
  stats: any[] = [];
  loading = true;

  constructor(private evalService: EvaluationService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Load all results
    this.evalService.getAllResults().subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching results:', err);
        this.loading = false;
      }
    });

    // Load stats
    this.evalService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error fetching stats:', err)
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
