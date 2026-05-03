import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lab-layout',
  templateUrl: './lab-layout.component.html',
  styleUrls: ['./lab-layout.component.css']
})
export class LabLayoutComponent implements OnInit {
  labId: string | null = null;
  labTitle: string = '';
  labLink: string | null = null;

  labsInfo: { [key: string]: { title: string, link: string | null } } = {
    '1': { title: 'Introducción',             link: null },
    '2': { title: 'Merge Cube',               link: 'https://mergeedu.com/merge-cube' },
    '3': { title: 'QuiverVision',             link: 'https://quivervision.com/' },
    '4': { title: 'Actionbound',              link: 'https://en.actionbound.com/' },
    '5': { title: 'Metaverso Meta',           link: null },
    '6': { title: 'RA Propia - Generador 3D', link: null },
    '7': { title: 'Modelo con Geoposición',   link: null }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.labId = params.get('id');
      if (this.labId && this.labsInfo[this.labId]) {
        this.labTitle = this.labsInfo[this.labId].title;
        this.labLink = this.labsInfo[this.labId].link;
      }
    });
  }
}
