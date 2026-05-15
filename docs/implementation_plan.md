# AURIS — Piano di implementazione
## Traccia i progressi qui. Spunta ogni checkbox quando è completo e testato.

---

## FASE 0 — Setup e fondamenta tecniche

- [x] Inizializza Git: `git init`, crea `.gitignore` (node_modules/, dist/, .env), primo commit
- [ ] Crea repo GitHub: `gh repo create auris --private --source=. --push`
- [x] Crea progetto con `npm create vite@latest auris -- --template react`
- [x] Installa Zustand: `npm install zustand`
- [x] Installa React Router: `npm install react-router-dom`
- [x] Configura Google Fonts in `index.html` (Metal Mania, Share Tech Mono, Barlow Condensed)
- [x] Scrivi `src/index.css` completo con tutte le CSS variables, reset, font, scanlines, noise texture
- [x] Crea struttura cartelle completa (audio/, data/, store/, hooks/, components/, pages/)
- [x] Configura routing base in App.jsx (MapPage, ChapterPage, ExercisePage)
- [x] Testa che `npm run dev` funzioni e la pagina si apra
- [ ] **COMMIT GIT: "feat: setup iniziale completato"**

---

## FASE 1 — Audio Engine

- [x] `src/audio/AudioEngine.js` — classe singleton con AudioContext
- [x] Timbro: basso elettrico (sawtooth + lowpass + sub-oscillatore)
- [x] Timbro: basso fretless (come elettrico + portamento + vibrato)
- [x] Timbro: piano (harmonics + envelope percussivo)
- [x] Timbro: campana (sine + partials inharmonici)
- [x] Timbro: organo (drawbars simulati)
- [x] Timbro: archi (sawtooth + ensemble detuned)
- [x] Timbro: synth pad (per droni)
- [x] Timbro: marimba (sine + partials + decay rapido)
- [x] `src/audio/droneEngine.js` — nota continua con fadeIn/fadeOut, ottava configurabile, drone su accordo
- [x] `src/audio/rhythmEngine.js` — generazione pattern ritmici, scheduler preciso
- [ ] Test audio: tutte le 8 timbri suonano correttamente su Chrome e Firefox

---

## FASE 2 — Store e persistenza

- [x] `src/store/gameStore.js` con Zustand
- [x] Struttura stato: globalXP, globalLevel, dailyStreak, chapters, settings, xpHistory
- [x] Funzioni: addXP(amount), unlockChapter(id), updateChapterStats(id, result), saveToLocalStorage()
- [x] Auto-save su ogni risposta dell'utente
- [x] Load da localStorage all'avvio
- [x] Gestione errori: localStorage pieno → notifica utente
- [ ] Test: chiudi e riapri il browser, i dati persistono

---

## FASE 3 — Mappa mondiale

- [x] `src/pages/MapPage.jsx` — layout principale scrollabile
- [x] `src/components/WorldMap/WorldMap.jsx` — contenitore 7 mondi
- [x] `src/components/WorldMap/WorldNode.jsx` — nodo singolo (sbloccato/corrente/bloccato/completato)
- [x] `src/components/WorldMap/WorldPath.jsx` — connessioni animate tra nodi (integrato in WorldMap)
- [x] HUD superiore: nome app, livello, XP, barra XP, streak giornaliero
- [x] Stile: path tortuoso, nodi esagonali, texture metallo, glow rosso su nodo corrente
- [ ] Animazione unlock: flash bianco + shake quando si sblocca un capitolo
- [ ] Test: tutti i 27 capitoli visibili, corretta logica bloccato/sbloccato

---

## FASE 4 — Shell esercizio

- [x] `src/pages/ChapterPage.jsx` — lista esercizi del capitolo, statistiche, stelle
- [x] `src/pages/ExercisePage.jsx` — wrapper generale
- [x] `src/components/Exercise/ExerciseShell.jsx` — header, HUD sessione, pannello parametri
- [x] `src/components/Exercise/NoteGrid.jsx` — griglia note cliccabile (con gradi scala)
- [x] `src/components/Exercise/DroneBar.jsx` — controllo drone (on/off)
- [ ] `src/components/Exercise/InstrumentPicker.jsx` — dropdown timbro con preview audio
- [x] `src/components/Exercise/RetentionTimer.jsx` — countdown visivo durante silenzio
- [x] `src/components/Exercise/FeedbackOverlay.jsx` — overlay corretto (verde) / sbagliato (rosso)
- [x] `src/components/HUD/XPBar.jsx` — barra XP con animazione fill
- [x] `src/components/HUD/StreakCounter.jsx`
- [x] `src/components/HUD/LevelBadge.jsx` — titolo livello metal
- [ ] Pannello parametri collassabile: timbro, drone, ottava, volume, durata, BPM, retention, pool note

---

## FASE 5 — Generatori esercizi

- [x] `src/data/curriculum.js` — struttura Mondo I completa (4 capitoli, 52 esercizi)
- [x] `src/data/exerciseGenerators.js` — funzioni generazione per tipi Mondo I:
  - [x] generateScaleDegreeQuestion(pool, droneNote, timbre)
  - [x] generateSequenceQuestion(pool, length)
  - [x] generateBinaryQuestion (sopra/sotto tonica)
  - [x] generateMissingDegreeQuestion (scala con lacuna)
  - [x] generateMissingFromSetQuestion (grado mancante da set)
  - [x] generateListenOnlyScale (ascolto scala)
  - [x] generateMinorCompareQuestion (b3 vs 3, b6 vs 6, b7 vs 7)
  - [x] major_minor_id (maggiore o minore)
  - [x] sing_degree (autovalutazione canto)
  - [x] generateRetentionDrill (integrato in useExercise)
  - [x] Time limit (timer auto-fail per speed round)
  - [ ] generateMelodicPhrase(length, pool, bpm) — Mondo II
  - [x] generateChordQuestion(pool, voicing) — Mondo III
  - [x] generateProgressionQuestion(length, pool) — Mondo III
  - [x] generateRhythmPattern(beats, complexity) — Mondo VI
- [x] `src/data/progressionRules.js` — logica stelle, unlock, XP moltiplicatori
- [x] `src/hooks/useExercise.js` — hook che gestisce stato esercizio (domanda corrente, risposta, feedback)
- [x] `src/hooks/useAudio.js` — hook che espone AudioEngine ai componenti
- [x] `src/hooks/useProgress.js` — hook che legge/scrive il gameStore

---

## MONDO I — Fondamenta tonali

### Capitolo 1 — La scala maggiore
- [x] Ex 1.1: Ascolto scala maggiore (solo ascolto) — tipo listen_only
- [x] Ex 1.2: Nota sopra o sotto la tonica (binario) — tipo binary
- [x] Ex 1.3: Conta i gradi (1-7) — tipo degree_single
- [x] Ex 1.4: Direzione + grado — tipo degree_direction (usa degree_single internamente)
- [x] Ex 1.5: Sequenza 2 note — tipo degree_sequence
- [x] Ex 1.6: Sequenza 3 note — tipo degree_sequence
- [x] Ex 1.7: Sequenza 4 note — tipo degree_sequence
- [x] Ex 1.8: Retention drill 2 note / 5s — degree_sequence + retention timer
- [x] Ex 1.9: Retention drill 3 note / 10s — degree_sequence + retention timer
- [x] Ex 1.10: Scala con lacuna — tipo missing_degree
- [ ] Test capitolo 1: bronzo raggiungibile, XP funzionante, capitolo 2 si sblocca

### Capitolo 2 — Gradi stabili (1, 3, 5)
- [x] Ex 2.1-2.6: degree_single (pool variabili, multiOctave)
- [x] Ex 2.7-2.8: degree_sequence da {1,3,5}
- [x] Ex 2.9-2.10: retention drill {1,3,5}
- [x] Ex 2.11: missing_from_set — grado stabile mancante
- [x] Ex 2.12: speed round — degree_single con timeLimit 3s
- [ ] Test capitolo 2

### Capitolo 3 — Gradi tensivi (2, 4, 6, 7)
- [x] Ex 3.1-3.9: degree_single con pool progressivi
- [x] Ex 3.10-3.11: degree_sequence pool completo
- [x] Ex 3.12-3.13: retention drill pool completo (10s, 20s)
- [x] Ex 3.14: speed round — timeLimit 2s
- [x] Ex 3.15: sing_degree — autovalutazione con reveal
- [ ] Test capitolo 3

### Capitolo 4 — Scala minore naturale
- [x] Ex 4.1-4.3: minor_compare (b3 vs 3, b6 vs 6, b7 vs 7)
- [x] Ex 4.4-4.6: degree_single su scala minore
- [x] Ex 4.7-4.8: degree_sequence su scala minore
- [x] Ex 4.9: major_minor_id — identifica scala maggiore/minore
- [x] Ex 4.10-4.11: retention drill minore (10s, 20s)
- [x] Ex 4.12: speed round minore — timeLimit 2s
- [x] Ex 4.13: missing_degree su scala minore
- [x] Ex 4.14: degree_sequence 4 note minore
- [x] Ex 4.15: sing_degree su scala minore
- [ ] Test capitolo 4
- [ ] **COMMIT GIT: "feat: Mondo I completo e testato"**

---

## MONDO II — Melodia

### Capitolo 5 — Frasi brevi su drone
- [x] Ex 5.1-5.3: Frasi 2/3/4 note (melodic_phrase)
- [x] Ex 5.4-5.6: Frasi ritmiche a 80 BPM (melodic_phrase con bpm)
- [x] Ex 5.7: Direzione frase (phrase_direction)
- [x] Ex 5.8: Ultimo grado (phrase_last_degree)
- [x] Ex 5.9-5.11: Retention drill frasi (5s/10s/15s)
- [x] Ex 5.12: Confronta frasi (phrase_compare)
- [x] Ex 5.13: Trova la differenza (phrase_diff)
- [ ] Test capitolo 5

### Capitolo 6 — Pentatonica maggiore e minore
- [x] Ex 6.1-6.6: Pentatonica maggiore (melodic_phrase, direction, last_degree, compare)
- [x] Ex 6.7-6.12: Pentatonica minore (melodic_phrase, direction, last_degree, compare)
- [ ] Test capitolo 6

### Capitolo 7 — Lick su pentatonica
- [x] Ex 7.1-7.4: Lick pentatonica maggiore (60/80 BPM, 4/6 note)
- [x] Ex 7.5-7.8: Lick pentatonica minore (60/80 BPM, 4/6 note)
- [x] Ex 7.9-7.10: Lick 8 note (80 BPM)
- [x] Ex 7.11: Retention drill lick
- [x] Ex 7.12: Lick con nota ripetuta
- [x] Ex 7.13: Primo grado del lick (phrase_first_degree)
- [x] Ex 7.14: Ultimo grado del lick (phrase_last_degree)
- [x] Ex 7.15: Maggiore o minore? (pentatonic_id)
- [ ] Test capitolo 7

### Capitolo 8 — Ornamenti e articolazioni
- [x] Ex 8.1-8.2: Bend semitono/tono (ornament_bend)
- [x] Ex 8.3-8.4: Hammer-on / Pull-off (ornament_pair)
- [x] Ex 8.5: Slide (ornament_pair)
- [x] Ex 8.6: Vibrato (ornament_vibrato)
- [x] Ex 8.7: Ghost note (ornament_ghost)
- [x] Ex 8.8: Lick con ornamenti (ornament_lick)
- [x] Ex 8.9-8.12: Versioni veloci
- [ ] Test capitolo 8
- [ ] **COMMIT GIT: "feat: Mondo II completo e testato"**

---

## MONDO III — Armonia diatonica

### Capitolo 9 — Triadi
- [x] Ex 9.1-9.10
- [ ] Test capitolo 9

### Capitolo 10 — Progressioni I-IV-V
- [x] Ex 10.1-10.12
- [ ] Test capitolo 10

### Capitolo 11 — Gradi armonici diatonici
- [x] Ex 11.1-11.12
- [ ] Test capitolo 11

### Capitolo 12 — Cadenze
- [x] Ex 12.1-12.10
- [ ] Test capitolo 12
- [ ] **COMMIT GIT: "feat: Mondo III completo e testato"**

---

## MONDO IV — Cromatismo e modalità

### Capitolo 13 — Minore armonica e melodica
- [x] Ex 13.1-13.16
- [ ] Test capitolo 13

### Capitolo 14 — Modi (A-F)
- [x] 14A: Dorico (8 esercizi)
- [x] 14B: Frigio (8 esercizi)
- [x] 14C: Lidio (8 esercizi)
- [x] 14D: Misolidio (8 esercizi)
- [x] 14E: Eolio / confronto (8 esercizi)
- [x] 14F: Locrio (8 esercizi)
- [ ] Test capitolo 14

### Capitolo 15 — Tensioni cromatiche
- [x] Ex 15.1-15.12
- [ ] Test capitolo 15

### Capitolo 16 — Lick modali
- [x] 16A-16D (8 esercizi ciascuno)
- [ ] Test capitolo 16
- [ ] **COMMIT GIT: "feat: Mondo IV completo e testato"**

---

## MONDO V — Armonia avanzata

### Capitolo 17 — Accordi di settima
- [x] Ex 17.1-17.12
- [ ] Test capitolo 17

### Capitolo 18 — ii-V-I
- [x] Ex 18.1-18.12
- [ ] Test capitolo 18

### Capitolo 19 — Sostituzioni
- [x] Ex 19.1-19.10
- [ ] Test capitolo 19

### Capitolo 20 — Riarmonia avanzata
- [x] Ex 20.1-20.10
- [ ] Test capitolo 20
- [ ] **COMMIT GIT: "feat: Mondo V completo e testato"**

---

## MONDO VI — Ritmo e poliritmia

### Capitolo 21 — Ritmo di base
- [x] Ex 21.1-21.12
- [ ] Test capitolo 21

### Capitolo 22 — Misure composte e odd time
- [x] Ex 22.1-22.12
- [ ] Test capitolo 22

### Capitolo 23 — Poliritmia
- [x] Ex 23.1-23.8
- [ ] Test capitolo 23
- [ ] **COMMIT GIT: "feat: Mondo VI completo e testato"**

---

## MONDO VII — Trascrizione integrata

### Capitolo 24 — Trascrizione melodica completa
- [x] Ex 24.1-24.12
- [ ] Test capitolo 24

### Capitolo 25 — Trascrizione armonica completa
- [x] Ex 25.1-25.12
- [ ] Test capitolo 25

### Capitolo 26 — Improvvisazione guidata
- [x] Ex 26.1-26.12
- [ ] Test capitolo 26

### Capitolo 27 — Intonazione (con intonatore esterno)
- [x] Ex 27.1-27.12
- [ ] Test capitolo 27
- [ ] **COMMIT GIT: "feat: Mondo VII completo e testato"**

---

## FASE FINALE — Polish

- [x] Statistiche globali: grafico accuratezza ultimi 30 giorni
- [x] Sistema easter egg (completare tutti gli ori di un mondo)
- [x] Animazioni unlock complete e rifinite
- [x] Cursor custom (crosshair rosso)
- [ ] Test performance: mappa con 27 nodi a 60fps
- [ ] Test localStorage: dati persistono correttamente
- [ ] Test su Chrome e Firefox
- [ ] **COMMIT GIT FINALE: "feat: AURIS v1.0 completo"**
