# Ritual Touch — sito

Sito di pre-lancio di **Ritual Touch** (ritualtouch.it): chi arriva guarda un video-rituale gratuito e, se vuole, entra nella cerchia **Le Meravigliose Creature**.

È fatto con HTML, CSS e JavaScript semplici: non serve installare programmi e non c'è nessun passaggio di "build". Si può modificare anche direttamente da GitHub.

---

## Cosa c'è dentro

```
index.html              la pagina principale
grazie/index.html       pagina dopo l'iscrizione (ritualtouch.it/grazie)
faq/index.html          domande frequenti (ritualtouch.it/faq)
privacy/index.html      informativa privacy (ritualtouch.it/privacy)
404.html                pagina per gli indirizzi sbagliati
assets/js/config.js     ← LE IMPOSTAZIONI: video, durata, modulo Kit, foto, citazioni
assets/js/faq.js        ← LE DOMANDE FREQUENTI (un solo file per la pagina principale e /faq)
assets/js/main.js       comportamenti della pagina principale
assets/js/pagine.js     «← Indietro» nelle pagine /faq e /privacy
assets/css/style.css    colori, caratteri e misure
assets/img/             simbolo, foto di Andrea, immagine per le anteprime social
assets/fonts/           Cormorant Garamond e Inter (ospitati qui, con le licenze)
favicon.ico, favicon.svg, apple-touch-icon.png   icone
vercel.json             impostazioni per Vercel (sicurezza, redirect /cookie → /privacy)
_headers, _redirects    le stesse impostazioni, pronte per Cloudflare Pages
robots.txt, sitemap.xml file per Google
```

---

## 1. Vedere il sito sul tuo computer

Apri il Terminale nella cartella del sito e scrivi:

```
python3 -m http.server 8000
```

Poi apri http://localhost:8000 nel browser. Per chiudere: `Ctrl + C`.
(Il doppio clic su `index.html` mostra la pagina, ma i collegamenti tra le pagine funzionano solo così o online.)

---

## 2. Inserire video, durata e modulo Kit

Tutto si fa in un solo file: **`assets/js/config.js`**.
Da GitHub: apri il file → icona della matita (*Edit*) → cambia il testo tra le virgolette → *Commit changes*. Dopo circa un minuto il sito si aggiorna.

```js
window.RITUAL_TOUCH_CONFIG = {
  YOUTUBE_VIDEO_ID: "",              // es. "AbCdEf12345" oppure il link intero del video
  VIDEO_DURATA_MINUTI: "",           // es. "5" → «RITUALE GRATUITO · 5 MINUTI»
  VIDEO_TITOLO: "Un momento per te", // la scritta sulla copertina del video
  KIT_FORM_ACTION: "https://app.kit.com/forms/10099436/subscriptions",  // già inserito
  FOTO_SCATTO_01: "",                // foto grande «Il corpo è sempre qui.»
  FOTO_SCATTO_02: "",                // foto piccola «Per te»
  FOTO_SCATTO_03: "",                // foto piccola «Con chi ami»
  CITAZIONI_APPROVATE: false         // true quando Andrea conferma il permesso per le tre frasi
};
```

- **Video:** caricalo su YouTube come *non in elenco*. Senza ID la copertina resta, il pulsante play non compare e l'etichetta dice «IN ARRIVO». Con l'ID compare il play; YouTube si carica solo quando la persona lo preme, e alla fine del video la pagina scorre da sola alla sezione «Resta ancora un momento».
- **Foto degli scatti 01–03:** prima vanno ottimizzate (formato WebP, larghezza 1600 px per la grande e 200 px per le piccole), poi messe in `assets/img` e indicate qui, per esempio `"assets/img/scatto-01.webp"`. Finché sono vuote, al posto della foto grande c'è un fondo scuro con la frase e le foto piccole non compaiono.
- **Kit:** se `KIT_FORM_ACTION` viene svuotato, il pulsante «Voglio esserci» si disattiva e compare «Iscrizioni in apertura a breve.».

---

## 3. Cambiare un testo o una domanda delle FAQ

**Un testo della pagina:** i testi sono in `index.html` (e in `grazie/`, `faq/`, `privacy/`).
1. Su GitHub apri il file e premi la matita (*Edit*).
2. Cerca la frase con `Cmd + F` (Mac) o `Ctrl + F`.
3. Cambia **solo il testo**, senza toccare i simboli `<` `>` e quello che c'è dentro.
4. Premi *Commit changes*.

**Una domanda frequente:** apri `assets/js/faq.js`. Ogni domanda è un blocco così:

```js
{
  domanda: "Devo saper fare massaggi?",
  risposta: "No, non serve nessuna preparazione. …"
},
```

Cambia le parole tra le virgolette. Per aggiungere una domanda copia un blocco, incollalo sotto l'ultimo e separa i blocchi con una virgola. La modifica compare sia nella pagina principale sia in /faq.

Consiglio: usa l'apostrofo tipografico `’` (come in «c’è»), così resta uguale al resto del sito.

**Se cambia l'informativa privacy:** aggiorna la data «Ultimo aggiornamento» in `privacy/index.html` e la stessa data nel valore della casella del consenso in `index.html` (`value="Sì, informativa del …"`). Così in Kit resta scritto quale versione ha accettato ogni persona.

---

## 4. Pubblicare gli aggiornamenti

Ogni *commit* sul ramo `main` di GitHub viene pubblicato in automatico, di solito in meno di un minuto.

**Hosting — da decidere.** Oggi il sito è su Vercel, piano gratuito, che però non ammette l'uso commerciale. Le due strade:
- **Cloudflare Pages:** gratuito anche per uso commerciale. Per usare ritualtouch.it serve spostare la *gestione DNS* da Aruba a Cloudflare (il dominio resta registrato su Aruba; vanno ricopiati i record, compresi quelli della posta e il record TXT di Google). I file `_headers` e `_redirects` sono già pronti.
- **Vercel Pro:** 20 $ al mese, nessun cambiamento.

---

## 5. Dominio ritualtouch.it (Aruba) — fatto

Collegato il 27 ottobre 2026. Su Aruba: record A `@` → `216.198.79.1` e CNAME `www` → `c2fb807ccab9b5f1.vercel-dns-017.com`. Su Vercel `www.ritualtouch.it` e `ritualtouch.vercel.app` portano a `ritualtouch.it` (redirect 308).
Su Aruba c'è anche il record TXT `google-site-verification`: **non cancellarlo**, serve a Google Search Console.
Se l'hosting cambia, i record A e CNAME vanno aggiornati con i valori del nuovo servizio.

---

## 6. Kit (piano gratuito)

### Com'è configurato
- **Form:** 10099436, già inserito in `config.js`. Il sito invia nome, email, cellulare, fonte e consenso.
- **Campi personalizzati in Kit:** `cellulare` e `fonte` creati; **da creare: `consenso`** (*Subscribers* → apri un iscritto → tre puntini accanto a *Custom Fields* → *Add new*).
- **Dopo l'invio:** Kit porta a `https://ritualtouch.it/grazie`.
- **Doppia conferma:** attiva. Dopo il clic su «Confermo l'iscrizione» Kit porta a `https://ritualtouch.it/`.
- **Prova del 27 ottobre 2026:** tutto funziona, ma l'email di conferma è finita in Spam (vedi sotto).

### Da aggiornare in Kit: l'email di conferma
Il form → *Settings* → *Confirmation Email*. Nuovo testo, allineato al nome della cerchia:

```
Oggetto: Conferma la tua iscrizione alla cerchia

Ciao, meravigliosa creatura.
Manca solo un passo per entrare nella cerchia delle Meravigliose Creature: premi il pulsante qui sotto per confermare la tua iscrizione.

[Pulsante] Confermo l'iscrizione

Così saprai prima di chiunque altro quando apre il percorso completo.

Se non hai chiesto tu l'iscrizione, ignora pure questa email.

A presto,
Andrea
```

### Mittente sul dominio (importante)
Oggi l'email parte dai server di Kit ma con un indirizzo @gmail.com: Gmail non può verificarla e la tratta come sospetta. Per risolvere:
1. su Aruba crea la casella `hello@ritualtouch.it` (se vuoi, con inoltro a hello.ritualtouch@gmail.com);
2. in Kit: *Settings* → *Email* → *Verified Sending Domains* → aggiungi `ritualtouch.it`, inserisci su Aruba i record CNAME che Kit indica e premi *Validate*;
3. in Kit aggiungi il mittente `hello@ritualtouch.it`, confermalo dall'email che arriva nella nuova casella, rendilo predefinito e sceglilo nell'email di conferma del form;
4. consigliato: su Aruba aggiungi un record TXT `_dmarc` con valore `v=DMARC1; p=none;`.

### Cancellazioni
Kit tiene in lista anche chi si cancella (come «disiscritto»). L'informativa dice che chi si cancella non riceve più nulla e può chiedere di eliminare del tutto i suoi dati: in quel caso, in Kit apri l'iscritto ed eliminalo. Conviene anche fare pulizia degli iscritti cancellati ogni tanto.

Il piano gratuito di Kit arriva fino a 10.000 iscritti.

---

## 7. Google

Proprietà `ritualtouch.it` verificata su Google Search Console con l'account hello.ritualtouch@gmail.com; sitemap inviata. La sitemap ora contiene /, /faq e /privacy: alla prossima lettura Google la aggiorna da solo.

---

## 8. Link da usare

La provenienza dell'iscrizione finisce nel campo `fonte` di Kit.

| Dove | Link |
|---|---|
| Messaggi automatici («Rituale» nei commenti) | `https://ritualtouch.it/?utm_source=dm` |
| Linktree, voce «I rituali» | `https://ritualtouch.it/?utm_source=linktree` |
| Bio Instagram | `https://ritualtouch.it/?utm_source=instagram` |

Senza parametro, la fonte registrata è `diretto`.

---

## 9. Stato del sito

### Cosa funziona
- Pagina principale nell'ordine del brief: Arrivo, Resta ancora un momento, Iscrizione, Per te / Con chi ami, Chi sono, Chiusura con domande frequenti e contatto, footer. Pagine /grazie, /faq, /privacy e 404.
- Verificato a 320, 360, 375, 390, 414, 430, 1024 e 1440 px: nessuno scorrimento orizzontale. Su telefono titolo, video e frase stanno nella prima schermata (anche su iPhone SE); «Ciao, meravigliosa creatura.» resta su una riga.
- Barra superiore fissa su tutte le pagine; «← Indietro» in /faq e /privacy riporta al punto di prima senza perdere quello che era stato scritto nel modulo.
- Pulsante fisso «Voglio esserci» sotto i 900 px: compare dopo la sezione Arrivo, sparisce quando l'iscrizione è visibile, al tocco porta al modulo e mette il cursore nel campo Nome.
- Video: copertina con «IN ARRIVO» finché manca l'ID; con l'ID, pulsante play con l'animazione «respiro», YouTube (modalità a privacy avanzata) solo al clic, scorrimento alla sezione 2 alla fine del video. Provato con un video simulato.
- Modulo collegato a Kit: blocca l'invio senza la spunta, messaggi in italiano sotto i campi, fonte da `?utm_source=`, consenso salvato con la data dell'informativa. Provato con un invio simulato.
- Domande frequenti a tendina da un unico file: una risposta aperta alla volta, funzionano con tocco, mouse e tastiera.
- Nessuna richiesta a siti esterni prima del clic sul video: niente tracker, niente cookie, caratteri ospitati sul sito.
- Contrasti WCAG AA su tutti i testi; contorno di selezione verde sui fondi chiari e oro su quelli scuri.
- Dominio ritualtouch.it con HTTPS; Google Search Console attiva; dati strutturati per Google.
- PageSpeed Insights da smartphone (27 ottobre 2026, dopo il rifacimento): 100 in Prestazioni, Accessibilità, Best practice e SEO (primo contenuto in 0,9 s, contenuto principale in 1,7 s).

### Cosa è provvisorio
- **Simbolo del logo:** è ancora quello ricavato dall'avatar Instagram, in SVG. Quando arriva `RitualTouch_icona_FINALE.png` si ricavano le versioni piatte avorio e verde come chiede il brief (stessi nomi file); favicon e immagine social vanno rigenerati.
- **Foto di Andrea:** è ancora quella ricavata dallo screenshot (720×900 px, con il pollice). Con l'originale `WVVI2912_1_.PNG` si fa il ritaglio del brief (x 240, y 20, 900×810) a 800 e 1600 px.
- **Video:** «IN ARRIVO» finché non ci sono ID e durata.
- **Foto degli scatti 01–03:** fondo scuro con la frase finché non arrivano.
- **Frasi della community:** nascoste finché non c'è il permesso.
- **Privacy:** manca l'indirizzo della sede (evidenziato); il testo va verificato da chi si occupa di privacy.

### Cosa deve configurare Andrea
- Video su YouTube (ID e durata), foto degli scatti 01–03, permesso per le tre frasi, indirizzo della sede, i due file grafici del brief.
- Kit: creare il campo `consenso`, aggiornare l'email di conferma (testo al punto 6), mittente su ritualtouch.it.
- Scelta dell'hosting (punto 4).

---

## 10. Scostamenti dal brief (approvati)

- **Casella del consenso:** «Voglio ricevere le email di Ritual Touch e, se lascio il numero, una chiamata da Andrea. Ho letto l'informativa privacy.» al posto di «Ho letto e accetto l'informativa privacy.», perché il consenso deve dire a cosa si acconsente. Messaggio d'errore: «Per continuare, spunta la casella.»
- **Privacy, «Per quanto tempo»:** «Quando ti cancelli smetto di scriverti; se vuoi che i tuoi dati vengano eliminati del tutto, basta un'email.», perché Kit tiene in lista chi si cancella. Compilati anche i fornitori (Kit e Vercel) e la data di aggiornamento.
- **Contorno di selezione:** verde sui fondi chiari (l'oro avrebbe contrasto 1,95:1, ne serve 3:1).
- **Telefoni bassi:** il video si riduce in proporzione, così titolo, video e frase restano nella prima schermata. Il titolo dell'iscrizione scende sotto i 30 px quanto basta per restare su una riga.
- **Pagina Cookie:** tolta come chiede il brief; chi ha il vecchio link viene portato a /privacy.
- **Immagini:** solo WebP per il sito (JPG solo per l'anteprima social); logo in SVG finché non arriva il file del brief.
- **Altro:** footer anche nelle pagine aggiuntive; angoli arrotondati della foto grande su computer; dati strutturati per Google.

---

Caratteri: Cormorant Garamond e Inter, entrambi con licenza SIL Open Font License 1.1 (file in `assets/fonts/`).
