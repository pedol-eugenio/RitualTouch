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

  // breve = etichetta dentro il video («GRATUITO · 5 MIN»); l'altra è quella sopra il titolo, da computer.
  function testoEtichetta(conVideo, breve) {
    if (!conVideo) return "In arrivo";
    var minuti = parseInt(config.VIDEO_DURATA_MINUTI, 10);
    if (breve) return minuti > 0 ? "Gratuito · " + minuti + " min" : "Gratuito";
    if (minuti > 0) return "Rituale gratuito · " + minuti + (minuti === 1 ? " minuto" : " minuti");
    return "Rituale gratuito";
  }

  // Carica una sola volta l'interfaccia di YouTube, poi chiama pronto().
  function caricaApiYoutube(pronto) {
    if (window.YT && window.YT.Player) {
      pronto();
      return;
    }
    var precedente = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof precedente === "function") precedente();
      pronto();
    };
    if (document.querySelector("script[data-youtube-api]")) return;
    var script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.setAttribute("data-youtube-api", "");
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
      el.textContent = testoEtichetta(Boolean(id), el.hasAttribute("data-video-etichetta-breve"));
    });
    var campoTitolo = box.querySelector("[data-video-titolo]");
    if (campoTitolo) campoTitolo.textContent = titolo;

    var play = box.querySelector("[data-video-play]");
    if (!play) return;
    play.hidden = false;

    // Niente video ancora: la copertina è uguale, ma il play mostra «Il primo rituale arriva tra pochi giorni».
    if (!id) {
      var avviso = box.querySelector("[data-video-avviso]");
      var timer = null;
      play.setAttribute("aria-label", "Il primo rituale arriva tra pochi giorni");
      play.addEventListener("click", function () {
        box.classList.add("video--avviso");
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          box.classList.remove("video--avviso");
        }, 3500);
      });
      if (avviso) avviso.setAttribute("aria-live", "polite");
      return;
    }

    /*
      Un clic solo. YouTube si prepara sotto la copertina poco dopo l'apertura
      della pagina; il centro della copertina lascia passare il tocco al player,
      così il video parte (con l'audio) al primo tocco anche su iPhone.
      Il bordo alto e quello basso restano della copertina, per non aprire per
      sbaglio i link di YouTube (titolo, logo).
    */
    var sezione = document.getElementById("resta");
    var player = null;
    var pronto = false;
    var avviato = false;
    var iframe = null;

    function mostraPlayer() {
      if (avviato) return;
      avviato = true;
      box.classList.add("video--in-corso");
      play.hidden = true;
    }

    function preparaPlayer(avviaSubito) {
      if (player) return;
      var segnaposto = document.createElement("div");
      segnaposto.className = "video__iframe video__iframe--attesa";
      box.insertBefore(segnaposto, box.firstChild);
      caricaApiYoutube(function () {
        try {
          player = new window.YT.Player(segnaposto, {
            host: "https://www.youtube-nocookie.com",
            videoId: id,
            playerVars: {
              autoplay: avviaSubito ? 1 : 0,
              playsinline: 1,
              rel: 0,
              origin: window.location.origin
            },
            events: {
              onReady: function () {
                iframe = player.getIframe();
                iframe.title = titolo;
                iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
                pronto = true;
                box.classList.add("video--pronto");
                if (avviaSubito) {
                  player.playVideo();
                  mostraPlayer();
                }
              },
              onStateChange: function (evento) {
                // 1 = in riproduzione, 3 = sta caricando: la persona ha premuto play
                if (evento.data === 1 || evento.data === 3) mostraPlayer();
                if (evento.data === 0 && sezione) scorriA(sezione); // 0 = video finito
              }
            }
          });
        } catch (e) {
          /* se YouTube non risponde resta la copertina */
        }
      });
    }

    // Tocco sulla copertina fuori dal centro, o prima che YouTube sia pronto
    function avviaDaCopertina() {
      if (pronto && player) {
        player.playVideo();
        mostraPlayer();
        if (iframe) iframe.focus();
      } else {
        preparaPlayer(true);
        box.classList.add("video--attesa");
      }
    }
    play.addEventListener("click", avviaDaCopertina);

    // Il tocco al centro arriva direttamente a YouTube: la pagina perde il focus
    window.addEventListener("blur", function () {
      if (pronto && document.activeElement === iframe) {
        window.setTimeout(mostraPlayer, 150);
      }
    });

    // Prepara YouTube appena la pagina è caricata, senza rallentarla
    function quandoLibero() {
      window.setTimeout(function () {
        preparaPlayer(false);
      }, 600);
    }
    if (document.readyState === "complete") quandoLibero();
    else window.addEventListener("load", quandoLibero);
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

  /* ---------- Numero che cresce (es. 140.000+) quando entra nello schermo ---------- */

  function preparaContatori() {
    var elementi = [].slice.call(document.querySelectorAll("[data-contatore]"));
    if (!elementi.length || riduciMovimento || !("IntersectionObserver" in window)) return;
    var DURATA = 2200; // millisecondi: né troppo veloce né troppo lento

    // Il «+» compare solo quando il numero è arrivato in fondo
    function scrivi(el, valore, finito) {
      el.textContent = valore.toLocaleString("it-IT") + (finito ? el.getAttribute("data-contatore-dopo") || "" : "");
    }

    function anima(el) {
      var fine = parseInt(el.getAttribute("data-contatore"), 10) || 0;
      var inizio = null;
      function passo(ora) {
        if (inizio === null) inizio = ora;
        var t = Math.min((ora - inizio) / DURATA, 1);
        var morbido = 1 - Math.pow(1 - t, 3); // rallenta verso la fine
        scrivi(el, Math.round(fine * morbido), t === 1);
        if (t < 1) window.requestAnimationFrame(passo);
      }
      window.requestAnimationFrame(passo);
    }

    var osservatore = new IntersectionObserver(
      function (voci) {
        voci.forEach(function (voce) {
          if (voce.isIntersecting) {
            osservatore.unobserve(voce.target);
            anima(voce.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    elementi.forEach(function (el) {
      scrivi(el, 0, false);
      osservatore.observe(el);
    });
  }

  function avvia() {
    preparaVideo();
    preparaModulo();
    preparaFoto();
    preparaPulsanteFisso();
    preparaDissolvenze();
    preparaContatori();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }
})();
