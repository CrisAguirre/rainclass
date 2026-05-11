const fs = require('fs');

const file = 'src/app/pages/laboratories/lab-evaluacion/lab-evaluacion.component.ts';
let content = fs.readFileSync(file, 'utf8');

const newQuestions = `visualizadorQuestions: Question[] = [
    {
      id: 1,
      text: '¿Cuántas temáticas principales abarca el Visor de Modelos 3D en la Misión 6?',
      options: [
        'Tres temáticas',
        'Cuatro temáticas',
        'Seis temáticas (Lenguaje, Matemáticas, Ciencias Naturales, Sociales, Inglés y Comprensión)',
        'Diez temáticas'
      ],
      correct: 2
    },
    {
      id: 2,
      text: '¿Para qué sirve el código QR en esta misión?',
      options: [
        'Para descargar un archivo PDF',
        'Para activar la visualización del modelo 3D interactivo correspondiente a cada temática',
        'Para conectarse al WiFi del colegio',
        'Para compartir resultados en redes sociales'
      ],
      correct: 1
    },
    {
      id: 3,
      text: 'Si un estudiante escanea el QR de "Ciencias Naturales", ¿qué tipo de modelo visualizará?',
      options: [
        'Un sólido geométrico o ecuación',
        'Un modelo interactivo relacionado con biología y anatomía',
        'Un mapa político interactivo',
        'Un libro de vocabulario en inglés'
      ],
      correct: 1
    },
    {
      id: 4,
      text: '¿Qué ventaja pedagógica ofrece visualizar figuras matemáticas en 3D?',
      options: [
        'Mejora la caligrafía de los números',
        'Permite comprender mejor la lógica espacial y las propiedades de las figuras',
        'Reduce el tiempo de la clase',
        'No ofrece ninguna ventaja real'
      ],
      correct: 1
    },
    {
      id: 5,
      text: '¿Qué elemento visual se destaca en la animación inicial de introducción a la Misión 6?',
      options: [
        'Un cubo flotante',
        'Un iris de ojo humano interactivo y brillante',
        'Un holograma de una persona',
        'Un marcador QR rotando'
      ],
      correct: 1
    },
    {
      id: 6,
      text: '¿Qué identificador interno utiliza el modelo de Comprensión de Lectura para ser reconocido?',
      options: [
        'RAINCLASS_MATH_3D',
        'RAINCLASS_SOCIALES_3D',
        'RAINCLASS_COMPRENSION_3D',
        'RAINCLASS_INGLES_3D'
      ],
      correct: 2
    },
    {
      id: 7,
      text: 'El área de Ciencias Sociales en este visor 3D se enfoca en:',
      options: [
        'La enseñanza de verbos irregulares',
        'Geografía y civilizaciones',
        'Anatomía del corazón',
        'Análisis sintáctico de oraciones'
      ],
      correct: 1
    },
    {
      id: 8,
      text: 'En el visor de Inglés, el modelo 3D tiene como objetivo principal:',
      options: [
        'Traducir textos completos automáticamente',
        'Practicar vocabulario de forma interactiva',
        'Corregir la pronunciación',
        'Enseñar historia británica'
      ],
      correct: 1
    },
    {
      id: 9,
      text: '¿Qué requerimiento técnico se necesita para escanear los QR de esta misión?',
      options: [
        'Gafas de Realidad Virtual avanzadas',
        'Un dispositivo móvil o computadora con cámara web',
        'Un Merge Cube físico',
        'Una impresora 3D'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al observar un modelo interactivo del "mundo de las palabras", ¿qué asignatura estamos abordando?',
      options: [
        'Matemáticas',
        'Lenguaje',
        'Ciencias Naturales',
        'Inglés'
      ],
      correct: 1
    }
  ];`;

// Remove the old array and replace it
const regex = /visualizadorQuestions:\s*Question\[\]\s*=\s*\[[\s\S]*?\];/;
if (content.match(regex)) {
  content = content.replace(regex, newQuestions);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully replaced visualizadorQuestions');
} else {
  console.log('Could not find visualizadorQuestions block');
}
