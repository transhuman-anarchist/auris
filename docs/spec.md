# PROMPT PER CLAUDE CODE — EAR TRAINER APP
## "AURIS" — Ear Training RPG

---

## CONTESTO GENERALE

Costruisci da zero un'applicazione web completa chiamata **AURIS** — un ear trainer interattivo in stile RPG/videogioco con estetica metal/industrial, pensato per un bassista che vuole raggiungere il livello di trascrizione, improvvisazione, riconoscimento armonico avanzato e intonazione assoluta sul fretless.

Stack: **React + Vite**. Tutto il suono generato via **Web Audio API** (zero librerie audio esterne). Salvataggio progressi con **localStorage**. UI in **italiano**.

---

## ESTETICA VISIVA — OBBLIGATORIA, NON NEGOZIABILE

L'app deve sembrare un videogioco metal/industrial underground. Non un'app educativa pulita. Non Material Design. Non Bootstrap. Il riferimento visivo è: copertine di album death metal, interfacce militari distopiche, aesthetic da terminal hacker, con la chiarezza UX di un videogioco di ruolo.

### Palette colori
- Background dominante: nero profondo `#080808` con texture noise sottile (SVG o CSS)
- Accento primario: **rosso sangue** `#8B0000` / `#C41E3A`
- Accento secondario: **arancio forgiato** `#D4500A`
- Testo principale: bianco sporco `#E8E3DC`
- Testo secondario: grigio cenere `#8A8480`
- Successo: verde acido `#39FF14` (neon, usato con parsimonia)
- Errore: rosso acceso `#FF2020`
- XP / progressi: oro antico `#C9A84C`
- Bordi: `#2A2520` con occasionale glow rosso su elementi attivi

### Tipografia
- Display / titoli: font **"Metal Mania"** o **"Cinzel Decorative"** (Google Fonts) — per titoli, nomi capitoli, UI principale
- Monospace / stats / numeri: **"Share Tech Mono"** o **"VT323"** (Google Fonts) — per XP, statistiche, valori
- Body / testo leggibile: **"Barlow Condensed"** (Google Fonts) — per descrizioni, istruzioni

### Effetti visivi
- Texture noise su background (SVG filter `feTurbulence` o CSS background con opacity bassa)
- Scanlines sottili su header e pannelli principali (CSS `repeating-linear-gradient`)
- Glow rosso su elementi selezionati / attivi (`box-shadow: 0 0 12px #C41E3A`)
- Animazioni di unlock capitolo: flash bianco + shake + suono sintetico
- Barra XP con animazione fill fluida
- Stelle dei capitoli: icone a forma di teschio o runa, non stelle generiche
- Cursor custom: crosshair sottile in rosso
- Particelle di background opzionali (punti luminosi lenti, come stelle morte)

### Mappa mondiale (Candy Crush style)
- Path tortuoso su sfondo scuro con texture di pietra o metallo
- Nodi capitolo: cerchi/esagoni con numero inciso
- Nodo completato: oro/rame con simbolo unlock
- Nodo corrente: pulsante con glow rosso e animazione pulse
- Nodo bloccato: grigio con lucchetto, leggermente traslucido
- Mondi separati: sezioni visive distinte con nome del mondo inciso (es. "MONDO I — FONDAMENTA")
- Connessioni tra nodi: linee metalliche/catene animate

---

## ARCHITETTURA DEL PROGETTO

```
auris/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css (global styles, CSS variables, fonts)
│   │
│   ├── audio/
│   │   ├── AudioEngine.js        ← Web Audio API, generazione note
│   │   ├── instruments.js        ← Definizione timbri (vedi sotto)
│   │   ├── droneEngine.js        ← Gestione drone continuo
│   │   └── rhythmEngine.js       ← Generazione pattern ritmici
│   │
│   ├── data/
│   │   ├── curriculum.js         ← Struttura completa mondi/capitoli/esercizi
│   │   ├── exerciseGenerators.js ← Logica generazione esercizi
│   │   └── progressionRules.js   ← Regole unlock, XP, livelli
│   │
│   ├── store/
│   │   └── gameStore.js          ← Stato globale (Zustand)
│   │
│   ├── hooks/
│   │   ├── useAudio.js
│   │   ├── useProgress.js
│   │   └── useExercise.js
│   │
│   ├── components/
│   │   ├── WorldMap/
│   │   │   ├── WorldMap.jsx
│   │   │   ├── WorldNode.jsx
│   │   │   └── WorldPath.jsx
│   │   ├── Exercise/
│   │   │   ├── ExerciseShell.jsx     ← Wrapper comune a tutti gli esercizi
│   │   │   ├── NoteGrid.jsx          ← Griglia 12 note cliccabile
│   │   │   ├── DroneBar.jsx          ← Controllo drone
│   │   │   ├── InstrumentPicker.jsx  ← Selettore timbro
│   │   │   ├── RetentionTimer.jsx    ← Timer per retention drills
│   │   │   └── FeedbackOverlay.jsx   ← Overlay corretto/sbagliato
│   │   ├── HUD/
│   │   │   ├── XPBar.jsx
│   │   │   ├── StreakCounter.jsx
│   │   │   ├── LevelBadge.jsx
│   │   │   └── SessionStats.jsx
│   │   └── UI/
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       └── Tooltip.jsx
│   │
│   └── pages/
│       ├── MapPage.jsx
│       ├── ChapterPage.jsx
│       └── ExercisePage.jsx
```

---

## SISTEMA AUDIO — WEB AUDIO API

### Timbri disponibili (selezionabili dall'utente in ogni esercizio)

Implementa questi timbri con oscillatori e filtri:

1. **Basso elettrico** (priorità massima — è il contesto dell'utente)
   - Oscillatore sawtooth + lowpass filter (cutoff ~800Hz, Q 1.5)
   - Leggero chorus (due oscillatori detuned ±4 cents)
   - Attack 8ms, decay 200ms, sustain 0.7, release 400ms
   - Sub-oscillatore sine un'ottava sotto a volume 0.3

2. **Basso fretless**
   - Come basso elettrico ma con pitch glide (portamento 80ms tra note consecutive)
   - Sine + triangle blend, più caldo
   - Vibrato sinusoidale opzionale (rate 5Hz, depth 15 cents)

3. **Piano**
   - Oscillatori harmonics con envelope percussivo
   - Attack 5ms, decay variabile per ottava, sustain basso, release 800ms

4. **Campana (Bell)**
   - Sine + partials inharmonici (×2.756, ×5.404, ×8.933)
   - Envelope: attack 2ms, long decay esponenziale

5. **Organo**
   - Drawbars simulati: 8 harmonics con ampiezze configurabili
   - Sustain piatto, no decay

6. **Archi (Strings)**
   - Sawtooth + ensemble (4 oscillatori detuned ±8, ±16 cents)
   - Attack lento 180ms, release 600ms

7. **Synth Pad**
   - Sine + triangle blend, chorus pesante
   - Utile per droni lunghi

8. **Marimba/Xilofono**
   - Sine con partials a ×4 e ×10 con decay rapido
   - Colpisce bene per esercizi di intonazione

### Drone Engine
- Nota continua con fadeIn/fadeOut fluidi (200ms)
- Timbro configurabile separatamente dal timbro quiz
- Ottava configurabile
- Volume indipendente
- Possibilità di drone su accordo (tonica + quinta)

### Retention Timer
- Silenzio controllato tra ascolto e risposta
- Durata configurabile: 2s / 5s / 10s / 15s / 30s
- Visual countdown durante il silenzio

---

## CURRICULUM COMPLETO

### SISTEMA DI LIVELLI CAPITOLO
Ogni capitolo ha 3 stelle:
- ⭐ Bronzo: 60% accuratezza su 20 risposte consecutive
- ⭐⭐ Argento: 80% accuratezza su 30 risposte consecutive
- ⭐⭐⭐ Oro: 95% accuratezza su 50 risposte consecutive

Bronzo sblocca il capitolo successivo. Oro sblocca contenuto bonus (esercizi extra, varianti avanzate).

Ogni esercizio ha parametri configurabili (difficoltà, velocità, retention time, pool di note).

---

### MONDO I — FONDAMENTA TONALI
*Prerequisito per tutto il resto. Nessun esercizio ritmico ancora.*

**Capitolo 1 — La scala maggiore**
- Ex 1.1: Ascolta la scala maggiore ascendente/discendente (drone su tonica). Solo ascolto, nessuna risposta richiesta. Ripeti finché vuoi.
- Ex 1.2: La tonica come ancora — senti una nota, il drone ti dà la tonica, indica se la nota è sopra o sotto la tonica (risposta binaria).
- Ex 1.3: Conta i gradi — senti una nota con drone, indica quanti gradi dista dalla tonica (1-7, direzione non richiesta).
- Ex 1.4: Direzione + grado — senti una nota con drone, indica grado E direzione (sopra/sotto).
- Ex 1.5: Sequenza di 2 note diatoniche — indica i due gradi in ordine.
- Ex 1.6: Sequenza di 3 note — indica i tre gradi in ordine.
- Ex 1.7: Sequenza di 4 note — indica i quattro gradi in ordine.
- Ex 1.8: Retention drill — senti 2 note, silenzio 5s, poi indica i gradi.
- Ex 1.9: Retention drill — senti 3 note, silenzio 10s.
- Ex 1.10: Scala con lacune — senti la scala con una nota mancante, indica quale manca.

**Capitolo 2 — Gradi stabili (1, 3, 5)**
- Ex 2.1: Solo tonica (grado 1) su drone. Riconosci quando senti il grado 1. (risposta: sì/no)
- Ex 2.2: Tonica vs Terza — pool {1, 3}, drone attivo.
- Ex 2.3: Tonica vs Quinta — pool {1, 5}.
- Ex 2.4: Triade maggiore — pool {1, 3, 5}.
- Ex 2.5: Triade maggiore in qualsiasi ordine (non solo ascendente).
- Ex 2.6: Triade con ottave diverse (stesso grado, ottava superiore/inferiore).
- Ex 2.7: Sequenza 2 note da {1,3,5}.
- Ex 2.8: Sequenza 3 note da {1,3,5}.
- Ex 2.9: Retention drill {1,3,5} — silenzio 5s.
- Ex 2.10: Retention drill {1,3,5} — silenzio 15s.
- Ex 2.11: Quale grado stabile NON è presente in una sequenza di 2? (domanda inversa)
- Ex 2.12: Velocità — risposta entro 3 secondi dall'ascolto.

**Capitolo 3 — Gradi tensivi (2, 4, 6, 7)**
- Ex 3.1: Grado 2 isolato vs tonica — pool {1, 2}.
- Ex 3.2: Grado 4 isolato — pool {1, 4}. Focus sulla tensione caratteristica della quarta.
- Ex 3.3: Grado 6 isolato — pool {1, 6}.
- Ex 3.4: Grado 7 isolato — pool {1, 7}. Leading tone, tensione verso l'8.
- Ex 3.5: Pool {2, 4} — distinzione tra i due gradi tensivi adiacenti.
- Ex 3.6: Pool {6, 7} — distinzione seste/settime.
- Ex 3.7: Pool {4, 5} — il punto dolente dell'utente (quarta vs quinta).
- Ex 3.8: Pool {3, 6} — terza vs sesta (il secondo punto dolente).
- Ex 3.9: Pool completo {1,2,3,4,5,6,7}.
- Ex 3.10: Sequenza 2 note da pool completo.
- Ex 3.11: Sequenza 3 note da pool completo.
- Ex 3.12: Retention drill pool completo — silenzio 10s.
- Ex 3.13: Retention drill — silenzio 20s.
- Ex 3.14: Speed round — pool completo, risposta entro 2s.
- Ex 3.15: Inversione domanda — "Suono il grado X, tu canta/fischia il grado Y" (autovalutazione con intonatore).

**Capitolo 4 — Scala minore naturale**
- Ex 4.1-4.15: Stessa struttura del Cap 3 ma su scala minore naturale (b3, b6, b7).
- Focus speciale su {b3 vs 3}, {b6 vs 6}, {b7 vs 7} — distinzione maggiore/minore per grado.

---

### MONDO II — MELODIA
*Entra il ritmo. Entra il concetto di frase.*

**Capitolo 5 — Frasi brevi su drone**
- Ex 5.1: Frase di 2 note generata casualmente da {1,2,3,4,5} — trascrivi i gradi.
- Ex 5.2: Frase di 3 note da {1,2,3,4,5}.
- Ex 5.3: Frase di 4 note da pool completo diatonico.
- Ex 5.4: Frase di 2 note con ritmo semplice (quarter notes). Trascrivi gradi + posizione ritmica.
- Ex 5.5: Frase di 3 note con ritmo (quarter + eighth).
- Ex 5.6: Frase di 4 note con ritmo misto.
- Ex 5.7: Frase ascendente o discendente? (direzione globale)
- Ex 5.8: La frase termina su che grado? (focus sull'ultimo grado = cadenza melodica)
- Ex 5.9: Retention drill frasi 2 note — silenzio 5s.
- Ex 5.10: Retention drill frasi 3 note — silenzio 10s.
- Ex 5.11: Retention drill frasi 4 note — silenzio 15s.
- Ex 5.12: Confronto — due frasi suonate, sono uguali o diverse?
- Ex 5.13: Dove differiscono? — due frasi quasi identiche, indica la posizione della differenza.

**Capitolo 6 — Pentatonica maggiore e minore**
- Ex 6.1-6.12: Stesso schema cap 5 ma con note solo da pentatonica (gradi {1,2,3,5,6} maggiore).
- Ex 6.7-6.12: Pentatonica minore ({1,b3,4,5,b7}).
- Bonus oro: Lick pentatonici reali (blues-style), trascrizione gradi.

**Capitolo 7 — Lick su pentatonica**
- Ex 7.1: Lick di 4 note pentatonica maggiore, tempo lento (60 BPM). Trascrivi.
- Ex 7.2: Lick di 4 note, 80 BPM.
- Ex 7.3: Lick di 6 note, 60 BPM.
- Ex 7.4: Lick di 6 note, 80 BPM.
- Ex 7.5: Lick di 4 note pentatonica minore, 60 BPM.
- Ex 7.6-7.10: Variazioni BPM e lunghezza progressiva.
- Ex 7.11: Retention drill — senti lick, silenzio 10s, trascrivi.
- Ex 7.12: Lick con ornamento (nota ripetuta, "riff").
- Ex 7.13: Identifica il primo grado del lick (attacco melodico).
- Ex 7.14: Identifica l'ultimo grado (risoluzione).
- Ex 7.15: Il lick è maggiore o minore?

**Capitolo 8 — Ornamenti e articolazioni**
- Ex 8.1: Nota singola con bend di un semitono — riconosci il grado di destinazione.
- Ex 8.2: Nota con bend di un tono intero.
- Ex 8.3: Hammer-on (due note legate ascendenti) — trascrivi entrambe.
- Ex 8.4: Pull-off (due note legate discendenti).
- Ex 8.5: Slide ascendente da grado X a grado Y — identifica entrambi.
- Ex 8.6: Vibrato — la nota con vibrato è sopra o sotto il grado target?
- Ex 8.7: Ghost note (nota percussiva) in un lick — identifica la sua posizione ritmica.
- Ex 8.8: Lick con mix di ornamenti — trascrivi gradi ignorando ornamenti.
- Ex 8.9-8.12: Versioni più veloci degli stessi esercizi.

---

### MONDO III — ARMONIA DIATONICA
*Entra la dimensione verticale. Si aggiunge la voce degli accordi.*

**Capitolo 9 — Triadi maggiori e minori**
- Ex 9.1: Triade maggiore vs minore — risposta binaria (M/m).
- Ex 9.2: Triade aumentata vs diminuita — risposta binaria.
- Ex 9.3: Pool {M, m, dim, aug} — 4 qualità.
- Ex 9.4: Triade in stato fondamentale vs primo rivolto vs secondo rivolto.
- Ex 9.5: Qualità + rivolto — identifica entrambi.
- Ex 9.6: Sequenza di 2 triadi — identifica entrambe le qualità.
- Ex 9.7: La triade è costruita sul grado X della scala? (es. "Questa è la triade del II grado?")
- Ex 9.8: Identifica il grado della scala su cui è costruita la triade (I-VII).
- Ex 9.9: Retention drill triadi — silenzio 10s.
- Ex 9.10: Speed round triadi.

**Capitolo 10 — Progressioni I-IV-V**
- Ex 10.1: I vs IV — distingui la triade di tonica dalla sottodominante.
- Ex 10.2: I vs V — tonica vs dominante.
- Ex 10.3: IV vs V.
- Ex 10.4: Pool {I, IV, V}.
- Ex 10.5: Progressione di 2 accordi da {I,IV,V} — trascrivi ordine.
- Ex 10.6: Progressione di 3 accordi.
- Ex 10.7: Progressione di 4 accordi.
- Ex 10.8: La progressione termina su I (risolve) o su V (sospesa)?
- Ex 10.9: Retention drill progressione 2 accordi — silenzio 10s.
- Ex 10.10: Retention drill 3 accordi — silenzio 15s.
- Ex 10.11: Identifica il basso di ogni accordo nella progressione.
- Ex 10.12: Progressione a tempo (quarter note changes, 60 BPM).

**Capitolo 11 — Tutti i gradi armonici diatonici**
- Ex 11.1: Aggiungi II minore al pool — {I, II, IV, V}.
- Ex 11.2: Aggiungi VI minore — {I, II, IV, V, VI}.
- Ex 11.3: Aggiungi III minore — {I, II, III, IV, V, VI}.
- Ex 11.4: Aggiungi VII diminuito — pool completo {I-VII}.
- Ex 11.5: Sequenze di 2 accordi da pool completo.
- Ex 11.6: Sequenze di 3 accordi.
- Ex 11.7: Sequenze di 4 accordi.
- Ex 11.8: Progressioni di 8 accordi.
- Ex 11.9: Retention drill — silenzio 15s.
- Ex 11.10: Speed round (risposta entro 3s per accordo).
- Ex 11.11: Basso della progressione — trascrivi solo le note del basso.
- Ex 11.12: Soprano della progressione — trascrivi solo la voce superiore.

**Capitolo 12 — Cadenze**
- Ex 12.1: Cadenza autentica (V→I) vs cadenza evitata (V→VI).
- Ex 12.2: Cadenza plagale (IV→I) vs autentica (V→I).
- Ex 12.3: Cadenza sospesa (I→V) — identifica la tensione finale.
- Ex 12.4: Pool {autentica, plagale, evitata, sospesa}.
- Ex 12.5: Identifica la cadenza alla fine di una progressione di 4 accordi.
- Ex 12.6-12.10: Variazioni con timbri diversi e tempi diversi.

---

### MONDO IV — CROMATISMO E MODALITÀ
*Esce dalla diatonicità. Entra il colore modale.*

**Capitolo 13 — Scala minore armonica e melodica**
- Ex 13.1-13.8: Gradi della minore armonica (b3, b6, 7 naturale).
- Focus su 7° grado naturale vs b7: il carattere del leading tone nella minore armonica.
- Ex 13.9-13.16: Scala minore melodica ascendente/discendente (b3, 6 naturale, 7 naturale asc / b7, b6 disc).

**Capitolo 14 — Modi della scala maggiore**
Ogni modo = sottocapitolo con 8 esercizi.
- 14A: Dorico (b3, b7 — il modo del basso, es. "Scarified", "Teen Town")
- 14B: Frigio (b2, b3, b6, b7 — tensione massima, metal, flamenco)
- 14C: Lidio (#4 — il più "alieno" dei modi maggiori)
- 14D: Misolidio (b7 — blues, rock, dominante naturale)
- 14E: Eolio (= minore naturale — già fatto, qui confronto modale)
- 14F: Locrio (b2, b5, b7 — instabilità totale, raramente usato)
- Per ogni modo: riconosci il modo dal suo "colore" (drone + scala suonata). Rispondi: che modo è?
- Confronti inter-modali: Dorico vs Eolio, Lidio vs Ionico, Misolidio vs Ionico.

**Capitolo 15 — Tensioni cromatiche**
- Ex 15.1: b2 (grado frigio) su contesto maggiore — riconosci la tensione.
- Ex 15.2: #4 (grado lidio) — il tritono sulla tonica.
- Ex 15.3: b5 — il tritono sotto.
- Ex 15.4: b7 (settima minore) su contesto maggiore.
- Ex 15.5: #5 — quinta aumentata, tono aumentato.
- Ex 15.6: Pool cromatico completo su drone maggiore.
- Ex 15.7-15.12: Sequenze di 2-3 note cromatiche in contesto tonale.

**Capitolo 16 — Lick modali**
- 16A: Lick dorici (4 note, poi 6, poi 8) — trascrivi + identifica il modo.
- 16B: Lick frigi.
- 16C: Lick lidii.
- 16D: Lick misolidii.
- Ogni sezione: 8 esercizi a difficoltà crescente (BPM, lunghezza, ornamenti).

---

### MONDO V — ARMONIA AVANZATA
*Accordi di settima, jazz harmony, tensioni.*

**Capitolo 17 — Accordi di settima**
- Ex 17.1: Major 7 vs Dominant 7 — pool {maj7, dom7}.
- Ex 17.2: Minor 7 vs Minor 7b5 — pool {m7, m7b5}.
- Ex 17.3: Pool {maj7, dom7, m7, m7b5, dim7}.
- Ex 17.4: Rivolti degli accordi di settima (4 posizioni).
- Ex 17.5: Qualità + rivolto.
- Ex 17.6: Sequenza di 2 accordi di settima.
- Ex 17.7: Sequenza di 3 accordi.
- Ex 17.8: Identifica il grado della scala su cui è costruito l'accordo di settima.
- Ex 17.9: Retention drill — silenzio 15s.
- Ex 17.10: Speed round.
- Ex 17.11: Distingui la terza dell'accordo dalla settima (voci interne).
- Ex 17.12: Il basso si muove per gradi o per salto? (voice leading del basso)

**Capitolo 18 — ii-V-I**
- Ex 18.1: ii-V-I maggiore — riconosci la progressione (sì/no).
- Ex 18.2: ii-V-I minore.
- Ex 18.3: Solo ii-V (senza risoluzione) — senti la tensione aperta.
- Ex 18.4: Distingui ii-V-I da I-IV-V.
- Ex 18.5: ii-V-I in diversi gradi della scala (es. ii-V-I del IV grado).
- Ex 18.6: Progressione lunga con più ii-V-I incatenati — trascrivi i centri tonali.
- Ex 18.7: La risoluzione dell'I è su accordo maggiore o minore?
- Ex 18.8-18.12: Variazioni di voicing, inversioni, timbri.

**Capitolo 19 — Sostituzioni e accordi di passaggio**
- Ex 19.1: Sostituzione di tritono — riconosci quando il V è sostituito dal bII.
- Ex 19.2: Accordo di passaggio cromatico tra I e ii.
- Ex 19.3: Dominante secondaria (V/V, V/ii, ecc.).
- Ex 19.4: Riconosci il centro tonale momentaneo in una progressione con dominanti secondarie.
- Ex 19.5: Borrowed chord (accordo preso dalla scala parallela).
- Ex 19.6-19.10: Progressioni miste con sostituzioni — identifica dove avviene la sostituzione.

**Capitolo 20 — Riarmonia e riconoscimento avanzato**
- Ex 20.1-20.10: Progressioni di 8-16 accordi. Trascrivi i gradi armonici completi.
- Timbri realistici (basso + pad + piano sintetici).
- Velocità variabile.
- Retention drill su progressioni di 4 accordi — silenzio 20s.

---

### MONDO VI — RITMO E POLIRITMIA
*Il ritmo come dimensione separata da allenare.*

**Capitolo 21 — Ritmo di base**
- Ex 21.1: Quarter note vs half note — distingui le durate.
- Ex 21.2: Eighth notes — conta e identifica il pattern.
- Ex 21.3: Sixteenth notes — grid da 16, identifica le posizioni attive.
- Ex 21.4: Pattern di 1 misura (4/4) con quarter + eighth — trascrivi.
- Ex 21.5-21.8: Pattern di complessità crescente.
- Ex 21.9: Sincope semplice — identifica la posizione della sincope.
- Ex 21.10: Pattern di 2 misure.
- Ex 21.11: Retention drill ritmico — senti, silenzio 5s, riproduci cliccando la griglia.
- Ex 21.12: Pattern con ghost notes — identifica le posizioni leggere vs pesanti.

**Capitolo 22 — Misure composte e odd time**
- Ex 22.1: 3/4 vs 4/4 — distingui il metro.
- Ex 22.2: 6/8 vs 3/4.
- Ex 22.3: 5/4 — conta e identifica il raggruppamento (3+2 vs 2+3).
- Ex 22.4: 7/4.
- Ex 22.5: 7/8.
- Ex 22.6: Pool {4/4, 3/4, 5/4, 7/4, 7/8}.
- Ex 22.7-22.12: Pattern ritmici in odd time — trascrivi.

**Capitolo 23 — Poliritmia**
- Ex 23.1: 3 contro 2 — identifica quale voce fa 3 e quale fa 2.
- Ex 23.2: 4 contro 3.
- Ex 23.3: Il basso fa 3, la batteria fa 4 — segui solo il basso.
- Ex 23.4-23.8: Complessità crescente.

---

### MONDO VII — TRASCRIZIONE INTEGRATA
*Melodia + armonia + ritmo insieme. Il livello finale.*

**Capitolo 24 — Trascrizione melodica completa**
- Ex 24.1: Frase di 4 note con ritmo semplice — trascrivi gradi + ritmo.
- Ex 24.2: Frase di 6 note.
- Ex 24.3: Frase di 8 note.
- Ex 24.4: Frase di 8 note su progressione armonica (drone cambia).
- Ex 24.5-24.8: Velocità crescente (60→80→100→120 BPM).
- Ex 24.9: Lick di basso complesso — trascrivi tutto.
- Ex 24.10: Retention drill totale — senti 8 note, silenzio 20s, trascrivi.
- Ex 24.11: Frase con ornamenti — trascrivi il nucleo melodico ignorando ornamenti.
- Ex 24.12: Due frasi — sono in risposta (domanda-risposta) o sono variazioni dello stesso tema?

**Capitolo 25 — Trascrizione armonica completa**
- Ex 25.1-25.12: Progressioni di 4-16 accordi con cambi a tempo reale. Trascrivi i gradi armonici.

**Capitolo 26 — Improvvisazione guidata**
- Ex 26.1: La progressione suona I-IV-V-I. Tu suoni/canti il grado 1 su ogni accordo. Autovalutazione.
- Ex 26.2: Suona i gradi stabili (1,3,5) dell'accordo corrente.
- Ex 26.3: Frase domanda (4 note) suonata dall'app — tu inventi la risposta (4 note). Autovalutazione.
- Ex 26.4-26.8: Progressioni più lunghe e complesse per l'improvvisazione guidata.
- Ex 26.9: Improvvisazione su ii-V-I — 2 misure. Autovalutazione.
- Ex 26.10: Improvvisazione libera su progressione di 8 misure.
- Ex 26.11: Registra la tua improvvisazione (Web Audio API recording) e confronta con il playback.
- Ex 26.12: L'app suona un lick, tu lo imiti immediatamente (call and response).

**Capitolo 27 — Intonazione (con intonatore esterno)**
- Ex 27.1: L'app suona il grado 1. Tu canti il grado 3. Controlla l'intonatore.
- Ex 27.2: L'app suona il grado 1. Tu canti il grado 5.
- Ex 27.3-27.10: Canta i gradi richiesti dall'app su drone. Autovalutazione via intonatore.
- Ex 27.11: Canta la scala completa in intonazione — autovalutazione.
- Ex 27.12: Canta un ii-V-I arpeggiato — autovalutazione.

---

## SISTEMA DI PROGRESSIONE E GAMIFICATION

### XP
- Risposta corretta: +10 XP base
- Streak 5: ×1.5 moltiplicatore
- Streak 10: ×2.0 moltiplicatore
- Streak 20+: ×3.0 moltiplicatore
- Risposta corretta al primo tentativo (senza reveal): +5 XP bonus
- Risposta veloce (entro metà del tempo limite): +3 XP bonus
- Errore: streak reset, -0 XP (non punitivo in XP, ma rompe il moltiplicatore)

### Livelli globali (titoli metal)
- Lv 1 — Apprentice of Sound (0 XP)
- Lv 2 — Acolyte of the Drone (500 XP)
- Lv 3 — Initiate of Tone (1500 XP)
- Lv 4 — Disciple of Harmony (3000 XP)
- Lv 5 — Adept of the Scale (5000 XP)
- Lv 6 — Warrior of Pitch (8000 XP)
- Lv 7 — Knight of the Seventh (12000 XP)
- Lv 8 — Master of Modes (18000 XP)
- Lv 9 — Archon of Transcription (25000 XP)
- Lv 10 — AURIS MAXIMUS (35000+ XP)

### Statistiche tracciate per capitolo
- Accuratezza totale (%)
- Accuratezza per tipo di esercizio
- Tempo medio di risposta
- Miglior streak
- Numero di sessioni
- XP guadagnati nel capitolo

### Statistiche globali
- XP totale
- Livello globale
- Capitoli completati (bronzo/argento/oro)
- Tempo totale di pratica
- Giorno corrente di streak (streak giornaliero)
- Grafico accuratezza nel tempo (ultimi 30 giorni)

### Unlock system
- Capitolo successivo: sbloccato con bronzo del precedente
- Mondo successivo: sbloccato completando bronzo di tutti i capitoli del mondo
- Esercizi bonus (oro): sbloccati con oro del capitolo
- Timbri extra: sbloccati raggiungendo certi livelli globali
- Easter egg: completare tutti gli ori di un mondo sblocca un messaggio speciale

---

## PARAMETRI CONFIGURABILI (per ogni esercizio)

Ogni ExercisePage deve mostrare un pannello parametri collassabile con:
- **Timbro** (dropdown: tutti i timbri implementati)
- **Timbro drone** (dropdown separato)
- **Ottava** (slider: 2-5)
- **Volume nota** (slider: 0-100%)
- **Volume drone** (slider: 0-100%)
- **Durata nota** (slider: 0.3s - 3.0s)
- **BPM** (slider: 40-180, per esercizi ritmici)
- **Retention time** (dropdown: off / 2s / 5s / 10s / 15s / 30s)
- **Pool di note** (checkbox per ogni nota cromatica — quale includere nel pool di quiz)
- **Difficoltà automatica** (toggle: se ON, il sistema sceglie i parametri ottimali basandosi sulla performance storica)

---

## SALVATAGGIO PROGRESSI (localStorage)

Chiave: `auris_save_v1`

Struttura JSON:
```json
{
  "version": 1,
  "lastSaved": "ISO timestamp",
  "globalXP": 0,
  "globalLevel": 1,
  "dailyStreak": 0,
  "lastPracticeDate": "YYYY-MM-DD",
  "totalPracticeMinutes": 0,
  "chapters": {
    "1_1": {
      "stars": 0,
      "bestAccuracy": 0,
      "totalAttempts": 0,
      "xpEarned": 0,
      "unlocked": true,
      "exercises": {
        "1_1_1": { "accuracy": 0, "attempts": 0, "bestStreak": 0 }
      }
    }
  },
  "settings": {
    "defaultTimbre": "bass_electric",
    "defaultDroneTimbre": "pad",
    "defaultVolume": 0.6,
    "defaultDroneVolume": 0.4
  },
  "xpHistory": [
    { "date": "YYYY-MM-DD", "xp": 0 }
  ]
}
```

---

## UI/UX — FLUSSO UTENTE

### Schermata principale: Mappa mondiale
- Header con: nome app "AURIS", livello globale, XP totale, barra XP, streak giornaliero
- Mappa scrollabile verticalmente con i 7 mondi
- Ogni mondo: titolo inciso, path tortuoso con nodi capitolo
- Nodo capitolo: mostra numero, nome, stelle ottenute, XP guadagnati
- Click su nodo sbloccato → transizione alla ChapterPage

### ChapterPage
- Titolo capitolo, descrizione breve, stelle ottenute
- Griglia degli esercizi del capitolo (lista con status: completato/corrente/bloccato)
- Statistiche del capitolo
- Pulsante "Pratica libera" (esercizi random dal capitolo)
- Click su esercizio → ExercisePage

### ExercisePage
- Header: nome esercizio, capitolo, stella target attuale
- HUD: XP sesione, streak corrente, accuratezza sessione, progresso verso stella
- Pannello parametri (collassabile, icona ingranaggio)
- Area principale: dipende dal tipo di esercizio
  - NoteGrid per risposta su gradi
  - Pulsanti per risposta qualitativa (M/m, su/giù, ecc.)
  - Griglia ritmica per esercizi ritmici
- Controlli audio: PLAY / RIPETI / AVANTI
- Feedback immediato: overlay corretto (verde + suono) / sbagliato (rosso + suono)
- Pulsante "mostra risposta" (penalizza: nessun XP per quella domanda)
- Barra progresso verso la stella

---

## NOTE TECNICHE FINALI

1. **Zero librerie UI esterne** — solo React + Vite + CSS custom. Niente Material UI, niente Tailwind, niente Chakra. CSS puro con variabili.
2. **Web Audio API** — tutti i suoni generati localmente. Nessuna fetch di file audio.
3. **Routing:** react-router-dom per navigazione tra MapPage, ChapterPage, ExercisePage. Installalo con `npm install react-router-dom`.
4. **Performance** — la mappa con 27 capitoli deve scrollare a 60fps. Usa `React.memo` e `useMemo` dove necessario.
5. **Responsive** — funziona su desktop e tablet. Mobile è secondario ma non rotto.
6. **No backend** — tutto client-side. localStorage per persistenza.
7. **Errori graceful** — se AudioContext non disponibile, mostra messaggio chiaro. Se localStorage pieno, notifica l'utente.
8. **Accessibilità minima** — tutti i pulsanti hanno aria-label. Navigazione keyboard funzionante.
9. **Git:** crea un `.gitignore` che escluda `node_modules/`, `dist/`, `.env`.

---

## ORDINE DI IMPLEMENTAZIONE SUGGERITO

1. Setup Vite + React, struttura cartelle
2. CSS globale, variabili, font Google Fonts
3. AudioEngine.js — tutti i timbri funzionanti
4. Store con localStorage
5. Mappa mondiale (layout, nodi, path) — con dati mock
6. ChapterPage + ExercisePage shell
7. Primo esercizio funzionante end-to-end (Cap 1, Ex 1.1)
8. Sistema XP + feedback
9. Tutti gli esercizi Mondo I
10. Tutti gli esercizi Mondo II
11. ... e così via per mondo
12. Statistiche globali + grafici
13. Polish visivo finale

---

*Questo documento è la specifica completa. Non tagliare nulla. Ogni esercizio elencato deve essere implementato. L'obiettivo è un'applicazione che richieda mesi di utilizzo quotidiano per essere completata.*
