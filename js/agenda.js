/* Agendamiento de Entrena tu mente.
   Recorrido: servicio → profesional y modalidad → fecha y horario → tus datos → confirmación.
   Lee data/agenda.js y data/profesionales.js. Mientras AGENDA.api esté vacío funciona en
   modo demostración: los horarios ocupados son de ejemplo y las citas no se guardan. */
(function () {
  "use strict";

  var root = document.querySelector("[data-agenda]");
  if (!root) return;

  var A = window.AGENDA;
  var PROS = (window.PROFESIONALES || []).filter(function (p) { return p.agendaActiva !== false; });
  var ETM = window.ETM;
  var I = ETM.I;
  var esc = ETM.esc;
  var DEMO = !A.api;

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  var ICO = {
    chat: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z"/>',
    inicio: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/>',
    persona: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>',
    pareja: '<circle cx="9" cy="8" r="3.2"/><circle cx="16.5" cy="9.5" r="2.6"/><path d="M3.5 20c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5M14.6 14.7c.6-.2 1.2-.3 1.9-.3 2.3 0 4.1 1.7 4.5 4.6"/>',
    familia: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>',
    online: '<rect x="3" y="5" width="13" height="12" rx="2.5"/><path d="m16 10 5-3v10l-5-3"/>',
    presencial: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    tarde: '<path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 6v3M5.6 9.6l1.6 1.6M18.4 9.6l-1.6 1.6"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    check: '<circle cx="12" cy="12" r="9.5"/><path d="m8 12.3 2.7 2.7L16.5 9"/>',
    equipo: '<rect x="4" y="7" width="16" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/>',
    descarga: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'
  };
  function ico(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICO[n] || "") + "</svg>"; }

  /* --- Tiempo en Paraguay (se trabaja con fechas «locales» como texto) ---- */
  function ahoraPY() {
    var f = new Intl.DateTimeFormat("en-CA", { timeZone: A.zonaHoraria, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    var p = {}; f.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { fecha: p.year + "-" + p.month + "-" + p.day, hora: p.hour + ":" + p.minute };
  }
  function aUTC(fecha, hora) { var d = fecha.split("-"), h = (hora || "00:00").split(":"); return Date.UTC(+d[0], d[1] - 1, +d[2], +h[0], +h[1]); }
  function deUTC(ms) { var s = new Date(ms).toISOString(); return { fecha: s.slice(0, 10), hora: s.slice(11, 16) }; }
  function minutos(h) { var x = h.split(":"); return +x[0] * 60 + +x[1]; }
  function hhmm(m) { return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + (m % 60)).slice(-2); }
  function diaSemana(fecha) { return new Date(aUTC(fecha)).getUTCDay(); }
  function fechaLarga(fecha) {
    var d = fecha.split("-");
    var t = DIAS[diaSemana(fecha)] + " " + (+d[2]) + " de " + MESES[d[1] - 1];
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function minimoReservable() { var n = ahoraPY(); return deUTC(aUTC(n.fecha, n.hora) + A.antelacionMinimaHoras * 3600e3); }
  function limiteFecha() { return deUTC(aUTC(ahoraPY().fecha) + A.diasHaciaAdelante * 864e5).fecha; }

  /* --- Disponibilidad ----------------------------------------------------- */
  function ocupadoDemo(fecha, hora, prof) {
    // Ocupación de ejemplo, siempre igual para la misma fecha y hora (para que se vea real)
    var s = fecha + hora + prof, h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % 100 < 38;
  }
  function horariosDelDia(fecha, servicio, prof) {
    if (fecha > limiteFecha() || A.diasBloqueados.indexOf(fecha) !== -1) return [];
    var tramos = A.horario[diaSemana(fecha)] || [];
    var min = minimoReservable();
    var lista = [];
    tramos.forEach(function (t) {
      for (var m = minutos(t[0]); m + servicio.duracion <= minutos(t[1]); m += A.intervaloMinutos) {
        var h = hhmm(m);
        if (fecha < min.fecha || (fecha === min.fecha && h < min.hora)) continue;
        var bloqueado = A.bloqueos.some(function (b) {
          return b.fecha === fecha && m < minutos(b.hasta) && m + servicio.duracion > minutos(b.desde);
        });
        if (bloqueado) continue;
        if (DEMO && ocupadoDemo(fecha, h, prof)) continue;
        lista.push(h);
      }
    });
    return lista;
  }
  // Fuente de horarios: hoy calcula en el navegador; con el sistema real consulta a Cloudflare
  var fuente = {
    disponibilidad: function (fecha, servicio, prof) {
      if (DEMO) return Promise.resolve(horariosDelDia(fecha, servicio, prof));
      return fetch(A.api + "/disponibilidad?fecha=" + fecha + "&servicio=" + servicio.id + "&profesional=" + prof)
        .then(function (r) { return r.json(); })
        .then(function (d) { return d.horarios || []; });
    },
    reservar: function (datos) {
      if (DEMO) return new Promise(function (ok) { setTimeout(function () { ok({ codigo: codigo(), demo: true }); }, 700); });
      return fetch(A.api + "/reservar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) })
        .then(function (r) { if (!r.ok) throw new Error("reserva"); return r.json(); });
    }
  };
  function codigo() {
    var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "";
    var r = (window.crypto && crypto.getRandomValues) ? crypto.getRandomValues(new Uint8Array(8)) : null;
    for (var i = 0; i < 8; i++) s += c[(r ? r[i] : Math.floor(Math.random() * 256)) % c.length];
    return s;
  }

  /* --- Estado ------------------------------------------------------------- */
  var params = new URLSearchParams(location.search);
  var st = {
    paso: 0,
    servicio: null, profesional: null, modalidad: null, lugar: null,
    mes: null, fecha: null, hora: null, turno: "manana",
    datos: { nombre: "", email: "", prefijo: "+595", telefono: "", acepto: false, recordar: false }
  };
  var guardado = null;
  try { guardado = JSON.parse(localStorage.getItem("etm-datos") || "null"); } catch (e) { guardado = null; }
  if (guardado) { st.datos.nombre = guardado.nombre || ""; st.datos.email = guardado.email || ""; st.datos.prefijo = guardado.prefijo || "+595"; st.datos.telefono = guardado.telefono || ""; st.datos.recordar = true; }

  function servicio() { return A.servicios.filter(function (s) { return s.id === st.servicio; })[0]; }
  function pro() { return PROS.filter(function (p) { return p.slug === st.profesional; })[0]; }

  /* --- Estado del consultorio (arriba de la tarjeta) ---------------------- */
  function estadoAtencion() {
    var n = ahoraPY(), hoy = A.horario[diaSemana(n.fecha)] || [];
    for (var i = 0; i < hoy.length; i++) {
      if (A.diasBloqueados.indexOf(n.fecha) === -1 && n.hora >= hoy[i][0] && n.hora < hoy[i][1]) return { abierto: true, texto: "Atendiendo ahora · hasta las " + hoy[i][1] };
    }
    for (var k = 0; k < 8; k++) {
      var f = deUTC(aUTC(n.fecha) + k * 864e5).fecha, tr = A.horario[diaSemana(f)] || [];
      if (A.diasBloqueados.indexOf(f) !== -1) continue;
      for (var j = 0; j < tr.length; j++) {
        if (k > 0 || n.hora < tr[j][0]) return { abierto: false, texto: "Cerrado ahora · abre " + (k === 0 ? "hoy" : k === 1 ? "mañana" : DIAS[diaSemana(f)]) + " a las " + tr[j][0] };
      }
    }
    return { abierto: false, texto: "Cerrado ahora" };
  }
  var chip = document.querySelector("[data-estado]");
  if (chip) { var e = estadoAtencion(); chip.innerHTML = ico("reloj") + esc(e.texto); chip.classList.toggle("is-open", e.abierto); }

  /* --- Pintado ------------------------------------------------------------ */
  var TOTAL = 4;
  function barra(paso) {
    var segs = "";
    for (var i = 0; i < TOTAL; i++) segs += '<span class="' + (i <= paso ? "is-on" : "") + '"></span>';
    return '<div class="ag-top">' +
      (paso > 0 ? '<button class="ag-back" type="button" data-volver aria-label="Volver al paso anterior">' + I.left + "</button>" : '<span class="ag-back-ph"></span>') +
      '<div class="ag-prog"><div class="ag-segs" aria-hidden="true">' + segs + '</div><p class="ag-step">Paso ' + (paso + 1) + " de " + TOTAL + "</p></div></div>";
  }
  function pintar(html, listo, textoBoton) {
    root.innerHTML = '<div class="screen-enter">' + html + "</div>";
    var foot = document.querySelector("[data-ag-foot]");
    if (foot) {
      foot.hidden = !textoBoton;
      var b = foot.querySelector("button");
      b.textContent = textoBoton || "Siguiente";
      b.disabled = !listo;
    }
    var h = root.querySelector("h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    var top = document.querySelector(".ag-card").getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    var v = root.querySelector("[data-volver]");
    if (v) v.addEventListener("click", volver);
  }
  function opcion(attrs, activo, icono, titulo, sub, extra) {
    return '<button type="button" class="ag-opt' + (activo ? " is-on" : "") + '" aria-pressed="' + activo + '" ' + attrs + ">" +
      '<span class="ag-opt-ico">' + icono + "</span>" +
      '<span class="ag-opt-txt"><b>' + esc(titulo) + "</b>" + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span>" +
      (extra || "") + '<span class="ag-radio" aria-hidden="true"></span></button>';
  }

  /* Paso 1: servicio */
  function pasoServicio() {
    st.paso = 0;
    var html = barra(0) + "<h2>¿Qué quieres agendar?</h2><p class=\"ag-sub\">Elige un servicio para continuar.</p><div class=\"ag-list\">" +
      A.servicios.map(function (s) {
        var etiqueta = s.gratis ? '<span class="ag-tag">Gratis</span>' : "";
        var mods = s.modalidades.map(function (m) { return A.modalidades[m].nombre; }).join(" o ");
        return opcion('data-servicio="' + s.id + '"', st.servicio === s.id, ico(s.icono), s.nombre, s.duracion + " min · " + mods, etiqueta);
      }).join("") + "</div>";
    pintar(html, !!st.servicio, "Siguiente");
    root.querySelectorAll("[data-servicio]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (st.servicio !== b.getAttribute("data-servicio")) { st.fecha = null; st.hora = null; }
        st.servicio = b.getAttribute("data-servicio");
        pasoServicio();
      });
    });
  }

  /* Paso 2: profesional y modalidad */
  function pasoProfesional() {
    st.paso = 1;
    var s = servicio();
    if (s.modalidades.length === 1) st.modalidad = s.modalidades[0];
    if (st.modalidad && s.modalidades.indexOf(st.modalidad) === -1) st.modalidad = null;
    if (PROS.length === 1) st.profesional = PROS[0].slug;
    var p = pro();
    var html = barra(1) + "<h2>¿Con quién y cómo?</h2><p class=\"ag-sub\">Elige profesional y modalidad.</p>";
    html += '<p class="ag-label">Profesional</p><div class="ag-list">' +
      (PROS.length > 1 ? opcion('data-pro="primero"', st.profesional === "primero", ico("equipo"), "Primer profesional disponible", "Te asignamos a quien tenga el horario que elijas") : "") +
      PROS.map(function (x) {
        var foto = x.foto ? '<img src="' + esc((document.body.getAttribute("data-root") || "") + x.foto) + '" alt="" style="object-position:' + esc(x.fotoEncuadre || "50% 25%") + '">' : ico("persona");
        return opcion('data-pro="' + x.slug + '"', st.profesional === x.slug, foto, x.nombre, x.titulo);
      }).join("") + "</div>";
    html += '<p class="ag-label">Modalidad</p><div class="ag-list ag-list--2">' +
      s.modalidades.map(function (m) { return opcion('data-mod="' + m + '"', st.modalidad === m, ico(m), A.modalidades[m].nombre, A.modalidades[m].detalle); }).join("") + "</div>";
    if (st.modalidad === "presencial" && p) {
      if (p.consultorios.length === 1) st.lugar = 0;
      html += '<p class="ag-label">Consultorio</p><div class="ag-list">' +
        p.consultorios.map(function (c, i) { return opcion('data-lugar="' + i + '"', st.lugar === i, ico("presencial"), c.lugar, [c.barrio, c.ciudad].filter(Boolean).join(", ")); }).join("") + "</div>";
    }
    var listo = st.profesional && st.modalidad && (st.modalidad !== "presencial" || st.lugar != null);
    pintar(html, listo, "Siguiente");
    root.querySelectorAll("[data-pro]").forEach(function (b) { b.addEventListener("click", function () { st.profesional = b.getAttribute("data-pro"); st.lugar = null; st.hora = null; pasoProfesional(); }); });
    root.querySelectorAll("[data-mod]").forEach(function (b) { b.addEventListener("click", function () { st.modalidad = b.getAttribute("data-mod"); if (st.modalidad !== "presencial") st.lugar = null; pasoProfesional(); }); });
    root.querySelectorAll("[data-lugar]").forEach(function (b) { b.addEventListener("click", function () { st.lugar = +b.getAttribute("data-lugar"); pasoProfesional(); }); });
  }

  /* Paso 3: fecha y horario */
  function profesionalesParaFecha() { return st.profesional === "primero" ? PROS.map(function (p) { return p.slug; }) : [st.profesional]; }
  function diaDisponible(fecha) {
    var s = servicio();
    return profesionalesParaFecha().some(function (slug) { return horariosDelDia(fecha, s, slug).length > 0; });
  }
  function pasoFecha() {
    st.paso = 2;
    var hoy = ahoraPY().fecha;
    if (!st.mes) st.mes = hoy.slice(0, 7);
    if (st.fecha) return pasoHorario();
    var y = +st.mes.slice(0, 4), m = +st.mes.slice(5, 7);
    var primero = st.mes + "-01";
    var offset = (diaSemana(primero) + 6) % 7; // lunes primero
    var diasMes = new Date(Date.UTC(y, m, 0)).getUTCDate();
    var celdas = "";
    for (var i = 0; i < offset; i++) celdas += '<span class="ag-day is-empty"></span>';
    for (var d = 1; d <= diasMes; d++) {
      var f = st.mes + "-" + ("0" + d).slice(-2);
      var ok = diaDisponible(f);
      celdas += ok
        ? '<button type="button" class="ag-day' + (f === hoy ? " is-today" : "") + '" data-dia="' + f + '" aria-label="' + esc(fechaLarga(f)) + '">' + d + "</button>"
        : '<span class="ag-day is-off" aria-hidden="true">' + d + "</span>";
    }
    var mesActual = hoy.slice(0, 7), mesLimite = limiteFecha().slice(0, 7);
    var html = barra(2) + "<h2>Elige fecha y horario</h2><p class=\"ag-sub\">Toca un día para ver los horarios disponibles.</p>" +
      '<div class="ag-cal-head"><button type="button" class="ag-nav" data-mes="-1" aria-label="Mes anterior"' + (st.mes <= mesActual ? " disabled" : "") + ">" + I.left + "</button>" +
      "<b>" + MESES[m - 1].charAt(0).toUpperCase() + MESES[m - 1].slice(1) + " " + y + "</b>" +
      '<button type="button" class="ag-nav" data-mes="1" aria-label="Mes siguiente"' + (st.mes >= mesLimite ? " disabled" : "") + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button></div>' +
      '<div class="ag-week" aria-hidden="true"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div>' +
      '<div class="ag-grid">' + celdas + "</div>";
    pintar(html, false, "Siguiente");
    root.querySelectorAll("[data-mes]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = new Date(Date.UTC(y, m - 1 + +b.getAttribute("data-mes"), 1));
        st.mes = n.toISOString().slice(0, 7); pasoFecha();
      });
    });
    root.querySelectorAll("[data-dia]").forEach(function (b) { b.addEventListener("click", function () { st.fecha = b.getAttribute("data-dia"); st.hora = null; pasoHorario(); }); });
  }
  function pasoHorario() {
    st.paso = 2;
    var s = servicio();
    var slugs = profesionalesParaFecha();
    Promise.all(slugs.map(function (slug) { return fuente.disponibilidad(st.fecha, s, slug); })).then(function (listas) {
      var todos = {};
      listas.forEach(function (l) { l.forEach(function (h) { todos[h] = true; }); });
      var horas = Object.keys(todos).sort();
      var manana = horas.filter(function (h) { return h < "13:00"; }), tarde = horas.filter(function (h) { return h >= "13:00"; });
      if (st.turno === "manana" && !manana.length && tarde.length) st.turno = "tarde";
      if (st.turno === "tarde" && !tarde.length && manana.length) st.turno = "manana";
      var visibles = st.turno === "manana" ? manana : tarde;
      var html = barra(2) + "<h2>Elige fecha y horario</h2><p class=\"ag-sub\">Toca un horario para continuar.</p>" +
        '<button type="button" class="ag-change" data-cambiar>' + I.left + "Cambiar fecha</button>" +
        '<p class="ag-date">' + esc(fechaLarga(st.fecha)) + "</p>";
      if (!horas.length) {
        html += '<p class="ag-empty">No quedan horarios libres para este servicio en esta fecha. Prueba con otro día.</p>';
      } else {
        html += '<div class="ag-seg" role="tablist">' +
          '<button type="button" role="tab" data-turno="manana" aria-selected="' + (st.turno === "manana") + '"' + (manana.length ? "" : " disabled") + ">" + ico("sol") + "Mañana</button>" +
          '<button type="button" role="tab" data-turno="tarde" aria-selected="' + (st.turno === "tarde") + '"' + (tarde.length ? "" : " disabled") + ">" + ico("tarde") + "Tarde</button></div>" +
          '<div class="ag-times">' + visibles.map(function (h) {
            return '<button type="button" class="ag-time' + (st.hora === h ? " is-on" : "") + '" aria-pressed="' + (st.hora === h) + '" data-hora="' + h + '">' + h + "</button>";
          }).join("") + "</div>";
      }
      pintar(html, !!st.hora, "Siguiente");
      root.querySelector("[data-cambiar]").addEventListener("click", function () { st.fecha = null; st.hora = null; pasoFecha(); });
      root.querySelectorAll("[data-turno]").forEach(function (b) { b.addEventListener("click", function () { st.turno = b.getAttribute("data-turno"); pasoHorario(); }); });
      root.querySelectorAll("[data-hora]").forEach(function (b) {
        b.addEventListener("click", function () {
          st.hora = b.getAttribute("data-hora");
          if (st.profesional === "primero") {
            // asigna el primer profesional libre en ese horario
            for (var i = 0; i < slugs.length; i++) if (listas[i].indexOf(st.hora) !== -1) { st.asignado = slugs[i]; break; }
          }
          pasoHorario();
        });
      });
    }).catch(function () {
      pintar(barra(2) + '<h2>Elige fecha y horario</h2><p class="ag-empty">No pudimos cargar los horarios. Revisa tu conexión e inténtalo de nuevo.</p>', false, "Siguiente");
    });
  }

  /* Resumen reutilizable */
  function resumen() {
    var s = servicio();
    var p = PROS.filter(function (x) { return x.slug === (st.profesional === "primero" ? st.asignado : st.profesional); })[0];
    var lugar = st.modalidad === "presencial" && p ? p.consultorios[st.lugar] : null;
    var filas = [
      ["Servicio", s.nombre + (s.gratis ? " · Gratis" : "")],
      ["Profesional", p ? p.nombre : "Primer profesional disponible"],
      ["Modalidad", A.modalidades[st.modalidad].nombre + (lugar ? " · " + lugar.lugar : "")],
      ["Fecha", fechaLarga(st.fecha)],
      ["Hora", st.hora + " hs · " + s.duracion + " min"]
    ];
    return { filas: filas, servicio: s, profesional: p, lugar: lugar,
      html: '<dl class="ag-sum">' + filas.map(function (f) { return "<div><dt>" + f[0] + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") + "</dl>" };
  }

  /* Paso 4: datos */
  function pasoDatos() {
    st.paso = 3;
    var r = resumen(), d = st.datos;
    var prefijos = [["+595", "🇵🇾 +595"], ["+54", "🇦🇷 +54"], ["+55", "🇧🇷 +55"], ["+56", "🇨🇱 +56"], ["+598", "🇺🇾 +598"], ["+34", "🇪🇸 +34"], ["+1", "🇺🇸 +1"]];
    var html = barra(3) + "<h2>Completa tus datos</h2><p class=\"ag-sub\">Los usamos solo para confirmar tu cita. No te preguntamos el motivo de consulta.</p>" +
      r.html +
      '<form class="ag-form" novalidate data-form>' +
      '<label class="ag-field"><span>Nombre y apellido</span><input name="nombre" autocomplete="name" required value="' + esc(d.nombre) + '"></label>' +
      '<label class="ag-field"><span>Email</span><input name="email" type="email" autocomplete="email" inputmode="email" required value="' + esc(d.email) + '"></label>' +
      '<div class="ag-field"><span id="tel-label">Teléfono (WhatsApp)</span><div class="ag-tel">' +
      '<select name="prefijo" aria-label="Código de país">' + prefijos.map(function (p) { return '<option value="' + p[0] + '"' + (d.prefijo === p[0] ? " selected" : "") + ">" + p[1] + "</option>"; }).join("") + "</select>" +
      '<input name="telefono" type="tel" autocomplete="tel-national" inputmode="tel" aria-labelledby="tel-label" required value="' + esc(d.telefono) + '"></div></div>' +
      '<label class="ag-check"><input type="checkbox" name="acepto"' + (d.acepto ? " checked" : "") + '><span>Acepto la <a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a>.</span></label>' +
      '<label class="ag-switch"><span>Recordar mis datos en este dispositivo</span><input type="checkbox" name="recordar"' + (d.recordar ? " checked" : "") + '><i aria-hidden="true"></i></label>' +
      '<p class="ag-error" data-error hidden></p></form>';
    pintar(html, valido(), "Confirmar cita");
    var form = root.querySelector("[data-form]");
    form.addEventListener("input", function () {
      d.nombre = form.nombre.value.trim(); d.email = form.email.value.trim(); d.prefijo = form.prefijo.value;
      d.telefono = form.telefono.value.replace(/[^\d]/g, ""); d.acepto = form.acepto.checked; d.recordar = form.recordar.checked;
      document.querySelector("[data-ag-foot] button").disabled = !valido();
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); siguiente(); });
  }
  function valido() {
    var d = st.datos;
    return d.nombre.length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) && d.telefono.length >= 6 && d.acepto;
  }

  /* Confirmación */
  function confirmar() {
    var boton = document.querySelector("[data-ag-foot] button");
    boton.disabled = true; boton.textContent = "Confirmando…";
    var r = resumen(), d = st.datos;
    try {
      if (d.recordar) localStorage.setItem("etm-datos", JSON.stringify({ nombre: d.nombre, email: d.email, prefijo: d.prefijo, telefono: d.telefono }));
      else localStorage.removeItem("etm-datos");
    } catch (e) { /* sin almacenamiento */ }
    var cita = { servicio: r.servicio.id, profesional: r.profesional ? r.profesional.slug : "", modalidad: st.modalidad,
      lugar: r.lugar ? r.lugar.lugar : "", fecha: st.fecha, hora: st.hora, duracion: r.servicio.duracion,
      nombre: d.nombre, email: d.email, telefono: d.prefijo + d.telefono };
    fuente.reservar(cita).then(function (res) { listo(cita, r, res); })
      .catch(function () {
        boton.disabled = false; boton.textContent = "Confirmar cita";
        var err = root.querySelector("[data-error]");
        if (err) { err.hidden = false; err.textContent = "Ese horario acaba de ocuparse o hubo un problema de conexión. Elige otro horario o inténtalo de nuevo."; }
      });
  }
  function ics(cita, r) {
    var ini = aUTC(cita.fecha, cita.hora) + 3 * 3600e3; // Paraguay: UTC-3
    var fin = ini + cita.duracion * 60e3;
    function f(ms) { return new Date(ms).toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"; }
    var donde = cita.modalidad === "online" ? "Online" : cita.lugar;
    var txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Entrena tu mente//Agenda//ES", "BEGIN:VEVENT",
      "UID:" + cita.codigo + "@entrenatumente", "DTSTAMP:" + f(Date.now()), "DTSTART:" + f(ini), "DTEND:" + f(fin),
      "SUMMARY:" + r.servicio.nombre + (r.profesional ? " con " + r.profesional.nombre : ""),
      "LOCATION:" + donde, "DESCRIPTION:Cita agendada en Entrena tu mente. Código: " + cita.codigo, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    return URL.createObjectURL(new Blob([txt], { type: "text/calendar" }));
  }
  function listo(cita, r, res) {
    cita.codigo = res.codigo;
    var quien = r.profesional ? r.profesional.nombre.split(" ")[0] : "";
    var msg = "Hola" + (quien ? " " + quien : "") + ", acabo de agendar en Entrena tu mente: " + r.servicio.nombre + " · " +
      A.modalidades[cita.modalidad].nombre + (cita.lugar ? " (" + cita.lugar + ")" : "") + " · " + fechaLarga(cita.fecha) + " a las " + cita.hora + " hs. Soy " + cita.nombre + ". Código: " + cita.codigo + ".";
    var wa = "https://wa.me/" + A.whatsappConfirmacion + "?text=" + encodeURIComponent(msg);
    var cancelar = "cancelar-cita.html?c=" + cita.codigo + (res.demo ? "&s=" + encodeURIComponent(r.servicio.nombre) + "&f=" + cita.fecha + "&h=" + cita.hora + "&n=" + encodeURIComponent(cita.nombre) : "");
    var html = '<div class="ag-done"><span class="ag-done-ico">' + ico("check") + "</span>" +
      "<h2>¡Listo, tu cita quedó agendada!</h2>" +
      "<p class=\"ag-sub\">" + (res.demo
        ? "<b>Modo demostración:</b> esta cita no se guardó. En la versión final te llegará un email a " + esc(cita.email) + " con los datos y el enlace para cancelar."
        : "Te enviamos un email a " + esc(cita.email) + " con los datos y el enlace para cancelar.") + "</p></div>" +
      r.html.replace('<dl class="ag-sum">', '<dl class="ag-sum"><div><dt>Código</dt><dd>' + cita.codigo + "</dd></div>") +
      '<div class="ag-done-actions">' +
      '<a class="btn btn--block" href="' + wa + '" target="_blank" rel="noopener">' + I.whatsapp + "Avisar por WhatsApp</a>" +
      '<a class="btn btn--soft btn--block" href="' + ics(cita, r) + '" download="cita-entrena-tu-mente.ics">' + ico("cal") + "Agregar a mi calendario</a>" +
      '<a class="ag-cancel-link" href="' + cancelar + '">¿Necesitas cancelar? Puedes hacerlo aquí</a></div>';
    pintar(html, false, "");
    st.paso = 4;
  }

  /* --- Navegación ---------------------------------------------------------- */
  function siguiente() {
    if (st.paso === 0 && st.servicio) return pasoProfesional();
    if (st.paso === 1) return pasoFecha();
    if (st.paso === 2 && st.hora) return pasoDatos();
    if (st.paso === 3 && valido()) return confirmar();
  }
  function volver() {
    if (st.paso === 3) return pasoHorario();
    if (st.paso === 2) {
      if (st.fecha) { st.fecha = null; st.hora = null; return pasoFecha(); }
      var s = servicio();
      return (PROS.length === 1 && s.modalidades.length === 1) ? pasoServicio() : pasoProfesional();
    }
    if (st.paso === 1) return pasoServicio();
  }
  var foot = document.querySelector("[data-ag-foot] button");
  if (foot) foot.addEventListener("click", siguiente);

  // ?servicio=charla abre directo en ese servicio (desde los botones de la web)
  var pre = params.get("servicio");
  if (pre && A.servicios.some(function (s) { return s.id === pre; })) {
    st.servicio = pre;
    var s0 = servicio();
    if (PROS.length === 1 && s0.modalidades.length === 1) { st.profesional = PROS[0].slug; st.modalidad = s0.modalidades[0]; pasoFecha(); }
    else pasoProfesional();
  } else {
    pasoServicio();
  }
})();
