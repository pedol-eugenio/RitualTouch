/*
  =========================================================
  CONFIGURAZIONE DEL SITO RITUAL TOUCH
  Cambia solo quello che c'è dopo i due punti, poi salva.
  =========================================================

  YOUTUBE_VIDEO_ID
    Il codice del video YouTube "non in elenco".
    Esempio: se il link è https://youtu.be/AbCdEf12345 scrivi "AbCdEf12345".
    Va bene anche incollare il link intero.
    Finché è vuoto ("") il pulsante play non compare e l'etichetta dice «IN ARRIVO».

  VIDEO_DURATA_MINUTI
    La durata del video in minuti, solo il numero. Esempio: "5".
    Compare nell'etichetta dentro il video «GRATUITO · 5 MIN»
    (e, da computer, sopra il titolo: «RITUALE GRATUITO · 5 MINUTI»).

  VIDEO_TITOLO
    La scritta grande sulla copertina del video.

  CAPITOLI
    Gli argomenti del video, che compaiono sotto il video come pulsanti:
    con un clic il video salta a quel punto.
    Ogni riga è ["minuti:secondi", "Nome dell'argomento"].
    Si possono usare anche i decimi di secondo, per esempio "1:47.4".
    Per aggiungere un argomento copia una riga (con la virgola alla fine).
    Se la lista è vuota [] gli argomenti non compaiono.

  KIT_FORM_ACTION
    L'indirizzo del modulo Kit (il valore di action="..." nel codice HTML di Kit).
    Se lo svuoti, il pulsante si disattiva e compare «Iscrizioni in apertura a breve.»

  FOTO_SCATTO_01, FOTO_SCATTO_02, FOTO_SCATTO_03
    Le foto della sezione «Per te / Con chi ami», quando ci saranno.
    Metti i file nella cartella assets/img e scrivi qui il percorso,
    per esempio "assets/img/scatto-01.webp".
    Finché sono vuote: al posto della foto grande c'è un fondo scuro con la frase,
    e le due foto piccole non compaiono.

  CITAZIONI_APPROVATE
    Le tre frasi della community nella sezione «Chi sono».
    Restano nascoste finché qui c'è false. Scrivi true quando Andrea conferma il permesso.
*/
window.RITUAL_TOUCH_CONFIG = {
  YOUTUBE_VIDEO_ID: "",
  VIDEO_DURATA_MINUTI: "",
  VIDEO_TITOLO: "Un momento per te",
  CAPITOLI: [
    ["0:00", "Benvenuto"],
    ["0:33", "Centratura"],
    ["1:47.4", "Presa di contatto"],
    ["2:26.6", "Trattamento piede sinistro"],
    ["6:58.4", "Trattamento piede destro"],
    ["9:33.7", "Informazione importante"]
  ],
  KIT_FORM_ACTION: "https://app.kit.com/forms/10099436/subscriptions",
  FOTO_SCATTO_01: "",
  FOTO_SCATTO_02: "",
  FOTO_SCATTO_03: "",
  CITAZIONI_APPROVATE: false
};

/* ---------- Da qui in giù non serve modificare niente ----------
   Prepara la pagina prima che compaia (con o senza video, con o senza foto),
   così niente si sposta mentre si carica. */
(function () {
  "use strict";
  var c = window.RITUAL_TOUCH_CONFIG;
  var classi = document.documentElement.classList;
  classi.add(String(c.YOUTUBE_VIDEO_ID || "").trim() ? "con-video" : "senza-video");
  if (String(c.FOTO_SCATTO_01 || "").trim()) classi.add("con-foto-01");
})();
