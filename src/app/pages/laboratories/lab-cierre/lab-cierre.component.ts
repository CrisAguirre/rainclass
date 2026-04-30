import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lab-cierre',
  templateUrl: './lab-cierre.component.html',
  styleUrls: ['./lab-cierre.component.css']
})
export class LabCierreComponent implements OnInit {
  labId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.labId = params.get('id');
    });
  }
}
