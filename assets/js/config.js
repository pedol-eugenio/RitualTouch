/*
  =========================================================
  CONFIGURAZIONE DEL SITO RITUAL TOUCH
  Cambia solo il testo tra le virgolette "...", poi salva.
  =========================================================

  YOUTUBE_VIDEO_ID
    Il codice del video YouTube "non in elenco".
    Esempio: se il link del video è https://youtu.be/AbCdEf12345
    scrivi "AbCdEf12345". Va bene anche incollare il link intero.
    Lascialo vuoto ("") finché il video non c'è:
    il sito mostra il messaggio provvisorio.

  KIT_FORM_ACTION
    L'indirizzo del modulo Kit, cioè il valore di action="..."
    nel codice HTML che Kit fornisce per il form.
    Esempio: "https://app.kit.com/forms/1234567/subscriptions"
    Lascialo vuoto ("") finché il modulo non è pronto:
    il pulsante resta disattivato e compare "Iscrizioni in apertura a breve."

  VIDEO_FORMATO
    "16:9" per un video orizzontale (predefinito),
    "9:16" se il video è verticale.
*/
window.RITUAL_TOUCH_CONFIG = {
  YOUTUBE_VIDEO_ID: "",
  KIT_FORM_ACTION: "",
  VIDEO_FORMATO: "16:9"
};
