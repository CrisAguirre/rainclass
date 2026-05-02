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
      name: 'Sistema Circulatorio',
      subject: 'Ciencias Naturales',
      icon: '🫀',
      modelPath: '/assets/models/science_model.glb',
      color: '#22c55e',
      description: 'Cuerpo humano translúcido con sistema circulatorio animado en tiempo real. Observa el flujo de sangre oxigenada (rojo) y desoxigenada (azul) a través de órganos pulsantes.',
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
    'RAINCLASS_CIRCULATORY_3D': this.models[1],
    'RAINCLASS_LITERATURE_3D': this.models[2]
  };

  constructor(private route: ActivatedRoute, private ngZone: NgZone) { }

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
          () => { }
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
      } catch (e) { }
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

  private buildARScene(): void {
    // AR.js necesita que la escena esté directamente en el body
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

    // ── Registrar componente personalizado para el cuerpo translúcido ──────────
    // Se registra antes de crear la escena para que A-Frame lo reconozca
    if (!(window as any).AFRAME?.components?.['circulatory-body']) {
      (window as any).AFRAME.registerComponent('circulatory-body', {
        init: function () {
          // Canvas 2D que se usará como textura dinámica
          const TEX_W = 512, TEX_H = 1024;
          const offscreen = document.createElement('canvas');
          offscreen.width = TEX_W;
          offscreen.height = TEX_H;
          const ctx = offscreen.getContext('2d')!;

          // Crear textura Three.js a partir del canvas
          const THREE = (window as any).THREE;
          const texture = new THREE.CanvasTexture(offscreen);
          texture.needsUpdate = true;

          // Plano que muestra la textura (cuerpo frontal)
          const geo = new THREE.PlaneGeometry(1, 2);
          const mat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            depthWrite: false
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(0, 0, 0.01);
          this.el.object3D.add(mesh);

          // ── Estado de la animación circulatoria ───────────────────────────
          let phase = 0;

          // Rutas de partículas: array de puntos normalizados [0..1] en el canvas
          // Sistema: coordenadas en canvas TEX_W x TEX_H
          const scale = (x: number, y: number) => [x * TEX_W, y * TEX_H] as [number, number];

          // Órganos (cx, cy, rx, ry, color, label)
          const organs: [number, number, number, number, string, string][] = [
            [0.50, 0.16, 0.14, 0.07, '#EF9F27', 'Cerebro'],
            [0.44, 0.37, 0.08, 0.07, '#D4537E', 'Corazón'],
            [0.32, 0.34, 0.09, 0.07, '#97C459', 'Pulmón izq'],
            [0.56, 0.34, 0.09, 0.07, '#97C459', 'Pulmón der'],
            [0.36, 0.53, 0.10, 0.06, '#EF9F27', 'Hígado'],
            [0.42, 0.62, 0.06, 0.05, '#BA7517', 'Estómago'],
            [0.33, 0.68, 0.07, 0.05, '#639922', 'Riñón izq'],
            [0.58, 0.68, 0.07, 0.05, '#639922', 'Riñón der'],
          ];

          // Paths circulatorios: [{pts, col}]
          // pts = array de puntos [xN, yN] normalizados 0..1
          const cirPaths: { pts: [number, number][], col: string, w: number }[] = [
            // Aorta principal (corazón → cuerpo inferior)
            { pts: [[0.46, 0.42], [0.46, 0.55], [0.46, 0.72], [0.46, 0.88]], col: '#E24B4A', w: 2.5 },
            // Arteria carótida (corazón → cerebro)
            { pts: [[0.47, 0.40], [0.47, 0.24], [0.47, 0.16]], col: '#E24B4A', w: 2 },
            // Arteria pulmonar der (corazón → pulmón der)
            { pts: [[0.49, 0.37], [0.54, 0.35], [0.59, 0.34]], col: '#378ADD', w: 1.8 },
            // Arteria pulmonar izq (corazón → pulmón izq)
            { pts: [[0.42, 0.37], [0.37, 0.35], [0.30, 0.34]], col: '#378ADD', w: 1.8 },
            // Vena pulmonar der (pulmón der → corazón)
            { pts: [[0.58, 0.37], [0.53, 0.38], [0.49, 0.39]], col: '#E24B4A', w: 1.5 },
            // Vena pulmonar izq (pulmón izq → corazón)
            { pts: [[0.30, 0.37], [0.36, 0.38], [0.42, 0.39]], col: '#E24B4A', w: 1.5 },
            // Vena cava superior (cerebro → corazón)
            { pts: [[0.50, 0.20], [0.50, 0.30], [0.50, 0.38]], col: '#378ADD', w: 2 },
            // Vena cava inferior (cuerpo → corazón)
            { pts: [[0.51, 0.88], [0.51, 0.72], [0.51, 0.55], [0.51, 0.44]], col: '#378ADD', w: 2.5 },
            // Arteria hepática (aorta → hígado)
            { pts: [[0.46, 0.50], [0.42, 0.51], [0.38, 0.53]], col: '#E24B4A', w: 1.5 },
            // Vena porta (hígado → vena cava)
            { pts: [[0.36, 0.55], [0.44, 0.55], [0.51, 0.54]], col: '#378ADD', w: 1.5 },
            // Arteria renal izq
            { pts: [[0.46, 0.65], [0.40, 0.66], [0.35, 0.68]], col: '#E24B4A', w: 1.3 },
            // Arteria renal der
            { pts: [[0.46, 0.65], [0.53, 0.66], [0.59, 0.68]], col: '#E24B4A', w: 1.3 },
            // Vena renal izq
            { pts: [[0.34, 0.70], [0.42, 0.70], [0.51, 0.68]], col: '#378ADD', w: 1.3 },
            // Vena renal der
            { pts: [[0.61, 0.70], [0.55, 0.70], [0.51, 0.68]], col: '#378ADD', w: 1.3 },
          ];

          // Partículas
          interface Particle { pathIdx: number; progress: number; speed: number; }
          const particles: Particle[] = [];
          cirPaths.forEach((path, idx) => {
            const count = Math.max(3, Math.round(path.w * 2.5));
            for (let i = 0; i < count; i++) {
              particles.push({ pathIdx: idx, progress: i / count, speed: 0.004 + Math.random() * 0.003 });
            }
          });

          function lerpPath(pts: [number, number][], t: number): [number, number] {
            const total = pts.length - 1;
            const seg = t * total;
            const i = Math.min(Math.floor(seg), total - 1);
            const f = seg - i;
            return [
              (pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f) * TEX_W,
              (pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f) * TEX_H
            ];
          }

          // Silueta del cuerpo humano como path SVG simplificado
          function drawBody(c: CanvasRenderingContext2D) {
            c.save();
            c.beginPath();
            // Cabeza
            c.ellipse(TEX_W * 0.50, TEX_H * 0.10, TEX_W * 0.12, TEX_H * 0.09, 0, 0, Math.PI * 2);
            // Cuello + torso + caderas
            c.moveTo(TEX_W * 0.44, TEX_H * 0.18);
            c.bezierCurveTo(TEX_W * 0.38, TEX_H * 0.22, TEX_W * 0.28, TEX_H * 0.38, TEX_W * 0.28, TEX_H * 0.52);
            c.bezierCurveTo(TEX_W * 0.28, TEX_H * 0.60, TEX_W * 0.32, TEX_H * 0.64, TEX_W * 0.35, TEX_H * 0.72);
            // Pierna izquierda
            c.bezierCurveTo(TEX_W * 0.35, TEX_H * 0.80, TEX_W * 0.33, TEX_H * 0.90, TEX_W * 0.33, TEX_H * 0.98);
            c.lineTo(TEX_W * 0.42, TEX_H * 0.98);
            c.bezierCurveTo(TEX_W * 0.42, TEX_H * 0.90, TEX_W * 0.44, TEX_H * 0.80, TEX_W * 0.44, TEX_H * 0.72);
            // Zona central inferior
            c.lineTo(TEX_W * 0.56, TEX_H * 0.72);
            // Pierna derecha
            c.bezierCurveTo(TEX_W * 0.56, TEX_H * 0.80, TEX_W * 0.58, TEX_H * 0.90, TEX_W * 0.58, TEX_H * 0.98);
            c.lineTo(TEX_W * 0.67, TEX_H * 0.98);
            c.bezierCurveTo(TEX_W * 0.67, TEX_H * 0.90, TEX_W * 0.65, TEX_H * 0.80, TEX_W * 0.65, TEX_H * 0.72);
            // Cadera derecha + torso derecho
            c.bezierCurveTo(TEX_W * 0.68, TEX_H * 0.64, TEX_W * 0.72, TEX_H * 0.60, TEX_W * 0.72, TEX_H * 0.52);
            c.bezierCurveTo(TEX_W * 0.72, TEX_H * 0.38, TEX_W * 0.62, TEX_H * 0.22, TEX_W * 0.56, TEX_H * 0.18);
            c.closePath();

            // Relleno translúcido (piel)
            const grad = c.createLinearGradient(0, 0, TEX_W, TEX_H);
            grad.addColorStop(0, 'rgba(255,220,180,0.18)');
            grad.addColorStop(0.5, 'rgba(240,200,160,0.22)');
            grad.addColorStop(1, 'rgba(220,180,140,0.18)');
            c.fillStyle = grad;
            c.fill();

            // Borde corporal
            c.strokeStyle = 'rgba(255,220,180,0.55)';
            c.lineWidth = 3;
            c.stroke();

            // Brazos
            c.beginPath();
            // Brazo izquierdo
            c.moveTo(TEX_W * 0.29, TEX_H * 0.24);
            c.bezierCurveTo(TEX_W * 0.18, TEX_H * 0.30, TEX_W * 0.14, TEX_H * 0.50, TEX_W * 0.16, TEX_H * 0.65);
            c.lineTo(TEX_W * 0.22, TEX_H * 0.65);
            c.bezierCurveTo(TEX_W * 0.21, TEX_H * 0.50, TEX_W * 0.24, TEX_H * 0.30, TEX_W * 0.34, TEX_H * 0.25);
            c.closePath();
            c.fillStyle = 'rgba(255,220,180,0.18)';
            c.fill();
            c.strokeStyle = 'rgba(255,220,180,0.50)';
            c.lineWidth = 2;
            c.stroke();

            // Brazo derecho
            c.beginPath();
            c.moveTo(TEX_W * 0.71, TEX_H * 0.24);
            c.bezierCurveTo(TEX_W * 0.82, TEX_H * 0.30, TEX_W * 0.86, TEX_H * 0.50, TEX_W * 0.84, TEX_H * 0.65);
            c.lineTo(TEX_W * 0.78, TEX_H * 0.65);
            c.bezierCurveTo(TEX_W * 0.79, TEX_H * 0.50, TEX_W * 0.76, TEX_H * 0.30, TEX_W * 0.66, TEX_H * 0.25);
            c.closePath();
            c.fillStyle = 'rgba(255,220,180,0.18)';
            c.fill();
            c.strokeStyle = 'rgba(255,220,180,0.50)';
            c.lineWidth = 2;
            c.stroke();
            c.restore();
          }

          function drawOrgans(c: CanvasRenderingContext2D, p: number) {
            organs.forEach(([nx, ny, rx, ry, col, label]) => {
              const cx = nx * TEX_W, cy = ny * TEX_H;
              const pulse = 1 + 0.04 * Math.sin(p * 5 + nx * 10);
              c.save();
              c.beginPath();
              c.ellipse(cx, cy, rx * TEX_W * pulse, ry * TEX_H * pulse, 0, 0, Math.PI * 2);
              c.fillStyle = col + '55';
              c.strokeStyle = col + 'CC';
              c.lineWidth = 1.5;
              c.fill();
              c.stroke();
              // Label
              c.fillStyle = col;
              c.font = `bold ${TEX_W * 0.028}px sans-serif`;
              c.textAlign = 'center';
              c.textBaseline = 'middle';
              c.fillText(label, cx, cy);
              c.restore();
            });
          }

          function drawVessels(c: CanvasRenderingContext2D) {
            cirPaths.forEach(path => {
              if (path.pts.length < 2) return;
              c.beginPath();
              c.moveTo(path.pts[0][0] * TEX_W, path.pts[0][1] * TEX_H);
              for (let i = 1; i < path.pts.length; i++) {
                c.lineTo(path.pts[i][0] * TEX_W, path.pts[i][1] * TEX_H);
              }
              c.strokeStyle = path.col + '55';
              c.lineWidth = path.w;
              c.lineCap = 'round';
              c.stroke();
            });
          }

          function drawParticles(c: CanvasRenderingContext2D) {
            particles.forEach(p => {
              const path = cirPaths[p.pathIdx];
              const [px, py] = lerpPath(path.pts, p.progress);
              c.beginPath();
              c.arc(px, py, path.w * 1.4, 0, Math.PI * 2);
              c.fillStyle = path.col;
              c.fill();
            });
          }

          // Latido: escala rítmica del corazón
          function drawHeartbeat(c: CanvasRenderingContext2D, p: number) {
            const beat = 1 + 0.08 * Math.abs(Math.sin(p * 8));
            const [hx, hy] = [0.44 * TEX_W, 0.37 * TEX_H];
            c.save();
            c.beginPath();
            c.ellipse(hx, hy, 0.08 * TEX_W * beat, 0.07 * TEX_H * beat, 0, 0, Math.PI * 2);
            c.fillStyle = '#D4537E88';
            c.strokeStyle = '#D4537ECC';
            c.lineWidth = 2;
            c.fill();
            c.stroke();
            c.fillStyle = '#D4537E';
            c.font = `bold ${TEX_W * 0.028}px sans-serif`;
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.fillText('Corazón', hx, hy);
            c.restore();
          }

          // Loop de animación con ticker de A-Frame
          const comp = this;
          (comp as any)._ticker = function () {
            phase += 0.018;

            // Actualizar partículas
            particles.forEach(p => {
              p.progress += p.speed;
              if (p.progress >= 1) p.progress = 0;
            });

            // Redibujar canvas
            ctx.clearRect(0, 0, TEX_W, TEX_H);
            drawBody(ctx);
            drawVessels(ctx);
            drawOrgans(ctx, phase);
            drawHeartbeat(ctx, phase);
            drawParticles(ctx);
            texture.needsUpdate = true;
          };

          this.el.sceneEl.addEventListener('renderstart', () => {
            this.el.sceneEl.renderer.setAnimationLoop(() => {
              (comp as any)._ticker?.();
            });
          });
        },

        remove: function () {
          (this as any)._ticker = null;
        }
      });
    }

    // ── Construir contenido de la escena ──────────────────────────────────────
    let sceneContent = '';

    this.models.forEach(model => {
      let markerTag = '';
      if (model.markerId === 0) {
        markerTag = `<a-marker preset="hiro" id="marker-${model.markerId}">`;
      } else if (model.markerId === 1) {
        // Marcador del CENTRO: cuerpo humano translúcido con sistema circulatorio
        markerTag = `<a-marker preset="kanji" id="marker-${model.markerId}">`;
      } else {
        markerTag = `<a-marker type="barcode" value="${model.markerId}" id="marker-${model.markerId}">`;
      }

      if (model.markerId === 1) {
        // ── CUERPO HUMANO TRANSLÚCIDO (marcador kanji / centro) ───────────────
        sceneContent += `
          ${markerTag}
            <a-entity id="ar-model-${model.markerId}"
                      position="0 0.05 0"
                      rotation="-90 0 0"
                      scale="0.9 0.9 0.9">
              <a-entity animation="property: position; to: 0 0.15 0; dir: alternate; dur: 2500; loop: true; easing: easeInOutSine">

                <!-- Plano principal con textura dinámica del sistema circulatorio -->
                <a-plane
                  circulatory-body
                  width="1"
                  height="2"
                  position="0 0 0"
                  material="transparent: true; opacity: 1; side: double; depthWrite: false">
                </a-plane>

                <!-- Aura exterior de brillo corporal -->
                <a-plane
                  width="1.06"
                  height="2.06"
                  position="0 0 -0.005"
                  material="color: #aaddff; opacity: 0.07; transparent: true; side: double; depthWrite: false">
                </a-plane>

                <!-- Partículas flotantes de energía vital alrededor del cuerpo -->
                <a-entity animation="property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear">
                  <a-sphere position="0.55 0.3 0"  radius="0.025" color="#E24B4A" opacity="0.85"
                    animation="property: position; from: 0.55 0.3 0; to: 0.55 0.8 0; dir: alternate; dur: 1800; loop: true; easing: easeInOutSine">
                  </a-sphere>
                  <a-sphere position="-0.55 0.5 0" radius="0.025" color="#378ADD" opacity="0.85"
                    animation="property: position; from: -0.55 0.5 0; to: -0.55 0.1 0; dir: alternate; dur: 2200; loop: true; easing: easeInOutSine">
                  </a-sphere>
                  <a-sphere position="0.55 -0.3 0" radius="0.02"  color="#97C459" opacity="0.85"
                    animation="property: position; from: 0.55 -0.3 0; to: 0.55 -0.7 0; dir: alternate; dur: 1500; loop: true; easing: easeInOutSine">
                  </a-sphere>
                  <a-sphere position="-0.55 -0.5 0" radius="0.02" color="#EF9F27" opacity="0.85"
                    animation="property: position; from: -0.55 -0.5 0; to: -0.55 -0.1 0; dir: alternate; dur: 2000; loop: true; easing: easeInOutSine">
                  </a-sphere>
                </a-entity>

                <!-- Pulso de luz cardíaco (esfera que late en el pecho) -->
                <a-sphere position="-0.06 0.26 0.02" radius="0.07" color="#D4537E" opacity="0.45"
                  animation="property: scale; from: 1 1 1; to: 1.35 1.35 1.35; dir: alternate; dur: 700; loop: true; easing: easeInOutSine">
                </a-sphere>

                <!-- Halo de los pulmones -->
                <a-sphere position="-0.16 0.3 0.01"  radius="0.08" color="#97C459" opacity="0.2"
                  animation="property: scale; from: 1 1 1; to: 1.15 1.15 1.15; dir: alternate; dur: 2500; loop: true; easing: easeInOutSine">
                </a-sphere>
                <a-sphere position="0.10 0.3 0.01"  radius="0.08" color="#97C459" opacity="0.2"
                  animation="property: scale; from: 1.1 1.1 1.1; to: 1 1 1; dir: alternate; dur: 2500; loop: true; easing: easeInOutSine">
                </a-sphere>

              </a-entity>
            </a-entity>
          </a-marker>
        `;
      } else {
        // ── Modelos genéricos para los otros marcadores ──────────────────────
        sceneContent += `
          ${markerTag}
            <a-entity id="ar-model-${model.markerId}" position="0 0 0" rotation="-90 0 0" scale="0.8 0.8 0.8">
              <a-entity animation="property: position; to: 0 0.2 0; dir: alternate; duration: 2000; loop: true">
                <a-sphere position="0 1.8 0" radius="0.3" color="${model.color}" opacity="0.9"></a-sphere>
                <a-cylinder position="0 1.0 0" radius="0.3" height="1.0" color="${model.color}" opacity="0.8"></a-cylinder>
                <a-cylinder position="-0.4 1.2 0" radius="0.1" height="0.8" rotation="0 0 30" color="${model.color}" opacity="0.9"></a-cylinder>
                <a-cylinder position="0.4 1.2 0" radius="0.1" height="0.8" rotation="0 0 -30" color="${model.color}" opacity="0.9"></a-cylinder>
                <a-cylinder position="-0.15 0.4 0" radius="0.1" height="0.8" color="${model.color}" opacity="0.9"></a-cylinder>
                <a-cylinder position="0.15 0.4 0" radius="0.1" height="0.8" color="${model.color}" opacity="0.9"></a-cylinder>
              </a-entity>
            </a-entity>
          </a-marker>
        `;
      }
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
