import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number; // index of correct option
}

@Component({
  selector: 'app-lab-evaluacion',
  templateUrl: './lab-evaluacion.component.html',
  styleUrls: ['./lab-evaluacion.component.css']
})
export class LabEvaluacionComponent implements OnInit {
  labId: string | null = null;
  answers: { [key: number]: number } = {};
  submitted = false;
  score = 0;
  totalQuestions = 0;

  mergeCubeQuestions: Question[] = [
    {
      id: 1,
      text: '¿Qué es el Merge Cube?',
      options: [
        'Un videojuego de consola para aprender ciencias',
        'Un dispositivo físico de realidad aumentada que permite sostener objetos 3D digitales',
        'Una aplicación de realidad virtual que requiere gafas especiales',
        'Un cubo de Rubik con sensores electrónicos'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Qué tecnología utiliza el Merge Cube para funcionar?',
      options: [
        'Bluetooth y sensores de movimiento',
        'NFC y chips integrados',
        'Visión por computadora y marcadores de realidad aumentada',
        'GPS y realidad virtual'
      ],
      correct: 2
    },
    {
      id: 3,
      text: '¿Qué función cumplen los patrones impresos en las caras del Merge Cube?',
      options: [
        'Son decorativos y no tienen función técnica',
        'Actúan como marcadores que la cámara reconoce para superponer objetos 3D',
        'Emiten señales infrarrojas al dispositivo',
        'Almacenan datos en formato QR'
      ],
      correct: 1
    },
    {
      id: 4,
      text: '¿Cuál de las siguientes NO es una aplicación oficial del ecosistema Merge?',
      options: [
        'Merge Explorer',
        'Object Viewer',
        'HoloGlobe',
        'Merge Reality Pro'
      ],
      correct: 3
    },
    {
      id: 5,
      text: '¿Qué tipo de aprendizaje promueve el Merge Cube?',
      options: [
        'Aprendizaje exclusivamente visual',
        'Aprendizaje multisensorial (visual, auditivo, cinestésico y táctil)',
        'Aprendizaje memorístico tradicional',
        'Aprendizaje pasivo basado en observación'
      ],
      correct: 1
    },
    {
      id: 6,
      text: '¿Con cuáles dispositivos es compatible el Merge Cube?',
      options: [
        'Solo con iPhones de última generación',
        'Exclusivamente con tabletas Android',
        'iOS, Android, Chromebook y Windows',
        'Solo con gafas de realidad virtual'
      ],
      correct: 2
    },
    {
      id: 7,
      text: '¿Cuántos objetos digitales 3D aproximadamente ofrece la plataforma Merge Explorer?',
      options: [
        'Alrededor de 50',
        'Alrededor de 200',
        'Más de 1000',
        'Menos de 10'
      ],
      correct: 2
    },
    {
      id: 8,
      text: '¿Cómo puede un docente implementar el Merge Cube sin presupuesto?',
      options: [
        'No es posible, el cubo es imprescindible comprarlo',
        'Imprimiendo la plantilla gratuita en papel y armando el cubo',
        'Usando una copia pirata del software',
        'Dibujando los patrones a mano'
      ],
      correct: 1
    },
    {
      id: 9,
      text: '¿Qué permite hacer la aplicación Object Viewer?',
      options: [
        'Tomar fotografías profesionales',
        'Cargar y visualizar modelos 3D propios sobre el Merge Cube',
        'Editar videos en realidad aumentada',
        'Crear presentaciones tipo PowerPoint'
      ],
      correct: 1
    },
    {
      id: 10,
      text: '¿Cuál es una ventaja pedagógica clave del aprendizaje multisensorial con Merge Cube?',
      options: [
        'Reduce el tiempo de clase a la mitad',
        'Elimina la necesidad de explicaciones del docente',
        'Mejora la retención y comprensión de conceptos abstractos',
        'Permite que los estudiantes no necesiten estudiar'
      ],
      correct: 2
    },
    {
      id: 11,
      text: '¿Qué estrategia pedagógica se puede implementar con el Merge Cube usando "aula invertida"?',
      options: [
        'El docente muestra videos mientras los alumnos duermen',
        'Los estudiantes exploran modelos 3D en casa y discuten en clase',
        'Se elimina toda la parte teórica de la asignatura',
        'El cubo reemplaza los libros de texto completamente'
      ],
      correct: 1
    },
    {
      id: 12,
      text: '¿Qué permite visualizar la aplicación HoloGlobe?',
      options: [
        'Modelos de automóviles en 3D',
        'Datos globales en tiempo real sobre un globo terráqueo holográfico',
        'Juegos de mesa en realidad virtual',
        'Películas en formato 3D'
      ],
      correct: 1
    },
    {
      id: 13,
      text: '¿En qué área STEM se puede usar el Merge Cube para explorar el sistema solar?',
      options: [
        'Tecnología de redes',
        'Astronomía y ciencias del espacio',
        'Programación avanzada',
        'Diseño gráfico editorial'
      ],
      correct: 1
    },
    {
      id: 14,
      text: '¿Cómo beneficia el Merge Cube a estudiantes con necesidades educativas especiales?',
      options: [
        'No tiene beneficios para esta población',
        'Proporciona estímulos multisensoriales que facilitan la comprensión',
        'Reemplaza al docente de apoyo',
        'Solo es útil para estudiantes avanzados'
      ],
      correct: 1
    },
    {
      id: 15,
      text: '¿Qué rol asume el docente al integrar el Merge Cube en su práctica?',
      options: [
        'Se vuelve innecesario en el proceso',
        'Solo supervisa que los dispositivos funcionen',
        'Evoluciona de transmisor de información a diseñador de experiencias de aprendizaje',
        'Se limita a leer instrucciones del manual del cubo'
      ],
      correct: 2
    },
    {
      id: 16,
      text: '¿Cuál herramienta de diseño 3D se puede usar para que los estudiantes creen modelos que luego visualicen en el Merge Cube?',
      options: [
        'Microsoft Word',
        'Tinkercad o Paint 3D',
        'Excel con gráficos 3D',
        'Adobe Photoshop'
      ],
      correct: 1
    },
    {
      id: 17,
      text: '¿Qué tipo de evaluación se puede realizar naturalmente con el Merge Cube?',
      options: [
        'Evaluación sumativa con examen escrito únicamente',
        'Evaluación formativa a través de la observación y descripción de modelos 3D',
        'Evaluación estandarizada de opción múltiple',
        'No es posible evaluar con esta herramienta'
      ],
      correct: 1
    },
    {
      id: 18,
      text: '¿Por qué se dice que el Merge Cube hace los conceptos abstractos "tangibles"?',
      options: [
        'Porque imprime objetos reales en 3D',
        'Porque permite sostener y manipular representaciones digitales 3D con las manos',
        'Porque convierte texto en audio',
        'Porque proyecta hologramas sin necesidad de dispositivo'
      ],
      correct: 1
    },
    {
      id: 19,
      text: '¿Qué ventaja tiene el Merge Cube sobre otras tecnologías de RA más costosas?',
      options: [
        'Tiene mejor resolución gráfica',
        'Funciona sin electricidad ni internet',
        'Es accesible, económico y funciona con dispositivos que ya se tienen',
        'No requiere ningún tipo de software'
      ],
      correct: 2
    },
    {
      id: 20,
      text: '¿Cómo puede un proyecto interdisciplinario integrar el Merge Cube?',
      options: [
        'Solo se puede usar en la clase de tecnología',
        'Explorando un volcán (ciencias), su ubicación (geografía) y escribiendo un relato (lengua)',
        'Únicamente para clases de matemáticas',
        'No es posible hacer proyectos interdisciplinarios con RA'
      ],
      correct: 1
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.labId = params.get('id');
    });
  }

  selectAnswer(questionId: number, optionIndex: number) {
    if (!this.submitted) {
      this.answers[questionId] = optionIndex;
    }
  }

  getQuestions(): Question[] {
    if (this.labId === '1') return this.mergeCubeQuestions;
    return [];
  }

  canSubmit(): boolean {
    const questions = this.getQuestions();
    return questions.length > 0 && Object.keys(this.answers).length === questions.length;
  }

  submitEvaluation() {
    const questions = this.getQuestions();
    this.totalQuestions = questions.length;
    this.score = 0;
    questions.forEach(q => {
      if (this.answers[q.id] === q.correct) {
        this.score++;
      }
    });
    this.submitted = true;
    // TODO: Send results to backend
  }

  getPercentage(): number {
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  retryEvaluation() {
    this.answers = {};
    this.submitted = false;
    this.score = 0;
  }
}
