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
      text: 'Â¿CuÃ¡l es la definiciÃ³n mÃ¡s precisa de Realidad Aumentada (RA)?',
      options: [
        'Una tecnologÃ­a que sumerge completamente al usuario en un entorno 100% digital, bloqueando el mundo real.',
        'Una tecnologÃ­a que superpone contenido digital (imÃ¡genes, modelos 3D, sonidos) sobre el mundo fÃ­sico en tiempo real, a travÃ©s de la cÃ¡mara de un dispositivo.',
        'Un videojuego que usa sensores de movimiento para controlar personajes en una pantalla.',
        'Una aplicaciÃ³n de ediciÃ³n de fotografÃ­as que aÃ±ade filtros sobre las imÃ¡genes guardadas.'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Â¿CuÃ¡l es la diferencia clave entre Realidad Aumentada (RA) y Realidad Virtual (RV)?',
      options: [
        'La RA requiere gafas especiales y la RV no necesita ningÃºn dispositivo adicional.',
        'La RA solo funciona en interiores, mientras que la RV funciona en cualquier lugar.',
        'En la RA el usuario sigue viendo su entorno real enriquecido con capas digitales; en la RV el usuario se sumerge completamente en un entorno digital.',
        'La RA es mÃ¡s costosa que la RV porque necesita cÃ¡maras de mayor resoluciÃ³n.'
      ],
      correct: 2
    },
    {
      id: 3,
      text: 'Â¿CuÃ¡les son los tres elementos tÃ©cnicos fundamentales que hacen posible el funcionamiento de la Realidad Aumentada?',
      options: [
        'Teclado, ratÃ³n y pantalla de alta resoluciÃ³n.',
        'CÃ¡mara/sensor, procesamiento por software y pantalla/visor.',
        'Auriculares, micrÃ³fono y conexiÃ³n a internet de fibra Ã³ptica.',
        'GPS, baterÃ­a de larga duraciÃ³n y almacenamiento en la nube.'
      ],
      correct: 1
    },
    {
      id: 4,
      text: 'SegÃºn la misiÃ³n introductoria, Â¿cuÃ¡nto puede aumentar la retenciÃ³n de informaciÃ³n cuando se aprende con Realidad Aumentada frente al aprendizaje pasivo?',
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
      text: 'Â¿CuÃ¡l de los siguientes ejemplos cotidianos es una aplicaciÃ³n real de Realidad Aumentada?',
      options: [
        'Ver una pelÃ­cula en plataformas de streaming como Netflix.',
        'Usar filtros de Instagram, jugar PokÃ©mon GO o usar Google Translate con cÃ¡mara.',
        'Hacer una videollamada por Zoom con compaÃ±eros de trabajo.',
        'Escuchar mÃºsica a travÃ©s de auriculares inalÃ¡mbricos Bluetooth.'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'Â¿QuÃ© caracteriza a la Realidad Mixta (RM) y la diferencia de la RA y la RV?',
      options: [
        'La RM solo funciona en dispositivos Apple y no es compatible con Android.',
        'La RM es simplemente otro nombre para la Realidad Virtual con mejor resoluciÃ³n grÃ¡fica.',
        'En la RM los objetos digitales interactÃºan con el mundo fÃ­sico en tiempo real, a diferencia de la RA donde son solo capas superpuestas.',
        'La RM requiere siempre una habitaciÃ³n completamente oscura para funcionar correctamente.'
      ],
      correct: 2
    },
    {
      id: 7,
      text: 'Â¿CuÃ¡l de las siguientes NO es una ventaja pedagÃ³gica de usar Realidad Aumentada en el aula segÃºn la misiÃ³n introductoria?',
      options: [
        'Permite gamificar el proceso educativo y elevar la motivaciÃ³n del estudiante.',
        'Permite visualizar conceptos abstractos de forma tridimensional e interactiva.',
        'Elimina completamente la necesidad de que el docente prepare sus clases.',
        'Elimina barreras geogrÃ¡ficas y de recursos fÃ­sicos.'
      ],
      correct: 2
    },
    {
      id: 8,
      text: 'En la ruta de aprendizaje de RaInClass, Â¿quÃ© misiÃ³n estÃ¡ dedicada a la creaciÃ³n de experiencias de RA propias usando tecnologÃ­a web y cÃ³digos QR?',
      options: [
        'MisiÃ³n 2 â Merge Cube.',
        'MisiÃ³n 4 â Actionbound.',
        'MisiÃ³n 6 â RA Propia: Generador 3D.',
        'MisiÃ³n 7 â Modelo con GeoposiciÃ³n.'
      ],
      correct: 2
    },
    {
      id: 9,
      text: 'Â¿QuÃ© diferencia fundamentalmente a la MisiÃ³n 7 (Modelo con GeoposiciÃ³n) de la MisiÃ³n 6 (RA Propia)?',
      options: [
        'La MisiÃ³n 7 usa realidad virtual en lugar de realidad aumentada.',
        'En la MisiÃ³n 7 el modelo 3D se ancla espacialmente a un marcador fÃ­sico manteniendo posiciÃ³n, rotaciÃ³n e inclinaciÃ³n en tiempo real (6DoF), mientras que en la MisiÃ³n 6 el QR solo activa la visualizaciÃ³n.',
        'La MisiÃ³n 7 requiere gafas de Realidad Virtual y la MisiÃ³n 6 solo necesita un smartphone.',
        'En la MisiÃ³n 7 los modelos son en 2D y en la MisiÃ³n 6 son en 3D.'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Â¿QuÃ© requisito mÃ­nimo se necesita para comenzar a experimentar con Realidad Aumentada segÃºn la misiÃ³n introductoria?',
      options: [
        'Un ordenador de escritorio con tarjeta grÃ¡fica de Ãºltima generaciÃ³n y gafas VR de 500 dÃ³lares.',
        'Un dispositivo con cÃ¡mara (telÃ©fono, tablet o PC con webcam), conexiÃ³n a internet estable y disposiciÃ³n para experimentar.',
        'Una sala de informÃ¡tica equipada con 30 computadores y un servidor propio del colegio.',
        'Conocimientos avanzados de programaciÃ³n en Python y diseÃ±o 3D en Blender.'
      ],
      correct: 1
    }
  ];

  mergeCubeQuestions: Question[] = [
    {
      id: 1,
      text: 'Â¿QuÃ© son los marcadores fiduciales en el Merge Cube?',
      options: [
        'Sensores electrÃ³nicos integrados en el cubo que emiten seÃ±ales Bluetooth',
        'Patrones geomÃ©tricos impresos en cada cara que la cÃ¡mara detecta para calcular posiciÃ³n y orientaciÃ³n',
        'Chips NFC que transmiten datos al dispositivo mÃ³vil',
        'CÃ³digos QR que redirigen a pÃ¡ginas web con contenido 3D'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Â¿CuÃ¡l es la tecnologÃ­a principal que permite al Merge Cube superponer objetos 3D sobre el cubo fÃ­sico?',
      options: [
        'GPS y triangulaciÃ³n de seÃ±ales de radio',
        'Realidad Virtual con cascos especializados',
        'VisiÃ³n por computadora y seguimiento espacial en tiempo real',
        'Bluetooth 5.0 y sensores de acelerÃ³metro'
      ],
      correct: 2
    },
    {
      id: 3,
      text: 'Â¿CuÃ¡l de las siguientes afirmaciones sobre el Merge Cube y la conectividad es correcta?',
      options: [
        'Requiere 4G o Wi-Fi constante para renderizar los modelos 3D',
        'Solo funciona con conexiÃ³n a internet en tiempo real vÃ­a streaming',
        'Una vez descargados los modelos, puede funcionar sin conexiÃ³n a internet',
        'Necesita conexiÃ³n permanente para calcular el tracking del cubo'
      ],
      correct: 2
    },
    {
      id: 4,
      text: 'Â¿QuÃ© aplicaciÃ³n del ecosistema Merge EDU permite cargar modelos 3D diseÃ±ados por los propios estudiantes (ej. desde Tinkercad)?',
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
      text: 'Â¿QuÃ© tipo de datos puede visualizar un estudiante de Ciencias Sociales con la aplicaciÃ³n HoloGlobe?',
      options: [
        'Solo mapas polÃ­ticos con fronteras de paÃ­ses',
        'Temperatura global, densidad de poblaciÃ³n, corrientes oceÃ¡nicas y actividad sÃ­smica en tiempo real',
        'Ãnicamente imÃ¡genes satelitales estÃ¡ticas del planeta',
        'Videos de viajes espaciales grabados por la NASA'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'En una clase, el docente usa el Merge Cube para explorar la cÃ©lula. Â¿QuÃ© rol deberÃ­a asumir el docente durante la exploraciÃ³n?',
      options: [
        'Dictar todas las partes de la cÃ©lula mientras los estudiantes repiten',
        'GuÃ­a socrÃ¡tico: hacer preguntas orientadoras como "Â¿QuÃ© funciÃ³n cumple esa estructura?" sin dar respuestas directas',
        'Permanecer en su escritorio mientras los estudiantes trabajan solos',
        'Evaluar con nota durante la exploraciÃ³n sin retroalimentaciÃ³n'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'Â¿Por quÃ© el aprendizaje multisensorial con el Merge Cube favorece mayor retenciÃ³n de informaciÃ³n?',
      options: [
        'Porque la pantalla emite luz azul que activa la memoria de largo plazo',
        'Porque al ver, tocar, mover y escuchar simultÃ¡neamente se activan mÃºltiples redes neuronales al mismo tiempo',
        'Porque las aplicaciones tienen colores que estimulan la concentraciÃ³n',
        'Porque los modelos 3D son mÃ¡s bonitos que los dibujos de los libros de texto'
      ],
      correct: 1
    },
    {
      id: 8,
      text: 'Â¿QuÃ© ventaja pedagÃ³gica tiene presentar preguntas detonadoras ANTES de encender el Merge Cube?',
      options: [
        'Ninguna; es mejor ver el objeto 3D primero para no generar confusiÃ³n',
        'Activa los conocimientos previos del estudiante y genera curiosidad intrÃ­nseca antes de la exploraciÃ³n',
        'Reduce el tiempo de clase y permite avanzar mÃ¡s rÃ¡pido en el currÃ­culo',
        'Es un requisito tÃ©cnico para que la aplicaciÃ³n funcione correctamente'
      ],
      correct: 1
    },
    {
      id: 9,
      text: 'Â¿CÃ³mo beneficia especÃ­ficamente el Merge Cube a estudiantes con dificultades para la abstracciÃ³n?',
      options: [
        'Les simplifica los conceptos reduciÃ©ndolos a definiciones mÃ¡s cortas',
        'Les permite omitir las partes mÃ¡s complejas del currÃ­culo',
        'Proporciona una representaciÃ³n 3D concreta que funciona como andamiaje cognitivo para visualizar conceptos abstractos',
        'Les entrega automÃ¡ticamente las respuestas correctas sin necesidad de reflexionar'
      ],
      correct: 2
    },
    {
      id: 10,
      text: 'Â¿CuÃ¡l es la transformaciÃ³n mÃ¡s profunda que el Merge Cube y herramientas similares producen en el rol del docente?',
      options: [
        'El docente se convierte en tÃ©cnico de soporte para resolver problemas con los dispositivos',
        'El docente pasa de ser un mero transmisor de informaciÃ³n a un arquitecto de experiencias de aprendizaje',
        'El docente deja de necesitar preparar clases porque la app tiene todo el contenido',
        'El docente se vuelve asistente del estudiante que lidera la clase de forma completamente autÃ³noma'
      ],
      correct: 1
    }
  ];

  quiverQuestions: Question[] = [
    {
      id: 1,
      text: 'Un docente quiere que sus estudiantes experimenten la Realidad Aumentada sin necesidad de cascos ni equipos costosos. Â¿QuÃ© hace especial a QuiverVision como herramienta pedagÃ³gica?',
      options: [
        'Es un software de Realidad Virtual que requiere gafas especializadas de $500 USD',
        'Es una plataforma de RA que transforma dibujos coloreados en papel en modelos 3D animados e interactivos, conservando los colores originales del estudiante',
        'Es una marca de crayones inteligentes que proyectan hologramas en el aire',
        'Es una impresora 3D que reproduce los dibujos de los estudiantes en plÃ¡stico'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Durante una clase de Ciencias Naturales, un estudiante colorea un volcÃ¡n en la plantilla de Quiver usando tonos rojos intensos para la lava y verdes oscuros para la vegetaciÃ³n. Â¿QuÃ© ocurre cuando se escanea el dibujo con la app?',
      options: [
        'El volcÃ¡n aparece en 3D con colores estÃ¡ndar predefinidos por la aplicaciÃ³n, ignorando lo que pintÃ³ el estudiante',
        'El dibujo se borra de la hoja y se convierte en una foto 2D en la pantalla',
        'Aparece un volcÃ¡n 3D animado que conserva exactamente los rojos de la lava y verdes de la vegetaciÃ³n que el estudiante eligiÃ³, con erupciÃ³n interactiva',
        'Solo se muestra un cÃ³digo QR de verificaciÃ³n sin modelo 3D'
      ],
      correct: 2
    },
    {
      id: 3,
      text: 'La profesora Marta planifica una sesiÃ³n con QuiverVision para niÃ±os de segundo grado. Â¿CuÃ¡l es la secuencia correcta de pasos para implementar la actividad?',
      options: [
        'Primero escanear, luego imprimir y finalmente colorear',
        'Descargar la app â comprar un Merge Cube â conectar gafas VR â proyectar en pared',
        'Descargar e imprimir plantillas desde el portal Quiver â los estudiantes colorean libremente â escanear con la app de Quiver â el dibujo cobra vida en 3D',
        'Conectar la tablet a internet vÃ­a cable â instalar Java â abrir el navegador â activar plugin'
      ],
      correct: 2
    },
    {
      id: 4,
      text: 'Un investigador educativo observa que los niÃ±os que usan QuiverVision muestran mayor desarrollo en ciertas habilidades. Â¿QuÃ© competencias se fortalecen especÃ­ficamente durante la fase de coloreado manual ANTES de la experiencia AR?',
      options: [
        'ProgramaciÃ³n en bloques y pensamiento computacional algorÃ­tmico',
        'Motricidad fina, expresiÃ³n artÃ­stica, atenciÃ³n al detalle y toma de decisiones estÃ©ticas sobre color y textura',
        'Lectura rÃ¡pida y comprensiÃ³n de textos acadÃ©micos complejos',
        'ResoluciÃ³n de ecuaciones de segundo grado y geometrÃ­a analÃ­tica'
      ],
      correct: 1
    },
    {
      id: 5,
      text: 'Al comparar QuiverVision con la Realidad Virtual pura, Â¿cuÃ¡l es la ventaja mÃ¡s significativa de Quiver para la educaciÃ³n infantil y primaria?',
      options: [
        'Quiver es mÃ¡s costosa pero ofrece mejor calidad grÃ¡fica que cualquier casco VR',
        'Quiver aÃ­sla completamente al niÃ±o del entorno real para mÃ¡xima concentraciÃ³n',
        'Quiver fusiona una actividad manual tradicional (colorear con lÃ¡pices reales) con la innovaciÃ³n digital, creando un puente entre lo analÃ³gico y lo tecnolÃ³gico',
        'Quiver requiere computadoras de alto rendimiento pero la experiencia es superior'
      ],
      correct: 2
    },
    {
      id: 6,
      text: 'Una psicÃ³loga escolar nota que los estudiantes con baja autoestima mejoran su confianza al usar QuiverVision. Â¿CuÃ¡l es el mecanismo psicolÃ³gico que explica este fenÃ³meno?',
      options: [
        'La app les da recompensas monetarias virtuales por jugar rÃ¡pido',
        'Al ver que SU PROPIA creaciÃ³n âcon sus colores Ãºnicos e irrepetiblesâ cobra vida y se convierte en la protagonista de la experiencia, el niÃ±o experimenta agencia y orgullo creativo',
        'La aplicaciÃ³n califica cada dibujo con notas del 1 al 10 y los mejores reciben premios',
        'La app compara automÃ¡ticamente los dibujos entre compaÃ±eros y premia al "mejor artista"'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'El docente Carlos quiere usar QuiverVision para enseÃ±ar educaciÃ³n emocional a sus alumnos de cuarto grado. Â¿QuÃ© estrategia pedagÃ³gica serÃ­a mÃ¡s efectiva?',
      options: [
        'Obligar a todos a colorear usando exclusivamente color gris para no generar distracciones',
        'Pedir que cada estudiante elija colores que representen su estado de Ã¡nimo actual, coloree la plantilla, y luego, al ver la animaciÃ³n 3D, reflexione con el grupo sobre las emociones expresadas',
        'Organizar una competencia cronometrada para ver quiÃ©n termina de colorear primero',
        'Esconder las tablets como castigo si algÃºn estudiante se porta mal durante la actividad'
      ],
      correct: 1
    },
    {
      id: 8,
      text: 'Quiver utiliza una tecnologÃ­a especÃ­fica para detectar las plantillas impresas. Si un estudiante colorea fuera de las lÃ­neas, Â¿quÃ© ocurre con el modelo 3D resultante?',
      options: [
        'La aplicaciÃ³n se bloquea y muestra un error porque no puede reconocer la plantilla',
        'El modelo 3D refleja fielmente esos trazos fuera de lÃ­nea, mostrando la creaciÃ³n tal como el niÃ±o la hizo, gracias al reconocimiento de imÃ¡genes patentado que mapea las texturas reales',
        'El dibujo se auto-corrige digitalmente y el modelo 3D aparece con lÃ­neas perfectas',
        'El modelo pierde todo el color y se renderiza en blanco porque el sistema no tolera imprecisiones'
      ],
      correct: 1
    },
    {
      id: 9,
      text: 'Un docente de MatemÃ¡ticas y GeometrÃ­a descubre que puede usar QuiverVision para enseÃ±ar cuerpos geomÃ©tricos. Â¿QuÃ© permite especÃ­ficamente visualizar la app en esta Ã¡rea?',
      options: [
        'Ecuaciones algebraicas complejas resueltas paso a paso con inteligencia artificial',
        'La transiciÃ³n de redes planas 2D a poliedros sÃ³lidos 3D que el estudiante puede rotar e inspeccionar desde todos los Ã¡ngulos, comprendiendo caras, aristas y vÃ©rtices',
        'La tabla de multiplicar cantada con ritmos musicales generados automÃ¡ticamente',
        'EstadÃ­sticas avanzadas del rendimiento acadÃ©mico de toda la clase'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al concluir una capacitaciÃ³n docente sobre QuiverVision, Â¿cuÃ¡l es la reflexiÃ³n pedagÃ³gica mÃ¡s profunda que deberÃ­a llevarse cada educador?',
      options: [
        'La tecnologÃ­a debe eliminar por completo el uso de papel y lÃ¡pices en las escuelas modernas',
        'La Realidad Aumentada es demasiado compleja para niÃ±os menores de 12 aÃ±os',
        'QuiverVision demuestra que se puede crear un vÃ­nculo perfecto y significativo entre actividades analÃ³gicas manuales y la tecnologÃ­a inmersiva, donde la creatividad del estudiante es el eje central',
        'Colorear es una pÃ©rdida de tiempo en la era digital y deberÃ­a reemplazarse por simulaciones 100% virtuales'
      ],
      correct: 2
    }
  ];

  actionboundQuestions: Question[] = [
    {
      id: 1,
      text: 'La docente LucÃ­a quiere sacar a sus alumnos del aula para una actividad innovadora de Historia. Descubre Actionbound. Â¿QuÃ© es exactamente esta plataforma y por quÃ© podrÃ­a transformar su clase?',
      options: [
        'Un software para hacer hojas de cÃ¡lculo con datos histÃ³ricos en la nube',
        'Una plataforma que permite crear "Bounds" (bÃºsquedas del tesoro, rallies y aventuras gamificadas digitales) combinando el mundo fÃ­sico real con elementos como GPS, cÃ³digos QR, cuestionarios y misiones multimedia',
        'Un videojuego de disparos ambientado en la Segunda Guerra Mundial',
        'Una aplicaciÃ³n de dibujo colaborativo que requiere conexiÃ³n por cable'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Para crear un Bound, el docente necesita dos elementos. Â¿CuÃ¡les son los componentes principales del ecosistema Actionbound y cuÃ¡l es la funciÃ³n de cada uno?',
      options: [
        'Unas gafas VR para el diseÃ±o y un proyector hologrÃ¡fico para la ejecuciÃ³n',
        'El "Bound Creator" (plataforma web donde el docente diseÃ±a la ruta con preguntas, GPS y contenido) y la "App Actionbound" (aplicaciÃ³n mÃ³vil que los estudiantes usan para recorrer el Bound)',
        'Un teclado especial de programaciÃ³n y un dron de vigilancia para los estudiantes',
        'Un microscopio digital para capturar imÃ¡genes y un casco de realidad mixta para verlas'
      ],
      correct: 1
    },
    {
      id: 3,
      text: 'El profesor Daniel diseÃ±a un Bound sobre sitios patrimoniales del centro de la ciudad. Los estudiantes deben llegar fÃ­sicamente a cada punto. Â¿QuÃ© tecnologÃ­a principal usa Actionbound para guiarlos por el espacio real?',
      options: [
        'Cables de red conectados a un servidor central del colegio',
        'Coordenadas GPS y la brÃºjula del dispositivo mÃ³vil, que les indican direcciÃ³n y distancia a cada punto',
        'Un sistema de megÃ¡fonos inalÃ¡mbricos que les grita las instrucciones',
        'Proyectores hologrÃ¡ficos instalados previamente en cada esquina de la ciudad'
      ],
      correct: 1
    },
    {
      id: 4,
      text: 'En un Bound de Ciencias, al llegar a la huerta escolar, los estudiantes deben tomar una foto de una planta, grabar un audio explicando su ciclo de vida y responder un quiz. Â¿QuÃ© tipo de aprendizaje estÃ¡ fomentando esta actividad?',
      options: [
        'Aprendizaje memorÃ­stico y pasivo basado exclusivamente en la repeticiÃ³n de definiciones',
        'Aprendizaje basado en proyectos y aprendizaje cinestÃ©sico (en movimiento), donde el estudiante investiga, crea evidencia multimedia y resuelve retos en el lugar real',
        'Aprendizaje en aislamiento total donde cada estudiante trabaja sin comunicarse con nadie',
        'Aprendizaje Ãºnicamente auditivo mediante podcasts grabados por el docente'
      ],
      correct: 1
    },
    {
      id: 5,
      text: 'La coordinadora acadÃ©mica quiere evaluar los resultados despuÃ©s de una actividad con Actionbound. Â¿QuÃ© herramienta de anÃ¡lisis ofrece la plataforma al docente?',
      options: [
        'Solo puede calificar observando directamente a cada equipo durante toda la actividad',
        'Genera informes analÃ­ticos detallados post-actividad: respuestas de cada equipo, tiempos empleados, fotos y audios subidos, puntuaciones por secciÃ³n, todo accesible desde la web',
        'EnvÃ­a automÃ¡ticamente las notas al Ministerio de EducaciÃ³n sin intervenciÃ³n del docente',
        'No ofrece ningÃºn tipo de analÃ­tica; el docente debe corregir todo manualmente en papel'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'Un grupo de 4Â° grado juega un Bound en equipo. Â¿QuÃ© habilidades blandas se desarrollan cuando los estudiantes deben tomar decisiones juntos, repartirse tareas y navegar hacia los puntos?',
      options: [
        'EgoÃ­smo individualista y competitividad destructiva entre compaÃ±eros',
        'ColaboraciÃ³n, delegaciÃ³n de tareas, comunicaciÃ³n efectiva, toma de decisiones conjuntas y liderazgo compartido',
        'Aislamiento social y dependencia total de la tecnologÃ­a sin interacciÃ³n humana',
        'Ãnicamente resistencia fÃ­sica y velocidad de carrera'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'El docente esconde cÃ³digos QR por toda la escuela como parte de un rally de bienvenida para nuevos estudiantes ("Onboarding Escolar"). Â¿CÃ³mo integra los QR fÃ­sicos dentro del Bound?',
      options: [
        'No se pueden usar QR dentro de Actionbound porque son tecnologÃ­as incompatibles',
        'Los QR solo sirven para descargar la aplicaciÃ³n, no para contenido educativo',
        'El docente los esconde estratÃ©gicamente en el entorno y configura el Bound para que los alumnos deban escanear cada cÃ³digo para desbloquear la siguiente etapa, informaciÃ³n o misiÃ³n',
        'Los QR se usan exclusivamente para cobrar el pago de la licencia del software'
      ],
      correct: 2
    },
    {
      id: 8,
      text: 'Un profesor de EducaciÃ³n FÃ­sica nota que sus estudiantes pasan demasiado tiempo sentados. Â¿De quÃ© forma Actionbound combate el sedentarismo en la vida escolar?',
      options: [
        'Actionbound fomenta el sedentarismo porque los estudiantes solo miran pantallas sentados',
        'Solo aumenta los problemas visuales por uso prolongado de dispositivos mÃ³viles',
        'Al requerir desplazamiento fÃ­sico real hacia puntos GPS, promueve activamente el movimiento, la exploraciÃ³n del entorno y combate el sedentarismo digital',
        'No tiene absolutamente ningÃºn impacto en la salud fÃ­sica de los participantes'
      ],
      correct: 2
    },
    {
      id: 9,
      text: 'La innovaciÃ³n pedagÃ³gica mÃ¡s potente de Actionbound es invertir los roles: pedir a los propios estudiantes que CREEN un Bound. Â¿CuÃ¡l es el valor educativo de esta estrategia?',
      options: [
        'Es simplemente una excusa para que el profesor no tenga que trabajar en la planificaciÃ³n',
        'Activa habilidades cognitivas de orden superior: sÃ­ntesis de contenido, estructuraciÃ³n lÃ³gica de secuencias, diseÃ±o de experiencia de usuario y empatÃ­a con el participante',
        'Es una forma de castigo para los estudiantes que no terminaron sus tareas',
        'Solo sirve para que gasten la baterÃ­a de sus dispositivos y se distraigan'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al cerrar la capacitaciÃ³n sobre Actionbound, Â¿cuÃ¡l es la transformaciÃ³n mÃ¡s profunda que esta herramienta representa para la educaciÃ³n?',
      options: [
        'El uso de pantallas y dispositivos mÃ³viles siempre significa quedarse sentado en un escritorio',
        'La escuela ya no termina en las cuatro paredes del aula: con Actionbound el mundo real se convierte en el tablero de juego, contextualizando el aprendizaje en los lugares donde la teorÃ­a cobra vida',
        'Actionbound solo es Ãºtil para las clases de EducaciÃ³n FÃ­sica y no tiene aplicaciÃ³n en otras materias',
        'Los docentes no deberÃ­an usar GPS por cuestiones de privacidad y la tecnologÃ­a deberÃ­a prohibirse'
      ],
      correct: 1
    }
  ];

  metaversoQuestions: Question[] = [
    {
      id: 1,
      text: 'El rector de un colegio escucha por primera vez el tÃ©rmino "Metaverso educativo" y quiere entender de quÃ© se trata. Â¿CuÃ¡l es la definiciÃ³n mÃ¡s precisa en un contexto de enseÃ±anza?',
      options: [
        'Un libro de texto digital en formato PDF que se lee en una tablet',
        'La evoluciÃ³n del internet hacia espacios virtuales tridimensionales y compartidos donde estudiantes y docentes ârepresentados por avataresâ pueden interactuar, colaborar y aprender como si estuvieran juntos fÃ­sicamente',
        'Una red social exclusiva para profesores donde comparten memes educativos',
        'Un sistema automatizado de calificaciones que reemplaza al docente'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Un estudiante se pone las gafas Meta Quest y reporta que "siente que realmente estÃ¡ en el fondo del ocÃ©ano". Â¿CÃ³mo se denomina este fenÃ³meno neurolÃ³gico que distingue a la VR de cualquier otra tecnologÃ­a educativa?',
      options: [
        'Efecto placebo tecnolÃ³gico sin base cientÃ­fica',
        '"Sentido de Presencia": la reacciÃ³n genuina del cerebro ante la experiencia virtual como si estuviera ocurriendo realmente, activando las mismas respuestas emocionales y cognitivas',
        'Hipnosis digital inducida por las pantallas de alta resoluciÃ³n',
        'Un simple efecto visual que desaparece al quitarse las gafas'
      ],
      correct: 1
    },
    {
      id: 3,
      text: 'En el Metaverso, cada participante necesita una identidad digital. Â¿CÃ³mo se representa un estudiante dentro de estos espacios virtuales y quÃ© capacidades tiene esa representaciÃ³n?',
      options: [
        'A travÃ©s de un cÃ³digo de barras numÃ©rico sin forma visual',
        'Mediante un "Avatar" personalizable que replica en tiempo real sus movimientos de cabeza, manos y expresiones faciales, permitiendo comunicaciÃ³n no verbal natural',
        'Como un texto plano que muestra su nombre en la pantalla sin ninguna forma humana',
        'No tienen representaciÃ³n visual; solo se escucha su voz como en una llamada telefÃ³nica'
      ],
      correct: 1
    },
    {
      id: 4,
      text: 'La profesora Ana quiere hacer una clase colaborativa donde sus estudiantes manipulen modelos 3D en una pizarra infinita. Â¿QuÃ© plataforma de Meta permite exactamente esto?',
      options: [
        'Facebook Marketplace â un espacio de comercio electrÃ³nico',
        'Horizon Workrooms â un espacio virtual colaborativo donde clases y equipos se reÃºnen mediante avatares, comparten pantallas, dibujan en pizarras y manipulan objetos 3D',
        'WhatsApp Business â un servicio de mensajerÃ­a comercial',
        'Instagram Reels â una plataforma de videos cortos verticales'
      ],
      correct: 1
    },
    {
      id: 5,
      text: 'Un neurÃ³logo escolar recomienda la VR para estudiantes con TDAH (dÃ©ficit de atenciÃ³n e hiperactividad). Â¿CuÃ¡l es el mecanismo que hace efectiva esta tecnologÃ­a para estos estudiantes?',
      options: [
        'Les permite jugar videojuegos de acciÃ³n en clase para canalizar su energÃ­a',
        'Al bloquear los estÃ­mulos visuales y sonoros del mundo fÃ­sico, la VR reduce radicalmente las distracciones externas, creando un entorno de concentraciÃ³n pura',
        'Hace que el profesor hable mÃ¡s fuerte a travÃ©s de los altavoces del visor',
        'No tiene ninguna ventaja; de hecho la VR empeora los sÃ­ntomas del TDAH'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'El coordinador TIC propone sesiones de VR en el aula. Â¿CuÃ¡l es la estrategia pedagÃ³gica correcta llamada "Micro-InmersiÃ³n" y por quÃ© se recomienda?',
      options: [
        'Sumergir fÃ­sicamente el visor en agua para probar su resistencia antes de usarlo',
        'Sesiones cortas de 10-15 minutos enfocadas en un solo objetivo pedagÃ³gico, seguidas de un debate y reflexiÃ³n en el mundo real, para evitar fatiga visual y maximizar el impacto',
        'Dejar a los estudiantes usando el visor durante 5 horas continuas para mÃ¡xima inmersiÃ³n',
        'Usar gafas de tamaÃ±o reducido que permiten leer textos tradicionales'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'En una clase de AnatomÃ­a, los estudiantes "entran" virtualmente al torrente sanguÃ­neo y "caminan" entre glÃ³bulos rojos. Â¿QuÃ© hace posible este tipo de experiencia educativa imposible en el mundo real?',
      options: [
        'Solo estÃ¡n viendo una presentaciÃ³n de PowerPoint proyectada en la pared',
        'La VR permite simular entornos a cualquier escala: los estudiantes pueden meterse virtualmente dentro de Ã³rganos, diseccionar estructuras a escala real y observar procesos biolÃ³gicos en primera persona',
        'EstÃ¡n escuchando una conferencia de un mÃ©dico por telÃ©fono mientras ven diapositivas',
        'EstÃ¡n dibujando en la pizarra tradicional con tizas de colores'
      ],
      correct: 1
    },
    {
      id: 8,
      text: 'Un colegio rural colombiano quiere que sus estudiantes "visiten" el Museo del Louvre en ParÃ­s. Â¿A quÃ© concepto del Metaverso educativo se refiere esta posibilidad?',
      options: [
        'A organizar una votaciÃ³n digital sobre quÃ© museo visitar y financiar el viaje',
        '"DemocratizaciÃ³n de Experiencias": viajes, visitas y simulaciones que serÃ­an imposibles o prohibitivamente costosos se vuelven accesibles para cualquier escuela conectada al Metaverso',
        'A que toda la tecnologÃ­a educativa es completamente gratuita sin ningÃºn costo',
        'A jugar un videojuego de trivia sobre museos europeos'
      ],
      correct: 1
    },
    {
      id: 9,
      text: 'Los visores Meta Quest permiten interactuar sin mandos fÃ­sicos. Â¿QuÃ© tecnologÃ­a hace posible manipular objetos virtuales de forma natural usando las manos desnudas?',
      options: [
        'Teclados inalÃ¡mbricos Bluetooth adaptados especialmente para VR',
        'Hand Tracking (seguimiento de manos): las cÃ¡maras del visor detectan y rastrean los movimientos de los dedos y las manos en tiempo real, permitiendo interacciÃ³n natural',
        'Comandos de voz donde el usuario grita las instrucciones al dispositivo',
        'Sensores de parpadeo que interpretan el movimiento de los ojos como clics'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Al implementar el Metaverso en la escuela, la rectora pregunta: "Â¿QuÃ© riesgos Ã©ticos debemos considerar?" Â¿CuÃ¡l es la respuesta mÃ¡s completa?',
      options: [
        'El Ãºnico riesgo es que los avatares usen sombreros inapropiados en el espacio virtual',
        'Se deben establecer normas claras de comportamiento en entornos virtuales, proteger los datos biomÃ©tricos que capturan los sensores, controlar los tiempos de exposiciÃ³n para evitar fatiga, y garantizar que la VR complemente (nunca reemplace) la interacciÃ³n humana presencial',
        'Solo es necesario permitir el uso de VR fuera del horario escolar sin supervisiÃ³n',
        'No existen riesgos Ã©ticos porque la tecnologÃ­a es completamente segura por defecto'
      ],
      correct: 1
    }
  ];

  geoposicionQuestions: Question[] = [
    {
      id: 1,
      text: 'Â¿QuÃ© diferencia fundamental tiene la RA basada en marcadores respecto a la lectura simple de QR?',
      options: [
        'Requiere internet mÃ¡s rÃ¡pido',
        'El modelo 3D se ancla espacialmente al marcador manteniendo posiciÃ³n y rotaciÃ³n en tiempo real',
        'Solo funciona con gafas VR',
        'Genera modelos mÃ¡s coloridos'
      ],
      correct: 1
    },
    {
      id: 2,
      text: 'Â¿QuÃ© son los "6 grados de libertad" (6DoF) en el contexto de la RA?',
      options: [
        'Seis tipos de marcadores diferentes',
        'Seis colores posibles para el modelo 3D',
        '3 ejes de traslaciÃ³n (X,Y,Z) + 3 ejes de rotaciÃ³n (pitch, yaw, roll)',
        'Seis niveles de dificultad'
      ],
      correct: 2
    },
    {
      id: 3,
      text: 'Â¿QuÃ© biblioteca JavaScript de cÃ³digo abierto se puede usar para crear experiencias WebAR con marcadores?',
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
      text: 'Â¿QuÃ© es una "matriz de transformaciÃ³n" en la RA basada en marcadores?',
      options: [
        'Una hoja de cÃ¡lculo con datos del estudiante',
        'Un filtro de color para la cÃ¡mara',
        'Una matriz 4x4 que contiene la posiciÃ³n, rotaciÃ³n y escala del marcador en el espacio 3D',
        'Un cÃ³digo QR especial'
      ],
      correct: 2
    },
    {
      id: 5,
      text: 'Â¿QuÃ© es un "marcador fiducial"?',
      options: [
        'Un dispositivo electrÃ³nico con sensores',
        'Un patrÃ³n visual de alto contraste que los algoritmos de visiÃ³n por computadora reconocen fÃ¡cilmente',
        'Una marca de agua invisible',
        'Un cÃ³digo de barras comercial'
      ],
      correct: 1
    },
    {
      id: 6,
      text: 'Â¿QuÃ© framework declarativo se integra con AR.js para construir escenas 3D usando HTML?',
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
      text: 'Â¿QuÃ© requisito del navegador es necesario para acceder a la cÃ¡mara en una experiencia WebAR?',
      options: [
        'Solo funciona en Google Chrome',
        'Requiere una extensiÃ³n especial',
        'El sitio debe servirse por HTTPS',
        'Necesita Java instalado'
      ],
      correct: 2
    },
    {
      id: 8,
      text: 'Â¿QuÃ© proceso realiza el sistema de RA 60 veces por segundo?',
      options: [
        'EnvÃ­a datos al servidor',
        'Toma una foto del usuario',
        'Estima la pose (posiciÃ³n + orientaciÃ³n) del marcador en el espacio',
        'Descarga un nuevo modelo 3D'
      ],
      correct: 2
    },
    {
      id: 9,
      text: 'Â¿CuÃ¡l es una ventaja educativa clave del anclaje AR respecto a un visor 3D convencional?',
      options: [
        'Los grÃ¡ficos son mÃ¡s bonitos',
        'El modelo vive en el espacio fÃ­sico del estudiante, creando una experiencia cognitiva mÃ¡s profunda',
        'Se pueden ver mÃ¡s modelos a la vez',
        'No requiere ningÃºn dispositivo'
      ],
      correct: 1
    },
    {
      id: 10,
      text: 'Â¿QuÃ© sucede con el modelo 3D cuando el usuario inclina el marcador fÃ­sico?',
      options: [
        'El modelo desaparece',
        'El modelo se inclina proporcionalmente, manteniendo la correspondencia espacial',
        'El modelo se agranda',
        'Nada, el modelo permanece estÃ¡tico'
      ],
      correct: 1
    },
    {
      id: 11,
      text: 'Â¿QuÃ© herramienta web gratuita permite crear marcadores AR personalizados?',
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
      text: 'Â¿En quÃ© asignatura se podrÃ­a usar un marcador AR para mostrar relieve topogrÃ¡fico sobre el pupitre?',
      options: [
        'EducaciÃ³n FÃ­sica',
        'MÃºsica',
        'GeografÃ­a',
        'Artes PlÃ¡sticas'
      ],
      correct: 2
    },
    {
      id: 13,
      text: 'Â¿QuÃ© tipo de modelo 3D se puede visualizar con AR.js?',
      options: [
        'Solo cubos y esferas',
        'Solo archivos PDF',
        'Modelos en formato GLTF/GLB, OBJ y primitivas 3D',
        'Solo imÃ¡genes 2D'
      ],
      correct: 2
    },
    {
      id: 14,
      text: 'Â¿QuÃ© estrategia pedagÃ³gica consiste en distribuir marcadores AR por el aula con diferentes contenidos?',
      options: [
        'Flipped Classroom',
        'Laboratorio Virtual distribuido / Mapa Interactivo del Aula',
        'Lectura en voz alta',
        'Debate socrÃ¡tico'
      ],
      correct: 1
    },
    {
      id: 15,
      text: 'Â¿QuÃ© ventaja tiene AR.js respecto a aplicaciones nativas de RA?',
      options: [
        'Mejor calidad grÃ¡fica',
        'No requiere instalaciÃ³n de aplicaciones; funciona directamente en el navegador',
        'Funciona sin cÃ¡mara',
        'Solo funciona offline'
      ],
      correct: 1
    },
    {
      id: 16,
      text: 'Â¿QuÃ© marcador clÃ¡sico viene preconfigurado en AR.js para pruebas rÃ¡pidas?',
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
      text: 'Â¿CÃ³mo puede un docente de anatomÃ­a usar marcadores AR?',
      options: [
        'Imprimiendo un marcador que, al escanearse, muestre un esqueleto 3D anclado sobre la mesa',
        'Enviando un PDF por correo',
        'Dibujando en la pizarra',
        'Reproduciendo un video de YouTube'
      ],
      correct: 0
    },
    {
      id: 18,
      text: 'Â¿QuÃ© propiedad del marcador fÃ­sico NO afecta la pose del modelo 3D?',
      options: [
        'Su rotaciÃ³n respecto a la cÃ¡mara',
        'Su distancia a la cÃ¡mara',
        'El color del papel donde estÃ¡ impreso',
        'Su inclinaciÃ³n respecto al plano horizontal'
      ],
      correct: 2
    },
    {
      id: 19,
      text: 'Â¿Por quÃ© los marcadores AR deben tener alto contraste (blanco y negro)?',
      options: [
        'Porque los colores gastan mÃ¡s baterÃ­a',
        'Porque el algoritmo de detecciÃ³n necesita bordes definidos para calcular la pose con precisiÃ³n',
        'Por estÃ©tica',
        'Porque las impresoras solo imprimen en blanco y negro'
      ],
      correct: 1
    },
    {
      id: 20,
      text: 'Â¿CuÃ¡l es una conclusiÃ³n central del laboratorio de Modelo con GeoposiciÃ³n?',
      options: [
        'La RA solo es Ãºtil para juegos',
        'Se necesitan equipos muy costosos para implementar RA en el aula',
        'Con herramientas open source como AR.js, cualquier docente puede crear experiencias AR ancladas sin costo',
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
    if (this.labId === '3') return this.quiverQuestions;
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
    const username = user?.displayName ?? user?.username ?? 'Docente AnÃ³nimo';

    // Marcar lab como completado en backend + localStorage
    if (this.labId) {
      const pct = Math.round((this.score / this.totalQuestions) * 100);
      this.progressService.completeLab(parseInt(this.labId), userId, username, pct);
    }

    // Send results to backend
    const labNames: { [key: string]: string } = { '1': 'IntroducciÃ³n', '2': 'Merge Cube', '3': 'QuiverVision', '4': 'Actionbound', '5': 'Metaverso Meta', '6': 'Visualizador de Modelos 3D', '7': 'Modelo 3D con GeoposiciÃ³n' };
    this.evalService.saveResult({
      userId: userId,
      username: username,
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
