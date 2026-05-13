import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { ProgressService } from '../../../services/progress.service';
import { AuthService } from '../../../services/auth.service';
import { GamificationService } from '../../../services/gamification.service';

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

  introduccionQuestions: Question[] = [
    {
      id: 1,
      text: '¿Cuál es la definición más precisa de Realidad Aumentada (RA)?',
      options: [
        'Una tecnología que sumerge completamente al usuario en un entorno 100% digital, bloqueando el mundo real.',
        'Una tecnología que superpone contenido digital (imágenes, modelos 3D, sonidos) sobre el mundo físico en tiempo real, a través de la cámara de un dispositivo.',
        'Un videojuego que usa sensores de movimiento para controlar personajes en una pantalla.',
        'Una aplicación de edición de fotografías que añade filtros sobre las imágenes guardadas.'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Cuál es la diferencia clave entre Realidad Aumentada (RA) y Realidad Virtual (RV)?',
      options: [
        'La RA requiere gafas especiales y la RV no necesita ningún dispositivo adicional.',
        'La RA solo funciona en interiores, mientras que la RV funciona en cuálquier lugar.',
        'En la RA el usuario sigue viendo su entorno real enriquecido con capas digitales; en la RV el usuario se sumerge completamente en un entorno digital.',
        'La RA es más costosa que la RV porque necesita cámaras de mayor resolución.'
      ],
      correct: 2
    },
    {
      id: 3,
      text: '¿Cuáles son los tres elementos únicos fundamentales que hacen posible el funcionamiento de la Realidad Aumentada?',
      options: [
        'Teclado, ratón y pantalla de alta resolución.',
        'Cámara/sensor, procesamiento por software y pantalla/visor.',
        'Auriculares, micrófono y conexión a internet de fibra óptica.',
        'GPS, batería de larga duración y almacenamiento en la nube.'
      ],
      correct: 1
    },
    {
      id: 4,
      text: 'Según la misión introductoria, ¿cuánto puede aumentar la retención de información cuando se aprende con Realidad Aumentada frente al aprendizaje pasivo?',
      options: [
        'Hasta un 20%.',
        'Hasta un 50%.',
        'Hasta un 75%.',
        'Hasta un 95%.'
      ],
      correct: 2
    },
    {
      id: 5,
      text: '¿Cuál de los siguientes ejemplos cotidianos es una aplicación real de Realidad Aumentada?',
      options: [
        'Ver una película en plataformás de streaming cómo Netflix.',
        'Usar filtros de Instagram, jugar Pokemon GO o usar Google Translate con cámara.',
        'Hacer una videollamada por Zoom con compañeros de trabajo.',
        'Escuchar música a través de auriculares inalámbricos Bluetooth.'
      ],
      correct: 1
    },
    {
      id: 6,
      text: '¿Qué caracteriza a la Realidad Mixta (RM) y la diferencia de la RA y la RV?',
      options: [
        'La RM solo funciona en dispositivos Apple y no es compatible con Android.',
        'La RM es simplemente otro nombre para la Realidad Virtual con mejor resolución gráfica.',
        'En la RM los objetos digitales interactúan con el mundo físico en tiempo real, a diferencia de la RA donde son solo capas superpuestas.',
        'La RM requiere siempre una habitación completamente oscura para funcionar correctamente.'
      ],
      correct: 2
    },
    {
      id: 7,
      text: '¿Cuál de las siguientes NO es una ventaja pedagógica de usar Realidad Aumentada en el aula según la misión introductoria?',
      options: [
        'Permite gamificar el proceso educativo y elevar la motivación del estudiante.',
        'Permite visualizar conceptos abstractos de forma tridimensional e interactiva.',
        'Elimina completamente la necesidad de que el docente prepare sus clases.',
        'Elimina barreras geográficas y de recursos físicos.'
      ],
      correct: 2
    },
    {
      id: 8,
      text: 'En la ruta de aprendizaje de RaInClass, ¿qué misión está dedicada a la creación de experiencias de RA propias usando tecnología web y códigos QR?',
      options: [
        'Misión 2 Cubo Merge.',
        'Misión 4 Actionbound.',
        'Misión 6 Visualizador 3D.',
        'Misión 7 Modelo con Geoposición.'
      ],
      correct: 2
    },
    {
      id: 9,
      text: '¿Qué diferencia fundamentalmente a la Misión 7 (Modelo con Geoposición) de la Misión 6 (RA Propia)?',
      options: [
        'La Misión 7 usa realidad virtual en lugar de realidad aumentada.',
        'En la Misión 7 el modelo 3D se ancla espacialmente a un marcador físico manteniendo posición, rotación e inclinación en tiempo real (6DoF), mientras que en la Misión 6 el QR solo activa la visualización.',
        'La Misión 7 requiere gafas de Realidad Virtual y la Misión 6 solo necesita un smartphone.',
        'En la Misión 7 los modelos son en 2D y en la Misión 6 son en 3D.'
      ],
      correct: 1
    },
    {
      id: 10,
      text: '¿Qué requisito mínimo se necesita para comenzar a experimentar con Realidad Aumentada según la misión introductoria?',
      options: [
        'Un ordenador de escritorio con tarjeta gráfica de última generación y gafas VR de 500 dólares.',
        'Un dispositivo con cámara (teléfono, tablet o PC con webcam), conexión a internet estable y disposición para experimentar.',
        'Una sala de informática equipada con 30 computadores y un servidor propio del colegio.',
        'Conocimientos avanzados de programación en Python y diseño 3D en Blender.'
      ],
      correct: 1
    }
  ];

  mergeCubeQuestions: Question[] = [
    {
      id: 1,
      text: '¿Qué son los marcadores fiduciales en el Cubo Merge?',
      options: [
        'Sensores electrónicos integrados en el cubo que emiten señales Bluetooth',
        'Patrones geométricos impresos en cada cara que la cámara detecta para calcular posición y orientación',
        'Chips NFC que transmiten datos al dispositivo móvil',
        'Códigos QR que redirigen a páginas web con contenido 3D'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Cuál es la tecnología principal que permite al Cubo Merge superponer objetos 3D sobre el cubo físico?',
      options: [
        'GPS y triangulación de señales de radio',
        'Realidad Virtual con cascos especializados',
        'Visión por computadora y seguimiento espacial en tiempo real',
        'Bluetooth 5.0 y sensores de acelerómetro'
      ],
      correct: 2
    },
    {
      id: 3,
      text: '¿Cuál de las siguientes afirmaciones sobre el Cubo Merge y la conectividad es correcta?',
      options: [
        'Requiere 4G o Wi-Fi constante para renderizar los modelos 3D',
        'Solo funciona con conexión a internet en tiempo real vía streaming',
        'Una vez descargados los modelos, puede funcionar sin conexión a internet',
        'Necesita conexión permanente para calcular el tracking del cubo'
      ],
      correct: 2
    },
    {
      id: 4,
      text: '¿Qué aplicación del ecosistema Merge EDU permite cargar modelos 3D diseñados por los propios estudiantes (ej. desde Tinkercad)?',
      options: [
        'Merge Explorer',
        'HoloGlobe',
        'Object Viewer',
        'Merge Reality Pro'
      ],
      correct: 2
    },
    {
      id: 5,
      text: '¿Qué tipo de datos puede visualizar un estudiante de Ciencias Sociales con la aplicación HoloGlobe?',
      options: [
        'Solo mapas políticos con fronteras de países',
        'Temperatura global, densidad de población, corrientes oceánicas y actividad sísmica en tiempo real',
        'Unicamente imágenes satelitales estáticas del planeta',
        'Videos de viajes espaciales grabados por la NASA'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'En una clase, el docente usa el Cubo Merge para explorar la célula. ¿Qué rol debería asumir el docente durante la exploración?',
      options: [
        'Dictar todas las partes de la célula mientras los estudiantes repiten',
        'Guía socrático: hacer preguntas orientadoras cómo "¿Qué función cumple esa estructura?" sin dar respuestas directas',
        'Permanecer en su escritorio mientras los estudiantes trabajan solos',
        'Evaluar con nota durante la exploración sin retroalimentación'
      ],
      correct: 1
    },
    {
      id: 7,
      text: '¿Por qué el aprendizaje multisensorial con el Cubo Merge favorece mayor retención de información?',
      options: [
        'Porqué la pantalla emite luz azul qué activa la memoria de largo plazo',
        'Porqué al ver, tocar, mover y escuchar simultáneamente se activan múltiples redes neuronales al mismo tiempo',
        'Porqué las aplicaciónes tienen colores que estimulan la concentración',
        'Porqué los modelos 3D son más bonitos que los dibujos de los libros de texto'
      ],
      correct: 1
    },
    {
      id: 8,
      text: '¿Qué ventaja pedagógica tiene presentar preguntas detonadoras ANTES de encender el Merge Cube?',
      options: [
        'Ninguna; es mejor ver el objeto 3D primero para no generar confusión',
        'Activa los conocimientos previos del estudiante y genera curiosidad intrínseca antes de la exploración',
        'Reduce el tiempo de clase y permite avanzar más rápido en el currículo',
        'Es un requisito téúnico para que la aplicación funcione correctamente'
      ],
      correct: 1
    },
    {
      id: 9,
      text: '¿Cómo beneficia específicamente el Merge Cube a estudiantes con dificultades para la abstracción?',
      options: [
        'Les simplifica los conceptos reduciéndolos a definiciones más cortas',
        'Les permite omitir las partes más complejas del currículo',
        'Proporciona una representación 3D concreta que funciona cómo andamiaje cognitivo para visualizar conceptos abstractos',
        'Les entrega automáticamente las respuestas correctas sin necesidad de reflexionar'
      ],
      correct: 2
    },
    {
      id: 10,
      text: '¿Cuál es la transformación más profunda que el Merge Cube y herramientas similares producen en el rol del docente?',
      options: [
        'El docente se convierte en téúnico de soporte para resolver problemas con los dispositivos',
        'El docente pasa de ser un mero transmisor de información a un arquitecto de experiencias de aprendizaje',
        'El docente deja de necesitar preparar clases porque la app tiene todo el contenido',
        'El docente se vuelve asistente del estudiante que lidera la clase de forma completamente autónoma'
      ],
      correct: 1
    }
  ];

  quiverQuestions: Question[] = [
    {
      id: 1,
      text: 'Un docente quiere que sus estudiantes experimenten la Realidad Aumentada sin necesidad de cascos ni equipos costosos. ¿Qué hace especial a QuiverVision cómo herramienta pedagógica?',
      options: [
        'Es un software de Realidad Virtual que requiere gafas especializadas de $500 USD',
        'Es una plataforma de RA que transforma dibujos coloreados en papel en modelos 3D animados e interactivos, conservando los colores originales del estudiante',
        'Es una marca de crayones inteligentes que proyectan hologramas en el aire',
        'Es una impresora 3D que reproduce los dibujos de los estudiantes en plástico'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Durante una clase de Ciencias Naturales, un estudiante colorea un volcán en la plantilla de Quiver usando tonos rojos intensos para la lava y verdes oscuros para la vegetación. ¿Qué ocurre cuando se escanea el dibujo con la app?',
      options: [
        'El volcán aparece en 3D con colores estándar predefinidos por la aplicación, ignorando lo que pintó el estudiante',
        'El dibujo se borra de la hoja y se convierte en una foto 2D en la pantalla',
        'Aparece un volcán 3D animado que conserva exactamente los rojos de la lava y verdes de la vegetación que el estudiante eligió, con erupción interactiva',
        'Solo se muestra un código QR de verificación sin modelo 3D'
      ],
      correct: 2
    },
    {
      id: 3,
      text: 'La profesora Marta planifica una sesión con QuiverVision para niños de segundo grado. ¿Cuál es la secuencia correcta de pasos para implementar la actividad?',
      options: [
        'Primero escanear, luego imprimir y finalmente colorear',
        'Descargar la app, comprar un Merge Cube, conectar gafas VR, proyectar en pared',
        'Descargar e imprimir plantillas desde el portal Quiver, los estudiantes colorean libremente, escanear con la app de Quiver, el dibujo cobra vida en 3D',
        'Conectar la tablet a internet vía cable, instalar Java, abrir el navegador, activar plugin'
      ],
      correct: 2
    },
    {
      id: 4,
      text: 'Un investigador educativo observa que los niños que usan QuiverVision muestran mayor desarrollo en ciertas habilidades. ¿Qué competencias se fortalecen específicamente durante la fase de coloreado manual ANTES de la experiencia AR?',
      options: [
        'Programación en bloques y pensamiento computacional algorítmico',
        'Motricidad fina, expresión artística, atención al detalle y toma de decisiones estéticas sobre color y textura',
        'Lectura rápida y comprensión de textos académicos complejos',
        'Resolución de ecuaciones de segundo grado y geometría analítica'
      ],
      correct: 1
    },
    {
      id: 5,
      text: 'Al comparar QuiverVision con la Realidad Virtual pura, ¿cuál es la ventaja más significativa de Quiver para la educación infantil y primaria?',
      options: [
        'Quiver es más costosa pero ofrece mejor calidad gráfica que cuálquier casco VR',
        'Quiver aísla completamente al niño del entorno real para máxima concentración',
        'Quiver fusiona una actividad manual tradicional (colorear con lápices reales) con la innovación digital, creando un puente entre lo analógico y lo tecnológico',
        'Quiver requiere computadoras de alto rendimiento pero la experiencia es superior'
      ],
      correct: 2
    },
    {
      id: 6,
      text: 'Una psicóloga escolar nota que los estudiantes con baja autoestima mejoran su confianza al usar QuiverVision. ¿Cuál es el mecanismo psicológico que explica este fenómeno?',
      options: [
        'La app les da recompensas monetarias virtuales por jugar rápido',
        'Al ver que SU PROPIA creación con sus colores únicos e irrepetibles cobra vida y se convierte en la protagonista de la experiencia, el niño experimenta confianza y orgullo creativo',
        'La aplicación califica cada dibujo con notas del 1 al 10 y los mejores reciben premios',
        'La app compara automáticamente los dibujos entre compañeros y premia al "mejor artista"'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'El docente Carlos quiere usar QuiverVision para enseñar educación emocional a sus alumnos de cuarto grado. ¿Qué estrategia pedagógica sería más efectiva?',
      options: [
        'Obligar a todos a colorear usando exclusivamente color gris para no generar distracciones',
        'Pedir que cada estudiante elija colores que representen su estado de ánimo actual, coloree la plantilla, y luego, al ver la animación 3D, reflexione con el grupo sobre las emociones expresadas',
        'Organizar una competencia cronometrada para ver quién termina de colorear primero',
        'Esconder las tablets cómo castigo si algún estudiante se porta mal durante la actividad'
      ],
      correct: 1
    },
    {
      id: 8,
      text: 'Quiver utiliza una tecnología específica para detectar las plantillas impresas. Si un estudiante colorea fuera de las líneas, ¿qué ocurre con el modelo 3D resultante?',
      options: [
        'La aplicación se bloquea y muestra un error porque no puede reconocer la plantilla',
        'El modelo 3D refleja fielmente esos trazos fuera de línea, mostrando la creación tal cómo el niño la hizo, gracias al reconocimiento de imágenes patentado que mapea las texturas reales',
        'El dibujo se auto-corrige digitalmente y el modelo 3D aparece con líneas perfectas',
        'El modelo pierde todo el color y se renderiza en blanco porque el sistema no tolera imprecisiones'
      ],
      correct: 1
    },
    {
      id: 9,
      text: 'Un docente de Matemáticas y Geometría descubre que puede usar QuiverVision para enseñar cuerpos geométricos. ¿Qué permite específicamente visualizar la app en esta área?',
      options: [
        'Ecuaciones algebraicas complejas resueltas paso a paso con inteligencia artificial',
        'La transición de redes planas 2D a poliedros sólidos 3D que el estudiante puede rotar e inspeccionar desde todos los ángulos, comprendiendo caras, aristas y vértices',
        'La tabla de multiplicar cantada con ritmos musicales generados automáticamente',
        'Estadísticas avanzadas del rendimiento académico de toda la clase'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al concluir una capacitación docente sobre QuiverVision, ¿cuál es la reflexión pedagógica más profunda que debería llevarse cada educador?',
      options: [
        'La tecnología debe eliminar por completo el uso de papel y lápices en las escuálas modernas',
        'La Realidad Aumentada es demasiado compleja para niños menores de 12 años',
        'QuiverVision demuestra que se puede crear un vínculo perfecto y significativo entre actividades analógicas manuales y la tecnología inmersiva, donde la creatividad del estudiante es el eje central',
        'Colorear es una pérdida de tiempo en la era digital y debería reemplazarse por simulaciones 100% virtuales'
      ],
      correct: 2
    }
  ];

  actionboundQuestions: Question[] = [
    {
      id: 1,
      text: 'La docente Lucía quiere sacar a sus alumnos del aula para una actividad innovadora de Historia. Descubre Actionbound. ¿Qué es exactamente esta plataforma y por que podría transformar su clase?',
      options: [
        'Un software para hacer hojas de cálculo con datos históricos en la nube',
        'Una plataforma que permite crear "Bounds" (búsquedas del tesoro, rallies y aventuras gamificadas digitales) combinando el mundo físico real con elementos cómo GPS, códigos QR, cuestionarios y misiones multimedia',
        'Un videojuego de disparos ambientado en la Segunda Guerra Mundial',
        'Una aplicación de dibujo colaborativo que requiere conexión por cable'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Para crear un Bound, el docente necesita dos elementos. ¿Cuáles son los componentes principales del ecosistema Actionbound y cuál es la función de cada uno?',
      options: [
        'Unas gafas VR para el diseño y un proyector holográfico para la ejecución',
        'El "Bound Creator" (plataforma web donde el docente diseña la ruta con preguntas, GPS y contenido) y la "App Actionbound" (aplicación móvil que los estudiantes usan para recorrer el Bound)',
        'Un teclado especial de programación y un dron de vigilancia para los estudiantes',
        'Un microscopio digital para capturar imágenes y un casco de realidad mixta para verlas'
      ],
      correct: 1
    },
    {
      id: 3,
      text: 'El profesor Daniel diseña un Bound sobre sitios patrimoniales del centro de la ciudad. Los estudiantes deben llegar físicamente a cada punto. ¿Qué tecnología principal usa Actionbound para guiarlos por el espacio real?',
      options: [
        'Cables de red conectados a un servidor central del colegio',
        'Coordenadas GPS y la brújula del dispositivo móvil, que les indican dirección y distancia a cada punto',
        'Un sistema de megáfonos inalámbricos que les grita las instrucciones',
        'Proyectores holográficos instalados previamente en cada esquina de la ciudad'
      ],
      correct: 1
    },
    {
      id: 4,
      text: 'En un Bound de Ciencias, al llegar a la huerta escolar, los estudiantes deben tomar una foto de una planta, grabar un audio explicando su ciclo de vida y responder un quiz. ¿Qué tipo de aprendizaje está fomentando esta actividad?',
      options: [
        'Aprendizaje memorístico y pasivo basado exclusivamente en la repetición de definiciones',
        'Aprendizaje basado en proyectos y aprendizaje cinestésico (en movimiento), donde el estudiante investiga, crea evidencia multimedia y resuelve retos en el lugar real',
        'Aprendizaje en aislamiento total donde cada estudiante trabaja sin comunicarse con nadie',
        'Aprendizaje únicamente auditivo mediante podcasts grabados por el docente'
      ],
      correct: 1
    },
    {
      id: 5,
      text: 'La coordinadora académica quiere evaluar los resultados después de una actividad con Actionbound. ¿Qué herramienta de análisis ofrece la plataforma al docente?',
      options: [
        'Solo puede calificar observando directamente a cada equipo durante toda la actividad',
        'Genera informes analíticos detallados post-actividad: respuestas de cada equipo, tiempos empleados, fotos y audios subidos, puntuaciones por sección, todo accesible desde la web',
        'Envía automáticamente las notas al Ministerio de Educación sin intervención del docente',
        'No ofrece ningún tipo de analítica; el docente debe corregir todo manualmente en papel'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'Un grupo de 4Â° grado juega un Bound en equipo. ¿Qué habilidades blandas se desarrollan cuando los estudiantes deben tomar decisiones juntos, repartirse tareas y navegar hacia los puntos?',
      options: [
        'Egoísmo individualista y competitividad destructiva entre compañeros',
        'Colaboración, delegación de tareas, comunicación efectiva, toma de decisiones conjuntas y liderazgo compartido',
        'Aislamiento social y dependencia total de la tecnología sin interacción humana',
        'Ãnicamente resistencia física y velocidad de carrera'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'El docente esconde códigos QR por toda la escuála cómo parte de un rally de bienvenida para nuevos estudiantes ("Onboarding Escolar"). ¿Cómo integra los QR físicos dentro del Bound?',
      options: [
        'No se pueden usar QR dentro de Actionbound porque son tecnologías incompatibles',
        'Los QR solo sirven para descargar la aplicación, no para contenido educativo',
        'El docente los esconde estratégicamente en el entorno y configura el Bound para que los alumnos deban escanear cada código para desbloquear la siguiente etapa, información o m La misión',
        'Los QR se usan exclusivamente para cobrar el pago de la licencia del software'
      ],
      correct: 2
    },
    {
      id: 8,
      text: 'Un profesor de Educación Física nota que sus estudiantes pasan demasiado tiempo sentados. ¿De que forma Actionbound combate el sedentarismo en la vida escolar?',
      options: [
        'Actionbound fomenta el sedentarismo porque los estudiantes solo miran pantallas sentados',
        'Solo aumenta los problemas visuales por uso prolongado de dispositivos móviles',
        'Al requerir desplazamiento físico real hacia puntos GPS, promueve activamente el movimiento, la exploración del entorno y combate el sedentarismo digital',
        'No tiene absolutamente ningún impacto en la salud física de los participantes'
      ],
      correct: 2
    },
    {
      id: 9,
      text: 'La innovación pedagógica más potente de Actionbound es invertir los roles: pedir a los propios estudiantes que CREEN un Bound. ¿Cuál es el valor educativo de esta estrategia?',
      options: [
        'Es simplemente una excusa para que el profesor no tenga que trabajar en la planificación',
        'Activa habilidades cognitivas de orden superior: síntesis de contenido, estructuración lógica de secuencias, diseño de experiencia de usuario y empatía con el participante',
        'Es una forma de castigo para los estudiantes que no terminaron sus tareas',
        'Solo sirve para que gasten la batería de sus dispositivos y se distraigan'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al cerrar la capacitación sobre Actionbound, ¿cuál es la transformación más profunda que esta herramienta representa para la educación?',
      options: [
        'El uso de pantallas y dispositivos móviles siempre significa quedarse sentado en un escritorio',
        'La escuála ya no termina en las cuatro paredes del aula: con Actionbound el mundo real se convierte en el tablero de juego, contextualizando el aprendizaje en los lugares donde la teoría cobra vida',
        'Actionbound solo es útil para las clases de Educación Física y no tiene aplicación en otras materias',
        'Los docentes no deberían usar GPS por cuestiones de privacidad y la tecnología debería prohibirse'
      ],
      correct: 1
    }
  ];

  metaversoQuestions: Question[] = [
    {
      id: 1,
      text: 'El rector de un colegio escucha por primera vez el término "Metaverso educativo" y quiere entender de que se trata. ¿Cuál es la definición más precisa en un contexto de enseñanza?',
      options: [
        'Un libro de texto digital en formato PDF que se lee en una tablet',
        'La evolución del internet hacia espacios virtuales tridimensionales y compartidos donde estudiantes y docentes ârepresentados por avataresâ pueden interactuar, colaborar y aprender cómo si estuvieran juntos físicamente',
        'Una red social exclusiva para profesores donde comparten temas educativos',
        'Un sistema automatizado de calificaciones que reemplaza al docente'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Un estudiante se pone las gafas Meta Quest y reporta que "siente que realmente está en el fondo del océano". ¿Cómo se denomina este fenómeno neurológico que distingue a la VR de cuálquier otra tecnología educativa?',
      options: [
        'Efecto placebo tecnológico sin base científica',
        '"Sentido de Presencia": la reacción genuina del cerebro ante la experiencia virtual cómo si estuviera ocurriendo realmente, activando las respuestas emocionales y cognitivas',
        'Hipnosis digital inducida por las pantallas de alta resolución',
        'Un simple efecto visual que desaparece al quitarse las gafas'
      ],
      correct: 1
    },
    {
      id: 3,
      text: 'En el Metaverso, cada participante necesita una identidad digital. ¿Cómo se representa un estudiante dentro de estos espacios virtuales y que capacidades tiene esa representación?',
      options: [
        'A través de un código de barras numérico sin forma visual',
        'Mediante un "Avatar" personalizable que replica en tiempo real sus movimientos de cabeza, manos y expresiones faciales, permitiendo comunicación no verbal natural',
        'Como un texto plano que muestra su nombre en la pantalla sin ninguna forma humana',
        'No tienen representación visual; solo se escucha su voz cómo en una llamada telefónica'
      ],
      correct: 1
    },
    {
      id: 4,
      text: 'La profesora Ana quiere hacer una clase colaborativa donde sus estudiantes manipulen modelos 3D en una pizarra infinita. ¿Qué plataforma de Meta permite exactamente esto?',
      options: [
        'Facebook Marketplace, un espacio de comercio electrÃúnico',
        'Horizon Workrooms, un espacio virtual colaborativo donde clases y equipos se reúnen mediante avatares, comparten pantallas, dibujan en pizarras y manipulan objetos 3D',
        'WhatsApp Business, un servicio de mensajería comercial',
        'Instagram Reels, una plataforma de videos cortos verticales'
      ],
      correct: 1
    },
    {
      id: 5,
      text: 'Un neurólogo escolar recomienda la VR para estudiantes con TDAH (déficit de atención e hiperactividad). ¿Cuál es el mecanismo que hace efectiva esta tecnología para estos estudiantes?',
      options: [
        'Les permite jugar videojuegos de acción en clase para canalizar su energía',
        'Al bloquear los estímulos visuales y sonoros del mundo físico, la VR reduce radicalmente las distracciones externas, creando un entorno de concentración pura',
        'Hace que el profesor hable más fuerte a través de los altavoces del visor',
        'No tiene ninguna ventaja; de hecho la VR empeora los síntomas del TDAH'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'El coordinador TIC propone sesiones de VR en el aula. ¿Cuál es la estrategia pedagógica correcta llamada "Micro-Inmersión" y por qué se recomienda?',
      options: [
        'Sumergir físicamente el visor en agua para probar su resistencia antes de usarlo',
        'Sesiones cortas de 10-15 minutos enfocadas en un solo objetivo pedagógico, seguidas de un debate y reflexión en el mundo real, para evitar fatiga visual y maximizar el impacto',
        'Dejar a los estudiantes usando el visor durante 5 horas continuas para máxima inmersión',
        'Usar gafas de tamaño reducido que permiten leer textos tradicionales'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'En una clase de Anatomía, los estudiantes "entran" virtualmente al torrente sanguíneo y "caminan" entre glóbulos rojos. ¿Qué hace posible este tipo de experiencia educativa imposible en el mundo real?',
      options: [
        'Solo están viendo una presentación de PowerPoint proyectada en la pared',
        'La VR permite simular entornos a cualquier escala: los estudiantes pueden meterse virtualmente dentro de órganos, diseccionar estructuras a escala real y observar procesos biológicos en primera persona',
        'Están escuchando una conferencia de un médico por teléfono mientras ven diapositivas',
        'Están dibujando en la pizarra tradicional con tizas de colores'
      ],
      correct: 1
    },
    {
      id: 8,
      text: 'Un colegio rural colombiano quiere que sus estudiantes "visiten" el Museo del Louvre en París. ¿A qué concepto del Metaverso educativo se refiere esta posibilidad?',
      options: [
        'A organizar una votación digital sobre que museo visitar y financiar el viaje',
        '"Democratización de Experiencias": viajes, visitas y simulaciones que serían imposibles o prohibitivamente costosos se vuelven accesibles para cuálquier escuála conectada al Metaverso',
        'A que toda la tecnología educativa es completamente gratuita sin ningún costo',
        'A jugar un videojuego de trivia sobre museos europeos'
      ],
      correct: 1
    },
    {
      id: 9,
      text: 'Los visores Meta Quest permiten interactuar sin mandos físicos. ¿Qué tecnología hace posible manipular objetos virtuales de forma natural usando las manos desnudas?',
      options: [
        'Teclados inalámbricos Bluetooth adaptados especialmente para VR',
        'Hand Tracking (seguimiento de manos): las cámaras del visor detectan y rastrean los movimientos de los dedos y las manos en tiempo real, permitiendo interacción natural',
        'Comandos de voz donde el usuario grita las instrucciones al dispositivo',
        'Sensores de parpadeo que interpretan el movimiento de los ojos cómo clics'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al implementar el Metaverso en la escuála, la rectora pregunta: "¿Qué riesgos éticos debemos considerar?" ¿Cuál es la respuesta más completa?',
      options: [
        'El Ãúnico riesgo es que los avatares usen sombreros inapropiados en el espacio virtual',
        'Se deben establecer normas claras de comportamiento en entornos virtuales, proteger los datos biométricos que capturan los sensores, controlar los tiempos de exposición para evitar fatiga, y garantizar que la VR complemente (nunca reemplace) la interacción humana presencial',
        'Solo es necesario permitir el uso de VR fuera del horario escolar sin supervisión',
        'No existen riesgos éticos porque la tecnología es completamente segura por defecto'
      ],
      correct: 1
    }
  ];

  visualizadorQuestions: Question[] = [
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
  ];

  // Contador de intentos para el trofeo "Persistente"
  private attemptCount = 0;

  constructor(
    private route: ActivatedRoute,
    private evalService: EvaluationService,
    private progressService: ProgressService,
    private authService: AuthService,
    private gamification: GamificationService,
  ) { }

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
    if (this.labId === '1') return this.introduccionQuestions;
    if (this.labId === '2') return this.mergeCubeQuestions;
    if (this.labId === '3') return this.quiverQuestions;
    if (this.labId === '4') return this.actionboundQuestions;
    if (this.labId === '5') return this.metaversoQuestions;
    if (this.labId === '6') return this.visualizadorQuestions;
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
      if (this.answers[q.id] === q.correct) this.score++;
    });
    this.submitted = true;
    this.attemptCount++;

    const user = this.authService.getCurrentUser();
    const userId = user?.userId ?? 'anon';
    const username = user?.displayName ?? user?.username ?? 'Docente Anónimo';
    const labNum = parseInt(this.labId || '0');
    const pct = this.getPercentage();

    // ── 1. Marcar misión como completada (progreso + backend) ─────────────────
    if (this.labId) {
      this.progressService.completeLab(labNum, userId, username, pct);
    }

    // ── 2. Calcular cuántas misiones completadas hay ahora ────────────────────
    //    (Se lee después de completeLab para incluir la actual)
    const totalCompleted = this.progressService.snapshot.labs
      .filter(l => l.status === 'completed').length;

    // ── 3. Otorgar trofeos y coleccionables en tiempo real ────────────────────
    //    GamificationService actualiza sus BehaviorSubjects de inmediato,
    //    así Trofeos y Coleccionables se refrescan SIN recargar la página.
    this.gamification.processEvaluationResult(labNum, pct, totalCompleted);
    if (this.attemptCount > 1) {
      this.gamification.processPersistence(this.attemptCount);
    }

    // ── 4. Guardar resultado de evaluación en backend ─────────────────────────
    const labName: Record<string, string> = {
      '1': 'Introducción', '2': 'Merge Cube', '3': 'QuiverVision',
      '4': 'Actionbound', '5': 'Metaverso Meta', '6': 'Visualizador de Modelos 3D',
      '7': 'Modelo con Geoposición',
    };

    this.evalService.saveResult({
      userId,
      username,
      labId: labNum,
      labName: labName[this.labId || '1'] || 'Desconocido',
      score: this.score,
      totalQuestions: this.totalQuestions,
      percentage: pct,
      answers: this.answers,
    }).subscribe({
      next: () => console.log(`[RaInClass] Evaluación misión ${labNum} guardada (${pct}%)`),
      error: (err) => console.warn('[RaInClass] No se pudo guardar en backend:', err),
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
