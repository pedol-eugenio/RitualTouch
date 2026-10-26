# Ritual Touch — sito

Landing page di pre-lancio di **Ritual Touch** (ritualtouch.it): chi arriva guarda un video-rituale gratuito e, se vuole, si iscrive alla **Prima Cerchia**.

È fatta con HTML, CSS e JavaScript semplici: non serve installare programmi e non c'è nessun passaggio di "build". Si può modificare anche direttamente da GitHub.

---

## Cosa c'è dentro

```
index.html              la pagina principale
grazie/index.html       pagina dopo l'iscrizione (ritualtouch.it/grazie)
privacy/index.html      Privacy Policy
cookie/index.html       Cookie Policy
404.html                pagina per gli indirizzi sbagliati (testo modificabile)
assets/js/config.js     ← LE IMPOSTAZIONI DA COMPILARE (video e modulo Kit)
assets/js/main.js       comportamenti: video, modulo, pulsante fisso, dissolvenze
assets/js/pagine.js     «Torna alla pagina» nelle pagine Privacy e Cookie
assets/css/style.css    colori, caratteri e impaginazione
assets/img/             simbolo, foto di Andrea, immagine per le anteprime social
assets/fonts/           Cormorant Garamond e Inter (ospitati qui, con le licenze)
favicon.ico, favicon.svg, apple-touch-icon.png   icone
vercel.json, robots.txt, sitemap.xml             file tecnici
```

---

## 1. Vedere il sito sul tuo computer

- **Veloce:** apri `index.html` con un doppio clic. Vedi la pagina principale; i link a Privacy e Cookie funzionano solo online o con il metodo qui sotto.
- **Completo (Mac):** apri il Terminale nella cartella del sito e scrivi:
  ```
  python3 -m http.server 8000
  ```
  Poi apri http://localhost:8000 nel browser. Per chiudere: `Ctrl + C`.
- **Online:** ogni modifica pubblicata su GitHub crea anche un'anteprima su Vercel.

---

## 2. Inserire il video e il modulo Kit

Tutto si fa in un solo file: **`assets/js/config.js`**.

Da GitHub: apri il file → icona della matita (*Edit*) → cambia il testo tra le virgolette → *Commit changes*. Dopo circa un minuto Vercel pubblica la nuova versione.

```js
window.RITUAL_TOUCH_CONFIG = {
  YOUTUBE_VIDEO_ID: "",   // es. "AbCdEf12345" oppure il link intero del video
  KIT_FORM_ACTION: "",    // es. "https://app.kit.com/forms/1234567/subscriptions"
  VIDEO_FORMATO: "16:9"   // "9:16" se il video è verticale
};
```

- **Video:** caricalo su YouTube come video *non in elenco*. Finché `YOUTUBE_VIDEO_ID` è vuoto, il sito mostra il messaggio provvisorio. Con l'ID compare una copertina verde con il logo e il pulsante play; YouTube si carica solo quando la persona preme play.
- **Kit:** finché `KIT_FORM_ACTION` è vuoto, il pulsante «Voglio esserci» resta disattivato e compare «Iscrizioni in apertura a breve.». Nessun dato viene inviato.

---

## 3. Modificare un testo

I testi sono in `index.html` (e in `grazie/`, `privacy/`, `cookie/`).

1. Su GitHub apri il file e premi la matita (*Edit*).
2. Cerca la frase con `Cmd + F` (Mac) o `Ctrl + F`.
3. Cambia **solo il testo**, senza toccare i simboli `<` `>` e quello che c'è dentro.
4. Premi *Commit changes*.

Consiglio: usa l'apostrofo tipografico `’` (come in «c’è»), così resta uguale al resto della pagina.

---

## 4. Pubblicare con Vercel

**Prima volta (si fa una volta sola):**
1. Su vercel.com: *Add New…* → *Project* → importa il repository GitHub **RitualTouch**.
2. *Framework Preset*: **Other**. Lascia vuoti *Build Command* e *Output Directory*.
3. *Deploy*. Vercel assegna un indirizzo gratuito del tipo `nome-progetto.vercel.app`: usalo come anteprima.

**Dopo:** ogni *commit* sul ramo `main` viene pubblicato in automatico, di solito in meno di un minuto.

Nota: il piano Hobby (gratuito) va bene per iniziare. Le condizioni di Vercel riservano però l'uso commerciale al piano Pro: valutalo prima del lancio dei rituali a pagamento.

---

## 5. Collegare il dominio ritualtouch.it (registrato su Aruba)

Il dominio **resta su Aruba**: si cambiano solo due record DNS, non serve trasferirlo.

**Su Vercel**
1. Progetto → *Settings* → *Domains* → aggiungi `ritualtouch.it`.
2. Vercel propone di aggiungere anche `www.ritualtouch.it`: accetta. Poi, sul dominio `www`, premi *Edit* e in *Redirect to* scegli `ritualtouch.it`. Così chi scrive www arriva alla versione senza www.
3. Vercel mostra i valori da inserire: un **record A** per `ritualtouch.it` (di solito `76.76.21.21`, ma usa quello che vedi) e un **CNAME** per `www`.

**Su Aruba**
1. Vai su admin.aruba.it → *Dominio* → *Gestione DNS e Name Server* → *Gestisci DNS* (se il pulsante dice *Attiva*, premilo prima e conferma).
2. Nella sezione dei record **A, AAAA e CNAME**:
   - record **A** con nome host vuoto (il dominio): sostituisci l'indirizzo con quello di Vercel;
   - **www**: se è un record A, eliminalo e crea un **CNAME** `www` con il valore indicato da Vercel;
   - eventuali record **AAAA** del dominio o di www: eliminali;
   - non toccare i record **MX** (servono alla posta), se ci sono.
3. Salva e attendi: di solito bastano pochi minuti, a volte qualche ora.

**HTTPS:** Vercel attiva il certificato da solo appena vede i record corretti.
**Verifica finale:** `https://ritualtouch.it` apre il sito e `https://www.ritualtouch.it` porta a `https://ritualtouch.it`.

L'immagine di anteprima (quando il link viene condiviso su WhatsApp o Instagram) usa l'indirizzo ritualtouch.it: compare solo quando il dominio è collegato. Conviene collegarlo prima di mandare il link nei messaggi automatici.

---

## 6. Configurare Kit (piano gratuito)

1. Crea l'account su kit.com.
2. *Audience growth* → *Landing Pages & Forms* → crea un **Form**.
3. Crea in Kit due **campi personalizzati** con nome esattamente `cellulare` e `fonte` (minuscolo). Il modo più semplice: *Subscribers* → apri un iscritto → accanto a *Custom Fields* il menu con i tre puntini → *Add new*. Non serve aggiungerli al form di Kit: il sito usa il suo modulo e Kit salva i valori appena i campi esistono. Il nome usa già il campo standard di Kit.
4. *Settings* → *General*: scegli di reindirizzare a una pagina esterna e inserisci `https://ritualtouch.it/grazie`.
5. *Settings* → *Confirmation email*: attivala (è la **doppia conferma**).
6. *Embed* → **HTML**: nel codice trovi `action="https://app.kit.com/forms/…/subscriptions"`. Copia solo l'indirizzo tra le virgolette e incollalo in `config.js` come `KIT_FORM_ACTION`.
7. Prova con la tua email: dopo l'invio arrivi su /grazie e ricevi l'email da confermare.

Il piano gratuito di Kit arriva fino a 10.000 iscritti; oltre, Kit passa in automatico a un piano a pagamento.

---

## 7. Link da usare

La provenienza dell'iscrizione finisce nel campo `fonte` di Kit.

| Dove | Link |
|---|---|
| Messaggi automatici («Rituale» nei commenti) | `https://ritualtouch.it/?utm_source=dm` |
| Linktree, voce «I rituali» | `https://ritualtouch.it/?utm_source=linktree` |
| Bio Instagram (se serve) | `https://ritualtouch.it/?utm_source=instagram` |

Senza parametro, la fonte registrata è `diretto`.

---

## 8. Stato del sito

### Cosa funziona
- Pagina completa con i testi definitivi del brief, verificata a 375 px e 1440 px (anche 320 px), senza scorrimento orizzontale.
- Pulsante «Guarda il rituale» visibile senza scorrere sugli smartphone, anche dentro il browser di Instagram.
- Video: stato provvisorio; con l'ID, copertina verde con logo e play. YouTube (youtube-nocookie.com, con avvio automatico) si carica solo al clic.
- Modulo collegato a Kit (form 10099436): invia nome, email, cellulare e fonte, con controlli e messaggi in italiano. Il campo fonte legge `?utm_source=`. Se `KIT_FORM_ACTION` viene svuotato, il pulsante torna disattivato.
- Pulsante fisso «Entra nella Prima Cerchia» su smartphone: compare dopo la sezione video e sparisce quando il modulo è visibile.
- Pagine Grazie, Privacy e Cookie; link a Instagram. Da Privacy e Cookie, «Torna alla pagina» riporta al modulo senza perdere quello che era stato scritto.
- Pagina 404 con il marchio, al posto di quella standard di Vercel.
- Modulo pensato per il telefono: il tasto «Avanti» della tastiera passa al campo successivo, la casella del consenso è grande e nello stile del sito.
- Il sito resta chiaro anche sui browser che scuriscono le pagine da soli (per esempio Samsung Internet).
- Navigazione da tastiera con focus visibile; contrasti WCAG AA su tutti i testi.
- Nessuna richiesta a siti esterni prima del clic sul video: niente tracker, niente cookie, caratteri ospitati sul sito.

### Cosa è provvisorio
- **Logo:** il simbolo è ricavato dall'avatar Instagram di @ritualtouch.official, in versione piatta (avorio su verde, verde su chiaro). La scritta «Ritual Touch» è composta in Cormorant Garamond. Quando arriva il vettoriale ufficiale, basta sostituire `assets/img/simbolo-avorio.svg` e `assets/img/simbolo-verde.svg` con file dagli stessi nomi; favicon e immagine social vanno rigenerati.
- **Foto di Andrea:** ricavata da uno screenshot (720×900 px). Con il file originale la qualità migliora.
- **Video:** messaggio provvisorio finché non c'è l'ID.
- **Privacy e Cookie:** bozze da far verificare; i punti tra parentesi quadre sono evidenziati.

### Cosa devi configurare tu
- **Kit:** il modulo è collegato. Restano da fare: creare i campi `cellulare` e `fonte` (punto 6), confermare hello.ritualtouch@gmail.com come mittente predefinito e usarlo anche nell'email di conferma del form.
- **Vercel e dominio:** import del repository e record DNS su Aruba (punti 4 e 5).
- **Privacy:** indirizzo della sede; hosting (Vercel Inc., Stati Uniti) e garanzie per il trasferimento extra-UE di Vercel e Kit.

### Proposte (non applicate)
- Mettere un ritratto di Andrea già nella prima schermata: chi arriva da un Reel lo riconosce subito. Oggi la sua foto compare solo nella quinta sezione.
- Far partire i messaggi automatici quando il video è online: finché c'è il messaggio provvisorio, «Guarda il rituale» porta a un video che non c'è ancora.
- Nella Cookie Policy, la frase «Nessun banner necessario finché resta così.» sembra una nota interna: valuterei di toglierla dalla pagina pubblica.
- Per avere traccia del consenso anche in Kit, si può inviare un campo `consenso` insieme all'iscrizione (oggi la casella è obbligatoria ma non viene salvata).

---

Caratteri: Cormorant Garamond e Inter, entrambi con licenza SIL Open Font License 1.1 (file in `assets/fonts/`).
