/* Cancelación de citas. Pide confirmación antes de cancelar: así un enlace abierto
   por error (o la vista previa automática de WhatsApp) no cancela la cita sola. */
(function () {
  "use strict";
  var root = document.querySelector("[data-cancelar]");
  if (!root) return;
  var A = window.AGENDA, I = window.ETM.I, esc = window.ETM.esc;
  var q = new URLSearchParams(location.search);
  var cod = (q.get("c") || "").replace(/[^A-Z0-9]/gi, "").toUpperCase();
  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="m8 12.3 2.7 2.7L16.5 9"/></svg>';

  function filas() {
    var f = [["Código", cod]];
    if (q.get("n")) f.push(["Nombre", q.get("n")]);
    if (q.get("s")) f.push(["Servicio", q.get("s")]);
    if (q.get("f")) f.push(["Fecha", q.get("f").split("-").reverse().join("/")]);
    if (q.get("h")) f.push(["Hora", q.get("h") + " hs"]);
    return '<dl class="ag-sum">' + f.map(function (x) { return "<div><dt>" + x[0] + "</dt><dd>" + esc(x[1]) + "</dd></div>"; }).join("") + "</dl>";
  }

  if (!cod) {
    root.innerHTML = '<h1 class="ag-title">Cancelar cita</h1><p class="ag-sub">El enlace no es válido. Usa el enlace del email de confirmación o escríbenos por WhatsApp.</p>' +
      '<a class="btn btn--block" href="agendar.html">Agendar una cita</a>';
    return;
  }

  root.innerHTML = '<h1 class="ag-title">¿Quieres cancelar tu cita?</h1><p class="ag-sub">Revisa los datos antes de confirmar.</p>' + filas() +
    '<div class="ag-done-actions"><button class="btn btn--block" type="button" data-ok>Sí, cancelar mi cita</button>' +
    '<a class="btn btn--soft btn--block" href="index.html">No, mantener la cita</a></div>';

  root.querySelector("[data-ok]").addEventListener("click", function () {
    var b = this; b.disabled = true; b.textContent = "Cancelando…";
    var hecho = !A.api ? Promise.resolve({ demo: true })
      : fetch(A.api + "/cancelar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codigo: cod }) })
          .then(function (r) { if (!r.ok) throw new Error("cancelar"); return r.json(); });
    hecho.then(function (res) {
      root.innerHTML = '<div class="ag-done"><span class="ag-done-ico">' + check + "</span><h1 class=\"ag-title\">Cita cancelada</h1>" +
        '<p class="ag-sub">' + (res.demo ? "<b>Modo demostración:</b> no había ninguna cita guardada. " : "") + "Puedes agendar de nuevo cuando quieras.</p></div>" + filas() +
        '<div class="ag-done-actions"><a class="btn btn--block" href="agendar.html">Agendar nuevamente</a></div>';
    }).catch(function () {
      b.disabled = false; b.textContent = "Sí, cancelar mi cita";
      root.insertAdjacentHTML("beforeend", '<p class="ag-error">No pudimos cancelar la cita. Inténtalo de nuevo o avísanos por WhatsApp.</p>');
    });
  });
})();
