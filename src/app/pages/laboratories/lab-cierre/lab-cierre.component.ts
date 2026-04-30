import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService, ConclusionResult } from '../../../services/evaluation.service';

@Component({
  selector: 'app-lab-cierre',
  templateUrl: './lab-cierre.component.html',
  styleUrls: ['./lab-cierre.component.css']
})
export class LabCierreComponent implements OnInit {
  labId: string | null = null;

  // Lab 5 Conclusions
  conclusionText: string = '';
  conclusionSaved: boolean = false;
  conclusionSaving: boolean = false;
  conclusionError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private evalService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.labId = params.get('id');
    });
  }

  saveConclusion(): void {
    if (!this.conclusionText.trim()) return;

    const userId = localStorage.getItem('userId') || 'anonymous';
    const username = localStorage.getItem('username') || 'Anónimo';

    const conclusion: ConclusionResult = {
      userId,
      username,
      labId: 5,
      labName: 'RA Propia - Generador 3D',
      conclusionText: this.conclusionText.trim(),
      scannedModels: [] // Could be populated from desarrollo component if needed
    };

    this.conclusionSaving = true;
    this.conclusionError = null;

    this.evalService.saveConclusion(conclusion).subscribe({
      next: () => {
        this.conclusionSaved = true;
        this.conclusionSaving = false;
      },
      error: (err) => {
        this.conclusionError = 'No se pudo guardar la conclusión. Verifica que el servidor esté activo.';
        this.conclusionSaving = false;
        console.error('Error saving conclusion:', err);
      }
    });
  }

  resetConclusion(): void {
    this.conclusionText = '';
    this.conclusionSaved = false;
    this.conclusionError = null;
  }
}
