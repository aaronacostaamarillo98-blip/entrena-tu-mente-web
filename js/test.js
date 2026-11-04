/* Tests de Entrena tu mente: motor reutilizable + lista desplegable del inicio.
   Lee window.TESTS (data/tests.js). Las respuestas viven solo en memoria:
   no se guardan ni se envían a ningún lado. */
(function () {
  "use strict";

  var ETM = window.ETM;
  var TESTS = window.TESTS || {};
  var ORDEN = window.TESTS_ORDEN || Object.keys(TESTS);
  var ROOT = document.body.getAttribute("data-root") || "";
  var I = ETM.I;
  var esc = ETM.esc;
  var agendaOn = (window.SITIO || {}).agendaEnLinea === true;

  function safe(nombre, fn) {
    try { fn(); } catch (e) { if (window.console) console.warn("[" + nombre + "]", e); }
  }
  // Eventos de medición (solo si el Pixel está activo). Nunca se envían respuestas ni puntajes.
  function medir(evento, test) {
    try { if (window.fbq) window.fbq("trackCustom", evento, { test: test.slug }); } catch (e) { /* sin medición */ }
  }

  /* --- Cálculo ----------------------------------------------------------- */
  function opcionesDe(test, i) {
    var q = test.preguntas[i];
    return (q && typeof q === "object" && q.opciones) || test.opciones;
  }
  function textoDe(test, i) {
    var q = test.preguntas[i];
    return typeof q === "object" ? q.texto : q;
  }
  function valorFinal(test, i, valor) {
    if ((test.invertidas || []).indexOf(i + 1) === -1) return valor;
    var vals = opcionesDe(test, i).map(function (o) { return o.valor; });
    return Math.max.apply(null, vals) + Math.min.apply(null, vals) - valor;
  }
  function rangoTotal(test) {
    var min = 0, max = 0;
    test.preguntas.forEach(function (_, i) {
      var vals = opcionesDe(test, i).map(function (o) { return o.valor; });
      min += Math.min.apply(null, vals); max += Math.max.apply(null, vals);
    });
    return { min: min, max: max };
  }
  function nivelPara(test, puntaje) {
    for (var i = 0; i < test.rangos.length; i++) {
      var r = test.rangos[i];
      if (puntaje >= r.min && puntaje <= r.max) return r;
    }
    return null;
  }
  function puntuar(test, respuestas) {
    return respuestas.reduce(function (a, v, i) { return a + valorFinal(test, i, v); }, 0);
  }

  var ICONOS = {
    ansiedad: '<path d="M3 12h3l2-6 4 12 2-6h7"/>',
    estres: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    autoestima: '<path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.4 3.6 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 16.4 12 21 12 21z"/>',
    pareja: '<circle cx="9" cy="8" r="3.2"/><circle cx="16.5" cy="9.5" r="2.6"/><path d="M3.5 20c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5M14.6 14.7c.6-.2 1.2-.3 1.9-.3 2.3 0 4.1 1.7 4.5 4.6"/>',
    familia: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>',
    atencion: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    incertidumbre: '<path d="M9.2 9a3 3 0 1 1 4.2 2.8c-.9.4-1.4 1.1-1.4 2.1v.6"/><circle cx="12" cy="18" r=".9" fill="currentColor"/><circle cx="12" cy="12" r="9.5"/>'
  };
  function icono(nombre) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONOS[nombre] || ICONOS.atencion) + "</svg>";
  }
  var icoAlert = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/></svg>';
  var icoLock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';

  // «Haz otro test»: sugerencias relacionadas para seguir en el recorrido
  function otrosTests(test) {
    var rel = (test.relacionados || []).filter(function (k) { return TESTS[k]; });
    if (!rel.length) return "";
    var enInicio = !!document.querySelector("[data-tests]");
    var enPaginaTest = !!document.body.getAttribute("data-test");
    return '<div class="next-tests"><p>¿Quieres conocerte un poco más?</p><div class="next-tests-row">' +
      rel.map(function (k) {
        var t = TESTS[k];
        var href = enInicio ? "#test-" + t.slug : enPaginaTest ? ROOT + "tests/" + t.slug + ".html" : ROOT + "index.html#test-" + t.slug;
        return '<a class="next-test" href="' + href + '"><span class="test-ico">' + icono(t.icono) + "</span>" +
          "<span><b>" + esc(t.titulo) + "</b><small>" + esc(t.meta) + "</small></span></a>";
      }).join("") + "</div></div>";
  }

  /* --- Componente: un test dentro de un contenedor ------------------------ */
  function montarTest(root, test, opts) {
    opts = opts || {};
    var total = test.preguntas.length;
    var rt = rangoTotal(test);
    var respuestas = [];
    var actual = 0;
    var iniciado = false;

    function mostrar(html, foco) {
      root.innerHTML = '<div class="screen-enter">' + html + "</div>";
      var el = root.querySelector(foco || "[data-foco]");
      if (el && opts.enfocar !== false) { el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); }
      var top = root.getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    }

    function intro() {
      var aviso = test.aviso ? '<p class="disclaimer">' + I.info + "<span>" + esc(test.aviso) + "</span></p>" : "";
      mostrar(
        (opts.conTitulo ? '<h1 data-foco>' + esc(test.nombreLargo) + "</h1>" : '<p class="test-gancho" data-foco>' + esc(test.gancho) + "</p>") +
        '<p class="test-sub">' + esc(test.meta) + " · resultado al instante</p>" +
        '<div class="test-info">' +
        '<p class="disclaimer">' + icoLock + "<span>Para mayores de 18 años. Tus respuestas no se guardan.</span></p>" + aviso + "</div>" +
        '<div class="test-start-row"><button class="btn btn--start" type="button" data-start>Empezar el test' + I.arrow + "</button>" +
        (opts.enlacePagina ? '<a class="link-arrow" href="' + ROOT + "tests/" + test.slug + '.html">Más sobre este test' + I.arrow + "</a>" : "") + "</div>",
        opts.enfocar === false ? "none" : null
      );
      opts.enfocar = true;
      root.querySelector("[data-start]").addEventListener("click", function () {
        if (!iniciado) { iniciado = true; medir("TestIniciado", test); }
        actual = 0; pregunta();
      });
    }

    function pregunta() {
      var ultima = actual === total - 1;
      var elegida = respuestas[actual];
      var ops = opcionesDe(test, actual);
      var opciones = ops.map(function (o, i) {
        return '<button class="option" type="button" role="radio" aria-checked="' + (elegida === o.valor) + '" data-i="' + i + '">' +
          '<span class="dot" aria-hidden="true"></span>' + esc(o.texto) + "</button>";
      }).join("");
      var qid = "q-" + test.slug;

      mostrar(
        '<div class="test-progress"><span>Pregunta ' + (actual + 1) + " de " + total + "</span><span>" + Math.round((actual / total) * 100) + "%</span></div>" +
        '<div class="progress" role="progressbar" aria-label="Progreso del test" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + actual + '"><i style="width:' + (actual / total) * 100 + '%"></i></div>' +
        '<p class="test-prompt">' + esc(test.consigna) + "</p>" +
        '<h3 class="test-question" id="' + qid + '" data-foco>' + esc(textoDe(test, actual)) + "</h3>" +
        '<div class="options" role="radiogroup" aria-labelledby="' + qid + '">' + opciones + "</div>" +
        '<div class="test-nav">' +
        '<button class="btn-back" type="button" data-back' + (actual === 0 ? " hidden" : "") + ">" + I.left + "Anterior</button>" +
        (ultima ? '<button class="btn" type="button" data-result' + (elegida == null ? " disabled" : "") + ">Ver mi resultado" + I.arrow + "</button>" : "") +
        "</div>"
      );

      var botones = root.querySelectorAll(".option");
      [].forEach.call(botones, function (b) {
        b.addEventListener("click", function () {
          respuestas[actual] = ops[+b.getAttribute("data-i")].valor;
          [].forEach.call(botones, function (x) { x.setAttribute("aria-checked", String(x === b)); });
          if (ultima) {
            var r = root.querySelector("[data-result]");
            r.disabled = false; r.focus();
          } else {
            setTimeout(function () { actual++; pregunta(); }, 260);
          }
        });
        b.addEventListener("keydown", function (e) {
          var i = +b.getAttribute("data-i");
          var to = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
          if (to == null) return;
          e.preventDefault();
          botones[(to + botones.length) % botones.length].focus();
        });
      });
      root.querySelector("[data-back]").addEventListener("click", function () { actual--; pregunta(); });
      var verRes = root.querySelector("[data-result]");
      if (verRes) verRes.addEventListener("click", resultado);
    }

    function resultado() {
      var puntaje = puntuar(test, respuestas);
      var r = nivelPara(test, puntaje);
      var link = ETM.contactoSitio(test.mensajeWhatsapp);
      var pin = Math.max(0, Math.min(100, ((puntaje - rt.min) / (rt.max - rt.min)) * 100));
      var cols = test.rangos.map(function (x) { return (x.max - x.min + 1) + "fr"; }).join(" ");
      medir("TestCompletado", test);

      mostrar(
        '<div class="result-head"><span class="result-level" data-tono="' + r.tono + '">' + esc(r.nivel) + "</span>" +
        '<p class="sr-only" data-foco>Tu resultado: ' + esc(r.nivel) + "</p>" +
        '<p class="result-score" aria-label="Puntaje ' + puntaje + " de " + rt.max + '">' + puntaje + "<small> / " + rt.max + "</small></p></div>" +
        '<div class="meter" aria-hidden="true"><div class="meter-track" style="grid-template-columns:' + cols + '">' +
        test.rangos.map(function (x) { return '<span data-tono="' + x.tono + '"></span>'; }).join("") + "</div>" +
        '<span class="meter-pin" style="left:0%"></span></div>' +
        '<p class="result-text">' + esc(r.texto) + "</p>" +
        // Sin agenda en línea, el botón principal va directo a WhatsApp
        '<div class="result-cta">' + (agendaOn
          ? '<a class="btn' + (r.destacado ? " btn--xl" : "") + '" data-contacto href="' + ROOT + 'agendar.html?servicio=charla">' + esc(r.boton) + I.arrow + "</a>"
          : '<a class="btn' + (r.destacado ? " btn--xl" : "") + '" data-contacto href="' + link + '" target="_blank" rel="noopener">' + I.whatsapp + esc(r.boton) + "</a>") +
        '<div class="result-alt' + (agendaOn ? "" : " result-alt--uno") + '">' +
        (agendaOn ? '<a class="btn btn--soft result-alt-btn result-alt-wa" href="' + link + '" target="_blank" rel="noopener">' + I.whatsapp + "WhatsApp</a>" : "") +
        '<a class="btn btn--soft result-alt-btn" href="' + ROOT + 'profesionales/sonia-davalos.html">Conoce a Sonia' + I.arrow + "</a></div></div>" +
        '<div class="disclaimers">' +
        '<p class="disclaimer">' + I.info + "<span>Este test es orientativo y no es un diagnóstico.</span></p>" +
        // El aviso del 911 vive en el pie de todas las páginas; en el resultado solo aparece si el nivel es alto
        (r.tono === "alto" ? '<p class="disclaimer disclaimer--alert">' + icoAlert + '<span>Si sientes que estás en peligro, llama al <a href="tel:911">911</a>.</span></p>' : "") + "</div>" +
        otrosTests(test) +
        '<div class="result-foot"><button class="btn-retake" type="button" data-retake>Volver a hacer el test</button>' +
        '<p class="test-source">' + esc(test.fuente) + "</p></div>"
      );
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { var p = root.querySelector(".meter-pin"); if (p) p.style.left = pin + "%"; });
      });
      root.querySelector("[data-contacto]").addEventListener("click", function () { medir("ContactoDesdeTest", test); });
      root.querySelector("[data-retake]").addEventListener("click", function () { respuestas = []; actual = 0; pregunta(); });
      if (opts.alTerminar) opts.alTerminar();
    }

    if (opts.enfocar === undefined) opts.enfocar = false;
    intro();
  }

  window.TestEngine = { nivelPara: nivelPara, puntuar: puntuar, rangoTotal: rangoTotal, montarTest: montarTest };

  /* --- Lista desplegable del inicio -------------------------------------- */
  safe("lista-tests", function () {
    var lista = document.querySelector("[data-tests]");
    if (!lista) return;
    lista.innerHTML = ORDEN.filter(function (k) { return TESTS[k]; }).map(function (k) {
      var t = TESTS[k];
      return '<li class="test-item" id="test-' + t.slug + '">' +
        '<h3 class="test-head"><button type="button" aria-expanded="false" aria-controls="panel-' + t.slug + '" data-abrir="' + k + '">' +
        '<span class="test-ico">' + icono(t.icono) + "</span>" +
        '<span class="test-name"><b>' + esc(t.titulo) + "</b><small>" + esc(t.meta) + "</small></span>" +
        '<span class="test-plus" aria-hidden="true"></span></button></h3>' +
        '<div class="test-panel" id="panel-' + t.slug + '" role="region" aria-label="' + esc(t.nombreLargo) + '"><div class="test-panel-inner"><div class="test-body" data-body></div></div></div>' +
        "</li>";
    }).join("");

    function abrir(item, desplazar) {
      var abierto = item.classList.contains("is-open");
      [].forEach.call(lista.querySelectorAll(".test-item.is-open"), function (o) {
        o.classList.remove("is-open");
        o.querySelector("[data-abrir]").setAttribute("aria-expanded", "false");
      });
      if (abierto) return;
      var key = item.querySelector("[data-abrir]").getAttribute("data-abrir");
      var body = item.querySelector("[data-body]");
      if (!body.hasChildNodes()) montarTest(body, TESTS[key], { enfocar: false, enlacePagina: true });
      item.classList.add("is-open");
      item.querySelector("[data-abrir]").setAttribute("aria-expanded", "true");
      if (desplazar) setTimeout(function () { item.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
    }

    lista.addEventListener("click", function (e) {
      var sig = e.target.closest(".next-test");
      if (sig) {
        var destino = document.getElementById(sig.getAttribute("href").slice(1));
        if (destino) {
          e.preventDefault();
          if (history.replaceState) history.replaceState(null, "", "#" + destino.id);
          if (!destino.classList.contains("is-open")) abrir(destino, true);
          return;
        }
      }
      var b = e.target.closest("[data-abrir]");
      if (b) abrir(b.closest(".test-item"), false);
    });

    // Enlace directo desde los videos: index.html#test-autoestima abre ese test
    function desdeHash() {
      var m = /^#test-([a-z]+)$/.exec(location.hash);
      if (!m) return;
      var item = document.getElementById("test-" + m[1]);
      if (item && !item.classList.contains("is-open")) abrir(item, true);
    }
    window.addEventListener("hashchange", desdeHash);
    desdeHash();
  });

  /* --- Página individual de un test (tests/<slug>.html) ------------------- */
  safe("pagina-test", function () {
    var root = document.querySelector("[data-test-root]");
    var key = document.body.getAttribute("data-test");
    if (!root || !TESTS[key]) return;
    montarTest(root, TESTS[key], { enfocar: false });
  });
})();
