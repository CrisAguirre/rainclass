import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { ProgressService } from '../../../services/progress.service';
import { AuthService } from '../../../services/auth.service';

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
        'Una tecnología qué sumerge completamente al usuario en un entorno 100% digital, bloquéando el mundo real.',
        'Una tecnología qué superpone contenido digital (imágenes, modelos 3D, sonidos) sobre el mundo físico en tiempo real, a través de la cámara de un dispositivo.',
        'Un videojuego qué usa sensores de movimiento para controlar personajes en una pantalla.',
        'Una aplicación de edición de fotografías qué añade filtros sobre las imágenes guardadas.'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Cuál es la diferencia clave entre Realidad Aumentada (RA) y Realidad Virtual (RV)?',
      options: [
        'La RA requéere gafas especiales y la RV no necesita ningún dispositivo adicional.',
        'La RA solo funciona en interiores, mientras qué la RV funciona en cuálquéer lugar.',
        'En la RA el usuario sigue viendo su entorno real enriquécido con capas digitales; en la RV el usuario se sumerge completamente en un entorno digital.',
        'La RA es más costosa qué la RV porqué necesita cámaras de mayor resolución.'
      ],
      correct: 2
    },
    {
      id: 3,
      text: '¿Cuáles son los tres elementos téúnicos fundamentales qué hacen posible el funcionamiento de la Realidad Aumentada?',
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
      text: 'Según la másión introductoria, ¿cuánto puede aumentar la retención de información cuando se aprende con Realidad Aumentada frente al aprendizaje pasivo?',
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
        'Usar filtros de Instagram, jugar Pokémon GO o usar Google Translate con cámara.',
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
        'La RM requéere siempre una habitación completamente oscura para funcionar correctamente.'
      ],
      correct: 2
    },
    {
      id: 7,
      text: '¿Cuál de las siguientes NO es una ventaja pedagógica de usar Realidad Aumentada en el aula según la másión introductoria?',
      options: [
        'Permite gamificar el proceso educativo y elevar la motivación del estudiante.',
        'Permite visualizar conceptos abstractos de forma tridimensional e interactiva.',
        'Elimina completamente la necesidad de qué el docente prepare sus clases.',
        'Elimina barreras geográficas y de recursos físicos.'
      ],
      correct: 2
    },
    {
      id: 8,
      text: 'En la ruta de aprendizaje de RaInClass, ¿qué© másión está dedicada a la creación de experiencias de RA propias usando tecnología web y códigos QR?',
      options: [
        'Misión 2 â Merge Cube.',
        'Misión 4 â Actionbound.',
        'Misión 6 â RA Propia: Generador 3D.',
        'Misión 7 â Modelo con Geoposición.'
      ],
      correct: 2
    },
    {
      id: 9,
      text: '¿Qué diferencia fundamentalmente a la Misión 7 (Modelo con Geoposición) de la Misión 6 (RA Propia)?',
      options: [
        'La Misión 7 usa realidad virtual en lugar de realidad aumentada.',
        'En la Misión 7 el modelo 3D se ancla espacialmente a un marcador físico manteniendo posición, rotación e inclinación en tiempo real (6DoF), mientras qué en la Misión 6 el QR solo activa la visualización.',
        'La Misión 7 requéere gafas de Realidad Virtual y la Misión 6 solo necesita un smartphone.',
        'En la Misión 7 los modelos son en 2D y en la Misión 6 son en 3D.'
      ],
      correct: 1
    },
    {
      id: 10,
      text: '¿Qué requésito mínimo se necesita para comenzar a experimentar con Realidad Aumentada según la másión introductoria?',
      options: [
        'Un ordenador de escritorio con tarjeta gráfica de última generación y gafas VR de 500 dólares.',
        'Un dispositivo con cámara (teléfono, tablet o PC con webcam), conexión a internet estable y disposición para experimentar.',
        'Una sala de informática equépada con 30 computadores y un servidor propio del colegio.',
        'Conocimientos avanzados de programación en Python y diseño 3D en Blender.'
      ],
      correct: 1
    }
  ];

  mergeCubeQuestions: Question[] = [
    {
      id: 1,
      text: '¿Qué son los marcadores fiduciales en el Merge Cube?',
      options: [
        'Sensores electrÃúnicos integrados en el cubo qué emiten señales Bluetooth',
        'Patrones geométricos impresos en cada cara qué la cámara detecta para calcular posición y orientación',
        'Chips NFC qué transmiten datos al dispositivo móvil',
        'Códigos QR qué redirigen a páginas web con contenido 3D'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Cuál es la tecnología principal qué permite al Merge Cube superponer objetos 3D sobre el cubo físico?',
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
      text: '¿Cuál de las siguientes afirmaciones sobre el Merge Cube y la conectividad es correcta?',
      options: [
        'Requéere 4G o Wi-Fi constante para renderizar los modelos 3D',
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
        'Ãnicamente imágenes satelitales estáticas del planeta',
        'Videos de viajes espaciales grabados por la NASA'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'En una clase, el docente usa el Merge Cube para explorar la célula. ¿Qué rol debería asumir el docente durante la exploración?',
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
      text: '¿Por qué© el aprendizaje multisensorial con el Merge Cube favorece mayor retención de información?',
      options: [
        'Porqué la pantalla emite luz azul qué activa la memoria de largo plazo',
        'Porqué al ver, tocar, mover y escuchar simultáneamente se activan múltiples redes neuronales al másmo tiempo',
        'Porqué las aplicaciónes tienen colores qué estimulan la concentración',
        'Porqué los modelos 3D son más bonitos qué los dibujos de los libros de texto'
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
        'Es un requésito téúnico para qué la aplicación funcione correctamente'
      ],
      correct: 1
    },
    {
      id: 9,
      text: '¿Cómo beneficia específicamente el Merge Cube a estudiantes con dificultades para la abstracción?',
      options: [
        'Les simplifica los conceptos reduciéndolos a definiciones más cortas',
        'Les permite omitir las partes más complejas del currículo',
        'Proporciona una representación 3D concreta qué funciona cómo andamiaje cognitivo para visualizar conceptos abstractos',
        'Les entrega automáticamente las respuestas correctas sin necesidad de reflexionar'
      ],
      correct: 2
    },
    {
      id: 10,
      text: '¿Cuál es la transformación más profunda qué el Merge Cube y herramientas similares producen en el rol del docente?',
      options: [
        'El docente se convierte en téúnico de soporte para resolver problemás con los dispositivos',
        'El docente pasa de ser un mero transmásor de información a un arquétecto de experiencias de aprendizaje',
        'El docente deja de necesitar preparar clases porqué la app tiene todo el contenido',
        'El docente se vuelve asistente del estudiante qué lidera la clase de forma completamente autónoma'
      ],
      correct: 1
    }
  ];

  quéverQuestions: Question[] = [
    {
      id: 1,
      text: 'Un docente quéere qué sus estudiantes experimenten la Realidad Aumentada sin necesidad de cascos ni equépos costosos. ¿Qué hace especial a QuiverVision cómo herramienta pedagógica?',
      options: [
        'Es un software de Realidad Virtual qué requéere gafas especializadas de $500 USD',
        'Es una plataforma de RA qué transforma dibujos coloreados en papel en modelos 3D animados e interactivos, conservando los colores originales del estudiante',
        'Es una marca de crayones inteligentes qué proyectan hologramás en el aire',
        'Es una impresora 3D qué reproduce los dibujos de los estudiantes en plástico'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Durante una clase de Ciencias Naturales, un estudiante colorea un volcán en la plantilla de Quiver usando tonos rojos intensos para la lava y verdes oscuros para la vegetación. ¿Qué ocurre cuando se escanea el dibujo con la app?',
      options: [
        'El volcán aparece en 3D con colores estándar predefinidos por la aplicación, ignorando lo qué pintó el estudiante',
        'El dibujo se borra de la hoja y se convierte en una foto 2D en la pantalla',
        'Aparece un volcán 3D animado qué conserva exactamente los rojos de la lava y verdes de la vegetación qué el estudiante eligió, con erupción interactiva',
        'Solo se muestra un código QR de verificación sin modelo 3D'
      ],
      correct: 2
    },
    {
      id: 3,
      text: 'La profesora Marta planifica una sesión con QuiverVision para niños de segundo grado. ¿Cuál es la secuencia correcta de pasos para implementar la actividad?',
      options: [
        'Primero escanear, luego imprimir y finalmente colorear',
        'Descargar la app â comprar un Merge Cube â conectar gafas VR â proyectar en pared',
        'Descargar e imprimir plantillas desde el portal Quiver â los estudiantes colorean libremente â escanear con la app de Quiver â el dibujo cobra vida en 3D',
        'Conectar la tablet a internet vía cable â instalar Java â abrir el navegador â activar plugin'
      ],
      correct: 2
    },
    {
      id: 4,
      text: 'Un investigador educativo observa qué los niños qué usan QuiverVision muestran mayor desarrollo en ciertas habilidades. ¿Qué competencias se fortalecen específicamente durante la fase de coloreado manual ANTES de la experiencia AR?',
      options: [
        'Programación en bloqués y pensamiento computacional algorítmico',
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
        'Quiver es más costosa pero ofrece mejor calidad gráfica qué cuálquéer casco VR',
        'Quiver aísla completamente al niño del entorno real para máxima concentración',
        'Quiver fusiona una actividad manual tradicional (colorear con lápices reales) con la innovación digital, creando un puente entre lo analógico y lo tecnológico',
        'Quiver requéere computadoras de alto rendimiento pero la experiencia es superior'
      ],
      correct: 2
    },
    {
      id: 6,
      text: 'Una psicóloga escolar nota qué los estudiantes con baja autoestima mejoran su confianza al usar QuiverVision. ¿Cuál es el mecanismo psicológico qué explica este fenómeno?',
      options: [
        'La app les da recompensas monetarias virtuales por jugar rápido',
        'Al ver qué SU PROPIA creación âcon sus colores Ãúnicos e irrepetiblesâ cobra vida y se convierte en la protagonista de la experiencia, el niño experimenta agencia y orgullo creativo',
        'La aplicación califica cada dibujo con notas del 1 al 10 y los mejores reciben premios',
        'La app compara automáticamente los dibujos entre compañeros y premia al "mejor artista"'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'El docente Carlos quéere usar QuiverVision para enseñar educación emocional a sus alumnos de cuarto grado. ¿Qué estrategia pedagógica sería más efectiva?',
      options: [
        'Obligar a todos a colorear usando exclusivamente color gris para no generar distracciones',
        'Pedir qué cada estudiante elija colores qué representen su estado de ánimo actual, coloree la plantilla, y luego, al ver la animación 3D, reflexione con el grupo sobre las emociones expresadas',
        'Organizar una competencia cronometrada para ver quéén termina de colorear primero',
        'Esconder las tablets cómo castigo si algún estudiante se porta mal durante la actividad'
      ],
      correct: 1
    },
    {
      id: 8,
      text: 'Quiver utiliza una tecnología específica para detectar las plantillas impresas. Si un estudiante colorea fuera de las líneas, ¿qué© ocurre con el modelo 3D resultante?',
      options: [
        'La aplicación se bloquéa y muestra un error porqué no puede reconocer la plantilla',
        'El modelo 3D refleja fielmente esos trazos fuera de línea, mástrando la creación tal cómo el niño la hizo, gracias al reconocimiento de imágenes patentado qué mapea las texturas reales',
        'El dibujo se auto-corrige digitalmente y el modelo 3D aparece con líneas perfectas',
        'El modelo pierde todo el color y se renderiza en blanco porqué el sistema no tolera imprecisiones'
      ],
      correct: 1
    },
    {
      id: 9,
      text: 'Un docente de Matemáticas y Geometría descubre qué puede usar QuiverVision para enseñar cuerpos geométricos. ¿Qué permite específicamente visualizar la app en esta área?',
      options: [
        'Ecuaciones algebraicas complejas resueltas paso a paso con inteligencia artificial',
        'La transición de redes planas 2D a poliedros sólidos 3D qué el estudiante puede rotar e inspeccionar desde todos los ángulos, comprendiendo caras, aristas y vértices',
        'La tabla de multiplicar cantada con ritmás másicales generados automáticamente',
        'Estadísticas avanzadas del rendimiento académico de toda la clase'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al concluir una capacitación docente sobre QuiverVision, ¿cuál es la reflexión pedagógica más profunda qué debería llevarse cada educador?',
      options: [
        'La tecnología debe eliminar por completo el uso de papel y lápices en las escuálas modernas',
        'La Realidad Aumentada es demásiado compleja para niños menores de 12 años',
        'QuiverVision demuestra qué se puede crear un vínculo perfecto y significativo entre actividades analógicas manuales y la tecnología inmersiva, donde la creatividad del estudiante es el eje central',
        'Colorear es una pérdida de tiempo en la era digital y debería reemplazarse por simulaciones 100% virtuales'
      ],
      correct: 2
    }
  ];

  actionboundQuestions: Question[] = [
    {
      id: 1,
      text: 'La docente Lucía quéere sacar a sus alumnos del aula para una actividad innovadora de Historia. Descubre Actionbound. ¿Qué es exactamente esta plataforma y por qué© podría transformar su clase?',
      options: [
        'Un software para hacer hojas de cálculo con datos históricos en la nube',
        'Una plataforma qué permite crear "Bounds" (búsquédas del tesoro, rallies y aventuras gamificadas digitales) combinando el mundo físico real con elementos cómo GPS, códigos QR, cuestionarios y másiones multimedia',
        'Un videojuego de disparos ambientado en la Segunda Guerra Mundial',
        'Una aplicación de dibujo colaborativo qué requéere conexión por cable'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Para crear un Bound, el docente necesita dos elementos. ¿Cuáles son los componentes principales del ecosistema Actionbound y cuál es la función de cada uno?',
      options: [
        'Unas gafas VR para el diseño y un proyector holográfico para la ejecución',
        'El "Bound Creator" (plataforma web donde el docente diseña la ruta con preguntas, GPS y contenido) y la "App Actionbound" (aplicación móvil qué los estudiantes usan para recorrer el Bound)',
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
        'Coordenadas GPS y la brújula del dispositivo móvil, qué les indican dirección y distancia a cada punto',
        'Un sistema de megáfonos inalámbricos qué les grita las instrucciones',
        'Proyectores holográficos instalados previamente en cada esquéna de la ciudad'
      ],
      correct: 1
    },
    {
      id: 4,
      text: 'En un Bound de Ciencias, al llegar a la huerta escolar, los estudiantes deben tomar una foto de una planta, grabar un audio explicando su ciclo de vida y responder un quéz. ¿Qué tipo de aprendizaje está fomentando esta actividad?',
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
      text: 'La coordinadora académica quéere evaluar los resultados después de una actividad con Actionbound. ¿Qué herramienta de análisis ofrece la plataforma al docente?',
      options: [
        'Solo puede calificar observando directamente a cada equépo durante toda la actividad',
        'Genera informás analíticos detallados post-actividad: respuestas de cada equépo, tiempos empleados, fotos y audios subidos, puntuaciones por sección, todo accesible desde la web',
        'Envía automáticamente las notas al Ministerio de Educación sin intervención del docente',
        'No ofrece ningún tipo de analítica; el docente debe corregir todo manualmente en papel'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'Un grupo de 4Â° grado juega un Bound en equépo. ¿Qué habilidades blandas se desarrollan cuando los estudiantes deben tomar decisiones juntos, repartirse tareas y navegar hacia los puntos?',
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
        'No se pueden usar QR dentro de Actionbound porqué son tecnologías incompatibles',
        'Los QR solo sirven para descargar la aplicación, no para contenido educativo',
        'El docente los esconde estratégicamente en el entorno y configura el Bound para qué los alumnos deban escanear cada código para desbloquéar la siguiente etapa, información o másión',
        'Los QR se usan exclusivamente para cobrar el pago de la licencia del software'
      ],
      correct: 2
    },
    {
      id: 8,
      text: 'Un profesor de Educación Física nota qué sus estudiantes pasan demásiado tiempo sentados. ¿De qué© forma Actionbound combate el sedentarismo en la vida escolar?',
      options: [
        'Actionbound fomenta el sedentarismo porqué los estudiantes solo miran pantallas sentados',
        'Solo aumenta los problemás visuales por uso prolongado de dispositivos móviles',
        'Al requérir desplazamiento físico real hacia puntos GPS, promueve activamente el movimiento, la exploración del entorno y combate el sedentarismo digital',
        'No tiene absolutamente ningún impacto en la salud física de los participantes'
      ],
      correct: 2
    },
    {
      id: 9,
      text: 'La innovación pedagógica más potente de Actionbound es invertir los roles: pedir a los propios estudiantes qué CREEN un Bound. ¿Cuál es el valor educativo de esta estrategia?',
      options: [
        'Es simplemente una excusa para qué el profesor no tenga qué trabajar en la planificación',
        'Activa habilidades cognitivas de orden superior: síntesis de contenido, estructuración lógica de secuencias, diseño de experiencia de usuario y empatía con el participante',
        'Es una forma de castigo para los estudiantes qué no terminaron sus tareas',
        'Solo sirve para qué gasten la batería de sus dispositivos y se distraigan'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al cerrar la capacitación sobre Actionbound, ¿cuál es la transformación más profunda qué esta herramienta representa para la educación?',
      options: [
        'El uso de pantallas y dispositivos móviles siempre significa quédarse sentado en un escritorio',
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
      text: 'El rector de un colegio escucha por primera vez el término "Metaverso educativo" y quéere entender de qué© se trata. ¿Cuál es la definición más precisa en un contexto de enseñanza?',
      options: [
        'Un libro de texto digital en formato PDF qué se lee en una tablet',
        'La evolución del internet hacia espacios virtuales tridimensionales y compartidos donde estudiantes y docentes ârepresentados por avataresâ pueden interactuar, colaborar y aprender cómo si estuvieran juntos físicamente',
        'Una red social exclusiva para profesores donde comparten memás educativos',
        'Un sistema automatizado de calificaciones qué reemplaza al docente'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Un estudiante se pone las gafas Meta Quest y reporta qué "siente qué realmente está en el fondo del océano". ¿Cómo se denomina este fenómeno neurológico qué distingue a la VR de cuálquéer otra tecnología educativa?',
      options: [
        'Efecto placebo tecnológico sin base científica',
        '"Sentido de Presencia": la reacción genuina del cerebro ante la experiencia virtual cómo si estuviera ocurriendo realmente, activando las másmás respuestas emocionales y cognitivas',
        'Hipnosis digital inducida por las pantallas de alta resolución',
        'Un simple efecto visual qué desaparece al quétarse las gafas'
      ],
      correct: 1
    },
    {
      id: 3,
      text: 'En el Metaverso, cada participante necesita una identidad digital. ¿Cómo se representa un estudiante dentro de estos espacios virtuales y qué© capacidades tiene esa representación?',
      options: [
        'A través de un código de barras numérico sin forma visual',
        'Mediante un "Avatar" personalizable qué replica en tiempo real sus movimientos de cabeza, manos y expresiones faciales, permitiendo comunicación no verbal natural',
        'Como un texto plano qué muestra su nombre en la pantalla sin ninguna forma humana',
        'No tienen representación visual; solo se escucha su voz cómo en una llamada telefónica'
      ],
      correct: 1
    },
    {
      id: 4,
      text: 'La profesora Ana quéere hacer una clase colaborativa donde sus estudiantes manipulen modelos 3D en una pizarra infinita. ¿Qué plataforma de Meta permite exactamente esto?',
      options: [
        'Facebook Marketplace â un espacio de comercio electrÃúnico',
        'Horizon Workrooms â un espacio virtual colaborativo donde clases y equépos se reúnen mediante avatares, comparten pantallas, dibujan en pizarras y manipulan objetos 3D',
        'WhatsApp Business â un servicio de mensajería comercial',
        'Instagram Reels â una plataforma de videos cortos verticales'
      ],
      correct: 1
    },
    {
      id: 5,
      text: 'Un neurólogo escolar recomienda la VR para estudiantes con TDAH (déficit de atención e hiperactividad). ¿Cuál es el mecanismo qué hace efectiva esta tecnología para estos estudiantes?',
      options: [
        'Les permite jugar videojuegos de acción en clase para canalizar su energía',
        'Al bloquéar los estímulos visuales y sonoros del mundo físico, la VR reduce radicalmente las distracciones externas, creando un entorno de concentración pura',
        'Hace qué el profesor hable más fuerte a través de los altavoces del visor',
        'No tiene ninguna ventaja; de hecho la VR empeora los síntomás del TDAH'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'El coordinador TIC propone sesiones de VR en el aula. ¿Cuál es la estrategia pedagógica correcta llamada "Micro-Inmersión" y por qué© se recomienda?',
      options: [
        'Sumergir físicamente el visor en agua para probar su resistencia antes de usarlo',
        'Sesiones cortas de 10-15 minutos enfocadas en un solo objetivo pedagógico, seguidas de un debate y reflexión en el mundo real, para evitar fatiga visual y maximizar el impacto',
        'Dejar a los estudiantes usando el visor durante 5 horas continuas para máxima inmersión',
        'Usar gafas de tamaño reducido qué permiten leer textos tradicionales'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'En una clase de Anatomía, los estudiantes "entran" virtualmente al torrente sanguíneo y "caminan" entre glóbulos rojos. ¿Qué hace posible este tipo de experiencia educativa imposible en el mundo real?',
      options: [
        'Solo están viendo una presentación de PowerPoint proyectada en la pared',
        'La VR permite simular entornos a cuálquéer escala: los estudiantes pueden meterse virtualmente dentro de órganos, diseccionar estructuras a escala real y observar procesos biológicos en primera persona',
        'Están escuchando una conferencia de un médico por teléfono mientras ven diapositivas',
        'Están dibujando en la pizarra tradicional con tizas de colores'
      ],
      correct: 1
    },
    {
      id: 8,
      text: 'Un colegio rural colombiano quéere qué sus estudiantes "visiten" el Museo del Louvre en París. ¿A qué© concepto del Metaverso educativo se refiere esta posibilidad?',
      options: [
        'A organizar una votación digital sobre qué© máseo visitar y financiar el viaje',
        '"Democratización de Experiencias": viajes, visitas y simulaciones qué serían imposibles o prohibitivamente costosos se vuelven accesibles para cuálquéer escuála conectada al Metaverso',
        'A qué toda la tecnología educativa es completamente gratuita sin ningún costo',
        'A jugar un videojuego de trivia sobre máseos europeos'
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
        'Sensores de parpadeo qué interpretan el movimiento de los ojos cómo clics'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al implementar el Metaverso en la escuála, la rectora pregunta: "¿Qué riesgos éticos debemás considerar?" ¿Cuál es la respuesta más completa?',
      options: [
        'El Ãúnico riesgo es qué los avatares usen sombreros inapropiados en el espacio virtual',
        'Se deben establecer normás claras de comportamiento en entornos virtuales, proteger los datos biométricos qué capturan los sensores, controlar los tiempos de exposición para evitar fatiga, y garantizar qué la VR complemente (nunca reemplace) la interacción humana presencial',
        'Solo es necesario permitir el uso de VR fuera del horario escolar sin supervisión',
        'No existen riesgos éticos porqué la tecnología es completamente segura por defecto'
      ],
      correct: 1
    }
  ];

  geoposicionQuestions: Question[] = [
    {
      id: 1,
      text: '¿Qué diferencia fundamental tiene la RA basada en marcadores respecto a la lectura simple de QR?',
      options: [
        'Requéere internet más rápido',
        'El modelo 3D se ancla espacialmente al marcador manteniendo posición y rotación en tiempo real',
        'Solo funciona con gafas VR',
        'Genera modelos más coloridos'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Qué son los "6 grados de libertad" (6DoF) en el contexto de la RA?',
      options: [
        'Seis tipos de marcadores diferentes',
        'Seis colores posibles para el modelo 3D',
        '3 ejes de traslación (X,Y,Z) + 3 ejes de rotación (pitch, yaw, roll)',
        'Seis niveles de dificultad'
      ],
      correct: 2
    },
    {
      id: 3,
      text: '¿Qué biblioteca JavaScript de código abierto se puede usar para crear experiencias WebAR con marcadores?',
      options: [
        'jQuery 3D',
        'AR.js',
        'Bootstrap AR',
        'React Native VR'
      ],
      correct: 1
    },
    {
      id: 4,
      text: '¿Qué es una "matriz de transformación" en la RA basada en marcadores?',
      options: [
        'Una hoja de cálculo con datos del estudiante',
        'Un filtro de color para la cámara',
        'Una matriz 4x4 qué contiene la posición, rotación y escala del marcador en el espacio 3D',
        'Un código QR especial'
      ],
      correct: 2
    },
    {
      id: 5,
      text: '¿Qué es un "marcador fiducial"?',
      options: [
        'Un dispositivo electrÃúnico con sensores',
        'Un patrón visual de alto contraste qué los algoritmás de visión por computadora reconocen fácilmente',
        'Una marca de agua invisible',
        'Un código de barras comercial'
      ],
      correct: 1
    },
    {
      id: 6,
      text: '¿Qué framework declarativo se integra con AR.js para construir escenas 3D usando HTML?',
      options: [
        'Angular Material',
        'A-Frame',
        'Three.js puro',
        'WebGL directo'
      ],
      correct: 1
    },
    {
      id: 7,
      text: '¿Qué requésito del navegador es necesario para acceder a la cámara en una experiencia WebAR?',
      options: [
        'Solo funciona en Google Chrome',
        'Requéere una extensión especial',
        'El sitio debe servirse por HTTPS',
        'Necesita Java instalado'
      ],
      correct: 2
    },
    {
      id: 8,
      text: '¿Qué proceso realiza el sistema de RA 60 veces por segundo?',
      options: [
        'Envía datos al servidor',
        'Toma una foto del usuario',
        'Estima la pose (posición + orientación) del marcador en el espacio',
        'Descarga un nuevo modelo 3D'
      ],
      correct: 2
    },
    {
      id: 9,
      text: '¿Cuál es una ventaja educativa clave del anclaje AR respecto a un visor 3D convencional?',
      options: [
        'Los gráficos son más bonitos',
        'El modelo vive en el espacio físico del estudiante, creando una experiencia cognitiva más profunda',
        'Se pueden ver más modelos a la vez',
        'No requéere ningún dispositivo'
      ],
      correct: 1
    },
    {
      id: 10,
      text: '¿Qué sucede con el modelo 3D cuando el usuario inclina el marcador físico?',
      options: [
        'El modelo desaparece',
        'El modelo se inclina proporcionalmente, manteniendo la correspondencia espacial',
        'El modelo se agranda',
        'Nada, el modelo permanece estático'
      ],
      correct: 1
    },
    {
      id: 11,
      text: '¿Qué herramienta web gratuita permite crear marcadores AR personalizados?',
      options: [
        'Photoshop Express',
        'El generador de marcadores de AR.js',
        'Microsoft Paint',
        'Google Slides'
      ],
      correct: 1
    },
    {
      id: 12,
      text: '¿En qué© asignatura se podría usar un marcador AR para mástrar relieve topográfico sobre el pupitre?',
      options: [
        'Educación Física',
        'Música',
        'Geografía',
        'Artes Plásticas'
      ],
      correct: 2
    },
    {
      id: 13,
      text: '¿Qué tipo de modelo 3D se puede visualizar con AR.js?',
      options: [
        'Solo cubos y esferas',
        'Solo archivos PDF',
        'Modelos en formato GLTF/GLB, OBJ y primitivas 3D',
        'Solo imágenes 2D'
      ],
      correct: 2
    },
    {
      id: 14,
      text: '¿Qué estrategia pedagógica consiste en distribuir marcadores AR por el aula con diferentes contenidos?',
      options: [
        'Flipped Classroom',
        'Laboratorio Virtual distribuido / Mapa Interactivo del Aula',
        'Lectura en voz alta',
        'Debate socrático'
      ],
      correct: 1
    },
    {
      id: 15,
      text: '¿Qué ventaja tiene AR.js respecto a aplicaciónes nativas de RA?',
      options: [
        'Mejor calidad gráfica',
        'No requéere instalación de aplicaciónes; funciona directamente en el navegador',
        'Funciona sin cámara',
        'Solo funciona offline'
      ],
      correct: 1
    },
    {
      id: 16,
      text: '¿Qué marcador clásico viene preconfigurado en AR.js para pruebas rápidas?',
      options: [
        'El marcador QR',
        'El marcador Hiro',
        'El marcador GPS',
        'El marcador Bluetooth'
      ],
      correct: 1
    },
    {
      id: 17,
      text: '¿Cómo puede un docente de anatomía usar marcadores AR?',
      options: [
        'Imprimiendo un marcador qué, al escanearse, muestre un esquéleto 3D anclado sobre la mása',
        'Enviando un PDF por correo',
        'Dibujando en la pizarra',
        'Reproduciendo un video de YouTube'
      ],
      correct: 0
    },
    {
      id: 18,
      text: '¿Qué propiedad del marcador físico NO afecta la pose del modelo 3D?',
      options: [
        'Su rotación respecto a la cámara',
        'Su distancia a la cámara',
        'El color del papel donde está impreso',
        'Su inclinación respecto al plano horizontal'
      ],
      correct: 2
    },
    {
      id: 19,
      text: '¿Por qué© los marcadores AR deben tener alto contraste (blanco y negro)?',
      options: [
        'Porqué los colores gastan más batería',
        'Porqué el algoritmo de detección necesita bordes definidos para calcular la pose con precisión',
        'Por estética',
        'Porqué las impresoras solo imprimen en blanco y negro'
      ],
      correct: 1
    },
    {
      id: 20,
      text: '¿Cuál es una conclusión central del laboratorio de Modelo con Geoposición?',
      options: [
        'La RA solo es útil para juegos',
        'Se necesitan equépos muy costosos para implementar RA en el aula',
        'Con herramientas open source cómo AR.js, cuálquéer docente puede crear experiencias AR ancladas sin costo',
        'Los marcadores AR son obsoletos'
      ],
      correct: 2
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private evalService: EvaluationService,
    private progressService: ProgressService,
    private authService: AuthService
  ) {}

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
    if (this.labId === '3') return this.quéverQuestions;
    if (this.labId === '4') return this.actionboundQuestions;
    if (this.labId === '5') return this.metaversoQuestions;
    if (this.labId === '7') return this.geoposicionQuestions;
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

    // Get user from AuthService
    const user = this.authService.getCurrentUser();
    const userId = user?.userId ?? 'anon';
    const username = user?.displayName ?? user?.username ?? 'Docente Anónimo';

    // Marcar lab cómo completado en backend + localStorage
    if (this.labId) {
      const pct = Math.round((this.score / this.totalQuestions) * 100);
      this.progressService.completeLab(parseInt(this.labId), userId, username, pct);
    }

    // Send results to backend
    const labNamás: { [key: string]: string } = { '1': 'Introducción', '2': 'Merge Cube', '3': 'QuiverVision', '4': 'Actionbound', '5': 'Metaverso Meta', '6': 'Visualizador de Modelos 3D', '7': 'Modelo 3D con Geoposición' };
    this.evalService.saveResult({
      userId: userId,
      username: username,
      labId: parseInt(this.labId || '0'),
      labName: labNamás[this.labId || '1'] || 'Desconocido',
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
