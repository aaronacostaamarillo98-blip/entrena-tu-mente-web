/* Entrena tu mente · comportamiento común a todas las páginas.
   El encabezado, el pie y los enlaces de WhatsApp ya vienen escritos en el HTML;
   este archivo los mejora (menú móvil, apariciones al bajar) y arma las tarjetas
   del equipo y la página de perfil a partir de data/profesionales.js. */
(function () {
  "use strict";

  var ROOT = document.body.getAttribute("data-root") || "";
  var SITIO = window.SITIO || {};
  var PROS = window.PROFESIONALES || [];

  function safe(nombre, fn) {
    try { fn(); } catch (e) { if (window.console) console.warn("[" + nombre + "]", e); }
  }

  /* --- Utilidades -------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function wa(numero, mensaje) {
    return "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje);
  }
  // Enlace de contacto: el de WhatsApp Business si existe; si no, número + mensaje
  function contacto(p) { return p.whatsappLink || wa(p.whatsapp, p.mensajeWhatsapp); }
  function contactoSitio(mensaje) { return SITIO.whatsappLink || wa(SITIO.whatsapp, mensaje || SITIO.mensajeWhatsapp); }
  function iniciales(nombre) {
    return nombre.replace(/^(Lic\.|Dra?\.|Mg\.)\s*/i, "").split(/\s+/).slice(0, 2)
      .map(function (p) { return p.charAt(0); }).join("").toUpperCase();
  }
  // Botón «Agendar»: a la agenda en línea si está activa; si no, a WhatsApp
  var AGENDA_ON = SITIO.agendaEnLinea === true;
  function btnAgendar(clase, texto, waHref) {
    return AGENDA_ON
      ? '<a class="' + clase + '" href="' + ROOT + 'agendar.html?servicio=charla">' + texto + "</a>"
      : '<a class="' + clase + '" href="' + waHref + '" target="_blank" rel="noopener">' + I.whatsapp + texto + "</a>";
  }
  function perfilUrl(p) { return ROOT + "profesionales/" + p.slug + ".html"; }
  function list(items, cls) {
    return items.map(function (t) { return '<li class="' + (cls || "") + '">' + esc(t) + "</li>"; }).join("");
  }

  var I = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.25"/><path d="m8.5 12.25 2.4 2.4 4.6-5.1"/></svg>',
    verified: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.75 14.6 3.6l3.17-.07.98 3.02 2.56 1.87-.99 3.02.99 3.02-2.56 1.87-.98 3.02-3.17-.07L12 22.25 9.4 20.4l-3.17.07-.98-3.02-2.56-1.87.99-3.02-.99-3.02 2.56-1.87.98-3.02 3.17.07z"/><path d="m8.4 12.2 2.4 2.4 4.8-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    screen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    lang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    quote: '<svg class="q" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.6 6C6.5 7.3 4.5 10 4.5 13.6V18h5.6v-5.4H7.5c.1-2 1.2-3.6 3-4.5zm9 0c-3.1 1.3-5.1 4-5.1 7.6V18h5.6v-5.4h-2.6c.1-2 1.2-3.6 3-4.5z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>'
  };

  function foto(p, opts) {
    opts = opts || {};
    var style = p.fotoEncuadre ? ' style="--foto-pos:' + esc(p.fotoEncuadre) + '"' : "";
    var img = p.foto
      ? '<img src="' + esc(ROOT + p.foto) + '" alt="Foto de ' + esc(p.nombre) + '" width="800" height="1000" decoding="async"' +
        (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' onerror="this.remove()">'
      : "";
    var hover = opts.hover
      ? '<span class="pro-hover" aria-hidden="true"><p>' + esc(p.frase) + "</p><span>Ver perfil completo" + I.arrow + "</span></span>"
      : "";
    var tag = opts.href ? 'a href="' + opts.href + '" aria-label="Ver el perfil de ' + esc(p.nombre) + '"' : "div";
    return "<" + tag + ' class="pro-photo"' + style + '><span class="ini" aria-hidden="true">' + esc(iniciales(p.nombre)) + "</span>" + img + hover + "</" + tag.split(" ")[0] + ">";
  }
  function badge(p) {
    return p.verificada ? '<span class="badge-verified">' + I.verified + "Perfil verificado</span>" : "";
  }

  /* --- Tarjetas del equipo (foto grande) --------------------------------- */
  function tarjeta(p, destacada) {
    var url = perfilUrl(p);
    return '<article class="pro-card glass reveal' + (destacada ? " is-featured" : "") + '">' +
      foto(p, { href: url, hover: !destacada, eager: destacada }) +
      '<div class="pro-body">' +
      '<h3><a href="' + url + '">' + esc(p.nombre) + "</a></h3>" +
      '<p class="pro-title">' + esc(p.titulo) + "</p>" + badge(p) +
      '<p class="pro-quote">' + esc(p.frase) + "</p>" +
      '<ul class="chips">' + list(p.areas.slice(0, 4), "chip") + "</ul>" +
      '<p class="pro-meta">' + I.screen + esc(p.modalidad.join(" · ")) + "</p>" +
      '<div class="pro-actions">' +
      btnAgendar("btn", "Agendar charla gratis", contacto(p)) +
      '<a class="link-arrow" href="' + url + '">Ver perfil completo' + I.arrow + "</a></div>" +
      "</div></article>";
  }

  function renderTarjetas(el) {
    if (!el) return;
    var single = PROS.length === 1;
    el.innerHTML = PROS.map(function (p) { return tarjeta(p, single); }).join("");
    el.classList.toggle("is-single", single);
    observar(el.querySelectorAll(".reveal"));
    var ctrl = document.querySelector('[data-carousel-for="' + el.id + '"]');
    if (!ctrl || single) return;
    var prev = ctrl.querySelector("[data-prev]");
    var next = ctrl.querySelector("[data-next]");
    function update() {
      ctrl.classList.toggle("is-active", el.scrollWidth - el.clientWidth > 4);
      prev.disabled = el.scrollLeft < 4;
      next.disabled = el.scrollLeft > el.scrollWidth - el.clientWidth - 4;
    }
    function step(dir) {
      var card = el.querySelector(".pro-card");
      el.scrollBy({ left: dir * (card ? card.offsetWidth + 24 : el.clientWidth), behavior: "smooth" });
    }
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* --- Aparición al bajar ------------------------------------------------- */
  var io = null;
  function observar(nodos) {
    if (!nodos || !nodos.length) return;
    if (!io) {
      [].forEach.call(nodos, function (n) { n.classList.add("is-in"); });
      return;
    }
    var alto = window.innerHeight || 800;
    [].forEach.call(nodos, function (n) {
      // lo que ya está en pantalla se muestra al instante
      if (n.getBoundingClientRect().top < alto) n.classList.add("is-in");
      else io.observe(n);
    });
  }

  window.ETM = { esc: esc, wa: wa, contactoSitio: contactoSitio, I: I, renderTarjetas: renderTarjetas };

  /* --- Inicio ------------------------------------------------------------- */
  safe("reveal", function () {
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });
    }
    observar(document.querySelectorAll(".reveal"));
    // Red de seguridad: pase lo que pase, a los 6 s todo queda visible
    setTimeout(function () {
      [].forEach.call(document.querySelectorAll(".reveal:not(.is-in)"), function (n) { n.classList.add("is-in"); });
    }, 6000);
  });

  safe("header", function () {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var toggle = header.querySelector(".menu-toggle");
    var mobile = header.querySelector(".mobile-nav");
    function setMenu(open) {
      mobile.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      toggle.innerHTML = open ? I.close : I.menu;
    }
    if (toggle && mobile) {
      toggle.addEventListener("click", function () { setMenu(!mobile.classList.contains("is-open")); });
      mobile.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    }
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });

  safe("whatsapp", function () {
    if (!SITIO.whatsapp && !SITIO.whatsappLink) return;
    var link = contactoSitio();
    [].forEach.call(document.querySelectorAll("[data-wa-sitio]"), function (a) { a.href = link; });
  });

  safe("equipo", function () {
    [].forEach.call(document.querySelectorAll("[data-equipo]"), renderTarjetas);
    // Con una sola profesional, el título habla de ella y no de «un equipo»
    var pros = window.PROFESIONALES || [];
    if (pros.length === 1) {
      var h = document.getElementById("equipo-titulo");
      var eb = document.querySelector("[data-equipo-eyebrow]");
      var bj = document.querySelector("[data-equipo-bajada]");
      if (h) h.textContent = "Conoce a quién te acompaña";
      if (eb) eb.textContent = "Tu psicóloga";
      if (bj) bj.textContent = "Conoce su enfoque y cómo trabaja antes de dar el primer paso.";
    }
  });

  /* --- WhatsApp flotante: se corre cuando tapa un botón ------------------- */
  safe("waFloat", function () {
    var fl = document.querySelector(".wa-float");
    if (!fl) return;
    var pend = false;
    function chequear() {
      pend = false;
      var r = fl.getBoundingClientRect(), tapa = false;
      [].forEach.call(document.querySelectorAll("main .btn, main [data-start], main button, main summary .faq-chev"), function (b) {
        if (tapa) return;
        var q = b.getBoundingClientRect();
        if (q.width && q.right > r.left - 8 && q.left < r.right + 8 && q.bottom > r.top - 8 && q.top < r.bottom + 8) tapa = true;
      });
      fl.classList.toggle("is-tucked", tapa);
    }
    function pedir() { if (!pend) { pend = true; requestAnimationFrame(chequear); } }
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    setTimeout(chequear, 400);
  });

  /* --- Testimonios (la sección se oculta si no hay) ---------------------- */
  safe("testimonios", function () {
    var sec = document.getElementById("testimonios");
    var cont = document.querySelector("[data-testimonios]");
    if (!sec || !cont) return;
    // Los de ejemplo se ven solo en la vista previa y en local: nunca en el dominio definitivo
    var vistaPrevia = /^(localhost|127\.0\.0\.1)$|entrena-tu-mente-preview\.pages\.dev$/.test(location.hostname);
    var lista = (window.TESTIMONIOS || []).filter(function (t) { return !t.ejemplo || vistaPrevia; });
    var demo = /[?&]demo=testimonios/.test(location.search);
    if (!lista.length && demo) {
      // Vista previa local con textos de ejemplo claramente marcados: nunca se publica así
      lista = [1, 2, 3, 4].map(function (n) {
        return { texto: "Texto de ejemplo para ver el diseño. Aquí va el testimonio real número " + n + ", con autorización del paciente.", nombre: "Ejemplo " + n, detalle: "Reemplazar por un testimonio real", ejemplo: true };
      });
    }
    if (!lista.length) return;
    cont.innerHTML = lista.map(function (t) {
      return '<figure class="testimonial glass reveal' + (t.ejemplo ? " is-demo" : "") + '">' + I.quote +
        "<blockquote>" + esc(t.texto) + "</blockquote>" +
        "<figcaption><b>" + esc(t.nombre) + "</b>" + (t.detalle ? "<span>" + esc(t.detalle) + "</span>" : "") +
        "</figcaption></figure>";
    }).join("");
    sec.hidden = false;
    observar(cont.querySelectorAll(".reveal"));
  });

  /* --- Página de perfil --------------------------------------------------- */
  safe("perfil", function () {
    var perfil = document.querySelector("[data-perfil]");
    if (!perfil) return;
    var p = PROS.filter(function (x) { return x.slug === perfil.getAttribute("data-perfil"); })[0];
    if (!p) return; // queda el contenido escrito en el HTML
    var waP = contacto(p);
    var fab = document.querySelector(".wa-float");
    if (fab) fab.href = waP;

    // «Sobre mí» con la última oración destacada
    var oraciones = p.sobreMi.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/);
    var ultima = oraciones.length > 1 ? oraciones.pop() : "";
    var sobreMi = '<p class="lead">' + esc(oraciones.join(" ")) + "</p>" + (ultima ? '<p class="highlight">' + esc(ultima) + "</p>" : "");

    var lugares = p.consultorios.map(function (c) {
      var zona = [c.barrio, c.ciudad].filter(Boolean).join(", ");
      return '<div class="place"><span class="ico">' + I.pin + "</span><strong>" + esc(c.lugar) + "</strong><span>" + esc(zona) + "</span>" +
        '<a class="btn btn--oceano" href="' + esc(c.mapa) + '" target="_blank" rel="noopener">Ver ubicación' + I.arrow + "</a></div>";
    }).join("");

    var facts =
      '<div class="facts">' +
      '<p class="fact">' + I.clock + "<span><b>Horario:</b> " + esc(p.horario) + "</span></p>" +
      '<p class="fact">' + I.screen + "<span><b>Modalidad:</b> " + esc(p.modalidad.join(" y ")) + "</span></p>" +
      '<p class="fact">' + I.lang + "<span><b>Idioma:</b> " + esc(p.idiomas.join(", ")) + "</span></p></div>";

    perfil.innerHTML =
      '<section class="profile-hero"><div class="container"><div class="profile-card glass">' +
      foto(p, { eager: true }) +
      '<div class="profile-info">' +
      '<nav class="breadcrumb" aria-label="Ruta"><a href="' + ROOT + 'index.html#equipo">Nuestro equipo</a> / ' + esc(p.nombre) + "</nav>" +
      "<h1>" + esc(p.nombre) + "</h1>" +
      '<p class="pro-title">' + esc(p.titulo) + "</p>" +
      '<div class="meta-row">' + badge(p) + p.estilo.map(function (e) { return '<span class="chip">' + esc(e) + "</span>"; }).join("") + "</div>" +
      '<p class="profile-quote">' + esc(p.frase) + "</p>" +
      '<div class="btn-row">' + btnAgendar("btn btn--xl", "Agendar charla gratis", waP) +
      (AGENDA_ON ? '<a class="btn btn--soft btn--xl" href="' + waP + '" target="_blank" rel="noopener">' + I.whatsapp + "WhatsApp</a>" : "") + "</div>" +
      "</div></div></div></section>" +

      '<div class="container"><div class="profile-layout"><div class="profile-main">' +
      '<section class="block glass reveal"><h2>Sobre mí</h2>' + sobreMi + "</section>" +
      '<section class="block glass reveal"><h2>Cómo trabajo</h2><p class="lead">' + esc(p.enfoque) + "</p>" +
      '<p class="sub-label">Temas que trabajo</p><ul class="chips">' + list(p.areas, "chip") + "</ul>" +
      '<p class="sub-label">A quién acompaño</p><p class="atiende">' + esc(p.atiende.join(" · ")) + "</p></section>" +
      '<section class="block glass reveal"><h2>La primera sesión</h2><p class="lead">' + esc(p.primeraSesion) + "</p></section>" +
      '<section class="message-card reveal">' + I.quote + "<p>" + esc(p.mensaje) + "</p>" + I.quote.replace('class="q"', 'class="q q--cierre"') + '<p class="sign">— ' + esc(p.nombre) + "</p></section>" +
      // El horario va en la tarjeta lateral; en el celular (sin tarjeta) se muestra aquí
      '<section class="block glass reveal"><h2>Dónde atiendo</h2><div class="places">' + lugares + "</div>" + facts.replace('class="facts"', 'class="facts facts--movil"') + "</section>" +
      '<p class="note glass reveal">' + I.info + "<span>" + esc(p.derivacion) + "</span></p>" +
      '<section class="block glass final-cta reveal"><h2>Honorarios</h2><p>Consulta honorarios y modalidades por WhatsApp.</p>' +
      btnAgendar("btn btn--xl", "Agendar charla gratis de 15 min", waP) +
      (AGENDA_ON ? '<p class="final-alt"><a href="' + waP + '" target="_blank" rel="noopener">o escríbele por WhatsApp</a></p>' : "") + "</section>" +
      "</div>" +

      '<aside class="profile-aside" aria-label="Agendar"><div class="aside-card glass">' +
      '<h3>Charla gratis de 15 minutos</h3><p>Por WhatsApp y sin compromiso: un primer contacto para conocernos y resolver tus dudas.</p>' +
      facts +
      (AGENDA_ON
        ? '<a class="btn btn--block" href="' + ROOT + 'agendar.html">Agendar en línea</a>' +
          '<a class="btn btn--soft btn--block aside-wa" href="' + waP + '" target="_blank" rel="noopener">' + I.whatsapp + "Escribir por WhatsApp</a>"
        : '<a class="btn btn--block" href="' + waP + '" target="_blank" rel="noopener">' + I.whatsapp + "Agendar por WhatsApp</a>") +
      (p.qr ? '<div class="qr-box"><img src="' + esc(ROOT + p.qr) + '" alt="Código QR para escribirle a ' + esc(p.nombre) + ' por WhatsApp" width="132" height="132" loading="lazy">' +
        "<p><b>¿Estás en la computadora?</b> Escanea el código con la cámara de tu celular para escribirle por WhatsApp.</p></div>" : "") +
      "</div></aside>" +
      "</div></div>";

    observar(perfil.querySelectorAll(".reveal"));
  });
})();
