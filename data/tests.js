/*
  Tests orientativos de Entrena tu mente. Los lee js/test.js.
  - Las respuestas se calculan en el navegador: no se guardan ni se envían.
  - Cada test tiene su enlace directo para los videos: index.html#test-<slug>
  - «opciones» sirve para todas las preguntas; una pregunta puede traer sus propias opciones.
  - «invertidas»: números de pregunta (desde 1) que puntúan al revés.
  - «tono» del resultado: ok · leve · medio · alto (define el color del nivel).
  TODO: Sonia debe revisar la redacción de preguntas y resultados antes de publicar.
*/
window.TESTS = {
  ansiedad: {
    slug: "ansiedad",
    relacionados: ["estres", "incertidumbre"], // se sugieren al terminar
    icono: "ansiedad",
    titulo: "Ansiedad",
    nombreLargo: "Test de ansiedad (GAD-7)",
    gancho: "¿Tus nervios ya no te dejan en paz?",
    meta: "7 preguntas · 1 min",
    consigna: "Durante las últimas 2 semanas, ¿con qué frecuencia te han molestado los siguientes problemas?",
    opciones: [
      { texto: "Nunca", valor: 0 },
      { texto: "Varios días", valor: 1 },
      { texto: "Más de la mitad de los días", valor: 2 },
      { texto: "Casi todos los días", valor: 3 }
    ],
    preguntas: [
      "Sentirte nervioso/a, ansioso/a o con los nervios de punta",
      "No poder dejar de preocuparte o no poder controlar la preocupación",
      "Preocuparte demasiado por diferentes cosas",
      "Tener dificultad para relajarte",
      "Estar tan inquieto/a que te cuesta quedarte sentado/a tranquilo/a",
      "Molestarte o ponerte irritable con facilidad",
      "Sentir miedo, como si algo terrible fuera a pasar"
    ],
    rangos: [
      { min: 0, max: 4, tono: "ok", nivel: "Bajo",
        texto: "Tu nivel de ansiedad hoy es bajo. ¡Buena noticia! Igual que el cuerpo, la mente se entrena: en una charla gratis de 15 minutos puedes conocer herramientas para mantener este equilibrio cuando lleguen semanas difíciles.",
        boton: "Quiero mi charla gratis" },
      { min: 5, max: 9, tono: "leve", nivel: "Leve",
        texto: "Tu resultado muestra síntomas de ansiedad leves. Es muy común y se puede trabajar a tiempo. En una charla gratis de 15 minutos, nuestro equipo te ayuda a entender qué te está pasando.",
        boton: "Hablar con un profesional" },
      { min: 10, max: 14, tono: "medio", nivel: "Moderado",
        texto: "Tu resultado muestra síntomas de ansiedad moderados. Es más común de lo que parece y tiene manejo. Te recomendamos hablar con un profesional: la primera charla de 15 minutos es gratis.",
        boton: "Hablar con un profesional" },
      { min: 15, max: 21, tono: "alto", nivel: "Alto",
        texto: "Tu resultado muestra síntomas de ansiedad intensos. Te recomendamos hablar pronto con un profesional: reserva hoy tu charla gratis.",
        boton: "Reservar ahora", destacado: true }
    ],
    fuente: "Fuente: GAD-7, Spitzer y colaboradores (2006), versión en español. Uso libre."
  },

  estres: {
    slug: "estres",
    relacionados: ["ansiedad", "atencion"], // se sugieren al terminar
    icono: "estres",
    titulo: "Estrés",
    nombreLargo: "Test de estrés percibido (PSS-10)",
    gancho: "¿Tu estrés es normal o ya te está pasando factura?",
    meta: "10 preguntas · 2 min",
    consigna: "En el último mes, ¿con qué frecuencia…",
    opciones: [
      { texto: "Nunca", valor: 0 },
      { texto: "Casi nunca", valor: 1 },
      { texto: "De vez en cuando", valor: 2 },
      { texto: "A menudo", valor: 3 },
      { texto: "Muy a menudo", valor: 4 }
    ],
    invertidas: [4, 5, 7, 8],
    preguntas: [
      "…te has sentido afectado/a por algo que ocurrió inesperadamente?",
      "…te has sentido incapaz de controlar las cosas importantes de tu vida?",
      "…te has sentido nervioso/a o estresado/a?",
      "…te has sentido seguro/a de tu capacidad para manejar tus problemas personales?",
      "…has sentido que las cosas te iban bien?",
      "…has sentido que no podías con todas las cosas que tenías que hacer?",
      "…has podido controlar las dificultades de tu vida?",
      "…has sentido que tenías todo bajo control?",
      "…te has enojado porque las cosas que te pasaron estaban fuera de tu control?",
      "…has sentido que las dificultades se acumulaban tanto que no podías superarlas?"
    ],
    rangos: [
      { min: 0, max: 13, tono: "ok", nivel: "Bajo",
        texto: "Tu nivel de estrés percibido es bajo. ¡Bien! Mantenerlo también se entrena: en una charla gratis de 15 minutos puedes conocer herramientas para cuando lleguen semanas exigentes.",
        boton: "Quiero mi charla gratis" },
      { min: 14, max: 26, tono: "medio", nivel: "Moderado",
        texto: "Tu resultado muestra un nivel de estrés moderado: hay momentos en que sientes que las exigencias te superan. Se puede trabajar a tiempo. En una charla gratis de 15 minutos, nuestro equipo te ayuda a identificar qué te está pesando.",
        boton: "Hablar con un profesional" },
      { min: 27, max: 40, tono: "alto", nivel: "Alto",
        texto: "Tu resultado muestra un nivel de estrés alto. Vivir así mucho tiempo desgasta el cuerpo y la mente. Te recomendamos hablar pronto con un profesional: reserva hoy tu charla gratis de 15 minutos.",
        boton: "Reservar mi charla gratis", destacado: true }
    ],
    fuente: "Fuente: Escala de Estrés Percibido (PSS-10), Cohen y colaboradores (1983), versión en español de Remor (2006)."
  },

  autoestima: {
    slug: "autoestima",
    relacionados: ["ansiedad", "pareja"], // se sugieren al terminar
    icono: "autoestima",
    titulo: "Autoestima",
    nombreLargo: "Test de autoestima (Rosenberg)",
    gancho: "¿Cuánto confías en ti?",
    meta: "10 preguntas · 2 min",
    consigna: "Indica cuánto estás de acuerdo con cada frase.",
    opciones: [
      { texto: "Muy en desacuerdo", valor: 1 },
      { texto: "En desacuerdo", valor: 2 },
      { texto: "De acuerdo", valor: 3 },
      { texto: "Muy de acuerdo", valor: 4 }
    ],
    invertidas: [6, 7, 8, 9, 10],
    preguntas: [
      "Siento que soy una persona digna de aprecio, al menos en igual medida que los demás.",
      "Siento que tengo buenas cualidades.",
      "Soy capaz de hacer las cosas tan bien como la mayoría de la gente.",
      "Tengo una actitud positiva hacia mí mismo/a.",
      "En general, estoy satisfecho/a conmigo mismo/a.",
      "Siento que no tengo mucho de lo que estar orgulloso/a.",
      "En general, tiendo a pensar que soy un fracaso.",
      "Me gustaría poder sentir más respeto por mí mismo/a.",
      "Hay veces que realmente pienso que soy un/a inútil.",
      "A veces creo que no soy buena persona."
    ],
    rangos: [
      { min: 10, max: 25, tono: "alto", nivel: "Baja",
        texto: "Tu resultado muestra que hoy te cuesta reconocer tu propio valor. No es algo que tengas que resolver en soledad: la confianza en uno mismo se puede reconstruir con acompañamiento. Te recomendamos hablar con un profesional; la primera charla de 15 minutos es gratis.",
        boton: "Reservar mi charla gratis", destacado: true },
      { min: 26, max: 29, tono: "medio", nivel: "Media",
        texto: "Tu autoestima está en un punto medio: hay días en que confías en ti y otros en que dudas. Es muy común y se puede fortalecer. En una charla gratis de 15 minutos, nuestro equipo te ayuda a ver por dónde empezar.",
        boton: "Hablar con un profesional" },
      { min: 30, max: 40, tono: "ok", nivel: "Alta",
        texto: "Tu autoestima hoy se ve sólida: te reconoces valor y capacidades. Cuidarla también es entrenarla: en una charla gratis de 15 minutos puedes conocer herramientas para sostenerla en momentos difíciles.",
        boton: "Quiero mi charla gratis" }
    ],
    fuente: "Fuente: Escala de Autoestima de Rosenberg (1965), versión en español. Uso libre."
  },

  pareja: {
    slug: "pareja",
    relacionados: ["familia", "autoestima"], // se sugieren al terminar
    icono: "pareja",
    titulo: "Tu relación de pareja",
    nombreLargo: "Test de satisfacción en la pareja (CSI-4)",
    gancho: "¿Qué tan bien está tu relación?",
    meta: "4 preguntas · 1 min",
    aviso: "Responde pensando en tu relación actual. Si hoy no estás en pareja, puedes elegir otro test.",
    consigna: "Pensando en tu relación de pareja actual:",
    opciones: [
      { texto: "Nada", valor: 0 },
      { texto: "Un poco", valor: 1 },
      { texto: "Algo", valor: 2 },
      { texto: "Bastante", valor: 3 },
      { texto: "Casi completamente", valor: 4 },
      { texto: "Completamente", valor: 5 }
    ],
    preguntas: [
      { texto: "Considerando todo, ¿qué tan feliz eres en tu relación?",
        opciones: [
          { texto: "Extremadamente infeliz", valor: 0 },
          { texto: "Bastante infeliz", valor: 1 },
          { texto: "Un poco infeliz", valor: 2 },
          { texto: "Feliz", valor: 3 },
          { texto: "Muy feliz", valor: 4 },
          { texto: "Extremadamente feliz", valor: 5 },
          { texto: "Perfecta", valor: 6 }
        ] },
      { texto: "Tengo una relación cálida y cómoda con mi pareja.",
        opciones: [
          { texto: "Nada cierto", valor: 0 },
          { texto: "Un poco cierto", valor: 1 },
          { texto: "Algo cierto", valor: 2 },
          { texto: "Bastante cierto", valor: 3 },
          { texto: "Casi completamente cierto", valor: 4 },
          { texto: "Completamente cierto", valor: 5 }
        ] },
      "¿Qué tan gratificante es tu relación con tu pareja?",
      "En general, ¿qué tan satisfecho/a estás con tu relación?"
    ],
    rangos: [
      { min: 0, max: 13, tono: "medio", nivel: "Con señales de malestar",
        texto: "Tu resultado muestra señales de insatisfacción en tu relación. Es más común de lo que parece y hablarlo a tiempo hace la diferencia. En una charla gratis de 15 minutos, nuestro equipo te ayuda a ordenar lo que sientes. También se puede trabajar en pareja.",
        boton: "Hablar con un profesional", destacado: true },
      { min: 14, max: 21, tono: "ok", nivel: "Satisfactoria",
        texto: "Tu relación hoy se percibe satisfactoria. Las relaciones también se cuidan: en una charla gratis de 15 minutos puedes conocer herramientas para fortalecer la comunicación y el vínculo.",
        boton: "Quiero mi charla gratis" }
    ],
    fuente: "Fuente: Couples Satisfaction Index (CSI-4), Funk y Rogge (2007). Traducción al español."
  },

  familia: {
    slug: "familia",
    relacionados: ["pareja", "estres"], // se sugieren al terminar
    icono: "familia",
    titulo: "Clima familiar",
    nombreLargo: "Test de funcionamiento familiar (APGAR familiar)",
    gancho: "¿Tu familia es un apoyo o una carga?",
    meta: "5 preguntas · 1 min",
    consigna: "¿Con qué frecuencia te pasa lo siguiente con tu familia?",
    opciones: [
      { texto: "Nunca", valor: 0 },
      { texto: "Casi nunca", valor: 1 },
      { texto: "Algunas veces", valor: 2 },
      { texto: "Casi siempre", valor: 3 },
      { texto: "Siempre", valor: 4 }
    ],
    preguntas: [
      "Me satisface la ayuda que recibo de mi familia cuando tengo algún problema o necesidad.",
      "Me satisface cómo mi familia habla de las cosas y comparte los problemas conmigo.",
      "Me satisface cómo mi familia acepta y apoya mis deseos de emprender nuevas actividades.",
      "Me satisface cómo mi familia expresa afecto y responde a mis emociones, como la tristeza, el enojo o el amor.",
      "Me satisface cómo compartimos en mi familia el tiempo, los espacios y el dinero."
    ],
    rangos: [
      { min: 0, max: 9, tono: "alto", nivel: "Dificultades importantes",
        texto: "Tu resultado muestra dificultades importantes en el funcionamiento familiar. No tienes que cargar con esto en soledad: hablar con un profesional puede ayudarte a encontrar caminos. Reserva hoy tu charla gratis de 15 minutos.",
        boton: "Reservar mi charla gratis", destacado: true },
      { min: 10, max: 12, tono: "medio", nivel: "Dificultades moderadas",
        texto: "Tu resultado muestra dificultades moderadas en tu familia: puede faltar apoyo, diálogo o tiempo compartido. Te recomendamos hablar con un profesional; la primera charla de 15 minutos es gratis.",
        boton: "Hablar con un profesional" },
      { min: 13, max: 16, tono: "leve", nivel: "Dificultades leves",
        texto: "Tu resultado muestra algunas dificultades leves en el funcionamiento familiar. Pasa en muchas familias y se puede mejorar. En una charla gratis de 15 minutos, nuestro equipo te orienta sobre por dónde empezar.",
        boton: "Hablar con un profesional" },
      { min: 17, max: 20, tono: "ok", nivel: "Buen funcionamiento",
        texto: "Percibes un buen funcionamiento en tu familia: apoyo, comunicación y afecto. Si quieres seguir fortaleciéndolo, en una charla gratis de 15 minutos puedes conocer herramientas.",
        boton: "Quiero mi charla gratis" }
    ],
    fuente: "Fuente: APGAR familiar, Smilkstein (1978), versión en español. Uso libre."
  },

  atencion: {
    slug: "atencion",
    relacionados: ["estres", "ansiedad"], // se sugieren al terminar
    icono: "atencion",
    titulo: "Atención plena",
    nombreLargo: "Test de atención plena (MAAS, versión breve)",
    gancho: "¿Vives en piloto automático?",
    meta: "5 preguntas · 1 min",
    consigna: "¿Con qué frecuencia te pasa lo siguiente en tu día a día?",
    opciones: [
      { texto: "Casi siempre", valor: 1 },
      { texto: "Muy a menudo", valor: 2 },
      { texto: "Bastante a menudo", valor: 3 },
      { texto: "Pocas veces", valor: 4 },
      { texto: "Muy pocas veces", valor: 5 },
      { texto: "Casi nunca", valor: 6 }
    ],
    // TODO: Sonia debe confirmar la selección de 5 ítems de la MAAS y los rangos (orientativos).
    preguntas: [
      "Hago las cosas apurado/a, sin estar realmente atento/a a ellas.",
      "Hago trabajos o tareas automáticamente, sin darme cuenta de lo que estoy haciendo.",
      "Me descubro haciendo cosas sin prestar atención.",
      "Siento que funciono en piloto automático, sin mucha conciencia de lo que hago.",
      "Me encuentro absorto/a pensando en el futuro o en el pasado."
    ],
    rangos: [
      { min: 5, max: 14, tono: "medio", nivel: "Mucho piloto automático",
        texto: "Tu resultado muestra que pasas buena parte del día en piloto automático. Entrenar la atención puede ayudarte a sentirte con más calma y más presente. Te recomendamos hablar con un profesional: la primera charla de 15 minutos es gratis.",
        boton: "Hablar con un profesional", destacado: true },
      { min: 15, max: 22, tono: "leve", nivel: "Atención intermedia",
        texto: "A veces vives en piloto automático: haces cosas sin estar del todo presente. Es muy común con el ritmo de hoy, y la atención se puede entrenar. En una charla gratis de 15 minutos te contamos cómo.",
        boton: "Quiero entrenar mi atención" },
      { min: 23, max: 30, tono: "ok", nivel: "Buena atención",
        texto: "Sueles estar presente en lo que haces. ¡Muy bien! La atención es como un músculo: en una charla gratis de 15 minutos puedes conocer cómo seguir entrenándola.",
        boton: "Quiero mi charla gratis" }
    ],
    fuente: "Fuente: Mindful Attention Awareness Scale (MAAS), Brown y Ryan (2003). Versión breve en español; rangos orientativos."
  },

  incertidumbre: {
    slug: "incertidumbre",
    relacionados: ["ansiedad", "estres"], // se sugieren al terminar
    icono: "incertidumbre",
    titulo: "Intolerancia a la incertidumbre",
    nombreLargo: "Test de intolerancia a la incertidumbre (IUS-12)",
    gancho: "¿Te cuesta decidir si no tienes todo bajo control?",
    meta: "12 preguntas · 2 min",
    consigna: "¿Qué tanto te describe cada frase?",
    opciones: [
      { texto: "Nada", valor: 1 },
      { texto: "Un poco", valor: 2 },
      { texto: "Algo", valor: 3 },
      { texto: "Bastante", valor: 4 },
      { texto: "Totalmente", valor: 5 }
    ],
    preguntas: [
      "Los imprevistos me alteran mucho.",
      "Me frustra no tener toda la información que necesito.",
      "Siempre debería mirar hacia adelante para evitar sorpresas.",
      "Un imprevisto puede arruinarlo todo, incluso con la mejor planificación.",
      "Siempre quiero saber qué me depara el futuro.",
      "No soporto que me tomen por sorpresa.",
      "Debería poder organizarlo todo de antemano.",
      "La incertidumbre me impide vivir una vida plena.",
      "Cuando llega el momento de actuar, la incertidumbre me paraliza.",
      "Cuando estoy en una situación incierta, no funciono muy bien.",
      "La más mínima duda puede impedirme actuar.",
      "Debo alejarme de todas las situaciones de incertidumbre."
    ],
    rangos: [
      { min: 12, max: 27, tono: "ok", nivel: "Baja",
        texto: "Toleras bien la incertidumbre: los imprevistos no suelen frenarte. En una charla gratis de 15 minutos puedes conocer herramientas para sostenerlo en momentos de cambio.",
        boton: "Quiero mi charla gratis" },
      { min: 28, max: 39, tono: "medio", nivel: "Moderada",
        texto: "Te cuesta convivir con lo que no puedes prever, y a veces eso te preocupa o te frena al decidir. Se puede trabajar. En una charla gratis de 15 minutos, nuestro equipo te ayuda a entender qué te pasa.",
        boton: "Hablar con un profesional" },
      { min: 40, max: 60, tono: "alto", nivel: "Alta",
        texto: "Tu resultado muestra que la incertidumbre te afecta mucho: puede paralizarte, generarte preocupación constante o dificultarte tomar decisiones. Te recomendamos hablar con un profesional; reserva hoy tu charla gratis de 15 minutos.",
        boton: "Reservar mi charla gratis", destacado: true }
    ],
    fuente: "Fuente: Intolerance of Uncertainty Scale (IUS-12), Carleton, Norton y Asmundson (2007), versión en español; rangos orientativos."
  }
};

// Orden en que aparecen en el inicio
window.TESTS_ORDEN = ["ansiedad", "estres", "autoestima", "pareja", "familia", "atencion", "incertidumbre"];
