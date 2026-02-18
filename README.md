# Serendip Studio — Presentazione Interattiva

Presentazione fullscreen a 15 slide in HTML/CSS/JS puro.  
Nessuna dipendenza, nessun framework, funziona aprendo `index.html` nel browser.

---

## 📁 Struttura del progetto

```
serendip-studio-presentation/
├── index.html        ← Contenuto di tutte le slide (editabile)
├── css/
│   └── style.css     ← Tutti gli stili e il design system
├── js/
│   └── app.js        ← Logica di navigazione
└── README.md
```

---

## 🚀 Come usarlo

### Apri in locale
Basta aprire `index.html` con qualsiasi browser moderno — non serve un server.

### Deploy su GitHub Pages
1. Vai su **Settings → Pages** nel tuo repo
2. Seleziona **Source: Deploy from a branch**
3. Scegli `main` → `/ (root)` → **Save**
4. La presentazione sarà live su `https://tuo-username.github.io/nome-repo/`

---

## ✏️ Come modificare i contenuti

### Testi e prezzi → `index.html`
Ogni slide è un `<div class="slide">` ben commentato:

```html
<!-- SLIDE 4 — Sviluppo Sito Web -->
<div class="slide" data-index="4" data-label="Sviluppo Sito Web">
  ...
</div>
```

**Aggiungere una slide:**
1. Duplica un blocco `<div class="slide">` in `index.html`
2. Aggiorna `data-index` in sequenza e imposta `data-label`
3. Il dot nav e il menu si aggiornano automaticamente

**Rimuovere una slide:**
1. Elimina il blocco `<div class="slide">` corrispondente
2. Rinumera i `data-index` degli altri (devono essere continui da 0)

**Cambiare il nome di una slide** (compare nel menu e nei dot):
```html
data-label="Nuovo Nome Slide"
```

---

### Colori e stile → `css/style.css`
Tutte le variabili di colore sono nelle prime righe del file:

```css
:root {
  --bg:       #000000;   /* sfondo principale */
  --surface:  rgba(255,255,255,0.06); /* sfondo card */
  --border:   rgba(255,255,255,0.10); /* bordi */
  /* ... */
}
```

Per cambiare il tema da scuro a chiaro, modifica queste variabili.

---

### Logica di navigazione → `js/app.js`
Le costanti in cima al file controllano le animazioni:

```js
var TRANSITION_MS = 580;  // durata transizione slide (ms)
var WHEEL_LOCK_MS = 700;  // debounce scroll wheel (ms)
var SWIPE_MIN     = 40;   // px minimi per registrare uno swipe
```

---

## ⌨️ Navigazione (utente finale)

| Input              | Azione                          |
|--------------------|---------------------------------|
| `→` `↓` `Space`    | Slide successiva                |
| `←` `↑`            | Slide precedente                |
| `Home`             | Prima slide                     |
| `End`              | Ultima slide                    |
| Swipe verticale    | Slide avanti/indietro (mobile)  |
| Scroll wheel       | Slide avanti/indietro           |
| Dot nella topbar   | Vai a quella slide              |
| Bottone `⋮`        | Apri indice completo            |

---

## 🎨 Classi utili

### Griglie card
```html
<div class="cards-grid cards-grid-3"> <!-- 3 colonne → 2 su tablet → 1 su mobile -->
<div class="cards-grid cards-grid-2"> <!-- 2 colonne → 1 su mobile -->
```

### Tipografia
```html
<h1 class="t-display-xl">Titolo enorme</h1>
<h2 class="t-display">Titolo grande</h2>
<h2 class="t-title">Titolo sezione</h2>
<p  class="t-body">Testo corpo</p>
<p  class="t-caption">Caption / label</p>
```

### Opacità testo
```html
<span class="muted">Testo grigio scuro</span>
<span class="semi">Testo grigio medio</span>
```

### Card con prezzo
```html
<div class="card">
  <div class="card-icon">📄</div>
  <div class="card-title">Titolo</div>
  <div class="card-body">Descrizione</div>
  <ul class="feature-list">
    <li>Feature 1</li>
  </ul>
  <div class="card-price">
    <span class="card-price-n">da 450€</span>
    <span class="card-price-t">+ IVA</span>
  </div>
</div>
```

---

## 📋 Slide presenti

| #  | Label                   | Tipo                     |
|----|-------------------------|--------------------------|
| 0  | Serendip Studio         | Hero / Cover             |
| 1  | Il Nostro Approccio     | Manifesto                |
| 2  | I Tuoi Obiettivi        | Tabella obiettivi        |
| 3  | I Servizi               | Panoramica servizi       |
| 4  | Sviluppo Sito Web       | 3 card con prezzi        |
| 5  | Brand Identity          | 2 card con prezzi        |
| 6  | Social Media Marketing  | Tabella comparativa      |
| 7  | TikTok & Influencer     | 3 card con prezzi        |
| 8  | ADS & Email             | 2 card con prezzi        |
| 9  | Content Creation        | 2 card con prezzi        |
| 10 | Case Studies            | 3 case study             |
| 11 | Come Lavoriamo          | 4 fasi del processo      |
| 12 | Il Team                 | Griglia team             |
| 13 | Riepilogo Prezzi        | Lista prezzi completa    |
| 14 | Iniziamo                | CTA + contatti           |

---

## 🌐 Browser supportati

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, Safari iOS 14+, Chrome Android 90+
