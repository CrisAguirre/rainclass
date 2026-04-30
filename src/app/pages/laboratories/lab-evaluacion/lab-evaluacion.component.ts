import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';

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

  quiverQuestions: Question[] = [
    {
      id: 1,
      text: '¿Qué es QuiverVision?',
      options: [
        'Una herramienta de Realidad Virtual para dibujar en el aire',
        'Una plataforma de Realidad Aumentada que da vida en 3D a dibujos coloreados en papel',
        'Un software para imprimir libros en 3D',
        'Una marca de crayones inteligentes'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Cuál es el primer paso para utilizar QuiverVision en el aula?',
      options: [
        'Comprar un Merge Cube',
        'Pintar la pantalla de la tablet',
        'Descargar e imprimir las plantillas desde el portal de Quiver',
        'Escuchar un audio explicativo'
      ],
      correct: 2
    },
    {
      id: 3,
      text: '¿Qué sucede cuando se escanea un dibujo coloreado con la app de Quiver?',
      options: [
        'El dibujo se borra de la hoja',
        'Aparece un modelo genérico en 3D',
        'Aparece un modelo 3D que conserva los mismos colores y texturas usados por el estudiante',
        'El dibujo se convierte en una foto 2D'
      ],
      correct: 2
    },
    {
      id: 4,
      text: '¿Qué habilidad principal se fomenta durante la etapa de coloreado manual en QuiverVision?',
      options: [
        'Programación avanzada',
        'Motricidad fina y expresión artística',
        'Matemáticas abstractas',
        'Lectura rápida'
      ],
      correct: 1
    },
    {
      id: 5,
      text: '¿Qué ventaja tiene QuiverVision sobre la Realidad Virtual en educación infantil?',
      options: [
        'Es más costosa',
        'Aísla completamente al estudiante del entorno real',
        'Combina una actividad manual tradicional (colorear) con la innovación digital',
        'Requiere computadoras de alto rendimiento'
      ],
      correct: 2
    },
    {
      id: 6,
      text: '¿Cómo contribuye Quiver a la autoestima del estudiante?',
      options: [
        'Dándole recompensas virtuales por jugar rápido',
        'Al ver que su propia creación, con sus colores únicos, cobra vida y es la protagonista',
        'Calificando su dibujo con notas del 1 al 10',
        'Comparando su dibujo con el de sus compañeros'
      ],
      correct: 1
    },
    {
      id: 7,
      text: '¿En qué área se puede utilizar la plantilla de un volcán de QuiverVision?',
      options: [
        'Música',
        'Ciencias Naturales o Geografía',
        'Matemáticas',
        'Educación Física'
      ],
      correct: 1
    },
    {
      id: 8,
      text: '¿Qué portal específico ofrece Quiver para planes de estudio y educadores?',
      options: [
        'Quiver Entertainment',
        'Quiver Education',
        'Quiver Pro 3D',
        'Quiver Teachers Only'
      ],
      correct: 1
    },
    {
      id: 9,
      text: '¿Cuál de las siguientes acciones NO es posible en la app de Quiver?',
      options: [
        'Interactuar tocando elementos en la pantalla',
        'Hacer que personajes animados realicen acciones',
        'Modificar el código fuente de la aplicación en tiempo real',
        'Escuchar audios informativos o cuestionarios en la app'
      ],
      correct: 2
    },
    {
      id: 10,
      text: '¿Cómo se pueden integrar las lenguas y la literatura con QuiverVision?',
      options: [
        'Haciendo que la app escriba ensayos automáticamente',
        'Usando los personajes 3D como inspiración para crear relatos o practicar narración oral',
        'Coloreando el abecedario sin usar tecnología',
        'QuiverVision no se puede usar para literatura'
      ],
      correct: 1
    },
    {
      id: 11,
      text: '¿Qué tecnología utiliza Quiver para detectar las páginas impresas?',
      options: [
        'Geolocalización GPS',
        'Reconocimiento de imágenes patentado',
        'Lectura de chips RFID',
        'Sensores de temperatura'
      ],
      correct: 1
    },
    {
      id: 12,
      text: '¿Qué es el "efecto Wow" en el contexto de QuiverVision?',
      options: [
        'El sonido que hace la app al iniciar',
        'El asombro inmediato que capta la atención del alumno al ver su dibujo cobrar vida',
        'Un botón especial para ganar puntos',
        'Un filtro de cámara para hacer las fotos más brillantes'
      ],
      correct: 1
    },
    {
      id: 13,
      text: '¿Cuál es el rol del docente durante una actividad con QuiverVision?',
      options: [
        'Solo observar cómo los niños colorean',
        'Aprovechar el asombro inicial para guiar a los estudiantes hacia la indagación y el objetivo curricular',
        'Colorear por los estudiantes',
        'Apagar los dispositivos para no distraer'
      ],
      correct: 1
    },
    {
      id: 14,
      text: 'En Matemáticas y Geometría, ¿qué permite visualizar QuiverVision?',
      options: [
        'Ecuaciones algebraicas complejas resueltas',
        'La transición de redes planas 2D a poliedros sólidos 3D que se pueden rotar',
        'La tabla de multiplicar cantada',
        'Estadísticas avanzadas de la clase'
      ],
      correct: 1
    },
    {
      id: 15,
      text: '¿Es necesario que el colegio adquiera hardware costoso específico (como cascos VR) para usar Quiver?',
      options: [
        'Sí, requiere cascos de $500 USD por estudiante',
        'No, basta con hojas impresas, lápices de colores y dispositivos móviles o tablets estándar',
        'Sí, se necesitan proyectores holográficos',
        'No, funciona en calculadoras'
      ],
      correct: 1
    },
    {
      id: 16,
      text: '¿Qué color de escaneo indica en la app de Quiver que ha detectado correctamente la plantilla entera?',
      options: [
        'Rojo a naranja',
        'Gris a blanco',
        'Azul a verde',
        'Negro a amarillo'
      ],
      correct: 2
    },
    {
      id: 17,
      text: 'Para trabajar educación emocional con Quiver, ¿qué estrategia es efectiva?',
      options: [
        'Obligar a todos a pintar de color gris',
        'Pedir que usen colores que expresen su estado de ánimo y reflexionar sobre la animación resultante',
        'Jugar carreras para ver quién termina primero',
        'Esconder la tablet si se portan mal'
      ],
      correct: 1
    },
    {
      id: 18,
      text: '¿Qué pasa si el estudiante colorea fuera de las líneas en la plantilla de Quiver?',
      options: [
        'La aplicación se bloquea',
        'El modelo 3D refleja esos trazos fuera de línea, mostrando fielmente la creación del niño',
        'El dibujo se auto-corrige y queda perfecto',
        'El modelo pierde todo el color y se vuelve blanco'
      ],
      correct: 1
    },
    {
      id: 19,
      text: 'Además de la cámara, ¿qué otro recurso multimedia suele integrarse en las animaciones de Quiver?',
      options: [
        'Solo imágenes sin sonido',
        'Efectos de sonido, información en audio y minijuegos',
        'Chat en vivo con el profesor',
        'Videollamadas con otros colegios'
      ],
      correct: 1
    },
    {
      id: 20,
      text: '¿Cuál es una conclusión pedagógica clave del Laboratorio de QuiverVision?',
      options: [
        'La tecnología debe eliminar el uso de papel en las escuelas',
        'La RA es demasiado compleja para niños pequeños',
        'Se puede crear un vínculo perfecto y significativo entre actividades analógicas manuales y la tecnología inmersiva',
        'Colorear es una pérdida de tiempo en la era digital'
      ],
      correct: 2
    }
  ];

  constructor(private route: ActivatedRoute, private evalService: EvaluationService) {}

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
    if (this.labId === '2') return this.quiverQuestions;
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

    // Get user from localStorage
    let userStr = localStorage.getItem('currentUser');
    let user = userStr ? JSON.parse(userStr) : { userId: 'anon', username: 'Docente Anónimo' };

    // Send results to backend
    const labNames: { [key: string]: string } = { '1': 'Merge Cube', '2': 'QuiverVision', '3': 'Actionbound', '4': 'Metaverso Meta', '5': 'Laboratorio 5' };
    this.evalService.saveResult({
      userId: user.userId,
      username: user.username,
      labId: parseInt(this.labId || '0'),
      labName: labNames[this.labId || '1'] || 'Desconocido',
      score: this.score,
      totalQuestions: this.totalQuestions,
      percentage: this.getPercentage(),
      answers: this.answers
    }).subscribe({
      next: (res) => console.log('Resultado guardado:', res),
      error: (err) => console.error('Error al guardar resultado:', err)
    });
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
