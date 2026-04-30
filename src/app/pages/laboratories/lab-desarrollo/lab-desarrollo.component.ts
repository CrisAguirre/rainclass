import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';

interface ModelInfo {
  name: string;
  subject: string;
  icon: string;
  modelPath: string;
  color: string;
  description: string;
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

  private modelMap: { [key: string]: ModelInfo } = {
    'RAINCLASS_MATH_3D': {
      name: 'Tetraedro Geométrico',
      subject: 'Matemáticas',
      icon: '📐',
      modelPath: 'assets/models/math_model.glb',
      color: '#3b82f6',
      description: 'Sólido geométrico regular de 4 caras triangulares equiláteras. Fundamental en geometría espacial y topología.'
    },
    'RAINCLASS_SCIENCE_3D': {
      name: 'Molécula Científica',
      subject: 'Ciencias Naturales',
      icon: '🔬',
      modelPath: 'assets/models/science_model.glb',
      color: '#22c55e',
      description: 'Estructura molecular representativa. Las moléculas son la base de la materia y sus interacciones químicas.'
    },
    'RAINCLASS_LITERATURE_3D': {
      name: 'Libro Literario',
      subject: 'Literatura',
      icon: '📖',
      modelPath: 'assets/models/literature_model.glb',
      color: '#ef4444',
      description: 'Representación 3D de un libro abierto. Símbolo del conocimiento narrativo y la imaginación creativa.'
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.labId = params.get('id');
    });
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

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
}
