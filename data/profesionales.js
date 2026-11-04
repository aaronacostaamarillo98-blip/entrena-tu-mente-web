/*
  Equipo de Entrena tu mente.
  Para sumar a un/a profesional:
    1. Agregar un objeto nuevo a este array (mismos campos que el de Sonia).
    2. Guardar su foto vertical en img/profesionales/<slug>.webp
    3. Copiar profesionales/sonia-davalos.html como profesionales/<slug>.html y cambiar
       data-slug, <title> y la meta descripción.
  Las tarjetas del inicio, del test y la página de perfil se generan solas desde acá.
*/
window.PROFESIONALES = [
  {
    slug: "sonia-davalos",
    nombre: "Sonia Dávalos",
    titulo: "Psicóloga y abogada",
    verificada: true, // título y registro profesional verificados; NO mostrar el número de registro
    foto: "img/profesionales/sonia-davalos.webp", // TODO: foto provisoria; reemplazar por la definitiva (vertical, WebP)
    fotoEncuadre: "50% 20%", // punto de la foto que queda centrado en el recorte vertical
    sobreMi: "Soy psicóloga y abogada: dos caminos que me enseñaron que detrás de cada conflicto hay una historia y una persona que merece ser escuchada. Aunque no podamos cambiar todo lo que nos pasa, sí podemos aprender a afrontarlo de otra manera.",
    frase: "Acompaño a personas que atraviesan momentos difíciles, buscan comprender lo que sienten y desean recuperar la confianza en sí mismas para tomar decisiones más conscientes.",
    estilo: ["Integral", "Analítica", "Humanista"],
    enfoque: "Cada proceso es a tu medida: a partir de la evaluación, elijo las técnicas que mejor se ajustan a tu historia y a tus objetivos.",
    // Las 4 primeras se muestran en la tarjeta del inicio
    areas: [
      "Ansiedad y estrés",
      "Pareja y vínculos",
      "Familia",
      "Autoestima",
      "Regulación emocional",
      "Tolerancia a la incertidumbre",
      "Toma de decisiones",
      "Atención y conciencia"
    ],
    atiende: [
      "Adultos",
      "Parejas",
      "Familias",
      "Niños y adolescentes, con autorización de sus padres o tutores"
    ],
    modalidad: ["Presencial", "Online"],
    idiomas: ["Castellano"],
    consultorios: [
      // TODO: barrio del consultorio de Fernando de la Mora (opcional)
      { ciudad: "Fernando de la Mora", barrio: "", lugar: "Centro Interdisciplinario Gamery", mapa: "https://maps.app.goo.gl/PsXJtJMdKi4K3k6a8" },
      // TODO: confirmar la escritura exacta de «Thaya Clinic Spa» y «Centro Interdisciplinario Gamery»
      { ciudad: "Asunción", barrio: "Carmelitas", lugar: "Thaya Clinic Spa", mapa: "https://maps.app.goo.gl/Cb3ytYUR4nA618Lg8" }
    ],
    horario: "Lunes a viernes, de 09:00 a 20:00, con turno previo",
    primeraSesion: "Un espacio de escucha, sin juicios, para entender qué te preocupa y definir juntos por dónde empezar.",
    mensaje: "Empezar terapia es una forma de cuidarte.",
    derivacion: "Si tu consulta necesita atención psiquiátrica u otra especialidad, te orientamos hacia el profesional adecuado.",
    // Enlace de WhatsApp Business de Sonia: abre el chat con el mensaje de bienvenida que ella configuró en la app.
    whatsappLink: "https://wa.me/message/I7CEUUC6IJIGI1",
    qr: "img/profesionales/sonia-davalos-qr.svg", // QR del mismo enlace (se muestra en el perfil, en computadora)
    whatsapp: "595983136060", // respaldo: 0983 136 060, se usa solo si no hay whatsappLink
    mensajeWhatsapp: "Hola Sonia, vi tu perfil en Entrena tu mente y quiero coordinar una charla gratis de 15 minutos."
  }
];
