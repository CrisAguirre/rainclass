import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lab-inicio',
  templateUrl: './lab-inicio.component.html',
  styleUrls: ['./lab-inicio.component.css']
})
export class LabInicioComponent implements OnInit {
  labId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.labId = params.get('id');
    });
  }
}
