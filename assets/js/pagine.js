/*
  Pagine Privacy e Cookie: «Torna alla pagina» riporta indietro di un passo
  quando si arriva dal sito, così il modulo ritrova quello che era stato scritto.
*/
(function () {
  "use strict";
  var link = document.querySelector("[data-torna]");
  if (!link) return;
  link.addEventListener("click", function (evento) {
    try {
      var provenienza = document.referrer ? new URL(document.referrer) : null;
      if (provenienza && provenienza.origin === window.location.origin && window.history.length > 1) {
        evento.preventDefault();
        window.history.back();
      }
    } catch (e) {
      /* in caso di dubbio il link apre semplicemente la pagina principale */
    }
  });
})();
