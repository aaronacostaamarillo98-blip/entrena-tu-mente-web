/*
  Agenda de Entrena tu mente: servicios, horario y reglas del agendamiento.
  Para cambiar horarios o bloquear días, se edita SOLO este archivo.

  MODO DEMOSTRACIÓN: mientras «api» esté vacío, los horarios ocupados son de ejemplo
  y las citas NO se guardan. Cuando Sonia tenga su cuenta de Cloudflare, se conecta
  el sistema real (guarda citas, evita turnos repetidos y envía el email de confirmación).
  TODO: Sonia confirma duraciones, horario y qué días atiende en cada consultorio.
*/
window.AGENDA = {
  api: "", // TODO: dirección del sistema de citas en Cloudflare (vacío = modo demostración)
  zonaHoraria: "America/Asuncion",
  intervaloMinutos: 30,          // cada cuánto empieza un turno
  antelacionMinimaHoras: 3,      // no se puede agendar con menos de 3 h de anticipación
  diasHaciaAdelante: 60,         // hasta cuántos días en el futuro se puede agendar

  // Horario fijo semanal (0 = domingo … 6 = sábado). Varios tramos por día si hace falta.
  horario: {
    1: [["09:00", "20:00"]],
    2: [["09:00", "20:00"]],
    3: [["09:00", "20:00"]],
    4: [["09:00", "20:00"]],
    5: [["09:00", "20:00"]]
  },

  // Días sin atención (vacaciones, feriados): "AAAA-MM-DD"
  diasBloqueados: [
    "2026-12-08", // Virgen de Caacupé
    "2026-12-25",
    "2027-01-01"
  ],

  // Turnos sueltos bloqueados: { fecha: "AAAA-MM-DD", desde: "HH:MM", hasta: "HH:MM" }
  bloqueos: [],

  servicios: [
    { id: "charla", nombre: "Charla gratis de 15 minutos", detalle: "Una primera conversación para conocernos y resolver tus dudas.",
      duracion: 15, gratis: true, modalidades: ["online"], icono: "chat" },
    { id: "primera", nombre: "Primera sesión", detalle: "Espacio de escucha y evaluación para definir juntos tus objetivos.",
      duracion: 60, modalidades: ["presencial", "online"], icono: "inicio" }, // TODO: confirmar duración
    { id: "individual", nombre: "Sesión individual", detalle: "Para continuar tu proceso terapéutico.",
      duracion: 60, modalidades: ["presencial", "online"], icono: "persona" }, // TODO: confirmar duración
    { id: "pareja", nombre: "Terapia de pareja", detalle: "Para trabajar la comunicación y el vínculo.",
      duracion: 60, modalidades: ["presencial", "online"], icono: "pareja" }, // TODO: confirmar duración
    { id: "familia", nombre: "Terapia familiar", detalle: "Para acompañar conflictos y cambios en la familia.",
      duracion: 60, modalidades: ["presencial", "online"], icono: "familia" } // TODO: confirmar duración
  ],

  // Cómo se explica cada modalidad
  modalidades: {
    online: { nombre: "Online", detalle: "Videollamada o llamada, desde donde estés." },
    presencial: { nombre: "Presencial", detalle: "En el consultorio que elijas." }
  },

  // Número para el botón «Avisar por WhatsApp» de la confirmación (acepta mensaje armado)
  whatsappConfirmacion: "595983136060"
};
