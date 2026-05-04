import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements AfterViewInit {
  @ViewChild('introVideo') introVideo!: ElementRef<HTMLVideoElement>;

  isFadingOut = false;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const video = this.introVideo.nativeElement;
    
    // Reproducir el video automáticamente si es posible
    video.play().catch(error => {
      console.warn("Autoplay was prevented:", error);
      // El usuario puede tener que interactuar para que suene el video. 
      // Por ahora, mostraremos controles o confiaremos en un evento de click.
    });

    video.onended = () => {
      this.finishIntro();
    };
  }

  finishIntro() {
    this.isFadingOut = true;
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000); // 1 segundo de desvanecimiento
  }
}
