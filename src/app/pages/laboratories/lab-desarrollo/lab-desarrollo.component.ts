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
      name: 'Lenguaje',
      subject: 'Lenguaje',
      icon: '📖',
      modelPath: '/assets/models/pixellabs-skull-potion-3558.glb',
      color: '#ef4444',
      description: 'Modelo 3D para la asignatura de Lenguaje. Explora el mundo de las palabras y la gramática.',
      markerId: 0
    },
    {
      name: 'Matemáticas',
      subject: 'Matemáticas',
      icon: '📐',
      modelPath: '/assets/models/pixellabs-glb-3347.glb',
      color: '#3b82f6',
      description: 'Modelo 3D para Matemáticas. Figuras geométricas, números y lógica espacial.',
      markerId: 1
    },
    {
      name: 'Ciencias Naturales',
      subject: 'Ciencias Naturales',
      icon: '🫀',
      modelPath: '/assets/models/nactivi-animación-4232.glb',
      color: '#22c55e',
      description: 'Modelo 3D de Ciencias Naturales. Biología, ecosistemas y anatomía.',
      markerId: 2
    },
    {
      name: 'Sociales',
      subject: 'Sociales',
      icon: '🌍',
      modelPath: '/assets/models/timeworx-world-4045.glb',
      color: '#f59e0b',
      description: 'Modelo 3D para Sociales. Geografía, historia y civilizaciones.',
      markerId: 3
    },
    {
      name: 'Inglés',
      subject: 'Inglés',
      icon: '🗣️',
      modelPath: '/assets/models/pixellabs-robot-3332.glb',
      color: '#8b5cf6',
      description: 'Modelo 3D interactivo para aprender y practicar vocabulario en Inglés.',
      markerId: 4
    },
    {
      name: 'Comprensión de lectura',
      subject: 'Comprensión de lectura',
      icon: '📚',
      modelPath: '/assets/models/pixellabs-potion-3620.glb',
      color: '#ec4899',
      description: 'Modelo 3D para ejercitar y evaluar la comprensión lectora.',
      markerId: 5
    }
  ];

  private modelMap: { [key: string]: ModelInfo } = {
    'RAINCLASS_LENGUAJE_3D': this.models[0],
    'RAINCLASS_MATEMATICAS_3D': this.models[1],
    'RAINCLASS_CIENCIAS_3D': this.models[2],
    'RAINCLASS_SOCIALES_3D': this.models[3],
    'RAINCLASS_INGLES_3D': this.models[4],
    'RAINCLASS_COMPRENSION_3D': this.models[5]
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
    this.scannedModel = null; // Reset to avoid carrying over Lab 5 state

    try {
      // Load AR.js + A-Frame scripts dynamically
      if (!this.arScriptsLoaded) {
        await this.loadScript('https://aframe.io/releases/1.4.0/aframe.min.js');
        await this.loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
        await this.loadScript('https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@7.0.0/dist/aframe-extras.min.js');
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
            // Success: Clean up any previous video elements from past sessions
            document.querySelectorAll('video').forEach(v => {
              if (v !== video) v.remove();
            });
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
    if (this.arSceneElement) {
      const videos = this.arSceneElement.querySelectorAll('video');
      videos.forEach(v => {
        const stream = (v as HTMLVideoElement).srcObject as MediaStream;
        if (stream) stream.getTracks().forEach(t => t.stop());
      });
      this.arSceneElement.remove();
      this.arSceneElement = null;
    }

    const leftoverScene = document.querySelector('a-scene');
    if (leftoverScene) leftoverScene.remove();
    
    document.querySelectorAll('video').forEach(v => {
      const stream = (v as HTMLVideoElement).srcObject as MediaStream;
      if (stream) stream.getTracks().forEach(t => t.stop());
      v.remove();
    });

    document.querySelectorAll('.a-canvas').forEach(c => c.remove());
    document.querySelectorAll('#arjs-video-elements').forEach(e => e.remove());

    const cleanupStyles = () => {
      document.documentElement.classList.remove('ar-active', 'a-fullscreen', 'a-hidden');
      document.body.classList.remove('ar-active', 'a-fullscreen', 'a-hidden');
      
      const propsToRemove = ['overflow', 'position', 'margin', 'padding', 'width', 'height', 'top', 'left', 'bottom', 'right', 'transform'];
      propsToRemove.forEach(prop => {
        document.body.style.removeProperty(prop);
        document.documentElement.style.removeProperty(prop);
      });
      
      document.querySelectorAll('.a-enter-vr, .a-enter-ar, .a-orientation-modal, .a-modal, .a-dialog').forEach(e => e.remove());
      
      // Force scroll reset
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    cleanupStyles();
    setTimeout(cleanupStyles, 100);
    setTimeout(cleanupStyles, 500);

    this.arActive = false;
    this.arScale = 1.0;
  }

  private registerCirculatoryComponent(): void {
    const AFRAME = (window as any).AFRAME;
    if (!AFRAME || AFRAME.components['circulatory-body']) return;

    AFRAME.registerComponent('circulatory-body', {
      init: function (this: any) {
        const TEX_W = 512, TEX_H = 1024;
        const offscreen = document.createElement('canvas');
        offscreen.width  = TEX_W;
        offscreen.height = TEX_H;
        const ctx = offscreen.getContext('2d') as CanvasRenderingContext2D;

        const THREE = (window as any).THREE;
        const texture = new THREE.CanvasTexture(offscreen);
        const geo = new THREE.PlaneGeometry(1, 2);
        const mat = new THREE.MeshBasicMaterial({
          map: texture, transparent: true, opacity: 1,
          side: THREE.DoubleSide, depthWrite: false
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, 0, 0.01);
        this.el.object3D.add(mesh);

        // Guardamos estado en el componente para que tick() lo acceda
        this._ctx      = ctx;
        this._texture  = texture;
        this._phase    = 0;
        this._TEX_W    = TEX_W;
        this._TEX_H    = TEX_H;

        this._organs = [
          [0.50, 0.16, 0.14, 0.07, '#EF9F27', 'Cerebro'],
          [0.44, 0.37, 0.08, 0.07, '#D4537E', 'Corazon'],
          [0.32, 0.34, 0.09, 0.07, '#97C459', 'Pulmon izq'],
          [0.56, 0.34, 0.09, 0.07, '#97C459', 'Pulmon der'],
          [0.36, 0.53, 0.10, 0.06, '#EF9F27', 'Higado'],
          [0.42, 0.62, 0.06, 0.05, '#BA7517', 'Estomago'],
          [0.33, 0.68, 0.07, 0.05, '#639922', 'Rinon izq'],
          [0.58, 0.68, 0.07, 0.05, '#639922', 'Rinon der'],
        ];

        this._paths = [
          {pts:[[0.46,0.42],[0.46,0.55],[0.46,0.72],[0.46,0.88]], col:'#E24B4A', w:2.5},
          {pts:[[0.47,0.40],[0.47,0.24],[0.47,0.16]],             col:'#E24B4A', w:2},
          {pts:[[0.49,0.37],[0.54,0.35],[0.59,0.34]],             col:'#378ADD', w:1.8},
          {pts:[[0.42,0.37],[0.37,0.35],[0.30,0.34]],             col:'#378ADD', w:1.8},
          {pts:[[0.58,0.37],[0.53,0.38],[0.49,0.39]],             col:'#E24B4A', w:1.5},
          {pts:[[0.30,0.37],[0.36,0.38],[0.42,0.39]],             col:'#E24B4A', w:1.5},
          {pts:[[0.50,0.20],[0.50,0.30],[0.50,0.38]],             col:'#378ADD', w:2},
          {pts:[[0.51,0.88],[0.51,0.72],[0.51,0.55],[0.51,0.44]], col:'#378ADD', w:2.5},
          {pts:[[0.46,0.50],[0.42,0.51],[0.38,0.53]],             col:'#E24B4A', w:1.5},
          {pts:[[0.36,0.55],[0.44,0.55],[0.51,0.54]],             col:'#378ADD', w:1.5},
          {pts:[[0.46,0.65],[0.40,0.66],[0.35,0.68]],             col:'#E24B4A', w:1.3},
          {pts:[[0.46,0.65],[0.53,0.66],[0.59,0.68]],             col:'#E24B4A', w:1.3},
          {pts:[[0.34,0.70],[0.42,0.70],[0.51,0.68]],             col:'#378ADD', w:1.3},
          {pts:[[0.61,0.70],[0.55,0.70],[0.51,0.68]],             col:'#378ADD', w:1.3},
        ];

        this._particles = [];
        this._paths.forEach((path: any, idx: number) => {
          const count = Math.max(3, Math.round(path.w * 2.5));
          for (let i = 0; i < count; i++) {
            this._particles.push({ pathIdx: idx, progress: i / count, speed: 0.004 + Math.random() * 0.003 });
          }
        });
      },

      // A-Frame llama tick() en cada frame — NO interfiere con el loop de AR.js
      tick: function (this: any) {
        const { _ctx: c, _texture: tex, _TEX_W: W, _TEX_H: H,
                _organs, _paths, _particles } = this;
        if (!c) return;

        this._phase += 0.018;
        const phase = this._phase;

        // Avanzar partículas
        _particles.forEach((p: any) => {
          p.progress += p.speed;
          if (p.progress >= 1) p.progress = 0;
        });

        // Limpiar canvas
        c.clearRect(0, 0, W, H);

        // ── Silueta corporal ──────────────────────────────────────────────────
        c.save();
        c.beginPath();
        c.ellipse(W*0.50, H*0.10, W*0.12, H*0.09, 0, 0, Math.PI*2);
        c.moveTo(W*0.44, H*0.18);
        c.bezierCurveTo(W*0.38, H*0.22, W*0.28, H*0.38, W*0.28, H*0.52);
        c.bezierCurveTo(W*0.28, H*0.60, W*0.32, H*0.64, W*0.35, H*0.72);
        c.bezierCurveTo(W*0.35, H*0.80, W*0.33, H*0.90, W*0.33, H*0.98);
        c.lineTo(W*0.42, H*0.98);
        c.bezierCurveTo(W*0.42, H*0.90, W*0.44, H*0.80, W*0.44, H*0.72);
        c.lineTo(W*0.56, H*0.72);
        c.bezierCurveTo(W*0.56, H*0.80, W*0.58, H*0.90, W*0.58, H*0.98);
        c.lineTo(W*0.67, H*0.98);
        c.bezierCurveTo(W*0.67, H*0.90, W*0.65, H*0.80, W*0.65, H*0.72);
        c.bezierCurveTo(W*0.68, H*0.64, W*0.72, H*0.60, W*0.72, H*0.52);
        c.bezierCurveTo(W*0.72, H*0.38, W*0.62, H*0.22, W*0.56, H*0.18);
        c.closePath();
        const grad = c.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0,   'rgba(255,220,180,0.20)');
        grad.addColorStop(0.5, 'rgba(240,200,160,0.25)');
        grad.addColorStop(1,   'rgba(220,180,140,0.20)');
        c.fillStyle = grad;
        c.fill();
        c.strokeStyle = 'rgba(255,220,180,0.65)';
        c.lineWidth = 3;
        c.stroke();
        // Brazos
        c.beginPath();
        c.moveTo(W*0.29, H*0.24);
        c.bezierCurveTo(W*0.18, H*0.30, W*0.14, H*0.50, W*0.16, H*0.65);
        c.lineTo(W*0.22, H*0.65);
        c.bezierCurveTo(W*0.21, H*0.50, W*0.24, H*0.30, W*0.34, H*0.25);
        c.closePath();
        c.fillStyle = 'rgba(255,220,180,0.20)';
        c.fill();
        c.strokeStyle = 'rgba(255,220,180,0.55)';
        c.lineWidth = 2;
        c.stroke();
        c.beginPath();
        c.moveTo(W*0.71, H*0.24);
        c.bezierCurveTo(W*0.82, H*0.30, W*0.86, H*0.50, W*0.84, H*0.65);
        c.lineTo(W*0.78, H*0.65);
        c.bezierCurveTo(W*0.79, H*0.50, W*0.76, H*0.30, W*0.66, H*0.25);
        c.closePath();
        c.fill();
        c.stroke();
        c.restore();

        // ── Vasos sanguíneos (fondo tenue) ────────────────────────────────────
        _paths.forEach((path: any) => {
          c.beginPath();
          c.moveTo(path.pts[0][0]*W, path.pts[0][1]*H);
          for (let i = 1; i < path.pts.length; i++) {
            c.lineTo(path.pts[i][0]*W, path.pts[i][1]*H);
          }
          c.strokeStyle = path.col + '44';
          c.lineWidth = path.w;
          c.lineCap = 'round';
          c.stroke();
        });

        // ── Órganos pulsantes ────────────────────────────────────────────────
        _organs.forEach(([nx, ny, rx, ry, col, label]: any) => {
          const cx = nx*W, cy = ny*H;
          const pulse = 1 + 0.04 * Math.sin(phase * 5 + nx * 10);
          c.save();
          c.beginPath();
          c.ellipse(cx, cy, rx*W*pulse, ry*H*pulse, 0, 0, Math.PI*2);
          c.fillStyle = col + '55';
          c.strokeStyle = col + 'CC';
          c.lineWidth = 1.5;
          c.fill();
          c.stroke();
          c.fillStyle = col;
          c.font = `bold ${W*0.026}px sans-serif`;
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText(label, cx, cy);
          c.restore();
        });

        // ── Latido del corazón ───────────────────────────────────────────────
        const beat = 1 + 0.10 * Math.abs(Math.sin(phase * 8));
        const hx = 0.44*W, hy = 0.37*H;
        c.save();
        c.beginPath();
        c.ellipse(hx, hy, 0.08*W*beat, 0.07*H*beat, 0, 0, Math.PI*2);
        c.fillStyle = '#D4537E99';
        c.strokeStyle = '#D4537EFF';
        c.lineWidth = 2;
        c.fill();
        c.stroke();
        c.fillStyle = '#fff';
        c.font = `bold ${W*0.026}px sans-serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('Corazon', hx, hy);
        c.restore();

        // ── Partículas en flujo ──────────────────────────────────────────────
        _particles.forEach((p: any) => {
          const path = _paths[p.pathIdx];
          const pts  = path.pts;
          const total = pts.length - 1;
          const seg = p.progress * total;
          const i = Math.min(Math.floor(seg), total - 1);
          const f = seg - i;
          const px = (pts[i][0] + (pts[i+1][0] - pts[i][0]) * f) * W;
          const py = (pts[i][1] + (pts[i+1][1] - pts[i][1]) * f) * H;
          c.beginPath();
          c.arc(px, py, path.w * 1.5, 0, Math.PI*2);
          c.fillStyle = path.col;
          c.fill();
        });

        tex.needsUpdate = true;
      }
    });
  }

  private buildARScene(): void {
    // ⚠️ CRÍTICO: registerComponent ANTES de crear el <a-scene>
    this.registerCirculatoryComponent();

    const scene = document.createElement('a-scene');
    scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
    scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; precision: medium; alpha: true;');
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('embedded', '');

    scene.style.setProperty('position', 'fixed', 'important');
    scene.style.setProperty('top', '0', 'important');
    scene.style.setProperty('left', '0', 'important');
    scene.style.setProperty('width', '100vw', 'important');
    scene.style.setProperty('height', '100vh', 'important');
    scene.style.setProperty('z-index', '9998', 'important');

    // ── Construir contenido de la escena ──────────────────────────────────────
    let sceneContent = '';

    this.models.forEach(model => {
      let markerTag = '';
      if (model.markerId === 0) {
        markerTag = `<a-marker preset="hiro" id="marker-${model.markerId}">`;
      } else if (model.markerId === 1) {
        markerTag = `<a-marker preset="kanji" id="marker-${model.markerId}">`;
      } else {
        markerTag = `<a-marker type="barcode" value="${model.markerId}" id="marker-${model.markerId}">`;
      }

      // ── Cargar el modelo .glb correspondiente ──────────────────────
      sceneContent += `
        ${markerTag}
          <a-entity id="ar-model-${model.markerId}" position="0 0 0" rotation="-90 0 0" scale="0.8 0.8 0.8">
            <a-entity gltf-model="url(${model.modelPath})" animation-mixer></a-entity>
          </a-entity>
        </a-marker>
      `;
    });

    sceneContent += `<a-entity camera></a-entity>`;

    scene.innerHTML = sceneContent;
    document.body.appendChild(scene);
    this.arSceneElement = scene;

    // Listeners de marcadores
    setTimeout(() => {
      this.models.forEach(model => {
        const markerEl = document.getElementById(`marker-${model.markerId}`);
        if (markerEl) {
          markerEl.addEventListener('markerFound', () => {
            this.ngZone.run(() => {
              this.scannedModel = model;
              if (!this.scanHistory.find(m => m.name === model.name)) {
                this.scanHistory.push(model);
              }
            });
          });
          markerEl.addEventListener('markerLost', () => {
            this.ngZone.run(() => {
              if (this.scannedModel?.markerId === model.markerId) {
                this.scannedModel = null;
              }
            });
          });
        }
      });
    }, 500);
  }

  private setupZoomControls(): void {
    // Los controles de zoom se registran en el document para capturar
    // eventos aunque el foco esté en el canvas de A-Frame
    const container = document;

    // Mouse wheel zoom
    document.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      this.arScale = Math.max(0.2, Math.min(3.0, this.arScale + delta));
      this.updateARModelScale();
    }, { passive: false });

    // Touch pinch zoom
    let initialDistance = 0;
    let initialScale = 1;

    document.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = this.arScale;
      }
    });

    document.addEventListener('touchmove', (e: TouchEvent) => {
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
