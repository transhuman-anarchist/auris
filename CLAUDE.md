# AURIS — Ear Training RPG
## File di memoria permanente per Claude Code

---

## Cos'è questo progetto

AURIS è un'applicazione web di ear training in stile RPG/videogioco con estetica metal/industrial.
L'obiettivo dell'utente finale è: sentire un lick e suonarlo immediatamente, trascrivere, improvvisare, riconoscere l'armonia avanzata, intonare sul basso fretless.

Il documento di specifica completo è in `docs/spec.md`. Leggilo prima di fare qualsiasi cosa.

---

## Stack

- **Framework:** React + Vite
- **Routing:** react-router-dom
- **Stato globale:** Zustand
- **Audio:** Web Audio API (zero librerie audio esterne — nessun Tone.js, nessun Howler)
- **Stile:** CSS puro con variabili CSS (zero Tailwind, zero Material UI, zero Bootstrap)
- **Persistenza:** localStorage (chiave: `auris_save_v1`)
- **Font:** Google Fonts — Metal Mania / Cinzel Decorative (display), Share Tech Mono / VT323 (mono), Barlow Condensed (body)
- **Lingua UI:** italiano

---

## Comandi di sviluppo

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Build produzione
npm run build

# Anteprima build
npm run preview
```

---

## Struttura cartelle

```
auris/
├── CLAUDE.md                  ← questo file
├── docs/
│   ├── spec.md                ← specifica completa (NON modificare)
│   └── implementation_plan.md ← piano con checkbox (aggiorna mentre lavori)
├── .claude/
│   └── agents/
│       └── debugger.md        ← subagent debugger
├── src/
│   ├── audio/
│   ├── data/
│   ├── store/
│   ├── hooks/
│   ├── components/
│   └── pages/
```

---

## Git — regola per ogni sessione

**All'inizio di ogni sessione/interazione**, controlla se il repo git è inizializzato (`git status`).
- Se **non è inizializzato**: esegui `git init`, configura identità (`user.email: fance.salis@gmail.com`, `user.name: gesu`), e fai un commit iniziale con tutto il lavoro presente.
- Se **è inizializzato**: verifica se ci sono modifiche non committate e, se sì, fai commit prima di iniziare nuovo lavoro.
- **Commit dopo ogni fase e dopo ogni mondo.** Non aspettare che l'utente lo chieda — fallo automaticamente.

---

## Regole obbligatorie — seguile sempre

1. **Mai usare librerie audio esterne.** Tutto il suono è Web Audio API puro.
2. **Mai usare framework CSS.** Solo CSS custom con variabili in `index.css`.
3. **Lo stato globale è solo Zustand.** Non mescolare con Context per lo stato app.
4. **localStorage è l'unica persistenza.** Nessun backend, nessuna fetch a server esterni.
5. **Dopo ogni mondo completato**, aggiorna i checkbox in `docs/implementation_plan.md`.
6. **Se incontri un bug**, usa il subagent debugger (`.claude/agents/debugger.md`) prima di procedere.
7. **Commit Git automatico dopo ogni fase e dopo ogni mondo.** Messaggio commit: `feat: Mondo X completo e testato`. Non aspettare che l'utente lo chieda — fallo subito. All'inizio di ogni sessione, verifica che git sia inizializzato (vedi sezione "Git — regola per ogni sessione").
8. **Fermati e avvisa l'utente dopo ogni mondo completato.** Non continuare autonomamente al mondo successivo — aspetta conferma esplicita.
9. **La UI è in italiano.** Tutti i testi visibili all'utente sono in italiano.
10. **Zero console.error in produzione.** Gestisci tutti gli errori AudioContext gracefully.
11. **Testa l'audio su Chrome e Firefox** prima di dichiarare un esercizio completo.
12. **Non andare avanti se il mondo precedente ha bug aperti.** Usa il debugger, risolvi, fai commit, poi procedi.

---

## Palette colori (CSS variables — definite in index.css)

```css
--bg-primary: #080808;
--bg-secondary: #0f0f0f;
--bg-panel: #141414;
--accent-red: #C41E3A;
--accent-red-dark: #8B0000;
--accent-orange: #D4500A;
--text-primary: #E8E3DC;
--text-secondary: #8A8480;
--text-mono: #C9A84C;
--success: #39FF14;
--error: #FF2020;
--gold: #C9A84C;
--border: #2A2520;
--glow-red: 0 0 12px #C41E3A;
```

---

## Stato attuale del progetto

Aggiorna questa sezione ogni volta che completi qualcosa di significativo.

- [x] Setup Vite + React + Zustand
- [x] CSS globale e variabili
- [x] AudioEngine — timbri base (8 timbri)
- [x] Store + localStorage
- [x] Mappa mondiale (layout + reattività unlock)
- [x] Sistema XP e livelli globali (addXP, streak, daily streak, moltiplicatori)
- [x] MONDO I — Fondamenta tonali (52 esercizi codificati, 10 tipi generatore, UI completa — da testare nel browser)
- [x] MONDO II — Melodia (52 esercizi codificati, 12 nuovi tipi generatore, audio BPM/ornamenti — da testare nel browser)
- [x] MONDO III — Armonia diatonica (44 esercizi, 12 nuovi tipi generatore, playChord/playChordSequence/playChordProgressionAtBPM, UI triadi/progressioni/cadenze — da testare nel browser)
- [x] MONDO IV — Cromatismo e modalità (108 esercizi codificati, 6 nuovi tipi generatore, scale modali/armoniche/melodiche/cromatiche — da testare nel browser)
- [x] MONDO V — Armonia avanzata (44 esercizi codificati, 16 nuovi tipi generatore, accordi 7ª/ii-V-I/sostituzioni/riarmonia — da testare nel browser)
- [x] MONDO VI — Ritmo e poliritmia (32 esercizi codificati, 9 nuovi tipi generatore, RhythmGrid, rhythmEngine potenziato — da testare nel browser)
- [x] MONDO VII — Trascrizione integrata (48 esercizi, 9 nuovi tipi generatore, melody_over_changes/transcription_core/phrase_relation/improv/call_response/intonation — da testare nel browser)
- [x] Statistiche e grafici (StatsPage con chart XP 30 giorni, progressi per mondo, overview)
- [x] Polish visivo finale (Easter egg per mondo padroneggiato, animazione unlock flash+shake, STATS nav link)
