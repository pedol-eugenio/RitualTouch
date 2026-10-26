/*
  Ritual Touch — comportamenti della pagina.
  Le impostazioni da modificare sono in config.js, non qui.
*/
(function () {
  "use strict";

  var config = window.RITUAL_TOUCH_CONFIG || {};
  var riduciMovimento =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Video: copertina, poi YouTube solo al clic ---------- */

  function estraiIdYoutube(valore) {
    var testo = String(valore || "").trim();
    if (!testo) return "";
    if (/^[A-Za-z0-9_-]{11}$/.test(testo)) return testo;
    var trovato = testo.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
    return trovato ? trovato[1] : "";
  }

  function preparaVideo() {
    var box = document.querySelector("[data-video]");
    if (!box) return;

    if (config.VIDEO_FORMATO === "9:16") box.classList.add("video--verticale");

    var id = estraiIdYoutube(config.YOUTUBE_VIDEO_ID);
    if (config.YOUTUBE_VIDEO_ID && !id) {
      console.warn("Ritual Touch: YOUTUBE_VIDEO_ID non sembra un video YouTube valido.");
    }
    if (!id) return; // resta il riquadro provvisorio

    var provvisorio = box.querySelector("[data-video-provvisorio]");
    var copertina = box.querySelector("[data-video-copertina]");
    if (!provvisorio || !copertina) return;

    provvisorio.hidden = true;
    copertina.hidden = false;

    copertina.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.className = "video__cornice video__iframe";
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(id) +
        "?autoplay=1&rel=0&playsinline=1";
      iframe.title = "Il primo rituale di Ritual Touch";
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      copertina.replaceWith(iframe);
      iframe.focus();
    });
  }

  /* ---------- Modulo Prima Cerchia (Kit) ---------- */

  function leggiFonte() {
    try {
      var valore = new URLSearchParams(window.location.search).get("utm_source") || "";
      valore = valore.toLowerCase().replace(/[^a-z0-9_.-]/g, "").slice(0, 40);
      return valore || "diretto";
    } catch (e) {
      return "diretto";
    }
  }

  var messaggi = {
    nomeVuoto: "Scrivi il tuo nome.",
    emailVuota: "Scrivi la tua email.",
    emailErrata: "Controlla l’indirizzo email: sembra incompleto.",
    cellulareErrato: "Controlla il numero di cellulare.",
    consenso: "Per iscriverti, spunta la casella qui sopra."
  };

  function controllaCampo(campo) {
    var valore = campo.type === "checkbox" ? campo.checked : campo.value.trim();
    switch (campo.id) {
      case "nome":
        return valore ? "" : messaggi.nomeVuoto;
      case "email":
        if (!valore) return messaggi.emailVuota;
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valore) ? "" : messaggi.emailErrata;
      case "cellulare":
        if (!valore) return "";
        return /^\+?\d{6,15}$/.test(valore.replace(/[\s().\-\/]/g, "")) ? "" : messaggi.cellulareErrato;
      case "consenso":
        return valore ? "" : messaggi.consenso;
      default:
        return "";
    }
  }

  function mostraErrore(campo, testo) {
    var errore = document.getElementById("errore-" + campo.id);
    if (!errore) return;
    if (testo) {
      errore.textContent = testo;
      errore.hidden = false;
      campo.setAttribute("aria-invalid", "true");
      campo.setAttribute("aria-describedby", errore.id);
    } else {
      errore.textContent = "";
      errore.hidden = true;
      campo.removeAttribute("aria-invalid");
      campo.removeAttribute("aria-describedby");
    }
  }

  function preparaModulo() {
    var modulo = document.querySelector("[data-modulo]");
    if (!modulo) return;

    var fonte = modulo.querySelector("[data-fonte]");
    if (fonte) fonte.value = leggiFonte();

    // Sul telefono il tasto «Avanti/Invio» porta al campo successivo invece di inviare subito.
    var successivo = { nome: "email", email: "cellulare", cellulare: "consenso" };
    modulo.addEventListener("keydown", function (evento) {
      if (evento.key !== "Enter" || evento.isComposing) return;
      var prossimo = successivo[evento.target.id];
      if (!prossimo) return;
      evento.preventDefault();
      var campo = document.getElementById(prossimo);
      if (campo) campo.focus();
    });

    var pulsante = modulo.querySelector("[data-invia]");
    var stato = modulo.querySelector("[data-stato]");
    var testoPulsante = pulsante ? pulsante.textContent : "";
    var indirizzo = String(config.KIT_FORM_ACTION || "").trim();
    var collegato = /^https:\/\/\S+$/i.test(indirizzo);

    if (indirizzo && !collegato) {
      console.warn("Ritual Touch: KIT_FORM_ACTION deve iniziare con https://");
    }

    if (!collegato) {
      // Modulo non ancora collegato a Kit: pulsante disattivato, nessun invio.
      if (pulsante) pulsante.disabled = true;
      if (stato) stato.hidden = false;
      modulo.addEventListener("submit", function (evento) {
        evento.preventDefault();
      });
      return;
    }

    modulo.action = indirizzo;
    if (pulsante) pulsante.disabled = false;
    if (stato) stato.hidden = true;

    var campi = [].slice.call(modulo.querySelectorAll("#nome, #email, #cellulare, #consenso"));

    campi.forEach(function (campo) {
      var evento = campo.type === "checkbox" ? "change" : "input";
      campo.addEventListener(evento, function () {
        if (campo.getAttribute("aria-invalid") === "true") mostraErrore(campo, controllaCampo(campo));
      });
      if (campo.type !== "checkbox") {
        campo.addEventListener("blur", function () {
          if (campo.value.trim()) mostraErrore(campo, controllaCampo(campo));
        });
      }
    });

    modulo.addEventListener("submit", function (evento) {
      var primoErrato = null;
      campi.forEach(function (campo) {
        var testo = controllaCampo(campo);
        mostraErrore(campo, testo);
        if (testo && !primoErrato) primoErrato = campo;
      });
      if (primoErrato) {
        evento.preventDefault();
        primoErrato.focus();
        return;
      }
      if (pulsante) {
        pulsante.disabled = true;
        pulsante.textContent = "Invio in corso…";
      }
    });

    // Se la persona torna indietro dal browser, il pulsante torna utilizzabile.
    window.addEventListener("pageshow", function () {
      if (pulsante) {
        pulsante.disabled = false;
        pulsante.textContent = testoPulsante;
      }
    });
  }

  /* ---------- Pulsante fisso su smartphone ---------- */

  function preparaPulsanteFisso() {
    var pulsante = document.querySelector("[data-cta-fissa]");
    var video = document.getElementById("video");
    var modulo = document.querySelector("[data-modulo]");
    if (!pulsante || !video || !modulo) return;

    var inAttesa = false;

    // Compare dopo la sezione video, sparisce quando il modulo è sullo schermo.
    function aggiorna() {
      inAttesa = false;
      var altezza = window.innerHeight || document.documentElement.clientHeight;
      var v = video.getBoundingClientRect();
      var m = modulo.getBoundingClientRect();
      var moduloVisibile = m.top < altezza && m.bottom > 0;
      var mostra = v.bottom <= 0 && !moduloVisibile;
      if (mostra === pulsante.classList.contains("visibile")) return;
      pulsante.classList.toggle("visibile", mostra);
      pulsante.setAttribute("aria-hidden", mostra ? "false" : "true");
      pulsante.tabIndex = mostra ? 0 : -1;
    }

    function richiedi() {
      if (inAttesa) return;
      inAttesa = true;
      window.requestAnimationFrame(aggiorna);
    }

    window.addEventListener("scroll", richiedi, { passive: true });
    window.addEventListener("resize", richiedi);
    aggiorna();
  }

  /* ---------- Dissolvenze leggere all'ingresso ---------- */

  function preparaDissolvenze() {
    if (riduciMovimento || !("IntersectionObserver" in window)) return;
    var elementi = [].slice.call(document.querySelectorAll("[data-dissolvenza]"));
    if (!elementi.length) return;

    var altezza = window.innerHeight || document.documentElement.clientHeight;
    elementi.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < altezza && r.bottom > 0) el.classList.add("visibile");
    });
    document.documentElement.classList.add("dissolvenze");

    var osservatore = new IntersectionObserver(
      function (voci) {
        voci.forEach(function (voce) {
          if (voce.isIntersecting) {
            voce.target.classList.add("visibile");
            osservatore.unobserve(voce.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px" }
    );
    elementi.forEach(function (el) {
      if (!el.classList.contains("visibile")) osservatore.observe(el);
    });
  }

  function avvia() {
    preparaVideo();
    preparaModulo();
    preparaPulsanteFisso();
    preparaDissolvenze();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }
})();
