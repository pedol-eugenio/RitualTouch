/*
  =========================================================
  DOMANDE FREQUENTI DI RITUAL TOUCH
  Questo è l'unico posto dove scriverle: compaiono identiche
  nella pagina principale e nella pagina /faq.

  Per cambiare un testo: modifica solo le parole tra le virgolette.
  Se dentro una frase serve una virgoletta dritta ("), scrivila così: \"
  Per aggiungere una domanda: copia un blocco { domanda: ..., risposta: ... },
  incollalo sotto l'ultimo e separa i blocchi con una virgola.
  =========================================================
*/
window.RITUAL_TOUCH_FAQ = [
  {
    domanda: "Devo saper fare massaggi?",
    risposta: "No, non serve nessuna preparazione. Ogni rituale ti guida passo dopo passo: ti mostro dove appoggiare le mani, come muoverle e con quale ritmo. Non devi imparare una tecnica da professionista: conta come ti senti mentre lo fai. Se un gesto non ti viene perfetto, va bene così."
  },
  {
    domanda: "Entrare nella cerchia costa qualcosa?",
    risposta: "No, è gratuito. Lasci nome ed email, e se vuoi il cellulare, e ti scrivo quando apre il percorso completo: la data non è ancora fissata, e chi è nella cerchia la conoscerà prima di chiunque altro. Non c’è nessun obbligo di acquisto e puoi cancellarti in ogni momento con il link in fondo a ogni email."
  },
  {
    domanda: "Cosa mi serve per vivere il rituale?",
    risposta: "Qualche minuto e un angolo dove nessuno ti disturbi: il divano, il letto, un tappeto. Abiti comodi aiutano. Se un rituale richiede qualcosa in più, per esempio un olio, lo trovi indicato all’inizio, così puoi prepararlo prima di cominciare."
  },
  {
    domanda: "Posso viverlo con il partner o con una persona cara?",
    risposta: "Sì. Nel percorso ci sono rituali per prenderti cura di te e rituali pensati per essere vissuti in due, con il partner o con una persona a cui vuoi bene. Non serve esperienza a nessuna delle due persone: bastano la voglia di esserci e un po’ di attenzione reciproca."
  },
  {
    domanda: "È un trattamento per dolori o problemi di salute?",
    risposta: "No. I rituali sono esperienze di benessere, cura e presenza: non sono una terapia e non sostituiscono trattamenti o indicazioni mediche. Se hai dolori, una patologia o sei in gravidanza, chiedi prima al tuo medico se i gesti proposti sono adatti a te. E durante il rituale ascolta sempre il tuo corpo: se qualcosa non ti fa stare bene, fermati."
  }
];

/* ---------- Da qui in giù non serve modificare niente ---------- */
(function () {
  "use strict";
  var domande = window.RITUAL_TOUCH_FAQ || [];
  var contenitori = document.querySelectorAll("[data-faq]");

  [].forEach.call(contenitori, function (contenitore, n) {
    var livello = contenitore.getAttribute("data-faq-livello") === "2" ? "h2" : "h3";
    var pulsanti = [];

    domande.forEach(function (voce, i) {
      var idDomanda = "faq-" + n + "-d" + i;
      var idRisposta = "faq-" + n + "-r" + i;
      var aperta = i === 0; // la prima risposta è aperta all'arrivo

      var blocco = document.createElement("div");
      blocco.className = "domanda";

      var titolo = document.createElement(livello);
      var pulsante = document.createElement("button");
      pulsante.type = "button";
      pulsante.className = "domanda__pulsante";
      pulsante.id = idDomanda;
      pulsante.setAttribute("aria-expanded", aperta ? "true" : "false");
      pulsante.setAttribute("aria-controls", idRisposta);

      var testo = document.createElement("span");
      testo.textContent = voce.domanda;
      var segno = document.createElement("span");
      segno.className = "domanda__segno";
      segno.setAttribute("aria-hidden", "true");
      segno.textContent = aperta ? "–" : "+";
      pulsante.appendChild(testo);
      pulsante.appendChild(segno);
      titolo.appendChild(pulsante);

      var risposta = document.createElement("div");
      risposta.className = "risposta";
      risposta.id = idRisposta;
      risposta.setAttribute("role", "region");
      risposta.setAttribute("aria-labelledby", idDomanda);
      risposta.hidden = !aperta;
      var paragrafo = document.createElement("p");
      paragrafo.textContent = voce.risposta;
      risposta.appendChild(paragrafo);

      blocco.appendChild(titolo);
      blocco.appendChild(risposta);
      contenitore.appendChild(blocco);
      pulsanti.push(pulsante);
    });

    function imposta(pulsante, aperta) {
      pulsante.setAttribute("aria-expanded", aperta ? "true" : "false");
      pulsante.querySelector(".domanda__segno").textContent = aperta ? "–" : "+";
      document.getElementById(pulsante.getAttribute("aria-controls")).hidden = !aperta;
    }

    // Una sola risposta aperta alla volta.
    pulsanti.forEach(function (pulsante) {
      pulsante.addEventListener("click", function () {
        var apri = pulsante.getAttribute("aria-expanded") !== "true";
        pulsanti.forEach(function (altro) {
          imposta(altro, altro === pulsante ? apri : false);
        });
      });
    });
  });
})();
