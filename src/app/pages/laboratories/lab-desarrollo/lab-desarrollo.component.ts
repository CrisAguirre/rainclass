import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';

interface ModelInfo {
  name: string;
  subject: string;
  icon: string;
  modelPath: string;
  color: string;
  description: string;
  markerId: number; // barcode marker ID for AR.js
}

@Component({
  selector: 'app-lab-desarrollo',
  templateUrl: './lab-desarrollo.component.html',
  styleUrls: ['./lab-desarrollo.component.css']
})
export class LabDesarrolloComponent implements OnInit, OnDestroy {
  labId: string | null = null;

  // Lab 5 QR Scanner
  scannerActive = false;
  scannerReady = false;
  scannedModel: ModelInfo | null = null;
  scanHistory: ModelInfo[] = [];
  scanError: string | null = null;
  private html5QrCode: Html5Qrcode | null = null;

  // Lab 6 AR Mode
  arActive = false;
  arLoading = false;
  arError: string | null = null;
  arScale = 1.0;
  private arScriptsLoaded = false;
  private arSceneElement: HTMLElement | null = null;

  // Shared model map (used by both Lab 5 and Lab 6)
  models: ModelInfo[] = [
    {
      name: 'Tetraedro Geométrico',
      subject: 'Matemáticas',
      icon: '📐',
      modelPath: '/assets/models/math_model.glb',
      color: '#3b82f6',
      description: 'Sólido geométrico regular de 4 caras triangulares equiláteras. Fundamental en geometría espacial y topología.',
      markerId: 0
    },
    {
      name: 'Molécula Científica',
      subject: 'Ciencias Naturales',
      icon: '🔬',
      modelPath: '/assets/models/science_model.glb',
      color: '#22c55e',
      description: 'Estructura molecular representativa. Las moléculas son la base de la materia y sus interacciones químicas.',
      markerId: 1
    },
    {
      name: 'Libro Literario',
      subject: 'Literatura',
      icon: '📖',
      modelPath: '/assets/models/literature_model.glb',
      color: '#ef4444',
      description: 'Representación 3D de un libro abierto. Símbolo del conocimiento narrativo y la imaginación creativa.',
      markerId: 2
    }
  ];

  private modelMap: { [key: string]: ModelInfo } = {
    'RAINCLASS_MATH_3D': this.models[0],
    'RAINCLASS_SCIENCE_3D': this.models[1],
    'RAINCLASS_LITERATURE_3D': this.models[2]
  };

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.labId = params.get('id');
    });
  }

  ngOnDestroy(): void {
    this.stopScanner();
    this.stopAR();
  }

  // ==================== LAB 5: QR SCANNER ====================

  async startScanner(): Promise<void> {
    this.scanError = null;
    this.scannedModel = null;

    try {
      this.html5QrCode = new Html5Qrcode('qr-reader');
      this.scannerActive = true;

      await this.html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText: string) => {
          this.onScanSuccess(decodedText);
        },
        () => {
          // Scan failure - ignore, keep scanning
        }
      );
      this.scannerReady = true;
    } catch (err: any) {
      // Try user-facing camera if environment fails
      try {
        await this.html5QrCode!.start(
          { facingMode: 'user' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText: string) => {
            this.onScanSuccess(decodedText);
          },
          () => {}
        );
        this.scannerReady = true;
      } catch (err2: any) {
        this.scanError = 'No se pudo acceder a la cámara. Verifica los permisos del navegador.';
        this.scannerActive = false;
      }
    }
  }

  async stopScanner(): Promise<void> {
    if (this.html5QrCode) {
      try {
        await this.html5QrCode.stop();
      } catch (e) {}
      this.html5QrCode = null;
    }
    this.scannerActive = false;
    this.scannerReady = false;
  }

  private onScanSuccess(decodedText: string): void {
    const model = this.modelMap[decodedText.trim()];
    if (model) {
      this.scannedModel = model;
      // Add to history if not already there
      if (!this.scanHistory.find(m => m.name === model.name)) {
        this.scanHistory.push(model);
      }
      this.stopScanner();
    } else {
      this.scanError = `Código QR no reconocido: "${decodedText}". Usa los QR de la pestaña Introducción.`;
    }
  }

  scanAgain(): void {
    this.scannedModel = null;
    this.scanError = null;
    this.startScanner();
  }

  clearModel(): void {
    this.scannedModel = null;
  }

  // ==================== LAB 6: AR MARKER TRACKING ====================

  async startAR(): Promise<void> {
    this.arError = null;
    this.arLoading = true;
    this.arScale = 1.0;

    try {
      // Load AR.js + A-Frame scripts dynamically
      if (!this.arScriptsLoaded) {
        await this.loadScript('https://aframe.io/releases/1.4.0/aframe.min.js');
        await this.loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
        this.arScriptsLoaded = true;
      }

      // Small delay to let scripts initialize
      await new Promise(resolve => setTimeout(resolve, 500));

      this.arActive = true;
      this.arLoading = false;

      // Build the AR scene
      setTimeout(() => {
        this.buildARScene();
        this.setupZoomControls();
        document.documentElement.classList.add('ar-active');
        document.body.classList.add('ar-active');

        // Robust fix: Force AR.js video and canvas to be fullscreen overlays
        const fixARjsVideo = setInterval(() => {
          const video = document.querySelector('video');
          if (video) {
            // Force the video to sit on top of the app, but behind our UI overlay
            video.style.setProperty('z-index', '9997', 'important');
            video.style.setProperty('position', 'fixed', 'important');
            video.style.setProperty('top', '0', 'important');
            video.style.setProperty('left', '0', 'important');
            video.style.setProperty('min-width', '100vw', 'important');
            video.style.setProperty('min-height', '100vh', 'important');
            video.style.setProperty('object-fit', 'cover', 'important');
          }
          
          const canvas = document.querySelector('.a-canvas') as HTMLElement;
          if (canvas) {
            canvas.style.setProperty('z-index', '9998', 'important');
            canvas.style.setProperty('position', 'fixed', 'important');
          }

          if (video && canvas) {
            clearInterval(fixARjsVideo);
          }
        }, 500);
        
        // Safety clear after 10s
        setTimeout(() => clearInterval(fixARjsVideo), 10000);

      }, 100);

    } catch (err: any) {
      this.arError = 'No se pudieron cargar las librerías de Realidad Aumentada. Verifica tu conexión a internet.';
      this.arLoading = false;
    }
  }

  stopAR(): void {
    // Remove the AR scene
    if (this.arSceneElement) {
      // Stop any camera streams
      const videos = this.arSceneElement.querySelectorAll('video');
      videos.forEach(v => {
        const stream = (v as HTMLVideoElement).srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
        }
      });

      this.arSceneElement.remove();
      this.arSceneElement = null;
    }

    // Also remove any leftover A-Frame elements or videos in body
    const leftoverScene = document.querySelector('a-scene');
    if (leftoverScene) {
      leftoverScene.remove();
    }
    
    // Stop all video streams (AR.js often appends to body)
    document.querySelectorAll('video').forEach(v => {
      const stream = (v as HTMLVideoElement).srcObject as MediaStream;
      if (stream) stream.getTracks().forEach(t => t.stop());
      v.remove();
    });

    // Remove any leftover AR canvas
    document.querySelectorAll('.a-canvas').forEach(c => c.remove());
    document.querySelectorAll('#arjs-video-elements').forEach(e => e.remove());

    document.documentElement.classList.remove('ar-active', 'a-fullscreen');
    document.body.classList.remove('ar-active', 'a-fullscreen');
    
    // AR.js injects inline styles to body and html that break scrolling/navigation
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('margin');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('height');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('width');
    document.documentElement.style.removeProperty('height');

    this.arActive = false;
    this.arScale = 1.0;
  }

  private buildARScene(): void {
    const container = document.getElementById('ar-scene-container');
    if (!container) return;

    // Create the A-Frame AR scene
    const scene = document.createElement('a-scene');
    scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
    scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; precision: medium; alpha: true;');
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    
    // Force scene to be a fixed fullscreen overlay
    scene.style.setProperty('position', 'fixed', 'important');
    scene.style.setProperty('top', '0', 'important');
    scene.style.setProperty('left', '0', 'important');
    scene.style.setProperty('width', '100vw', 'important');
    scene.style.setProperty('height', '100vh', 'important');
    scene.style.setProperty('z-index', '9998', 'important');

    // Create markers for each model
    this.models.forEach(model => {
      const marker = document.createElement('a-marker');
      marker.setAttribute('type', 'barcode');
      marker.setAttribute('value', model.markerId.toString());
      marker.setAttribute('id', `marker-${model.markerId}`);

      const entity = document.createElement('a-entity');
      entity.setAttribute('gltf-model', `url(${model.modelPath})`);
      entity.setAttribute('scale', '0.5 0.5 0.5');
      entity.setAttribute('position', '0 0 0');
      entity.setAttribute('rotation', '-90 0 0');
      entity.setAttribute('class', 'ar-model');
      entity.setAttribute('id', `ar-model-${model.markerId}`);

      marker.appendChild(entity);

      // Listen for marker found/lost events
      marker.addEventListener('markerFound', () => {
        this.ngZone.run(() => {
          this.scannedModel = model;
          if (!this.scanHistory.find(m => m.name === model.name)) {
            this.scanHistory.push(model);
          }
        });
      });

      scene.appendChild(marker);
    });

    // Add camera entity
    const camera = document.createElement('a-entity');
    camera.setAttribute('camera', '');
    scene.appendChild(camera);

    container.appendChild(scene);
    this.arSceneElement = scene;
  }

  private setupZoomControls(): void {
    const container = document.getElementById('ar-scene-container');
    if (!container) return;

    // Mouse wheel zoom
    container.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      this.arScale = Math.max(0.2, Math.min(3.0, this.arScale + delta));
      this.updateARModelScale();
    }, { passive: false });

    // Touch pinch zoom
    let initialDistance = 0;
    let initialScale = 1;

    container.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = this.arScale;
      }
    });

    container.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scaleFactor = currentDistance / initialDistance;
        this.arScale = Math.max(0.2, Math.min(3.0, initialScale * scaleFactor));
        this.updateARModelScale();
      }
    }, { passive: false });
  }

  private updateARModelScale(): void {
    const scale = this.arScale * 0.5; // base scale is 0.5
    this.models.forEach(model => {
      const entity = document.getElementById(`ar-model-${model.markerId}`);
      if (entity) {
        entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
      }
    });
  }

  zoomIn(): void {
    this.arScale = Math.min(3.0, this.arScale + 0.15);
    this.updateARModelScale();
  }

  zoomOut(): void {
    this.arScale = Math.max(0.2, this.arScale - 0.15);
    this.updateARModelScale();
  }

  resetZoom(): void {
    this.arScale = 1.0;
    this.updateARModelScale();
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }
}
