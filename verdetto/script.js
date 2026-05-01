const cases = [
  {
    id: "001",
    type: "Penale",
    title: "Il finto bonifico della console",
    subtitle: "Una vendita veloce, una schermata convincente e 320 euro spariti nel nulla.",
    attentionBudget: 7,
    dossier: "Luca vende una console usata per 320 euro. L'acquirente, Dario M., si presenta di persona, mostra sul telefono un bonifico istantaneo apparentemente riuscito e ritira la console alle 18:42. L'accredito non arriva mai. Dario sostiene che il pagamento sia stato bloccato dalla banca solo dopo il ritiro.",
    accusation: "Per l'accusa, Dario ha usato una schermata ingannevole per ottenere il bene inducendo il venditore in errore. La sequenza chat + consegna + mancato accredito rende il comportamento compatibile con una truffa semplice.",
    defense: "La difesa sostiene che non vi sia prova della falsità originaria del pagamento. L'imputato afferma di aver avviato realmente il bonifico e di essersi accorto del blocco solo in seguito per un problema sul conto.",
    mediaItems: [
      {
        id: "c1a",
        kind: "Profilo",
        title: "Scheda del compratore",
        teaser: "Foto identificativa del soggetto che ha ritirato la console.",
        cost: 1,
        detail: "La foto conferma l'identità del soggetto che si è presentato all'appuntamento.",
        helpful: false,
        mediaType: "image",
        media: "case1_suspect.svg"
      },
      {
        id: "c1b",
        kind: "Documento",
        title: "Schermata del bonifico",
        teaser: "La prova centrale: la schermata mostrata al momento della consegna.",
        cost: 2,
        detail: "La banca del venditore riferisce che il CRO indicato non corrisponde a un vero bonifico istantaneo eseguito quel giorno. L'operazione appare solo come schermata mostrata sul dispositivo dell'imputato.",
        helpful: true,
        mediaType: "image",
        media: "case1_transfer.svg"
      },
      {
        id: "c1c",
        kind: "Chat",
        title: "Conversazione tra venditore e acquirente",
        teaser: "Serve a capire se la consegna era subordinata all'effettivo accredito.",
        cost: 1,
        detail: "La chat mostra che il venditore aveva accettato di consegnare la console solo dopo la visione di una schermata di accredito / bonifico istantaneo. L'imputato insiste sul fatto che sarebbe bastata la schermata.",
        helpful: true,
        mediaType: "image",
        media: "case1_chat.svg"
      },
      {
        id: "c1d",
        kind: "Video",
        title: "Ripresa CCTV del ritiro",
        teaser: "Breve sequenza della consegna nel punto d'incontro.",
        cost: 2,
        detail: "Il video mostra Dario ritirare la console e allontanarsi subito dopo aver mostrato il telefono. Non dimostra da solo la falsità del bonifico, ma conferma il ritiro materiale del bene.",
        helpful: true,
        mediaType: "video",
        media: "case1_cctv.mp4"
      },
      {
        id: "c1e",
        kind: "Accertamento",
        title: "Esito controllo banca",
        teaser: "Un dettaglio tecnico sulla movimentazione del denaro.",
        cost: 1,
        detail: "La banca del venditore conferma che nessun accredito in entrata, né istantaneo né ordinario, è mai stato avviato verso quel conto nelle 48 ore successive. Questo indebolisce fortemente la tesi del semplice ritardo.",
        helpful: true,
        mediaType: "image",
        media: "case1_transfer.svg"
      }
    ],
    verdictOptions: [
      {id:"condanna_truffa", title:"Condanna per truffa", text:"Ritieni provato l'inganno finalizzato a ottenere la console."},
      {id:"assoluzione", title:"Assoluzione", text:"Ritieni che l'elemento del dolo non sia sufficientemente dimostrato."},
      {id:"inadempimento", title:"Solo inadempimento civile", text:"Ritieni che vi sia un mancato pagamento, ma non una vera condotta fraudolenta iniziale."}
    ],
    issueOptions: [
      {id:"schermata_falsa", title:"La schermata bancaria appare simulata o non genuina"},
      {id:"nessun_accredito", title:"Nessun accredito risulta mai partito verso il conto del venditore"},
      {id:"ritiro_bene", title:"Il ritiro materiale della console è confermato"},
      {id:"semplice_ritardo", title:"Il caso è compatibile con un semplice ritardo bancario"}
    ],
    sentence: {
      type: "criminal",
      fields: [
        {id:"months", label:"Mesi di reclusione", min:0, max:24, step:1, default:6, prefix:"", suffix:" mesi"},
        {id:"restitution", label:"Restituzione / risarcimento", min:0, max:1000, step:10, default:300, prefix:"€ ", suffix:""}
      ]
    },
    correct: {
      verdict:"condanna_truffa",
      issues:["schermata_falsa","nessun_accredito","ritiro_bene"],
      sentence:{months:8, restitution:320},
      reasoning:"La lettura più solida è la condanna per truffa. La schermata bancaria è il perno dell'inganno, il denaro non risulta mai partito verso il conto del venditore e il ritiro della console è certo. La tesi del semplice ritardo bancario non regge di fronte al controllo tecnico dell'istituto."
    }
  },
  {
    id: "002",
    type: "Civile",
    title: "Il deposito del monolocale e il parquet rigato",
    subtitle: "Una cauzione da 1.200 euro, un danno reale ma non totale, e una perdita d'acqua che cambia i conti.",
    attentionBudget: 7,
    dossier: "Giulia lascia un monolocale in affitto e chiede la restituzione della cauzione di 1.200 euro. Il proprietario la trattiene integralmente sostenendo che il parquet è stato gravemente rigato e che vi sia stato un danno da acqua vicino alla lavatrice. Giulia replica che parte del danno deriva da una perdita già segnalata e che trattenere tutta la somma è eccessivo.",
    accusation: "Il proprietario afferma che i danni superano l'importo della cauzione. In particolare richiama il parquet rovinato, l'umidità a parete e alcune spese di ripristino.",
    defense: "La conduttrice sostiene che una parte della problematica dipendeva da una perdita d'acqua non imputabile a lei e che i costi di ripristino vadano distinti tra usura, difetti dell'immobile e danni effettivamente causati.",
    mediaItems: [
      {
        id: "c2a",
        kind: "Profilo",
        title: "Scheda dell'attrice",
        teaser: "Ritratto e posizione della parte che chiede il deposito.",
        cost: 1,
        detail: "Giulia R. chiede la restituzione della cauzione, accettando di vedersi imputati solo i danni realmente provati.",
        helpful: false,
        mediaType: "image",
        media: "case2_tenant.svg"
      },
      {
        id: "c2b",
        kind: "Foto",
        title: "Foto del parquet rigato",
        teaser: "Mostra la rigatura principale vicino alla zona giorno.",
        cost: 2,
        detail: "La foto evidenzia una rigatura ampia e non compatibile con la sola usura ordinaria. Il danno appare reale e specifico.",
        helpful: true,
        mediaType: "image",
        media: "case2_parquet.svg"
      },
      {
        id: "c2c",
        kind: "Foto",
        title: "Foto del danno da perdita",
        teaser: "Serve a capire se la macchia sia connessa alla lavatrice o all'impianto.",
        cost: 2,
        detail: "L'area vicino alla lavatrice mostra un danno da umidità. Dalle comunicazioni emerge che la perdita era stata segnalata al proprietario già durante la locazione.",
        helpful: true,
        mediaType: "image",
        media: "case2_leak.svg"
      },
      {
        id: "c2d",
        kind: "Fattura",
        title: "Fattura dettagliata di ripristino",
        teaser: "Un documento più utile di un preventivo generico.",
        cost: 1,
        detail: "La fattura distingue i costi: 260 euro per lucidatura, 110 per il listello, 180 per asciugatura e trattamento, 70 per tinteggiatura. Totale danni provati: 620 euro.",
        helpful: true,
        mediaType: "image",
        media: "case2_invoice.svg"
      },
      {
        id: "c2e",
        kind: "Accertamento",
        title: "Esito manutenzione impianto",
        teaser: "Chiarisce se la perdita fosse stata segnalata in tempo.",
        cost: 1,
        detail: "Nei messaggi inviati due mesi prima della riconsegna, la conduttrice segnala una perdita intermittente vicino al raccordo della lavatrice. Il proprietario risponde che avrebbe fatto controllare, ma non risulta intervento immediato.",
        helpful: true,
        mediaType: "image",
        media: "case2_leak.svg"
      }
    ],
    verdictOptions: [
      {id:"restituzione_parziale", title:"Restituzione parziale della cauzione", text:"Alcuni danni sono provati, ma non giustificano la trattenuta totale."},
      {id:"restituzione_totale", title:"Restituzione totale", text:"Ritieni che i danni non siano imputabili o non siano provati."},
      {id:"trattenuta_totale", title:"Trattenuta totale", text:"Ritieni giustificato trattenere l'intera cauzione."}
    ],
    issueOptions: [
      {id:"rigatura_reale", title:"La rigatura del parquet è un danno effettivo imputabile alla conduttrice"},
      {id:"perdita_segnalata", title:"La perdita d'acqua era stata segnalata prima della riconsegna"},
      {id:"fattura_distinta", title:"La fattura consente una quantificazione precisa dei danni"},
      {id:"intera_cauzione", title:"I danni giustificano certamente tutti i 1.200 euro"}
    ],
    sentence: {
      type: "civil",
      fields: [
        {id:"refund", label:"Importo da restituire alla conduttrice", min:0, max:1200, step:10, default:700, prefix:"€ ", suffix:""}
      ]
    },
    correct: {
      verdict:"restituzione_parziale",
      issues:["rigatura_reale","perdita_segnalata","fattura_distinta"],
      sentence:{refund:580},
      reasoning:"La decisione più equilibrata è la restituzione parziale. Alcuni danni sono certamente imputabili alla conduttrice, in particolare la rigatura del parquet, ma la perdita d'acqua era stata segnalata e non può essere ribaltata integralmente su di lei. Dalla fattura emergono danni quantificati per 620 euro: su una cauzione di 1.200 euro, la somma da restituire è quindi 580 euro."
    }
  },
  {
    id: "003",
    type: "Penale",
    title: "Il pugno nel parcheggio del pub",
    subtitle: "Una lite notturna, un testimone indipendente e un video che mostra il colpo decisivo.",
    attentionBudget: 7,
    dossier: "Dopo una discussione fuori da un pub, Simone colpisce Matteo al volto nel parcheggio. La persona offesa riporta frattura composta del setto nasale e contusione allo zigomo. L'imputato sostiene di aver reagito d'istinto a una provocazione e di essere stato spinto per primo.",
    accusation: "Per l'accusa, Simone aggredisce la vittima quando il confronto verbale era già in fase di allontanamento. Il colpo appare volontario e non necessario per difendersi.",
    defense: "La difesa invoca il clima concitato, la provocazione subita e un contesto di reciproca ostilità. Sostiene che la reazione sia stata immediata e non preordinata.",
    mediaItems: [
      {
        id: "c3a",
        kind: "Profilo",
        title: "Scheda dell'imputato",
        teaser: "Ritratto del soggetto accusato dell'aggressione.",
        cost: 1,
        detail: "La scheda è utile per contestualizzare il soggetto, ma non è decisiva per la responsabilità.",
        helpful: false,
        mediaType: "image",
        media: "case3_suspect.svg"
      },
      {
        id: "c3b",
        kind: "Referto",
        title: "Certificato medico della persona offesa",
        teaser: "Stabilisce la natura e la durata delle lesioni.",
        cost: 1,
        detail: "Il referto parla di frattura composta del setto nasale e 18 giorni di prognosi. Il trauma è compatibile con un colpo diretto al volto.",
        helpful: true,
        mediaType: "image",
        media: "case3_medical.svg"
      },
      {
        id: "c3c",
        kind: "Testimonianza",
        title: "Dichiarazione del testimone indipendente",
        teaser: "Un soggetto terzo può chiarire chi stava aggredendo e chi no.",
        cost: 1,
        detail: "Il testimone dichiara di aver visto Simone spingere Matteo contro un'auto e colpirlo mentre la vittima stava parlando ma non stava colpendo in quel momento.",
        helpful: true,
        mediaType: "image",
        media: "case3_witness.svg"
      },
      {
        id: "c3d",
        kind: "Video",
        title: "Clip del parcheggio",
        teaser: "La ripresa mostra la fase finale della lite.",
        cost: 2,
        detail: "La clip non mostra l'inizio del litigio, ma riprende la fase finale: si vede Matteo retrocedere verso un'auto e Simone avanzare con un pugno al volto. Questo indebolisce la tesi della legittima difesa attuale.",
        helpful: true,
        mediaType: "video",
        media: "case3_video.mp4"
      },
      {
        id: "c3e",
        kind: "Accertamento",
        title: "Valutazione sulla provocazione",
        teaser: "Non ogni offesa verbale giustifica una reazione fisica.",
        cost: 2,
        detail: "Anche ammettendo parole offensive o spinte precedenti, nella sequenza finale documentata l'imputato non appare costretto a difendersi da un'aggressione in atto. La reazione è sproporzionata rispetto al pericolo attuale.",
        helpful: true,
        mediaType: "image",
        media: "case3_witness.svg"
      }
    ],
    verdictOptions: [
      {id:"condanna_lesioni", title:"Condanna per lesioni personali", text:"Ritieni provata un'aggressione volontaria con esito lesivo."},
      {id:"provocazione_lieve", title:"Responsabilità attenuata per provocazione", text:"Ritieni il fatto provato ma notevolmente ridimensionato."},
      {id:"assoluzione_legittima", title:"Assoluzione per legittima difesa", text:"Ritieni che il colpo sia stato necessario per difendersi."}
    ],
    issueOptions: [
      {id:"referto", title:"Il referto medico conferma una lesione concreta e non lieve"},
      {id:"video_finale", title:"Il video mostra il colpo in una fase in cui la vittima sta arretrando"},
      {id:"testimone_terzo", title:"Il testimone indipendente conferma una dinamica aggressiva"},
      {id:"difesa_attuale", title:"È credibile una reale necessità di difendersi in quel momento"}
    ],
    sentence: {
      type: "criminal",
      fields: [
        {id:"months", label:"Mesi di reclusione", min:0, max:24, step:1, default:4, prefix:"", suffix:" mesi"},
        {id:"compensation", label:"Risarcimento alla persona offesa", min:0, max:5000, step:50, default:1200, prefix:"€ ", suffix:""}
      ]
    },
    correct: {
      verdict:"condanna_lesioni",
      issues:["referto","video_finale","testimone_terzo"],
      sentence:{months:5, compensation:1500},
      reasoning:"La soluzione più corretta è la condanna per lesioni personali. Il referto documenta un danno non trascurabile, il testimone indipendente descrive una condotta aggressiva e il video mostra la fase finale con la vittima in arretramento. La legittima difesa non appare attuale né necessaria in quel momento."
    }
  }
];

let caseIndex = 0;
let step = 0;
let attentionRemaining = 0;
let totalAttention = 0;
let openedItems = new Set();
let selectedVerdict = null;
let selectedIssues = [];
let motivation = "";
let sentenceValues = {};

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");
const contentCard = document.getElementById("contentCard");
const caseNumber = document.getElementById("caseNumber");
const caseType = document.getElementById("caseType");
const caseTitle = document.getElementById("caseTitle");
const caseSubtitle = document.getElementById("caseSubtitle");
const attentionValue = document.getElementById("attentionValue");
const attentionFill = document.getElementById("attentionFill");
const openedCount = document.getElementById("openedCount");
const openedFill = document.getElementById("openedFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const tabs = Array.from(document.querySelectorAll(".tab"));

const modal = document.getElementById("mediaModal");
const modalMedia = document.getElementById("modalMedia");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

const overlay = document.getElementById("verdictOverlay");
const overlayPanel = overlay.querySelector(".overlay-panel");
const overlayStamp = document.getElementById("overlayStamp");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const overlayChip = document.getElementById("overlayChip");

function currentCase() { return cases[caseIndex]; }

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showScreen(screen) {
  [startScreen, gameScreen, resultScreen].forEach(el => el.classList.remove("active"));
  screen.classList.add("active");
}

function updateHeader() {
  const c = currentCase();
  caseNumber.textContent = `Caso #${c.id}`;
  caseType.textContent = c.type;
  caseTitle.textContent = c.title;
  caseSubtitle.textContent = c.subtitle;
  attentionValue.textContent = `${attentionRemaining} / ${totalAttention}`;
  openedCount.textContent = `${openedItems.size}`;
  attentionFill.style.width = `${(attentionRemaining / totalAttention) * 100}%`;
  openedFill.style.width = `${(openedItems.size / c.mediaItems.length) * 100}%`;
  tabs.forEach((tab, idx) => tab.classList.toggle("active", idx === step));
  prevBtn.disabled = step === 0;
  nextBtn.textContent = step === 4 ? "Emetti la sentenza" : "Avanti";
}

function renderDossier(c) {
  contentCard.innerHTML = `
    <h3>Dossier del caso</h3>
    <p class="lead">${escapeHtml(c.dossier)}</p>
    <div class="document-sheet">
      <h4>Obiettivo del giudice</h4>
      <p>Separare l'impressione iniziale dalla struttura probatoria reale. In questa versione del gioco, puoi aprire direttamente foto, documenti e video, ma ogni scelta consuma attenzione.</p>
    </div>
    <div class="callout">
      <strong>Consiglio strategico:</strong> apri prima le prove che possono cambiare il risultato, non quelle che sono solo curiose.
    </div>
  `;
}

function renderAccusa(c) {
  contentCard.innerHTML = `
    <h3>Tesi dell'accusa</h3>
    <div class="document-sheet">
      <h4>Argomentazione</h4>
      <p>${escapeHtml(c.accusation)}</p>
    </div>
    <div class="callout">
      <strong>Domanda guida:</strong> l'accusa dispone di una catena logica completa oppure pretende di riempire i vuoti con supposizioni?
    </div>
  `;
}

function renderDifesa(c) {
  contentCard.innerHTML = `
    <h3>Tesi della difesa</h3>
    <div class="document-sheet">
      <h4>Argomentazione</h4>
      <p>${escapeHtml(c.defense)}</p>
    </div>
    <div class="callout">
      <strong>Domanda guida:</strong> la difesa introduce un dubbio concreto e verificabile o propone una versione poco compatibile con i media e gli accertamenti?
    </div>
  `;
}

function mediaMarkup(item) {
  if (item.mediaType === "video") {
    return `<video src="${item.media}" autoplay muted loop playsinline></video>`;
  }
  return `<img src="${item.media}" alt="${escapeHtml(item.title)}" />`;
}

function renderProve(c) {
  contentCard.innerHTML = `
    <h3>Prove, media e documenti</h3>
    <p class="lead">Apri i contenuti che ritieni davvero utili: ognuno ha un costo in attenzione.</p>
    <div class="grid">
      ${c.mediaItems.map(item => {
        const opened = openedItems.has(item.id);
        const locked = !opened && item.cost > attentionRemaining;
        return `
          <div class="media-card ${opened ? 'opened' : ''} ${locked ? 'locked' : ''}">
            <div class="media-thumb">${mediaMarkup(item)}</div>
            <div class="media-copy">
              <div class="media-meta">
                <span>${escapeHtml(item.kind)}</span>
                <span class="media-cost">Costo ${item.cost}</span>
              </div>
              <div class="media-title">${escapeHtml(item.title)}</div>
              <p>${escapeHtml(item.teaser)}</p>
              ${opened ? `
                <div class="reveal-box">
                  ${escapeHtml(item.detail)}
                  <div class="reveal-actions">
                    <button class="small-btn preview-btn" data-id="${item.id}">Apri media</button>
                  </div>
                </div>
              ` : `
                <button class="btn ${locked ? 'btn-ghost' : 'btn-primary'} open-media-btn" data-id="${item.id}" ${locked ? 'disabled' : ''}>
                  ${locked ? 'Attenzione insufficiente' : 'Approfondisci'}
                </button>
              `}
            </div>
          </div>
        `;
      }).join("")}
    </div>
    <div class="callout">
      <strong>Nota:</strong> i contenuti visivi non servono solo a fare scena. Devi chiederti quanto pesano davvero sul verdetto.
    </div>
  `;

  document.querySelectorAll(".open-media-btn").forEach(btn => {
    btn.addEventListener("click", () => openItem(btn.dataset.id));
  });

  document.querySelectorAll(".preview-btn").forEach(btn => {
    btn.addEventListener("click", () => previewItem(btn.dataset.id));
  });
}

function sentenceFieldsMarkup(c) {
  return c.sentence.fields.map(field => {
    const value = sentenceValues[field.id] ?? field.default;
    return `
      <div class="form-field">
        <label for="field_${field.id}">${escapeHtml(field.label)}</label>
        <input id="field_${field.id}" type="number" min="${field.min}" max="${field.max}" step="${field.step}" value="${value}" data-id="${field.id}" />
        <small>${escapeHtml(field.prefix || '')}${value}${escapeHtml(field.suffix || '')}</small>
      </div>
    `;
  }).join("");
}

function renderSentenza(c) {
  contentCard.innerHTML = `
    <h3>Componi la sentenza</h3>

    <p>Scegli il verdetto finale:</p>
    <div>
      ${c.verdictOptions.map(option => `
        <button class="choice-card verdict-choice ${selectedVerdict === option.id ? 'selected' : ''}" data-id="${option.id}">
          ${escapeHtml(option.title)}
          <small>${escapeHtml(option.text)}</small>
        </button>
      `).join("")}
    </div>

    <p>Seleziona i punti che ritieni decisivi:</p>
    <div>
      ${c.issueOptions.map(option => `
        <button class="choice-card issue-choice ${selectedIssues.includes(option.id) ? 'selected' : ''}" data-id="${option.id}">
          ${escapeHtml(option.title)}
        </button>
      `).join("")}
    </div>

    <p>Definisci anche la parte quantitativa della decisione:</p>
    <div class="form-grid">
      ${sentenceFieldsMarkup(c)}
    </div>

    <textarea id="motivationBox" placeholder="Motiva la sentenza: spiega perché hai scelto questo verdetto e perché la quantificazione è proporzionata.">${escapeHtml(motivation)}</textarea>

    <div class="callout">
      <strong>Ricorda:</strong> la tua valutazione finale non dipende solo da chi scegli di condannare o assolvere, ma anche da quanto la tua sentenza è proporzionata e ben motivata.
    </div>
  `;

  document.querySelectorAll(".verdict-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedVerdict = btn.dataset.id;
      renderSentenza(c);
    });
  });

  document.querySelectorAll(".issue-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (selectedIssues.includes(id)) {
        selectedIssues = selectedIssues.filter(x => x !== id);
      } else {
        selectedIssues.push(id);
      }
      renderSentenza(c);
    });
  });

  document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", e => {
      sentenceValues[e.target.dataset.id] = Number(e.target.value);
      const small = e.target.parentElement.querySelector("small");
      const field = c.sentence.fields.find(f => f.id === e.target.dataset.id);
      if (small && field) {
        small.textContent = `${field.prefix || ''}${e.target.value}${field.suffix || ''}`;
      }
    });
  });

  document.getElementById("motivationBox").addEventListener("input", e => {
    motivation = e.target.value;
  });
}

function renderStep() {
  const c = currentCase();
  updateHeader();
  if (step === 0) renderDossier(c);
  if (step === 1) renderAccusa(c);
  if (step === 2) renderDifesa(c);
  if (step === 3) renderProve(c);
  if (step === 4) renderSentenza(c);
}

function openItem(itemId) {
  const c = currentCase();
  const item = c.mediaItems.find(x => x.id === itemId);
  if (!item || openedItems.has(item.id) || item.cost > attentionRemaining) return;
  attentionRemaining -= item.cost;
  openedItems.add(item.id);
  renderProve(c);
  updateHeader();
}

function previewItem(itemId) {
  const item = currentCase().mediaItems.find(x => x.id === itemId);
  if (!item) return;
  modal.classList.add("show");
  modalTitle.textContent = item.title;
  modalDescription.textContent = item.detail;
  if (item.mediaType === "video") {
    modalMedia.innerHTML = `<video src="${item.media}" controls autoplay loop muted playsinline></video>`;
  } else {
    modalMedia.innerHTML = `<img src="${item.media}" alt="${escapeHtml(item.title)}" />`;
  }
}

function closeModal() {
  modal.classList.remove("show");
  modalMedia.innerHTML = "";
}

function sentenceSubscore(c) {
  let points = 0;
  let notes = [];
  for (const field of c.sentence.fields) {
    const chosen = Number(sentenceValues[field.id] ?? field.default);
    const ideal = Number(c.correct.sentence[field.id] ?? 0);
    const range = Math.max(field.max - field.min, 1);
    const diff = Math.abs(chosen - ideal);
    let local = Math.max(0, 10 - Math.round((diff / range) * 20));
    if (field.id === "months") local = Math.max(0, 10 - diff * 2);
    if (field.id === "restitution" || field.id === "refund" || field.id === "compensation") local = Math.max(0, 10 - Math.round(diff / 80));
    points += local;
    if (diff === 0) {
      notes.push(`La quantificazione di "${field.label}" è perfettamente allineata.`);
    } else if (diff <= Math.max(field.step * 2, 20)) {
      notes.push(`La quantificazione di "${field.label}" è molto vicina a quella più equilibrata.`);
    } else {
      notes.push(`La quantificazione di "${field.label}" è poco proporzionata rispetto al caso.`);
    }
  }
  return { score: Math.min(20, Math.max(0, points)), notes };
}

function calculateScores(c) {
  let legal = 0;
  let evidence = 0;
  let motivationScore = 0;
  const feedback = [];

  if (selectedVerdict === c.correct.verdict) {
    legal += 35;
    feedback.push("Hai scelto il verdetto più coerente con il quadro processuale.");
  } else if (selectedVerdict) {
    legal += 12;
    feedback.push("Il verdetto scelto non coglie con precisione il cuore giuridico del caso.");
  } else {
    feedback.push("Non hai indicato un verdetto finale.");
  }

  const correctIssues = c.correct.issues;
  const rightIssues = selectedIssues.filter(id => correctIssues.includes(id));
  const wrongIssues = selectedIssues.filter(id => !correctIssues.includes(id));
  evidence += Math.min(25, rightIssues.length * 8);
  evidence -= wrongIssues.length * 4;

  if (rightIssues.length > 0) feedback.push(`Hai identificato ${rightIssues.length} elemento/i decisivo/i.`);
  if (wrongIssues.length > 0) feedback.push("Hai attribuito peso anche a elementi secondari o fuorvianti.");

  const helpfulOpened = c.mediaItems.filter(item => openedItems.has(item.id) && item.helpful).length;
  const uselessOpened = c.mediaItems.filter(item => openedItems.has(item.id) && !item.helpful).length;
  evidence += Math.min(10, helpfulOpened * 2);
  evidence -= Math.min(4, uselessOpened);

  if (helpfulOpened >= 2) {
    feedback.push("Hai usato bene il budget di attenzione, aprendo media davvero utili.");
  } else {
    feedback.push("Potevi usare meglio il budget di attenzione per consultare i media più rilevanti.");
  }

  const ss = sentenceSubscore(c);
  ss.notes.forEach(n => feedback.push(n));

  const cleanMotivation = motivation.trim();
  if (cleanMotivation.length >= 150) {
    motivationScore = 20;
    feedback.push("La motivazione è ampia e collega bene prove, verdetto e quantificazione.");
  } else if (cleanMotivation.length >= 80) {
    motivationScore = 12;
    feedback.push("La motivazione è buona, ma poteva essere ancora più incisiva.");
  } else if (cleanMotivation.length >= 30) {
    motivationScore = 6;
    feedback.push("Hai motivato la decisione in modo essenziale.");
  } else {
    feedback.push("La motivazione è troppo breve: la sentenza deve essere anche spiegata.");
  }

  legal = Math.max(0, Math.min(35, legal));
  evidence = Math.max(0, Math.min(25, evidence));
  const sentenceScore = Math.max(0, Math.min(20, ss.score));
  motivationScore = Math.max(0, Math.min(20, motivationScore));
  const total = Math.max(0, Math.min(100, legal + evidence + sentenceScore + motivationScore));

  return { total, legal, evidence, sentenceScore, motivationScore, feedback };
}

function judgeProfile(scores) {
  if (scores.total >= 90) return "Giudice stratega";
  if (scores.total >= 76) return "Giudice equilibrato";
  if (scores.total >= 60) return "Giudice intuitivo";
  return "Giudice impulsivo";
}

function resultTitle(score) {
  if (score >= 90) return "Sentenza magistrale";
  if (score >= 76) return "Sentenza solida";
  if (score >= 60) return "Sentenza discutibile";
  return "Sentenza fragile";
}

function resultSummary(score) {
  if (score >= 90) return "Hai gestito bene i media, il ragionamento e la parte quantitativa della decisione.";
  if (score >= 76) return "Hai giudicato bene: resta solo qualche margine di rifinitura.";
  if (score >= 60) return "Hai colto parte del caso, ma non tutto il suo equilibrio interno.";
  return "La tua decisione appare più istintiva che costruita sulle prove.";
}

function showVerdictOverlay(score) {
  overlay.classList.add("show");
  overlayPanel.classList.remove("good","bad");
  const good = score >= 76;
  overlayPanel.classList.add(good ? "good" : "bad");
  overlayStamp.textContent = good ? "✓" : "!";
  overlayTitle.textContent = good ? "Colpo di martelletto!" : "Sentenza contestata";
  overlayText.textContent = good
    ? "La tua decisione regge bene sotto il peso delle prove."
    : "La scena è forte, ma la logica della sentenza è ancora debole.";
  overlayChip.textContent = good ? "VERDETTO CONVINCENTE" : "VERDETTO RIVEDIBILE";
  setTimeout(() => overlay.classList.remove("show"), 2000);
}

function showResult() {
  const c = currentCase();
  const scores = calculateScores(c);
  showVerdictOverlay(scores.total);

  document.getElementById("resultHeading").textContent = resultTitle(scores.total);
  document.getElementById("scoreValue").textContent = scores.total;
  document.getElementById("scoreSummary").textContent = resultSummary(scores.total);
  document.getElementById("evidenceScore").textContent = scores.evidence;
  document.getElementById("legalScore").textContent = scores.legal;
  document.getElementById("sentenceScore").textContent = scores.sentenceScore;
  document.getElementById("motivationScore").textContent = scores.motivationScore;
  document.getElementById("judgeProfile").textContent = judgeProfile(scores);
  document.getElementById("officialReasoning").textContent = c.correct.reasoning;

  const verdictLabel = c.verdictOptions.find(v => v.id === selectedVerdict)?.title || "Nessun verdetto";
  const pills = [
    `<span class="summary-pill">${escapeHtml(verdictLabel)}</span>`,
    ...selectedIssues.map(id => {
      const label = c.issueOptions.find(i => i.id === id)?.title;
      return label ? `<span class="summary-pill">${escapeHtml(label)}</span>` : "";
    }).filter(Boolean)
  ];
  const quantities = c.sentence.fields.map(f => {
    const val = sentenceValues[f.id] ?? f.default;
    return `<span class="summary-pill">${escapeHtml(f.label)}: ${escapeHtml((f.prefix || '') + val + (f.suffix || ''))}</span>`;
  }).join("");

  document.getElementById("playerSummary").innerHTML = `
    ${pills.join("")}
    ${quantities}
    <p>${motivation.trim() ? escapeHtml(motivation.trim()) : "Nessuna motivazione scritta."}</p>
  `;

  document.getElementById("feedbackList").innerHTML = scores.feedback.map(item => `<li>${escapeHtml(item)}</li>`).join("");

  document.getElementById("scoreRing").style.background =
    `radial-gradient(circle at center,#fff4da 58%,transparent 59%), conic-gradient(var(--red) ${scores.total * 3.6}deg,#fff 0deg)`;

  showScreen(resultScreen);
}

function resetCaseState() {
  const c = currentCase();
  step = 0;
  attentionRemaining = c.attentionBudget;
  totalAttention = c.attentionBudget;
  openedItems = new Set();
  selectedVerdict = null;
  selectedIssues = [];
  motivation = "";
  sentenceValues = {};
  c.sentence.fields.forEach(field => sentenceValues[field.id] = field.default);
}

function startCase() {
  resetCaseState();
  renderStep();
  showScreen(gameScreen);
}

function nextCase() {
  caseIndex = (caseIndex + 1) % cases.length;
  startCase();
}

document.getElementById("startBtn").addEventListener("click", startCase);

prevBtn.addEventListener("click", () => {
  if (step > 0) {
    if (step === 4) {
      const box = document.getElementById("motivationBox");
      if (box) motivation = box.value;
    }
    step--;
    renderStep();
  }
});

nextBtn.addEventListener("click", () => {
  if (step === 4) {
    const box = document.getElementById("motivationBox");
    if (box) motivation = box.value;
    if (!selectedVerdict) {
      alert("Prima scegli un verdetto.");
      return;
    }
    showResult();
    return;
  }
  step++;
  renderStep();
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    if (step === 4) {
      const box = document.getElementById("motivationBox");
      if (box) motivation = box.value;
    }
    step = Number(tab.dataset.step);
    renderStep();
  });
});

document.getElementById("closeModalBtn").addEventListener("click", closeModal);
modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);

document.getElementById("copyBtn").addEventListener("click", () => {
  const c = currentCase();
  const score = document.getElementById("scoreValue").textContent;
  const heading = document.getElementById("resultHeading").textContent;
  const profile = document.getElementById("judgeProfile").textContent;
  const text = `VERDETTO! - Caso #${c.id}
${heading}
Punteggio: ${score}/100
Profilo: ${profile}
Caso: ${c.title}
Ho emesso una sentenza completa. Tu come avresti deciso?`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copyBtn");
    btn.textContent = "Risultato copiato";
    setTimeout(() => btn.textContent = "Copia risultato", 1200);
  });
});

document.getElementById("newCaseBtn").addEventListener("click", nextCase);
document.getElementById("restartBtn").addEventListener("click", startCase);
