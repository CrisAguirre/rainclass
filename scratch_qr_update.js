const fs = require('fs');

const tsFile = 'c:/Users/USUARIO/Desktop/RA/rainclass/src/app/pages/laboratories/lab-desarrollo/lab-desarrollo.component.ts';
let tsContent = fs.readFileSync(tsFile, 'utf8');

const newModels = `  models: ModelInfo[] = [
    {
      name: 'Lenguaje',
      subject: 'Lenguaje',
      icon: '📖',
      modelPath: '/assets/models/lenguaje_model.glb',
      color: '#ef4444',
      description: 'Modelo 3D para la asignatura de Lenguaje. Explora el mundo de las palabras y la gramática.',
      markerId: 0
    },
    {
      name: 'Matemáticas',
      subject: 'Matemáticas',
      icon: '📐',
      modelPath: '/assets/models/matematicas_model.glb',
      color: '#3b82f6',
      description: 'Modelo 3D para Matemáticas. Figuras geométricas, números y lógica espacial.',
      markerId: 1
    },
    {
      name: 'Ciencias Naturales',
      subject: 'Ciencias Naturales',
      icon: '🫀',
      modelPath: '/assets/models/ciencias_model.glb',
      color: '#22c55e',
      description: 'Modelo 3D de Ciencias Naturales. Biología, ecosistemas y anatomía.',
      markerId: 2
    },
    {
      name: 'Sociales',
      subject: 'Sociales',
      icon: '🌍',
      modelPath: '/assets/models/sociales_model.glb',
      color: '#f59e0b',
      description: 'Modelo 3D para Sociales. Geografía, historia y civilizaciones.',
      markerId: 3
    },
    {
      name: 'Inglés',
      subject: 'Inglés',
      icon: '🗣️',
      modelPath: '/assets/models/ingles_model.glb',
      color: '#8b5cf6',
      description: 'Modelo 3D interactivo para aprender y practicar vocabulario en Inglés.',
      markerId: 4
    },
    {
      name: 'Comprensión de lectura',
      subject: 'Comprensión de lectura',
      icon: '📚',
      modelPath: '/assets/models/comprension_model.glb',
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
  };`;

const regex = /models: ModelInfo\[\] = \[[\s\S]*?private modelMap: \{ \[key: string\]: ModelInfo \} = \{[\s\S]*?\};/;
tsContent = tsContent.replace(regex, newModels);
fs.writeFileSync(tsFile, tsContent);

const htmlFile = 'c:/Users/USUARIO/Desktop/RA/rainclass/src/app/pages/laboratories/lab-desarrollo/lab-desarrollo.component.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf8');

// Replace "3" with "6" only in the QR scan section
htmlContent = htmlContent.replace(/Apunta hacia uno de los 3 códigos QR/g, 'Apunta hacia uno de los 6 códigos QR');
htmlContent = htmlContent.replace(/\(scanHistory\.length \/ 3\) \* 100/g, '(scanHistory.length / 6) * 100');
htmlContent = htmlContent.replace(/de 3 modelos escaneados/g, 'de 6 modelos escaneados');
htmlContent = htmlContent.replace(/scanHistory\.length === 3/g, 'scanHistory.length === 6');

fs.writeFileSync(htmlFile, htmlContent);

console.log('Update completed for 6 subjects.');
