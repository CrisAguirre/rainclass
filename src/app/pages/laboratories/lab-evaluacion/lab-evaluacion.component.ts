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

  actionboundQuestions: Question[] = [
    {
      id: 1,
      text: '¿Qué es Actionbound?',
      options: [
        'Un software para hacer hojas de cálculo',
        'Una plataforma para crear búsquedas del tesoro y rallies digitales en el mundo real',
        'Un videojuego de disparos',
        'Una aplicación para dibujar'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Cuáles son los dos componentes principales de Actionbound?',
      options: [
        'Cámara y micrófono',
        'El Bound Creator (web) y la App Actionbound (móvil)',
        'Teclado y ratón',
        'Gafas VR y mandos'
      ],
      correct: 1
    },
    {
      id: 3,
      text: '¿Qué tecnología principal usa Actionbound para guiar a los estudiantes físicamente?',
      options: [
        'Cables conectados a un servidor',
        'Coordenadas GPS y brújula del dispositivo',
        'Impresión 3D',
        'Proyectores holográficos'
      ],
      correct: 1
    },
    {
      id: 4,
      text: '¿Qué es un "Bound"?',
      options: [
        'Un límite de tiempo en la clase',
        'El nombre que reciben las rutas, rallies o búsquedas creadas en la plataforma',
        'Un libro de texto digital',
        'Un error de programación'
      ],
      correct: 1
    },
    {
      id: 5,
      text: '¿Cómo ingresan los estudiantes a un Bound creado por el docente?',
      options: [
        'Escribiendo 10 páginas de código',
        'Llamando por teléfono al soporte técnico',
        'Escaneando un código QR único con la app Actionbound',
        'Comprando un ticket físico'
      ],
      correct: 2
    },
    {
      id: 6,
      text: '¿Qué tipo de aprendizaje promueve principalmente Actionbound?',
      options: [
        'Aprendizaje memorístico y pasivo',
        'Aprendizaje basado en proyectos y aprendizaje cinestésico (en movimiento)',
        'Aprendizaje exclusivo en aislamiento',
        'Aprendizaje únicamente auditivo'
      ],
      correct: 1
    },
    {
      id: 7,
      text: 'En un Bound, ¿qué función cumple el elemento "Información"?',
      options: [
        'Elimina a un jugador',
        'Muestra textos, imágenes, videos o audios para contextualizar un lugar',
        'Resta puntos al equipo',
        'Cierra la aplicación'
      ],
      correct: 1
    },
    {
      id: 8,
      text: '¿Qué requiere hacer un alumno en una "Misión" de Actionbound?',
      options: [
        'Solo leer un texto largo',
        'Resolver un desafío creativo, como tomar una foto o grabar un audio',
        'Dormir 10 minutos',
        'Esconder su celular'
      ],
      correct: 1
    },
    {
      id: 9,
      text: '¿Cómo se pueden incluir los Códigos QR físicos dentro de un Bound?',
      options: [
        'No se pueden usar QR en Actionbound',
        'Solo sirven para descargar la app',
        'El docente los esconde en el entorno y los alumnos deben escanearlos para poder avanzar',
        'Se usan para pagar la licencia'
      ],
      correct: 2
    },
    {
      id: 10,
      text: '¿Qué beneficio ofrece Actionbound para la evaluación docente?',
      options: [
        'Califica automáticamente el comportamiento en el recreo',
        'Genera informes analíticos detallados post-actividad (respuestas, tiempo, fotos) en la web',
        'Reemplaza al Ministerio de Educación',
        'Ninguno, el docente debe corregir todo a mano'
      ],
      correct: 1
    },
    {
      id: 11,
      text: '¿Cómo se puede usar Actionbound en la materia de Historia?',
      options: [
        'Jugando ajedrez',
        'Creando un rally en sitios patrimoniales de la ciudad, desbloqueando datos in situ',
        'Leyendo un PDF estático en el aula',
        'No tiene aplicaciones en Historia'
      ],
      correct: 1
    },
    {
      id: 12,
      text: '¿Qué es el "Onboarding Escolar" propuesto como ejemplo de uso?',
      options: [
        'Enseñar a usar una patineta',
        'Un rally de bienvenida para nuevos alumnos explorando las instalaciones del colegio',
        'Una clase de inglés avanzado',
        'Un sistema de castigos'
      ],
      correct: 1
    },
    {
      id: 13,
      text: '¿Qué impacto tiene Actionbound en la salud física de los estudiantes?',
      options: [
        'Fomenta el sedentarismo',
        'Aumenta los problemas visuales exclusivamente',
        'Promueve el movimiento y combate el sedentarismo al requerir desplazamiento físico',
        'No tiene ningún impacto'
      ],
      correct: 2
    },
    {
      id: 14,
      text: '¿Qué habilidad blanda se desarrolla fuertemente al jugar Bounds en grupo?',
      options: [
        'Egoísmo',
        'Competitividad destructiva',
        'Colaboración, delegación de tareas y toma de decisiones conjuntas',
        'Aislamiento social'
      ],
      correct: 2
    },
    {
      id: 15,
      text: '¿Cuál es el valor pedagógico de pedir a los propios estudiantes que CREEN un Bound?',
      options: [
        'Es para que el profesor no trabaje',
        'Fomenta habilidades superiores: síntesis, estructuración lógica y empatía con el usuario',
        'Es un castigo',
        'Para que gasten la batería de sus dispositivos'
      ],
      correct: 1
    },
    {
      id: 16,
      text: 'En un Bound, si una pregunta tiene respuesta exacta, ¿qué sucede si los estudiantes se equivocan?',
      options: [
        'Pierden sus dispositivos',
        'Dependiendo de la configuración, pueden perder puntos o recibir penalizaciones de tiempo',
        'Ganan más puntos',
        'El juego se borra'
      ],
      correct: 1
    },
    {
      id: 17,
      text: '¿Por qué se dice que Actionbound contextualiza el aprendizaje?',
      options: [
        'Porque usa mucho texto',
        'Porque vincula los conceptos teóricos directamente con lugares físicos reales específicos',
        'Porque requiere conexión a internet',
        'Porque se traduce a varios idiomas'
      ],
      correct: 1
    },
    {
      id: 18,
      text: '¿Qué es un "Torneo" dentro del contexto de un Bound?',
      options: [
        'Peleas físicas entre equipos',
        'Un modo donde los equipos compiten simultáneamente para completar retos y ganar puntos',
        'Un juego de cartas',
        'Una carrera de 100 metros planos'
      ],
      correct: 1
    },
    {
      id: 19,
      text: '¿Actionbound requiere saber programar código complejo para crear una ruta?',
      options: [
        'Sí, se necesita saber C++ y Python',
        'No, el Bound Creator usa una interfaz intuitiva de arrastrar y soltar',
        'Sí, requiere conocimientos de hacking',
        'Solo si se usa en bachillerato'
      ],
      correct: 1
    },
    {
      id: 20,
      text: '¿Cuál es una conclusión central del Laboratorio Actionbound?',
      options: [
        'El uso de pantallas siempre significa quedarse sentado',
        'La escuela ya no termina en las cuatro paredes del aula; el mundo real es el tablero de juego',
        'Solo sirve para clases de Educación Física',
        'Los docentes no deben usar GPS por privacidad'
      ],
      correct: 1
    }
  ];

  metaversoQuestions: Question[] = [
    {
      id: 1,
      text: '¿Qué es el Metaverso en un contexto educativo?',
      options: [
        'Un libro de texto digital en PDF',
        'La evolución del internet hacia espacios virtuales tridimensionales y compartidos',
        'Una red social exclusiva para profesores',
        'Un sistema de calificaciones automático'
      ],
      correct: 1
    },
    {
      id: 2,
      text: '¿Qué dispositivo de hardware es el más representativo para acceder al Metaverso impulsado por Meta?',
      options: [
        'Un proyector de diapositivas',
        'Meta Quest (visores de Realidad Virtual/Mixta)',
        'Un ratón inalámbrico',
        'Una calculadora científica'
      ],
      correct: 1
    },
    {
      id: 3,
      text: '¿Qué significa el "Sentido de Presencia" en la Realidad Virtual?',
      options: [
        'Estar físicamente en la escuela',
        'La reacción del cerebro a la experiencia virtual como si estuviera ocurriendo realmente',
        'Llamar lista en clase',
        'Encender la cámara web'
      ],
      correct: 1
    },
    {
      id: 4,
      text: '¿Cómo se representa un estudiante dentro del Metaverso?',
      options: [
        'A través de un código de barras',
        'Mediante un "Avatar" que replica sus movimientos y expresiones',
        'Como un texto en pantalla',
        'No tienen representación visual'
      ],
      correct: 1
    },
    {
      id: 5,
      text: '¿Qué es Horizon Workrooms?',
      options: [
        'Un programa para hacer hojas de cálculo',
        'Un espacio virtual colaborativo donde equipos o clases pueden reunirse mediante avatares',
        'Un juego de carreras de autos',
        'Un motor de búsqueda de internet'
      ],
      correct: 1
    },
    {
      id: 6,
      text: '¿Qué tecnología permite ver el aula física mezclada con hologramas virtuales?',
      options: [
        'Realidad Mixta (Passthrough)',
        'Cine 4D',
        'Televisión por cable',
        'Bluetooth'
      ],
      correct: 0
    },
    {
      id: 7,
      text: '¿Qué ventaja tiene la VR para estudiantes con problemas de atención o hiperactividad?',
      options: [
        'Les permite jugar videojuegos en clase',
        'Al bloquear los estímulos visuales del mundo físico, reduce radicalmente las distracciones',
        'Hace que el profesor hable más fuerte',
        'Ninguna ventaja'
      ],
      correct: 1
    },
    {
      id: 8,
      text: '¿Qué es una "Micro-Inmersión" en la estrategia pedagógica de la VR?',
      options: [
        'Sumergir el visor en agua',
        'Sesiones cortas (10-15 min) enfocadas en un objetivo específico, seguidas de un debate en el mundo real',
        'Jugar 5 horas seguidas sin parar',
        'Usar gafas pequeñas'
      ],
      correct: 1
    },
    {
      id: 9,
      text: 'En el Metaverso, ¿qué función cumple el "Audio Espacial"?',
      options: [
        'Escuchar música muy alto',
        'Permite percibir de qué dirección y distancia provienen las voces, imitando la realidad',
        'Traducir idiomas automáticamente',
        'Grabar la clase'
      ],
      correct: 1
    },
    {
      id: 10,
      text: '¿Qué se conoce como el "Modelo de Piloto y Copiloto"?',
      options: [
        'Una clase sobre aviación',
        'Una estrategia donde un estudiante usa el visor (piloto) y otro lo guía mirando la pantalla (copiloto)',
        'Un juego de conducción',
        'El profesor controla a todos los estudiantes'
      ],
      correct: 1
    },
    {
      id: 11,
      text: '¿Cómo puede utilizarse el Metaverso en Anatomía?',
      options: [
        'Viendo fotos en un libro de texto',
        'Metidos virtualmente dentro de un torrente sanguíneo o diseccionando órganos a escala real',
        'Escuchando una charla de un médico',
        'Dibujando en la pizarra'
      ],
      correct: 1
    },
    {
      id: 12,
      text: '¿Qué es un "Aula Espejo Internacional"?',
      options: [
        'Poner espejos reales en el salón',
        'Conectar estudiantes de diferentes países en una misma sala virtual para colaboración global',
        'Grabar la clase y enviarla por correo',
        'Usar gafas de sol en clase'
      ],
      correct: 1
    },
    {
      id: 13,
      text: '¿Por qué se considera a la VR "la máquina de empatía definitiva"?',
      options: [
        'Porque es muy barata',
        'Porque permite experimentar el mundo desde la perspectiva en primera persona de otra persona o época',
        'Porque te hace llorar siempre',
        'Porque lee la mente'
      ],
      correct: 1
    },
    {
      id: 14,
      text: '¿Qué son los "Simuladores de Riesgo" en VR?',
      options: [
        'Juegos de azar',
        'Apps para entrenar procedimientos peligrosos (ej. químicos o primeros auxilios) sin consecuencias reales',
        'Antivirus para computadoras',
        'Simuladores de bolsa de valores'
      ],
      correct: 1
    },
    {
      id: 15,
      text: '¿Cómo ayuda el Metaverso al aprendizaje de Idiomas?',
      options: [
        'Traduciendo el pensamiento',
        'Practicando en escenarios virtuales (ej. un restaurante en Londres) donde el avatar reduce el miedo escénico',
        'Imprimiendo diccionarios 3D',
        'Leyendo subtítulos en el aire'
      ],
      correct: 1
    },
    {
      id: 16,
      text: '¿Es recomendable impartir una clase tradicional entera de 45 minutos dentro de la Realidad Virtual?',
      options: [
        'Sí, es lo más recomendado',
        'No, puede causar fatiga visual y desconexión física. Se recomiendan sesiones más cortas.',
        'Sí, hasta 3 horas seguidas',
        'Depende de la conexión WiFi'
      ],
      correct: 1
    },
    {
      id: 17,
      text: '¿A qué se refiere la "Democratización de Experiencias" en el Metaverso?',
      options: [
        'A votar por el mejor juego',
        'A que viajes imposibles o costosos (ir a la Luna o al Louvre) se vuelven accesibles para escuelas conectadas',
        'A que la tecnología es gratis para todos',
        'A jugar a la política'
      ],
      correct: 1
    },
    {
      id: 18,
      text: 'En el Metaverso, ¿cómo se interactúa de forma más natural sin mandos físicos?',
      options: [
        'A través de teclados especiales',
        'A través del seguimiento de manos (Hand Tracking) que captan las cámaras del visor',
        'Hablando fuerte',
        'Pestañeando'
      ],
      correct: 1
    },
    {
      id: 19,
      text: '¿Qué es "Bodyswaps" según la información del laboratorio?',
      options: [
        'Una app de ejercicios físicos',
        'Una aplicación para practicar entrevistas o resolución de conflictos y desarrollar habilidades blandas',
        'Una tienda de ropa virtual',
        'Un juego de acción'
      ],
      correct: 1
    },
    {
      id: 20,
      text: '¿Qué consideración ética es crítica al usar el Metaverso en la escuela?',
      options: [
        'Prohibir que los avatares usen sombreros',
        'Establecer normas claras de comportamiento, proteger datos biométricos y controlar tiempos de exposición',
        'Solo permitir jugar fuera del horario escolar',
        'Evitar enseñar materias de ciencias'
      ],
      correct: 1
    }
  ];

  geoposicionQuestions: Question[] = [
    {
      id: 1,
      text: '¿Qué diferencia fundamental tiene la RA basada en marcadores respecto a la lectura simple de QR?',
      options: [
        'Requiere internet más rápido',
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
        'Una matriz 4x4 que contiene la posición, rotación y escala del marcador en el espacio 3D',
        'Un código QR especial'
      ],
      correct: 2
    },
    {
      id: 5,
      text: '¿Qué es un "marcador fiducial"?',
      options: [
        'Un dispositivo electrónico con sensores',
        'Un patrón visual de alto contraste que los algoritmos de visión por computadora reconocen fácilmente',
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
      text: '¿Qué requisito del navegador es necesario para acceder a la cámara en una experiencia WebAR?',
      options: [
        'Solo funciona en Google Chrome',
        'Requiere una extensión especial',
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
        'No requiere ningún dispositivo'
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
      text: '¿En qué asignatura se podría usar un marcador AR para mostrar relieve topográfico sobre el pupitre?',
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
      text: '¿Qué ventaja tiene AR.js respecto a aplicaciones nativas de RA?',
      options: [
        'Mejor calidad gráfica',
        'No requiere instalación de aplicaciones; funciona directamente en el navegador',
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
        'Imprimiendo un marcador que, al escanearse, muestre un esqueleto 3D anclado sobre la mesa',
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
      text: '¿Por qué los marcadores AR deben tener alto contraste (blanco y negro)?',
      options: [
        'Porque los colores gastan más batería',
        'Porque el algoritmo de detección necesita bordes definidos para calcular la pose con precisión',
        'Por estética',
        'Porque las impresoras solo imprimen en blanco y negro'
      ],
      correct: 1
    },
    {
      id: 20,
      text: '¿Cuál es una conclusión central del laboratorio de Modelo con Geoposición?',
      options: [
        'La RA solo es útil para juegos',
        'Se necesitan equipos muy costosos para implementar RA en el aula',
        'Con herramientas open source como AR.js, cualquier docente puede crear experiencias AR ancladas sin costo',
        'Los marcadores AR son obsoletos'
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

    // Get user from localStorage
    let userStr = localStorage.getItem('currentUser');
    let user = userStr ? JSON.parse(userStr) : { userId: 'anon', username: 'Docente Anónimo' };

    // Send results to backend
    const labNames: { [key: string]: string } = { '1': 'Introducción', '2': 'Merge Cube', '3': 'QuiverVision', '4': 'Actionbound', '5': 'Metaverso Meta', '6': 'RA Propia – Generador 3D', '7': 'Modelo con Geoposición' };
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
