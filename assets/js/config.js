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
    Compare nell'etichetta «RITUALE GRATUITO · 5 MINUTI».

  VIDEO_TITOLO
    La scritta grande sulla copertina del video.

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
  KIT_FORM_ACTION: "https://app.kit.com/forms/10099436/subscriptions",
  FOTO_SCATTO_01: "",
  FOTO_SCATTO_02: "",
  FOTO_SCATTO_03: "",
  CITAZIONI_APPROVATE: false
};
