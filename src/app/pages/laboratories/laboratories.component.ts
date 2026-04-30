import { Component } from '@angular/core';

@Component({
  selector: 'app-laboratories',
  templateUrl: './laboratories.component.html',
  styleUrls: ['./laboratories.component.css']
})
export class LaboratoriesComponent {
  labs = [
    {
      id: 1,
      title: 'Merge Cube',
      description: 'Explora objetos 3D y simulaciones en la palma de tu mano.',
      link: 'https://mergeedu.com/merge-cube',
      icon: 'cube'
    },
    {
      id: 2,
      title: 'QuiverVision',
      description: 'Dale vida a páginas para colorear a través de realidad aumentada interactiva.',
      link: 'https://quivervision.com/',
      icon: 'color_lens'
    },
    {
      id: 3,
      title: 'Actionbound',
      description: 'Crea recorridos, búsquedas del tesoro y aventuras de aprendizaje gamificadas.',
      link: 'https://en.actionbound.com/',
      icon: 'map'
    },
    {
      id: 4,
      title: 'Metaverso Meta',
      description: 'Conéctate, colabora y aprende en entornos virtuales inmersivos.',
      link: null,
      icon: 'public'
    },
    {
      id: 5,
      title: 'RA Propia - Generador 3D',
      description: 'Escanea patrones QR con tu cámara y genera modelos 3D interactivos por asignatura.',
      link: null,
      icon: 'science'
    }
  ];
}
