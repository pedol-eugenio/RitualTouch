/*
  Ritual Touch — comportamenti della pagina principale.
  Le impostazioni da modificare sono in config.js, non qui.
*/
(function () {
  "use strict";

  var config = window.RITUAL_TOUCH_CONFIG || {};
  var riduciMovimento =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scorriA(elemento) {
    elemento.scrollIntoView({ behavior: riduciMovimento ? "auto" : "smooth", block: "start" });
  }

  /* ---------- Video: copertina, poi YouTube solo al clic ---------- */

  function estraiIdYoutube(valore) {
    var testo = String(valore || "").trim();
    if (!testo) return "";
    if (/^[A-Za-z0-9_-]{11}$/.test(testo)) return testo;
    var trovato = testo.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
    return trovato ? trovato[1] : "";
  }

  function testoEtichetta(conVideo) {
    if (!conVideo) return "In arrivo";
    var minuti = parseInt(config.VIDEO_DURATA_MINUTI, 10);
    if (minuti > 0) return "Rituale gratuito · " + minuti + (minuti === 1 ? " minuto" : " minuti");
    return "Rituale gratuito";
  }

  // Alla fine del video la pagina scorre alla sezione «Resta ancora un momento».
  // L'interfaccia di YouTube si carica solo dopo il clic su play.
  function collegaFineVideo(iframe) {
    var sezione = document.getElementById("resta");
    if (!sezione) return;
    function collega() {
      try {
        new window.YT.Player(iframe, {
          events: {
            onStateChange: function (evento) {
              if (evento.data === 0) scorriA(sezione); // 0 = video finito
            }
          }
        });
      } catch (e) {
        /* se non riesce, il video funziona comunque */
      }
    }
    if (window.YT && window.YT.Player) {
      collega();
      return;
    }
    var precedente = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof precedente === "function") precedente();
      collega();
    };
    var script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  }

  function preparaVideo() {
    var box = document.querySelector("[data-video]");
    if (!box) return;

    var id = estraiIdYoutube(config.YOUTUBE_VIDEO_ID);
    if (config.YOUTUBE_VIDEO_ID && !id) {
      console.warn("Ritual Touch: YOUTUBE_VIDEO_ID non sembra un video YouTube valido.");
      document.documentElement.classList.remove("con-video");
      document.documentElement.classList.add("senza-video");
    }
    var titolo = String(config.VIDEO_TITOLO || "").trim() || "Un momento per te";

    [].forEach.call(document.querySelectorAll("[data-video-etichetta]"), function (el) {
      el.textContent = testoEtichetta(Boolean(id));
    });
    var campoTitolo = box.querySelector("[data-video-titolo]");
    if (campoTitolo) campoTitolo.textContent = titolo;

    if (!id) return; // niente video: copertina con «IN ARRIVO», nessun pulsante play

    var play = box.querySelector("[data-video-play]");
    if (!play) return;
    play.hidden = false;

    play.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.className = "video__iframe";
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(id) +
        "?autoplay=1&playsinline=1&rel=0&enablejsapi=1&origin=" +
        encodeURIComponent(window.location.origin);
      iframe.title = titolo;
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      play.hidden = true;
      box.appendChild(iframe);
      iframe.focus();
      collegaFineVideo(iframe);
    });
  }

  /* ---------- Modulo d'iscrizione (Kit) ---------- */

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
    nome: "Scrivi il tuo nome.",
    email: "Controlla l’indirizzo email.",
    cellulare: "Controlla il numero di cellulare.",
    consenso: "Per continuare, spunta la casella."
  };

  function controllaCampo(campo) {
    var valore = campo.type === "checkbox" ? campo.checked : campo.value.trim();
    switch (campo.id) {
      case "nome":
        return valore ? "" : messaggi.nome;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valore) ? "" : messaggi.email;
      case "cellulare":
        if (!valore) return "";
        return /^\+?\d{6,15}$/.test(valore.replace(/[\s().\-\/]/g, "")) ? "" : messaggi.cellulare;
      case "consenso":
        return valore ? "" : messaggi.consenso;
      default:
        return "";
    }
  }

  function mostraErrore(campo, testo) {
    var errore = document.getElementById("errore-" + campo.id);
    if (!errore) return;
    // Le descrizioni già presenti (per esempio il testo d'aiuto) restano collegate al campo.
    var base = campo.getAttribute("data-descritto-da");
    if (base === null) {
      base = campo.getAttribute("aria-describedby") || "";
      campo.setAttribute("data-descritto-da", base);
    }
    if (testo) {
      errore.textContent = testo;
      errore.hidden = false;
      campo.setAttribute("aria-invalid", "true");
      campo.setAttribute("aria-describedby", (errore.id + " " + base).trim());
    } else {
      errore.textContent = "";
      errore.hidden = true;
      campo.removeAttribute("aria-invalid");
      if (base) campo.setAttribute("aria-describedby", base);
      else campo.removeAttribute("aria-describedby");
    }
  }

  function preparaModulo() {
    var modulo = document.querySelector("[data-modulo]");
    if (!modulo) return;

    var fonte = modulo.querySelector("[data-fonte]");
    if (fonte) fonte.value = leggiFonte();

    // Sul telefono il tasto «Avanti» della tastiera porta al campo successivo.
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

  /* ---------- Pulsante fisso «Voglio esserci» (telefono) ---------- */

  function preparaPulsanteFisso() {
    var pulsante = document.querySelector("[data-cta-fissa]");
    var arrivo = document.getElementById("inizio");
    var iscrizione = document.getElementById("iscrizione");
    var barra = document.querySelector(".barra");
    if (!pulsante || !arrivo || !iscrizione) return;

    var inAttesa = false;

    // Compare quando la sezione Arrivo esce dallo schermo, sparisce quando l'iscrizione è visibile.
    function aggiorna() {
      inAttesa = false;
      var altezza = window.innerHeight || document.documentElement.clientHeight;
      var sopra = barra ? barra.getBoundingClientRect().bottom : 0;
      var a = arrivo.getBoundingClientRect();
      var i = iscrizione.getBoundingClientRect();
      var iscrizioneVisibile = i.top < altezza && i.bottom > sopra;
      var mostra = a.bottom <= sopra && !iscrizioneVisibile;
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

    // Al tocco: scorre all'iscrizione e mette il cursore nel campo Nome.
    pulsante.addEventListener("click", function (evento) {
      evento.preventDefault();
      var nome = document.getElementById("nome");
      scorriA(iscrizione);
      if (!nome) return;
      var fatto = false;
      function metti() {
        if (fatto) return;
        fatto = true;
        try {
          nome.focus({ preventScroll: true });
        } catch (e) {
          nome.focus();
        }
      }
      if (riduciMovimento) {
        metti();
      } else if ("onscrollend" in window) {
        window.addEventListener("scrollend", metti, { once: true });
        window.setTimeout(metti, 1500);
      } else {
        window.setTimeout(metti, 800);
      }
    });

    window.addEventListener("scroll", richiedi, { passive: true });
    window.addEventListener("resize", richiedi);
    aggiorna();
  }

  /* ---------- Foto (quando ci sono) e frasi della community ---------- */

  function creaFoto(percorso, classe, alt) {
    var img = document.createElement("img");
    img.src = percorso;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    if (classe) img.className = classe;
    return img;
  }

  function preparaFoto() {
    var grande = document.querySelector("[data-foto-grande]");
    var scatto01 = String(config.FOTO_SCATTO_01 || "").trim();
    if (grande && scatto01) {
      grande.insertBefore(creaFoto(scatto01, "", "Due mani appoggiate su una spalla, in una luce calda"), grande.firstChild);
      grande.classList.add("foto-grande--con-foto");
    }
    [
      ["FOTO_SCATTO_02", "[data-foto-per-te]"],
      ["FOTO_SCATTO_03", "[data-foto-con-chi-ami]"]
    ].forEach(function (coppia) {
      var percorso = String(config[coppia[0]] || "").trim();
      var posto = document.querySelector(coppia[1]);
      if (!percorso || !posto) return;
      var img = creaFoto(percorso, "modo__foto", "");
      img.width = 88;
      img.height = 88;
      posto.replaceWith(img);
    });

    if (config.CITAZIONI_APPROVATE === true) {
      var citazioni = document.querySelector("[data-citazioni]");
      if (citazioni) citazioni.hidden = false;
    }
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
    preparaFoto();
    preparaPulsanteFisso();
    preparaDissolvenze();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }
})();
