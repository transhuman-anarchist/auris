export const WORLDS = [
  {
    id: 1,
    name: 'MONDO I — FONDAMENTA TONALI',
    subtitle: 'Prerequisito per tutto il resto',
    chapters: [1, 2, 3, 4],
  },
  {
    id: 2,
    name: 'MONDO II — MELODIA',
    subtitle: 'Entra il ritmo. Entra la frase.',
    chapters: [5, 6, 7, 8],
  },
  {
    id: 3,
    name: 'MONDO III — ARMONIA DIATONICA',
    subtitle: 'La dimensione verticale',
    chapters: [9, 10, 11, 12],
  },
  {
    id: 4,
    name: 'MONDO IV — CROMATISMO E MODALITÀ',
    subtitle: 'Esce dalla diatonicità',
    chapters: [13, 14, 15, 16],
  },
  {
    id: 5,
    name: 'MONDO V — ARMONIA AVANZATA',
    subtitle: 'Settima, jazz, tensioni',
    chapters: [17, 18, 19, 20],
  },
  {
    id: 6,
    name: 'MONDO VI — RITMO E POLIRITMIA',
    subtitle: 'Il ritmo come dimensione separata',
    chapters: [21, 22, 23],
  },
  {
    id: 7,
    name: 'MONDO VII — TRASCRIZIONE INTEGRATA',
    subtitle: 'Il livello finale',
    chapters: [24, 25, 26, 27],
  },
];

export const CHAPTERS = {
  1: {
    id: 1, worldId: 1,
    name: 'La Scala Maggiore',
    description: 'Fondamenta: la scala maggiore come mappa mentale.',
    exerciseCount: 10,
    exercises: buildExercises(1, [
      { id: '1_1', name: 'Ascolto scala maggiore', type: 'listen_only', description: 'Ascolta la scala maggiore ascendente/discendente con drone.' },
      { id: '1_2', name: 'Sopra o sotto la tonica', type: 'binary', description: 'La nota è sopra o sotto la tonica?', pool: 'major_scale' },
      { id: '1_3', name: 'Conta i gradi', type: 'degree_single', description: 'Indica il grado della nota (1-7).', pool: [1,2,3,4,5,6,7] },
      { id: '1_4', name: 'Direzione + grado', type: 'degree_direction', description: 'Indica grado e direzione (sopra/sotto).', pool: [1,2,3,4,5,6,7] },
      { id: '1_5', name: 'Sequenza 2 note', type: 'degree_sequence', description: 'Indica i gradi di 2 note in ordine.', pool: [1,2,3,4,5,6,7], length: 2 },
      { id: '1_6', name: 'Sequenza 3 note', type: 'degree_sequence', description: 'Indica i gradi di 3 note in ordine.', pool: [1,2,3,4,5,6,7], length: 3 },
      { id: '1_7', name: 'Sequenza 4 note', type: 'degree_sequence', description: 'Indica i gradi di 4 note in ordine.', pool: [1,2,3,4,5,6,7], length: 4 },
      { id: '1_8', name: 'Retention 2 note / 5s', type: 'degree_sequence', description: 'Senti 2 note, silenzio 5s, poi rispondi.', pool: [1,2,3,4,5,6,7], length: 2, retention: 5 },
      { id: '1_9', name: 'Retention 3 note / 10s', type: 'degree_sequence', description: 'Senti 3 note, silenzio 10s, poi rispondi.', pool: [1,2,3,4,5,6,7], length: 3, retention: 10 },
      { id: '1_10', name: 'Scala con lacuna', type: 'missing_degree', description: 'Quale grado manca dalla scala?' },
    ]),
  },
  2: {
    id: 2, worldId: 1,
    name: 'Gradi Stabili (1, 3, 5)',
    description: 'La triade maggiore come ancora.',
    exerciseCount: 12,
    exercises: buildExercises(2, [
      { id: '2_1', name: 'Solo tonica', type: 'degree_single', description: 'Riconosci quando senti il grado 1.', pool: [1] },
      { id: '2_2', name: 'Tonica vs Terza', type: 'degree_single', description: 'Pool {1, 3}.', pool: [1, 3] },
      { id: '2_3', name: 'Tonica vs Quinta', type: 'degree_single', description: 'Pool {1, 5}.', pool: [1, 5] },
      { id: '2_4', name: 'Triade maggiore', type: 'degree_single', description: 'Pool {1, 3, 5}.', pool: [1, 3, 5] },
      { id: '2_5', name: 'Triade in qualsiasi ordine', type: 'degree_single', description: 'Pool {1, 3, 5} ordine casuale.', pool: [1, 3, 5] },
      { id: '2_6', name: 'Triade con ottave', type: 'degree_single', description: 'Stesso grado, ottave diverse.', pool: [1, 3, 5], multiOctave: true },
      { id: '2_7', name: 'Sequenza 2 note', type: 'degree_sequence', description: 'Sequenza 2 note da {1,3,5}.', pool: [1, 3, 5], length: 2 },
      { id: '2_8', name: 'Sequenza 3 note', type: 'degree_sequence', description: 'Sequenza 3 note da {1,3,5}.', pool: [1, 3, 5], length: 3 },
      { id: '2_9', name: 'Retention 5s', type: 'degree_sequence', description: 'Retention drill {1,3,5} — silenzio 5s.', pool: [1, 3, 5], length: 2, retention: 5 },
      { id: '2_10', name: 'Retention 15s', type: 'degree_sequence', description: 'Retention drill {1,3,5} — silenzio 15s.', pool: [1, 3, 5], length: 2, retention: 15 },
      { id: '2_11', name: 'Grado mancante', type: 'missing_from_set', description: 'Quale grado stabile NON è presente?', pool: [1, 3, 5] },
      { id: '2_12', name: 'Speed round', type: 'degree_single', description: 'Risposta entro 3s.', pool: [1, 3, 5], timeLimit: 3 },
    ]),
  },
  3: {
    id: 3, worldId: 1,
    name: 'Gradi Tensivi (2, 4, 6, 7)',
    description: 'Tensione e risoluzione nella scala maggiore.',
    exerciseCount: 15,
    exercises: buildExercises(3, [
      { id: '3_1', name: 'Grado 2 vs tonica', type: 'degree_single', pool: [1, 2] },
      { id: '3_2', name: 'Grado 4 vs tonica', type: 'degree_single', pool: [1, 4] },
      { id: '3_3', name: 'Grado 6 vs tonica', type: 'degree_single', pool: [1, 6] },
      { id: '3_4', name: 'Grado 7 vs tonica', type: 'degree_single', pool: [1, 7] },
      { id: '3_5', name: 'Pool {2, 4}', type: 'degree_single', pool: [2, 4] },
      { id: '3_6', name: 'Pool {6, 7}', type: 'degree_single', pool: [6, 7] },
      { id: '3_7', name: 'Pool {4, 5}', type: 'degree_single', pool: [4, 5] },
      { id: '3_8', name: 'Pool {3, 6}', type: 'degree_single', pool: [3, 6] },
      { id: '3_9', name: 'Pool completo', type: 'degree_single', pool: [1,2,3,4,5,6,7] },
      { id: '3_10', name: 'Sequenza 2 note', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], length: 2 },
      { id: '3_11', name: 'Sequenza 3 note', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], length: 3 },
      { id: '3_12', name: 'Retention 10s', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], length: 2, retention: 10 },
      { id: '3_13', name: 'Retention 20s', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], length: 3, retention: 20 },
      { id: '3_14', name: 'Speed round', type: 'degree_single', pool: [1,2,3,4,5,6,7], timeLimit: 2 },
      { id: '3_15', name: 'Inversione — canta il grado', type: 'sing_degree', pool: [1,2,3,4,5,6,7] },
    ]),
  },
  4: {
    id: 4, worldId: 1,
    name: 'Scala Minore Naturale',
    description: 'b3, b6, b7 — il colore minore.',
    exerciseCount: 15,
    exercises: buildExercises(4, [
      { id: '4_1', name: 'b3 vs 3', type: 'minor_compare', degree: 3, description: 'La nota è il grado 3 maggiore o b3 minore?' },
      { id: '4_2', name: 'b6 vs 6', type: 'minor_compare', degree: 6, description: 'La nota è il grado 6 maggiore o b6 minore?' },
      { id: '4_3', name: 'b7 vs 7', type: 'minor_compare', degree: 7, description: 'La nota è il grado 7 maggiore o b7 minore?' },
      { id: '4_4', name: 'Gradi stabili minore', type: 'degree_single', pool: [1, 3, 5], scaleType: 'minor' },
      { id: '4_5', name: 'Gradi tensivi minore', type: 'degree_single', pool: [2, 4, 6, 7], scaleType: 'minor' },
      { id: '4_6', name: 'Pool completo minore', type: 'degree_single', pool: [1,2,3,4,5,6,7], scaleType: 'minor' },
      { id: '4_7', name: 'Sequenza 2 note minore', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], scaleType: 'minor', length: 2 },
      { id: '4_8', name: 'Sequenza 3 note minore', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], scaleType: 'minor', length: 3 },
      { id: '4_9', name: 'Maggiore o minore?', type: 'major_minor_id', description: 'La scala è maggiore o minore?' },
      { id: '4_10', name: 'Retention 10s minore', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], scaleType: 'minor', length: 2, retention: 10 },
      { id: '4_11', name: 'Retention 20s minore', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], scaleType: 'minor', length: 3, retention: 20 },
      { id: '4_12', name: 'Speed round minore', type: 'degree_single', pool: [1,2,3,4,5,6,7], scaleType: 'minor', timeLimit: 2 },
      { id: '4_13', name: 'Grado mancante minore', type: 'missing_degree', scaleType: 'minor' },
      { id: '4_14', name: 'Sequenza 4 note minore', type: 'degree_sequence', pool: [1,2,3,4,5,6,7], scaleType: 'minor', length: 4 },
      { id: '4_15', name: 'Canta il grado minore', type: 'sing_degree', pool: [1,2,3,4,5,6,7], scaleType: 'minor' },
    ]),
  },

  // ─── MONDO II — MELODIA ───────────────────────────────────────

  5: {
    id: 5, worldId: 2,
    name: 'Frasi Brevi su Drone',
    description: 'Frasi melodiche brevi con drone.',
    exerciseCount: 13,
    exercises: buildExercises(5, [
      { id: '5_1', name: 'Frase 2 note', type: 'melodic_phrase', description: 'Trascrivi i gradi di una frase di 2 note.', pool: [1,2,3,4,5], length: 2 },
      { id: '5_2', name: 'Frase 3 note', type: 'melodic_phrase', description: 'Trascrivi i gradi di una frase di 3 note.', pool: [1,2,3,4,5], length: 3 },
      { id: '5_3', name: 'Frase 4 note', type: 'melodic_phrase', description: 'Trascrivi i gradi di una frase di 4 note.', pool: [1,2,3,4,5,6,7], length: 4 },
      { id: '5_4', name: 'Frase ritmica 2 note', type: 'melodic_phrase', description: 'Frase di 2 note con ritmo a 80 BPM.', pool: [1,2,3,4,5], length: 2, bpm: 80 },
      { id: '5_5', name: 'Frase ritmica 3 note', type: 'melodic_phrase', description: 'Frase di 3 note con ritmo misto.', pool: [1,2,3,4,5], length: 3, bpm: 80 },
      { id: '5_6', name: 'Frase ritmica 4 note', type: 'melodic_phrase', description: 'Frase di 4 note con ritmo misto.', pool: [1,2,3,4,5,6,7], length: 4, bpm: 80 },
      { id: '5_7', name: 'Direzione frase', type: 'phrase_direction', description: 'La frase è ascendente o discendente?', pool: [1,2,3,4,5,6,7], length: 4 },
      { id: '5_8', name: 'Ultimo grado', type: 'phrase_last_degree', description: 'Su quale grado termina la frase?', pool: [1,2,3,4,5,6,7], length: 4 },
      { id: '5_9', name: 'Retention 2 note / 5s', type: 'melodic_phrase', description: 'Frase 2 note, silenzio 5s, poi rispondi.', pool: [1,2,3,4,5], length: 2, retention: 5 },
      { id: '5_10', name: 'Retention 3 note / 10s', type: 'melodic_phrase', description: 'Frase 3 note, silenzio 10s, poi rispondi.', pool: [1,2,3,4,5], length: 3, retention: 10 },
      { id: '5_11', name: 'Retention 4 note / 15s', type: 'melodic_phrase', description: 'Frase 4 note, silenzio 15s, poi rispondi.', pool: [1,2,3,4,5,6,7], length: 4, retention: 15 },
      { id: '5_12', name: 'Confronta frasi', type: 'phrase_compare', description: 'Le due frasi sono uguali o diverse?', pool: [1,2,3,4,5,6,7], length: 3 },
      { id: '5_13', name: 'Trova la differenza', type: 'phrase_diff', description: 'In quale posizione differiscono le due frasi?', pool: [1,2,3,4,5,6,7], length: 4 },
    ]),
  },

  6: {
    id: 6, worldId: 2,
    name: 'Pentatonica Maggiore e Minore',
    description: 'Frasi su scala pentatonica.',
    exerciseCount: 12,
    exercises: buildExercises(6, [
      { id: '6_1', name: 'Pent. maggiore 2 note', type: 'melodic_phrase', description: 'Frase 2 note da pentatonica maggiore.', pool: [1,2,3,5,6], length: 2 },
      { id: '6_2', name: 'Pent. maggiore 3 note', type: 'melodic_phrase', description: 'Frase 3 note da pentatonica maggiore.', pool: [1,2,3,5,6], length: 3 },
      { id: '6_3', name: 'Pent. maggiore 4 note', type: 'melodic_phrase', description: 'Frase 4 note da pentatonica maggiore.', pool: [1,2,3,5,6], length: 4 },
      { id: '6_4', name: 'Direzione pent. maggiore', type: 'phrase_direction', description: 'La frase pentatonica è ascendente o discendente?', pool: [1,2,3,5,6], length: 4 },
      { id: '6_5', name: 'Ultimo grado pent. magg.', type: 'phrase_last_degree', description: 'Su quale grado termina la frase?', pool: [1,2,3,5,6], length: 4 },
      { id: '6_6', name: 'Confronta pent. maggiore', type: 'phrase_compare', description: 'Le due frasi pentatoniche sono uguali o diverse?', pool: [1,2,3,5,6], length: 3 },
      { id: '6_7', name: 'Pent. minore 2 note', type: 'melodic_phrase', description: 'Frase 2 note da pentatonica minore.', pool: [1,3,4,5,7], scaleType: 'minor', length: 2 },
      { id: '6_8', name: 'Pent. minore 3 note', type: 'melodic_phrase', description: 'Frase 3 note da pentatonica minore.', pool: [1,3,4,5,7], scaleType: 'minor', length: 3 },
      { id: '6_9', name: 'Pent. minore 4 note', type: 'melodic_phrase', description: 'Frase 4 note da pentatonica minore.', pool: [1,3,4,5,7], scaleType: 'minor', length: 4 },
      { id: '6_10', name: 'Direzione pent. minore', type: 'phrase_direction', description: 'La frase pentatonica minore è ascendente o discendente?', pool: [1,3,4,5,7], scaleType: 'minor', length: 4 },
      { id: '6_11', name: 'Ultimo grado pent. min.', type: 'phrase_last_degree', description: 'Su quale grado termina la frase?', pool: [1,3,4,5,7], scaleType: 'minor', length: 4 },
      { id: '6_12', name: 'Confronta pent. minore', type: 'phrase_compare', description: 'Le due frasi pentatoniche minori sono uguali o diverse?', pool: [1,3,4,5,7], scaleType: 'minor', length: 3 },
    ]),
  },

  7: {
    id: 7, worldId: 2,
    name: 'Lick su Pentatonica',
    description: 'Trascrizione di lick a vari BPM.',
    exerciseCount: 15,
    exercises: buildExercises(7, [
      { id: '7_1', name: 'Lick 4 note magg. 60BPM', type: 'melodic_phrase', description: 'Lick pentatonico maggiore a 60 BPM.', pool: [1,2,3,5,6], length: 4, bpm: 60 },
      { id: '7_2', name: 'Lick 4 note magg. 80BPM', type: 'melodic_phrase', description: 'Lick pentatonico maggiore a 80 BPM.', pool: [1,2,3,5,6], length: 4, bpm: 80 },
      { id: '7_3', name: 'Lick 6 note magg. 60BPM', type: 'melodic_phrase', description: 'Lick 6 note pentatonico maggiore a 60 BPM.', pool: [1,2,3,5,6], length: 6, bpm: 60 },
      { id: '7_4', name: 'Lick 6 note magg. 80BPM', type: 'melodic_phrase', description: 'Lick 6 note pentatonico maggiore a 80 BPM.', pool: [1,2,3,5,6], length: 6, bpm: 80 },
      { id: '7_5', name: 'Lick 4 note min. 60BPM', type: 'melodic_phrase', description: 'Lick pentatonico minore a 60 BPM.', pool: [1,3,4,5,7], scaleType: 'minor', length: 4, bpm: 60 },
      { id: '7_6', name: 'Lick 4 note min. 80BPM', type: 'melodic_phrase', description: 'Lick pentatonico minore a 80 BPM.', pool: [1,3,4,5,7], scaleType: 'minor', length: 4, bpm: 80 },
      { id: '7_7', name: 'Lick 6 note min. 60BPM', type: 'melodic_phrase', description: 'Lick 6 note pentatonico minore a 60 BPM.', pool: [1,3,4,5,7], scaleType: 'minor', length: 6, bpm: 60 },
      { id: '7_8', name: 'Lick 6 note min. 80BPM', type: 'melodic_phrase', description: 'Lick 6 note pentatonico minore a 80 BPM.', pool: [1,3,4,5,7], scaleType: 'minor', length: 6, bpm: 80 },
      { id: '7_9', name: 'Lick 8 note magg. 80BPM', type: 'melodic_phrase', description: 'Lick 8 note maggiore a 80 BPM.', pool: [1,2,3,5,6], length: 8, bpm: 80 },
      { id: '7_10', name: 'Lick 8 note min. 80BPM', type: 'melodic_phrase', description: 'Lick 8 note minore a 80 BPM.', pool: [1,3,4,5,7], scaleType: 'minor', length: 8, bpm: 80 },
      { id: '7_11', name: 'Retention lick 10s', type: 'melodic_phrase', description: 'Senti il lick, silenzio 10s, poi trascrivi.', pool: [1,2,3,5,6], length: 4, bpm: 60, retention: 10 },
      { id: '7_12', name: 'Lick con nota ripetuta', type: 'melodic_phrase', description: 'Lick con una nota ripetuta (riff).', pool: [1,2,3,5,6], length: 6, bpm: 80, allowRepeats: true },
      { id: '7_13', name: 'Primo grado del lick', type: 'phrase_first_degree', description: 'Identifica il primo grado del lick.', pool: [1,2,3,5,6], length: 4, bpm: 60 },
      { id: '7_14', name: 'Ultimo grado del lick', type: 'phrase_last_degree', description: 'Identifica l\'ultimo grado del lick.', pool: [1,2,3,5,6], length: 4, bpm: 60 },
      { id: '7_15', name: 'Lick maggiore o minore?', type: 'pentatonic_id', description: 'Il lick è su pentatonica maggiore o minore?' },
    ]),
  },

  8: {
    id: 8, worldId: 2,
    name: 'Ornamenti e Articolazioni',
    description: 'Bend, hammer-on, pull-off, slide, vibrato.',
    exerciseCount: 12,
    exercises: buildExercises(8, [
      { id: '8_1', name: 'Bend semitono', type: 'ornament_bend', description: 'Riconosci il grado di destinazione dopo un bend di un semitono.', pool: [1,2,3,4,5,6,7], bendSemitones: 1 },
      { id: '8_2', name: 'Bend tono intero', type: 'ornament_bend', description: 'Riconosci il grado di destinazione dopo un bend di un tono.', pool: [1,2,3,4,5,6,7], bendSemitones: 2 },
      { id: '8_3', name: 'Hammer-on', type: 'ornament_pair', description: 'Due note legate ascendenti — trascrivi entrambe.', pool: [1,2,3,4,5,6,7], ornamentType: 'hammer_on' },
      { id: '8_4', name: 'Pull-off', type: 'ornament_pair', description: 'Due note legate discendenti — trascrivi entrambe.', pool: [1,2,3,4,5,6,7], ornamentType: 'pull_off' },
      { id: '8_5', name: 'Slide', type: 'ornament_pair', description: 'Slide tra due gradi — identifica entrambi.', pool: [1,2,3,4,5,6,7], ornamentType: 'slide' },
      { id: '8_6', name: 'Vibrato', type: 'ornament_vibrato', description: 'La nota con vibrato è sopra o sotto il grado target?', pool: [1,2,3,4,5,6,7] },
      { id: '8_7', name: 'Ghost note', type: 'ornament_ghost', description: 'Identifica la posizione della ghost note nel lick.', pool: [1,2,3,5,6], length: 4 },
      { id: '8_8', name: 'Lick con ornamenti', type: 'ornament_lick', description: 'Trascrivi i gradi ignorando gli ornamenti.', pool: [1,2,3,5,6], length: 4, bpm: 60 },
      { id: '8_9', name: 'Bend veloce', type: 'ornament_bend', description: 'Bend più veloce — identifica il grado.', pool: [1,2,3,4,5,6,7], bendSemitones: 1, fast: true },
      { id: '8_10', name: 'Hammer-on veloce', type: 'ornament_pair', description: 'Hammer-on/pull-off veloce — trascrivi.', pool: [1,2,3,4,5,6,7], ornamentType: 'hammer_on', fast: true },
      { id: '8_11', name: 'Slide veloce', type: 'ornament_pair', description: 'Slide veloce — identifica i gradi.', pool: [1,2,3,4,5,6,7], ornamentType: 'slide', fast: true },
      { id: '8_12', name: 'Lick ornamentato veloce', type: 'ornament_lick', description: 'Lick con ornamenti a velocità maggiore.', pool: [1,2,3,5,6], length: 4, bpm: 80 },
    ]),
  },

  // ─── MONDO III — ARMONIA DIATONICA ──────────────────────────

  9: {
    id: 9, worldId: 3,
    name: 'Triadi Maggiori e Minori',
    description: 'La dimensione verticale — accordi.',
    exerciseCount: 10,
    exercises: buildExercises(9, [
      { id: '9_1', name: 'Maggiore vs Minore', type: 'chord_quality', description: 'La triade è maggiore o minore?', qualityPool: ['major', 'minor'] },
      { id: '9_2', name: 'Aumentata vs Diminuita', type: 'chord_quality', description: 'La triade è aumentata o diminuita?', qualityPool: ['augmented', 'diminished'] },
      { id: '9_3', name: '4 qualità', type: 'chord_quality', description: 'Identifica la qualità tra M, m, dim, aug.', qualityPool: ['major', 'minor', 'diminished', 'augmented'] },
      { id: '9_4', name: 'Rivolti', type: 'chord_inversion', description: 'Identifica il rivolto della triade.' },
      { id: '9_5', name: 'Qualità + Rivolto', type: 'chord_quality_inversion', description: 'Identifica qualità e rivolto.', qualityPool: ['major', 'minor', 'diminished', 'augmented'] },
      { id: '9_6', name: 'Sequenza 2 triadi', type: 'chord_sequence_quality', description: 'Identifica le qualità di 2 triadi.', qualityPool: ['major', 'minor', 'diminished', 'augmented'], length: 2 },
      { id: '9_7', name: 'Grado della triade?', type: 'chord_degree_confirm', description: 'La triade è costruita sul grado indicato?', pool: [1,2,3,4,5,6,7] },
      { id: '9_8', name: 'Identifica il grado', type: 'chord_degree', description: 'Su quale grado è costruita la triade?', pool: [1,2,3,4,5,6,7] },
      { id: '9_9', name: 'Retention triadi 10s', type: 'chord_quality', description: 'Ascolta, silenzio 10s, poi rispondi.', qualityPool: ['major', 'minor', 'diminished', 'augmented'], retention: 10 },
      { id: '9_10', name: 'Speed round triadi', type: 'chord_quality', description: 'Identifica la qualità entro 3s.', qualityPool: ['major', 'minor', 'diminished', 'augmented'], timeLimit: 3 },
    ]),
  },

  10: {
    id: 10, worldId: 3,
    name: 'Progressioni I-IV-V',
    description: 'Tonica, sottodominante, dominante.',
    exerciseCount: 12,
    exercises: buildExercises(10, [
      { id: '10_1', name: 'I vs IV', type: 'chord_degree', description: 'Tonica o sottodominante?', pool: [1, 4] },
      { id: '10_2', name: 'I vs V', type: 'chord_degree', description: 'Tonica o dominante?', pool: [1, 5] },
      { id: '10_3', name: 'IV vs V', type: 'chord_degree', description: 'Sottodominante o dominante?', pool: [4, 5] },
      { id: '10_4', name: 'Pool I-IV-V', type: 'chord_degree', description: 'Identifica il grado tra I, IV, V.', pool: [1, 4, 5] },
      { id: '10_5', name: 'Progressione 2 accordi', type: 'chord_progression', description: 'Trascrivi la progressione di 2 accordi.', pool: [1, 4, 5], length: 2 },
      { id: '10_6', name: 'Progressione 3 accordi', type: 'chord_progression', description: 'Trascrivi la progressione di 3 accordi.', pool: [1, 4, 5], length: 3 },
      { id: '10_7', name: 'Progressione 4 accordi', type: 'chord_progression', description: 'Trascrivi la progressione di 4 accordi.', pool: [1, 4, 5], length: 4 },
      { id: '10_8', name: 'Risolve o sospesa?', type: 'progression_resolution', description: 'La progressione termina su I o su V?', pool: [1, 4, 5] },
      { id: '10_9', name: 'Retention 2 accordi 10s', type: 'chord_progression', description: 'Progressione 2 accordi, silenzio 10s.', pool: [1, 4, 5], length: 2, retention: 10 },
      { id: '10_10', name: 'Retention 3 accordi 15s', type: 'chord_progression', description: 'Progressione 3 accordi, silenzio 15s.', pool: [1, 4, 5], length: 3, retention: 15 },
      { id: '10_11', name: 'Basso della progressione', type: 'progression_bass', description: 'Identifica il basso di ogni accordo.', pool: [1, 4, 5], length: 3 },
      { id: '10_12', name: 'Progressione a tempo', type: 'chord_progression', description: 'Progressione a 60 BPM.', pool: [1, 4, 5], length: 4, bpm: 60 },
    ]),
  },

  11: {
    id: 11, worldId: 3,
    name: 'Gradi Armonici Diatonici',
    description: 'Tutti e 7 i gradi armonici.',
    exerciseCount: 12,
    exercises: buildExercises(11, [
      { id: '11_1', name: 'Pool I-II-IV-V', type: 'chord_degree', description: 'Aggiungi il II minore.', pool: [1, 2, 4, 5] },
      { id: '11_2', name: 'Pool + VI', type: 'chord_degree', description: 'Aggiungi il VI minore.', pool: [1, 2, 4, 5, 6] },
      { id: '11_3', name: 'Pool + III', type: 'chord_degree', description: 'Aggiungi il III minore.', pool: [1, 2, 3, 4, 5, 6] },
      { id: '11_4', name: 'Pool completo I-VII', type: 'chord_degree', description: 'Tutti i 7 gradi armonici.', pool: [1, 2, 3, 4, 5, 6, 7] },
      { id: '11_5', name: 'Sequenza 2 accordi', type: 'chord_progression', description: 'Progressione 2 accordi, pool completo.', pool: [1, 2, 3, 4, 5, 6, 7], length: 2 },
      { id: '11_6', name: 'Sequenza 3 accordi', type: 'chord_progression', description: 'Progressione 3 accordi.', pool: [1, 2, 3, 4, 5, 6, 7], length: 3 },
      { id: '11_7', name: 'Sequenza 4 accordi', type: 'chord_progression', description: 'Progressione 4 accordi.', pool: [1, 2, 3, 4, 5, 6, 7], length: 4 },
      { id: '11_8', name: 'Progressione 8 accordi', type: 'chord_progression', description: 'Progressione lunga di 8 accordi.', pool: [1, 2, 3, 4, 5, 6, 7], length: 8 },
      { id: '11_9', name: 'Retention 15s', type: 'chord_progression', description: 'Progressione 3 accordi, silenzio 15s.', pool: [1, 2, 3, 4, 5, 6, 7], length: 3, retention: 15 },
      { id: '11_10', name: 'Speed round', type: 'chord_degree', description: 'Identifica il grado entro 3s.', pool: [1, 2, 3, 4, 5, 6, 7], timeLimit: 3 },
      { id: '11_11', name: 'Basso progressione', type: 'progression_bass', description: 'Trascrivi le note del basso.', pool: [1, 2, 3, 4, 5, 6, 7], length: 4 },
      { id: '11_12', name: 'Soprano progressione', type: 'progression_soprano', description: 'Trascrivi la voce superiore.', pool: [1, 2, 3, 4, 5, 6, 7], length: 4 },
    ]),
  },

  12: {
    id: 12, worldId: 3,
    name: 'Cadenze',
    description: 'Autentica, plagale, evitata, sospesa.',
    exerciseCount: 10,
    exercises: buildExercises(12, [
      { id: '12_1', name: 'Autentica vs Evitata', type: 'cadence_type', description: 'V→I (autentica) o V→VI (evitata)?', cadencePool: ['autentica', 'evitata'] },
      { id: '12_2', name: 'Plagale vs Autentica', type: 'cadence_type', description: 'IV→I (plagale) o V→I (autentica)?', cadencePool: ['plagale', 'autentica'] },
      { id: '12_3', name: 'Autentica vs Sospesa', type: 'cadence_type', description: 'Risoluzione o tensione?', cadencePool: ['autentica', 'sospesa'] },
      { id: '12_4', name: '4 cadenze', type: 'cadence_type', description: 'Identifica tra 4 tipi di cadenza.', cadencePool: ['autentica', 'plagale', 'evitata', 'sospesa'] },
      { id: '12_5', name: 'Cadenza in progressione', type: 'cadence_in_progression', description: 'Identifica la cadenza finale di 4 accordi.', cadencePool: ['autentica', 'plagale', 'evitata', 'sospesa'] },
      { id: '12_6', name: 'Cadenze — variazione 1', type: 'cadence_type', description: 'Cadenze con contesto armonico diverso.', cadencePool: ['autentica', 'plagale', 'evitata', 'sospesa'] },
      { id: '12_7', name: 'Cadenze — variazione 2', type: 'cadence_type', description: 'Identifica rapidamente la cadenza.', cadencePool: ['autentica', 'plagale', 'evitata', 'sospesa'] },
      { id: '12_8', name: 'Cadenze — variazione 3', type: 'cadence_type', description: 'Cadenze con diverso registro.', cadencePool: ['autentica', 'plagale', 'evitata', 'sospesa'] },
      { id: '12_9', name: 'Cadenze a 60 BPM', type: 'cadence_type', description: 'Cadenze a tempo.', cadencePool: ['autentica', 'plagale', 'evitata', 'sospesa'], bpm: 60 },
      { id: '12_10', name: 'Cadenze a 80 BPM', type: 'cadence_type', description: 'Cadenze a tempo veloce.', cadencePool: ['autentica', 'plagale', 'evitata', 'sospesa'], bpm: 80 },
    ]),
  },

  // ─── MONDO IV — CROMATISMO E MODALITÀ ──────────────────────

  13: {
    id: 13, worldId: 4,
    name: 'Minore Armonica e Melodica',
    description: 'Leading tone, scala melodica, confronto minori.',
    exerciseCount: 16,
    exercises: buildExercises(13, [
      // Minore armonica (13.1-13.8)
      { id: '13_1', name: 'Ascolto minore armonica', type: 'listen_only', description: 'Ascolta la scala minore armonica.', scaleType: 'harmonic_minor' },
      { id: '13_2', name: '7 vs b7 in minore', type: 'minor_compare', description: 'Leading tone (7) o b7?', degree: 7 },
      { id: '13_3', name: 'Gradi stabili arm.', type: 'degree_single', description: 'Pool {1,3,5,7} su armonica.', pool: [1,3,5,7], scaleType: 'harmonic_minor' },
      { id: '13_4', name: 'Pool completo arm.', type: 'degree_single', description: 'Tutti i gradi della minore armonica.', pool: [1,2,3,4,5,6,7], scaleType: 'harmonic_minor' },
      { id: '13_5', name: 'Sequenza 2 note arm.', type: 'degree_sequence', description: 'Sequenza 2 note su armonica.', pool: [1,2,3,4,5,6,7], scaleType: 'harmonic_minor', length: 2 },
      { id: '13_6', name: 'Sequenza 3 note arm.', type: 'degree_sequence', description: 'Sequenza 3 note su armonica.', pool: [1,2,3,4,5,6,7], scaleType: 'harmonic_minor', length: 3 },
      { id: '13_7', name: 'Retention arm. 10s', type: 'degree_sequence', description: 'Retention drill armonica 10s.', pool: [1,2,3,4,5,6,7], scaleType: 'harmonic_minor', length: 2, retention: 10 },
      { id: '13_8', name: 'Speed round arm.', type: 'degree_single', description: 'Speed round armonica — 3s.', pool: [1,2,3,4,5,6,7], scaleType: 'harmonic_minor', timeLimit: 3 },
      // Minore melodica (13.9-13.16)
      { id: '13_9', name: 'Ascolto minore melodica', type: 'listen_only', description: 'Ascolta la scala minore melodica.', scaleType: 'melodic_minor' },
      { id: '13_10', name: 'Gradi caratteristici mel.', type: 'degree_single', description: 'Pool {1,3,6,7} su melodica.', pool: [1,3,6,7], scaleType: 'melodic_minor' },
      { id: '13_11', name: 'Pool completo mel.', type: 'degree_single', description: 'Tutti i gradi della minore melodica.', pool: [1,2,3,4,5,6,7], scaleType: 'melodic_minor' },
      { id: '13_12', name: 'Sequenza 2 note mel.', type: 'degree_sequence', description: 'Sequenza 2 note su melodica.', pool: [1,2,3,4,5,6,7], scaleType: 'melodic_minor', length: 2 },
      { id: '13_13', name: 'Sequenza 3 note mel.', type: 'degree_sequence', description: 'Sequenza 3 note su melodica.', pool: [1,2,3,4,5,6,7], scaleType: 'melodic_minor', length: 3 },
      { id: '13_14', name: 'Naturale vs Armonica vs Melodica', type: 'minor_scale_id', description: 'Identifica il tipo di scala minore.', scalePool: ['minor', 'harmonic_minor', 'melodic_minor'] },
      { id: '13_15', name: 'Retention mel. 10s', type: 'degree_sequence', description: 'Retention drill melodica 10s.', pool: [1,2,3,4,5,6,7], scaleType: 'melodic_minor', length: 2, retention: 10 },
      { id: '13_16', name: 'Speed round mel.', type: 'degree_single', description: 'Speed round melodica — 3s.', pool: [1,2,3,4,5,6,7], scaleType: 'melodic_minor', timeLimit: 3 },
    ]),
  },

  14: {
    id: 14, worldId: 4,
    name: 'Modi della Scala Maggiore',
    description: 'Dorico, Frigio, Lidio, Misolidio, Eolio, Locrio.',
    exerciseCount: 48,
    exercises: buildExercises(14, [
      // 14A — Dorico (14_1 - 14_8)
      { id: '14_1', name: 'Ascolto Dorico', type: 'listen_only', description: 'Ascolta la scala dorica.', scaleType: 'dorian' },
      { id: '14_2', name: 'Gradi caratteristici Dorico', type: 'degree_single', description: 'Pool {1,3,6} — il 6 naturale è la firma dorica.', pool: [1,3,6], scaleType: 'dorian' },
      { id: '14_3', name: 'Pool completo Dorico', type: 'degree_single', description: 'Tutti i gradi dorici.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian' },
      { id: '14_4', name: 'Sequenza 2 note Dorico', type: 'degree_sequence', description: '2 note doriche.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 2 },
      { id: '14_5', name: 'Sequenza 3 note Dorico', type: 'degree_sequence', description: '3 note doriche.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 3 },
      { id: '14_6', name: 'Dorico vs Eolio', type: 'mode_id', description: 'Riconosci il modo: Dorico o Eolio?', modePool: ['dorian', 'aeolian'] },
      { id: '14_7', name: 'Retention Dorico 10s', type: 'degree_sequence', description: 'Retention drill dorico.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 2, retention: 10 },
      { id: '14_8', name: 'Speed round Dorico', type: 'degree_single', description: 'Speed round dorico — 3s.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', timeLimit: 3 },

      // 14B — Frigio (14_9 - 14_16)
      { id: '14_9', name: 'Ascolto Frigio', type: 'listen_only', description: 'Ascolta la scala frigia.', scaleType: 'phrygian' },
      { id: '14_10', name: 'Gradi caratteristici Frigio', type: 'degree_single', description: 'Pool {1,2,5} — il b2 è la firma frigia.', pool: [1,2,5], scaleType: 'phrygian' },
      { id: '14_11', name: 'Pool completo Frigio', type: 'degree_single', description: 'Tutti i gradi frigi.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian' },
      { id: '14_12', name: 'Sequenza 2 note Frigio', type: 'degree_sequence', description: '2 note frigie.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 2 },
      { id: '14_13', name: 'Sequenza 3 note Frigio', type: 'degree_sequence', description: '3 note frigie.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 3 },
      { id: '14_14', name: 'Frigio vs Eolio', type: 'mode_id', description: 'Riconosci il modo: Frigio o Eolio?', modePool: ['phrygian', 'aeolian'] },
      { id: '14_15', name: 'Retention Frigio 10s', type: 'degree_sequence', description: 'Retention drill frigio.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 2, retention: 10 },
      { id: '14_16', name: 'Speed round Frigio', type: 'degree_single', description: 'Speed round frigio — 3s.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', timeLimit: 3 },

      // 14C — Lidio (14_17 - 14_24)
      { id: '14_17', name: 'Ascolto Lidio', type: 'listen_only', description: 'Ascolta la scala lidia.', scaleType: 'lydian' },
      { id: '14_18', name: 'Gradi caratteristici Lidio', type: 'degree_single', description: 'Pool {1,4,5} — il #4 è la firma lidia.', pool: [1,4,5], scaleType: 'lydian' },
      { id: '14_19', name: 'Pool completo Lidio', type: 'degree_single', description: 'Tutti i gradi lidi.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian' },
      { id: '14_20', name: 'Sequenza 2 note Lidio', type: 'degree_sequence', description: '2 note lidie.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 2 },
      { id: '14_21', name: 'Sequenza 3 note Lidio', type: 'degree_sequence', description: '3 note lidie.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 3 },
      { id: '14_22', name: 'Lidio vs Ionico', type: 'mode_id', description: 'Riconosci il modo: Lidio o Ionico?', modePool: ['lydian', 'ionian'] },
      { id: '14_23', name: 'Retention Lidio 10s', type: 'degree_sequence', description: 'Retention drill lidio.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 2, retention: 10 },
      { id: '14_24', name: 'Speed round Lidio', type: 'degree_single', description: 'Speed round lidio — 3s.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', timeLimit: 3 },

      // 14D — Misolidio (14_25 - 14_32)
      { id: '14_25', name: 'Ascolto Misolidio', type: 'listen_only', description: 'Ascolta la scala misolidia.', scaleType: 'mixolydian' },
      { id: '14_26', name: 'Gradi caratteristici Misol.', type: 'degree_single', description: 'Pool {1,5,7} — il b7 è la firma misolidia.', pool: [1,5,7], scaleType: 'mixolydian' },
      { id: '14_27', name: 'Pool completo Misolidio', type: 'degree_single', description: 'Tutti i gradi misolidi.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian' },
      { id: '14_28', name: 'Sequenza 2 note Misol.', type: 'degree_sequence', description: '2 note misolidie.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 2 },
      { id: '14_29', name: 'Sequenza 3 note Misol.', type: 'degree_sequence', description: '3 note misolidie.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 3 },
      { id: '14_30', name: 'Misolidio vs Ionico', type: 'mode_id', description: 'Riconosci il modo: Misolidio o Ionico?', modePool: ['mixolydian', 'ionian'] },
      { id: '14_31', name: 'Retention Misolidio 10s', type: 'degree_sequence', description: 'Retention drill misolidio.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 2, retention: 10 },
      { id: '14_32', name: 'Speed round Misolidio', type: 'degree_single', description: 'Speed round misolidio — 3s.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', timeLimit: 3 },

      // 14E — Eolio / Confronto modale (14_33 - 14_40)
      { id: '14_33', name: 'Ascolto Eolio', type: 'listen_only', description: 'Ascolta la scala eolia (= minore naturale).', scaleType: 'aeolian' },
      { id: '14_34', name: 'Eolio vs Dorico', type: 'mode_id', description: 'Il 6° grado è naturale (Dorico) o bemolle (Eolio)?', modePool: ['aeolian', 'dorian'] },
      { id: '14_35', name: 'Eolio vs Frigio', type: 'mode_id', description: 'Eolio o Frigio?', modePool: ['aeolian', 'phrygian'] },
      { id: '14_36', name: 'Dorico vs Frigio', type: 'mode_id', description: 'Dorico o Frigio?', modePool: ['dorian', 'phrygian'] },
      { id: '14_37', name: 'Lidio vs Misolidio', type: 'mode_id', description: 'Lidio o Misolidio?', modePool: ['lydian', 'mixolydian'] },
      { id: '14_38', name: 'Pool 4 modi', type: 'mode_id', description: 'Identifica tra Dorico, Frigio, Lidio, Misolidio.', modePool: ['dorian', 'phrygian', 'lydian', 'mixolydian'] },
      { id: '14_39', name: 'Pool 6 modi', type: 'mode_id', description: 'Identifica tra tutti e 6 i modi.', modePool: ['dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'] },
      { id: '14_40', name: 'Pool 7 modi (con Ionico)', type: 'mode_id', description: 'Tutti i 7 modi incluso Ionico.', modePool: ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'] },

      // 14F — Locrio (14_41 - 14_48)
      { id: '14_41', name: 'Ascolto Locrio', type: 'listen_only', description: 'Ascolta la scala locria.', scaleType: 'locrian' },
      { id: '14_42', name: 'Gradi caratteristici Locrio', type: 'degree_single', description: 'Pool {1,2,5} — b2 e b5 sono la firma locria.', pool: [1,2,5], scaleType: 'locrian' },
      { id: '14_43', name: 'Pool completo Locrio', type: 'degree_single', description: 'Tutti i gradi locri.', pool: [1,2,3,4,5,6,7], scaleType: 'locrian' },
      { id: '14_44', name: 'Sequenza 2 note Locrio', type: 'degree_sequence', description: '2 note locrie.', pool: [1,2,3,4,5,6,7], scaleType: 'locrian', length: 2 },
      { id: '14_45', name: 'Sequenza 3 note Locrio', type: 'degree_sequence', description: '3 note locrie.', pool: [1,2,3,4,5,6,7], scaleType: 'locrian', length: 3 },
      { id: '14_46', name: 'Locrio vs Frigio', type: 'mode_id', description: 'Locrio o Frigio?', modePool: ['locrian', 'phrygian'] },
      { id: '14_47', name: 'Retention Locrio 10s', type: 'degree_sequence', description: 'Retention drill locrio.', pool: [1,2,3,4,5,6,7], scaleType: 'locrian', length: 2, retention: 10 },
      { id: '14_48', name: 'Speed round Locrio', type: 'degree_single', description: 'Speed round locrio — 3s.', pool: [1,2,3,4,5,6,7], scaleType: 'locrian', timeLimit: 3 },
    ]),
  },

  15: {
    id: 15, worldId: 4,
    name: 'Tensioni Cromatiche',
    description: 'b2, #4, b5, b7, #5 su contesto maggiore.',
    exerciseCount: 12,
    exercises: buildExercises(15, [
      { id: '15_1', name: 'b2 — grado frigio', type: 'chromatic_tension', description: 'Riconosci la tensione b2.', tensionPool: ['b2'] },
      { id: '15_2', name: '#4 — tritono sopra', type: 'chromatic_tension', description: 'Riconosci la tensione #4.', tensionPool: ['#4'] },
      { id: '15_3', name: 'b3 — terza minore', type: 'chromatic_tension', description: 'Riconosci la tensione b3.', tensionPool: ['b3'] },
      { id: '15_4', name: 'b7 — settima minore', type: 'chromatic_tension', description: 'Riconosci la tensione b7.', tensionPool: ['b7'] },
      { id: '15_5', name: '#5 — quinta aumentata', type: 'chromatic_tension', description: 'Riconosci la tensione #5.', tensionPool: ['#5'] },
      { id: '15_6', name: 'Pool cromatico completo', type: 'chromatic_tension', description: 'Identifica la tensione cromatica.', tensionPool: ['b2', 'b3', '#4', '#5', 'b7'] },
      { id: '15_7', name: 'Sequenza 2 tensioni', type: 'chromatic_tension_sequence', description: 'Sequenza di 2 note cromatiche.', tensionPool: ['b2', 'b3', '#4', '#5', 'b7'], length: 2 },
      { id: '15_8', name: 'Sequenza 3 tensioni', type: 'chromatic_tension_sequence', description: 'Sequenza di 3 note cromatiche.', tensionPool: ['b2', 'b3', '#4', '#5', 'b7'], length: 3 },
      { id: '15_9', name: 'b2 vs #4', type: 'chromatic_tension', description: 'Distingui b2 da #4.', tensionPool: ['b2', '#4'] },
      { id: '15_10', name: '#5 vs b7', type: 'chromatic_tension', description: 'Distingui #5 da b7.', tensionPool: ['#5', 'b7'] },
      { id: '15_11', name: 'Retention cromatiche 10s', type: 'chromatic_tension', description: 'Tensione cromatica, silenzio 10s.', tensionPool: ['b2', 'b3', '#4', '#5', 'b7'], retention: 10 },
      { id: '15_12', name: 'Speed round cromatiche', type: 'chromatic_tension', description: 'Identifica la tensione entro 3s.', tensionPool: ['b2', 'b3', '#4', '#5', 'b7'], timeLimit: 3 },
    ]),
  },

  16: {
    id: 16, worldId: 4,
    name: 'Lick Modali',
    description: 'Lick dorici, frigi, lidii, misolidii.',
    exerciseCount: 32,
    exercises: buildExercises(16, [
      // 16A — Lick dorici (16_1 - 16_8)
      { id: '16_1', name: 'Lick dorico 4 note 60BPM', type: 'modal_lick', description: 'Lick dorico breve.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 4, bpm: 60 },
      { id: '16_2', name: 'Lick dorico 4 note 80BPM', type: 'modal_lick', description: 'Lick dorico a velocità moderata.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 4, bpm: 80 },
      { id: '16_3', name: 'Lick dorico 6 note 60BPM', type: 'modal_lick', description: 'Lick dorico 6 note.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 6, bpm: 60 },
      { id: '16_4', name: 'Lick dorico 6 note 80BPM', type: 'modal_lick', description: 'Lick dorico 6 note veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 6, bpm: 80 },
      { id: '16_5', name: 'Lick dorico 8 note', type: 'modal_lick', description: 'Lick dorico lungo.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 8, bpm: 80 },
      { id: '16_6', name: 'Dorico o Eolio? (lick)', type: 'modal_lick_id', description: 'Il lick è Dorico o Eolio?', modePool: ['dorian', 'aeolian'], length: 5, bpm: 60 },
      { id: '16_7', name: 'Retention dorico 10s', type: 'modal_lick', description: 'Lick dorico + silenzio 10s.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 4, bpm: 60, retention: 10 },
      { id: '16_8', name: 'Lick dorico 8 note 100BPM', type: 'modal_lick', description: 'Lick dorico veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian', length: 8, bpm: 100 },

      // 16B — Lick frigi (16_9 - 16_16)
      { id: '16_9', name: 'Lick frigio 4 note 60BPM', type: 'modal_lick', description: 'Lick frigio breve.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 4, bpm: 60 },
      { id: '16_10', name: 'Lick frigio 4 note 80BPM', type: 'modal_lick', description: 'Lick frigio veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 4, bpm: 80 },
      { id: '16_11', name: 'Lick frigio 6 note 60BPM', type: 'modal_lick', description: 'Lick frigio 6 note.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 6, bpm: 60 },
      { id: '16_12', name: 'Lick frigio 6 note 80BPM', type: 'modal_lick', description: 'Lick frigio 6 note veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 6, bpm: 80 },
      { id: '16_13', name: 'Lick frigio 8 note', type: 'modal_lick', description: 'Lick frigio lungo.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 8, bpm: 80 },
      { id: '16_14', name: 'Frigio o Eolio? (lick)', type: 'modal_lick_id', description: 'Il lick è Frigio o Eolio?', modePool: ['phrygian', 'aeolian'], length: 5, bpm: 60 },
      { id: '16_15', name: 'Retention frigio 10s', type: 'modal_lick', description: 'Lick frigio + silenzio 10s.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 4, bpm: 60, retention: 10 },
      { id: '16_16', name: 'Lick frigio 8 note 100BPM', type: 'modal_lick', description: 'Lick frigio veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'phrygian', length: 8, bpm: 100 },

      // 16C — Lick lidii (16_17 - 16_24)
      { id: '16_17', name: 'Lick lidio 4 note 60BPM', type: 'modal_lick', description: 'Lick lidio breve.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 4, bpm: 60 },
      { id: '16_18', name: 'Lick lidio 4 note 80BPM', type: 'modal_lick', description: 'Lick lidio veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 4, bpm: 80 },
      { id: '16_19', name: 'Lick lidio 6 note 60BPM', type: 'modal_lick', description: 'Lick lidio 6 note.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 6, bpm: 60 },
      { id: '16_20', name: 'Lick lidio 6 note 80BPM', type: 'modal_lick', description: 'Lick lidio 6 note veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 6, bpm: 80 },
      { id: '16_21', name: 'Lick lidio 8 note', type: 'modal_lick', description: 'Lick lidio lungo.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 8, bpm: 80 },
      { id: '16_22', name: 'Lidio o Ionico? (lick)', type: 'modal_lick_id', description: 'Il lick è Lidio o Ionico?', modePool: ['lydian', 'ionian'], length: 5, bpm: 60 },
      { id: '16_23', name: 'Retention lidio 10s', type: 'modal_lick', description: 'Lick lidio + silenzio 10s.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 4, bpm: 60, retention: 10 },
      { id: '16_24', name: 'Lick lidio 8 note 100BPM', type: 'modal_lick', description: 'Lick lidio veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'lydian', length: 8, bpm: 100 },

      // 16D — Lick misolidii (16_25 - 16_32)
      { id: '16_25', name: 'Lick misolidio 4 note 60BPM', type: 'modal_lick', description: 'Lick misolidio breve.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 4, bpm: 60 },
      { id: '16_26', name: 'Lick misolidio 4 note 80BPM', type: 'modal_lick', description: 'Lick misolidio veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 4, bpm: 80 },
      { id: '16_27', name: 'Lick misolidio 6 note 60BPM', type: 'modal_lick', description: 'Lick misolidio 6 note.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 6, bpm: 60 },
      { id: '16_28', name: 'Lick misolidio 6 note 80BPM', type: 'modal_lick', description: 'Lick misolidio 6 note veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 6, bpm: 80 },
      { id: '16_29', name: 'Lick misolidio 8 note', type: 'modal_lick', description: 'Lick misolidio lungo.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 8, bpm: 80 },
      { id: '16_30', name: 'Misol. o Ionico? (lick)', type: 'modal_lick_id', description: 'Il lick è Misolidio o Ionico?', modePool: ['mixolydian', 'ionian'], length: 5, bpm: 60 },
      { id: '16_31', name: 'Retention misolidio 10s', type: 'modal_lick', description: 'Lick misolidio + silenzio 10s.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 4, bpm: 60, retention: 10 },
      { id: '16_32', name: 'Lick misolidio 8 note 100BPM', type: 'modal_lick', description: 'Lick misolidio veloce.', pool: [1,2,3,4,5,6,7], scaleType: 'mixolydian', length: 8, bpm: 100 },
    ]),
  },
  // ─── MONDO V — Armonia avanzata ──────────────────────────────

  17: {
    id: 17, worldId: 5,
    name: 'Accordi di Settima',
    description: 'maj7, dom7, m7, m7b5, dim7 — la dimensione verticale si espande.',
    exerciseCount: 12,
    exercises: buildExercises(17, [
      { id: '17_1', name: 'Maj7 vs Dom7', type: 'seventh_quality', description: 'Distingui Maj7 da Dom7.', qualityPool: ['maj7', 'dom7'] },
      { id: '17_2', name: 'm7 vs m7b5', type: 'seventh_quality', description: 'Distingui m7 da m7b5.', qualityPool: ['m7', 'm7b5'] },
      { id: '17_3', name: 'Pool completo 7ª', type: 'seventh_quality', description: 'Identifica tra tutte le qualità di settima.', qualityPool: ['maj7', 'dom7', 'm7', 'm7b5', 'dim7'] },
      { id: '17_4', name: 'Rivolti di 7ª', type: 'seventh_inversion', description: 'Identifica il rivolto (4 posizioni).' },
      { id: '17_5', name: 'Qualità + rivolto', type: 'seventh_quality_inversion', description: 'Identifica qualità e rivolto.', qualityPool: ['maj7', 'dom7', 'm7', 'm7b5', 'dim7'] },
      { id: '17_6', name: 'Sequenza 2 accordi 7ª', type: 'seventh_sequence', description: 'Sequenza di 2 accordi di settima.', qualityPool: ['maj7', 'dom7', 'm7', 'm7b5', 'dim7'], length: 2 },
      { id: '17_7', name: 'Sequenza 3 accordi 7ª', type: 'seventh_sequence', description: 'Sequenza di 3 accordi di settima.', qualityPool: ['maj7', 'dom7', 'm7', 'm7b5', 'dim7'], length: 3 },
      { id: '17_8', name: 'Grado diatonico 7ª', type: 'seventh_degree', description: 'Su quale grado è costruito l\'accordo di settima?', pool: [1, 2, 3, 4, 5, 6, 7] },
      { id: '17_9', name: 'Retention 7ª 15s', type: 'seventh_quality', description: 'Accordo di settima + silenzio 15s.', qualityPool: ['maj7', 'dom7', 'm7', 'm7b5', 'dim7'], retention: 15 },
      { id: '17_10', name: 'Speed round 7ª', type: 'seventh_quality', description: 'Identifica entro 3s.', qualityPool: ['maj7', 'dom7', 'm7', 'm7b5', 'dim7'], timeLimit: 3 },
      { id: '17_11', name: 'Terza o Settima?', type: 'seventh_voice_id', description: 'La nota è la terza o la settima dell\'accordo?' },
      { id: '17_12', name: 'Basso: grado o salto?', type: 'bass_movement', description: 'Il basso si muove per grado congiunto o per salto?' },
    ]),
  },

  18: {
    id: 18, worldId: 5,
    name: 'ii-V-I',
    description: 'La progressione fondamentale del jazz.',
    exerciseCount: 12,
    exercises: buildExercises(18, [
      { id: '18_1', name: 'ii-V-I maggiore (sì/no)', type: 'ii_v_i_confirm', description: 'Questa progressione è un ii-V-I maggiore?' },
      { id: '18_2', name: 'ii-V-I minore (sì/no)', type: 'ii_v_i_confirm', description: 'Questa progressione è un ii-V-I minore?', minor: true },
      { id: '18_3', name: 'ii-V aperta', type: 'ii_v_open', description: 'ii-V senza risoluzione — senti la tensione aperta.' },
      { id: '18_4', name: 'ii-V-I vs I-IV-V', type: 'ii_v_i_vs_I_IV_V', description: 'Distingui ii-V-I da I-IV-V.' },
      { id: '18_5', name: 'ii-V-I secondario', type: 'ii_v_i_secondary', description: 'ii-V-I su quale grado della scala?', degreePool: [1, 2, 4, 5, 6] },
      { id: '18_6', name: 'ii-V-I incatenati', type: 'ii_v_i_chain', description: 'Quanti ii-V-I consecutivi?', chainLength: 2 },
      { id: '18_7', name: 'Risoluzione Magg/Min', type: 'ii_v_i_resolution', description: 'La risoluzione dell\'I è maggiore o minore?' },
      { id: '18_8', name: 'ii-V-I maggiore retention', type: 'ii_v_i_confirm', description: 'ii-V-I con silenzio 10s.', retention: 10 },
      { id: '18_9', name: 'ii-V-I speed round', type: 'ii_v_i_confirm', description: 'Identifica entro 5s.', timeLimit: 5 },
      { id: '18_10', name: 'ii-V-I 3 incatenati', type: 'ii_v_i_chain', description: '3 ii-V-I consecutivi.', chainLength: 3 },
      { id: '18_11', name: 'ii-V-I sec. pool ampio', type: 'ii_v_i_secondary', description: 'ii-V-I su qualsiasi grado.', degreePool: [1, 2, 3, 4, 5, 6] },
      { id: '18_12', name: 'Risoluzione + ritenzione', type: 'ii_v_i_resolution', description: 'Magg/Min con silenzio 10s.', retention: 10 },
    ]),
  },

  19: {
    id: 19, worldId: 5,
    name: 'Sostituzioni',
    description: 'Tritono, dominanti secondarie, borrowed chords.',
    exerciseCount: 10,
    exercises: buildExercises(19, [
      { id: '19_1', name: 'Sostituzione di tritono', type: 'tritone_sub', description: 'Il V è sostituito dal bII7?' },
      { id: '19_2', name: 'Accordo di passaggio', type: 'chromatic_passing', description: 'C\'è un accordo di passaggio cromatico tra I e ii?' },
      { id: '19_3', name: 'Dominante secondaria', type: 'secondary_dominant', description: 'Identifica la dominante secondaria (V/V, V/ii, ecc.).', targetPool: [2, 5, 6] },
      { id: '19_4', name: 'Centro tonale moment.', type: 'ii_v_i_secondary', description: 'Identifica il centro tonale momentaneo.', degreePool: [1, 2, 3, 4, 5, 6] },
      { id: '19_5', name: 'Borrowed chord', type: 'borrowed_chord', description: 'Quale accordo è preso dalla scala parallela?' },
      { id: '19_6', name: 'Trova la sostituzione', type: 'substitution_spot', description: 'In quale posizione c\'è la sostituzione?' },
      { id: '19_7', name: 'Tritono + retention', type: 'tritone_sub', description: 'Tritono con silenzio 10s.', retention: 10 },
      { id: '19_8', name: 'Dom. sec. pool ampio', type: 'secondary_dominant', description: 'Dominante secondaria su qualsiasi grado.', targetPool: [2, 3, 4, 5, 6] },
      { id: '19_9', name: 'Sostit. in progressione', type: 'substitution_spot', description: 'Progressione più lunga con sostituzione.' },
      { id: '19_10', name: 'Borrowed speed round', type: 'borrowed_chord', description: 'Borrowed chord — identifica entro 5s.', timeLimit: 5 },
    ]),
  },

  20: {
    id: 20, worldId: 5,
    name: 'Riarmonia Avanzata',
    description: 'Progressioni lunghe — trascrivi tutto.',
    exerciseCount: 10,
    exercises: buildExercises(20, [
      { id: '20_1', name: 'Progressione 4 accordi', type: 'full_progression', description: 'Trascrivi 4 accordi diatonici.', length: 4 },
      { id: '20_2', name: 'Progressione 6 accordi', type: 'full_progression', description: 'Trascrivi 6 accordi.', length: 6 },
      { id: '20_3', name: 'Progressione 8 accordi', type: 'full_progression', description: 'Trascrivi 8 accordi.', length: 8 },
      { id: '20_4', name: 'Prog. 8 a 60BPM', type: 'full_progression', description: 'Trascrivi 8 accordi a 60 BPM.', length: 8, bpm: 60 },
      { id: '20_5', name: 'Prog. 10 accordi', type: 'full_progression', description: 'Trascrivi 10 accordi.', length: 10 },
      { id: '20_6', name: 'Prog. 12 accordi', type: 'full_progression', description: 'Trascrivi 12 accordi.', length: 12 },
      { id: '20_7', name: 'Retention 4 accordi 20s', type: 'full_progression', description: '4 accordi + silenzio 20s.', length: 4, retention: 20 },
      { id: '20_8', name: 'Prog. 14 accordi', type: 'full_progression', description: 'Trascrivi 14 accordi.', length: 14 },
      { id: '20_9', name: 'Prog. 16 accordi', type: 'full_progression', description: 'Trascrivi 16 accordi.', length: 16 },
      { id: '20_10', name: 'Prog. 16 a 80BPM', type: 'full_progression', description: 'Trascrivi 16 accordi a 80 BPM.', length: 16, bpm: 80 },
    ]),
  },
  // ─── MONDO VI — Ritmo e poliritmia ──────────────────────────

  21: {
    id: 21, worldId: 6,
    name: 'Ritmo di Base',
    description: 'Durate, pattern, sincopi e ghost notes.',
    exerciseCount: 12,
    exercises: buildExercises(21, [
      { id: '21_1', name: 'Quarter vs Half', type: 'rhythm_duration', description: 'Distingui semiminima da minima.', durationPool: ['semiminima', 'minima'], bpm: 80 },
      { id: '21_2', name: 'Conta le crome', type: 'rhythm_count', description: 'Quante crome senti?', maxCount: 6, bpm: 100 },
      { id: '21_3', name: 'Griglia da 16', type: 'rhythm_grid', description: 'Identifica le posizioni attive su 16 semicrome.', subdivisions: 16, measures: 1, complexity: 0.25, bpm: 80, beatsPerMeasure: 4 },
      { id: '21_4', name: 'Pattern 4/4 (crome)', type: 'rhythm_grid', description: 'Trascrivi il pattern con semiminime e crome.', subdivisions: 8, measures: 1, complexity: 0.4, bpm: 90, beatsPerMeasure: 4 },
      { id: '21_5', name: 'Pattern medio', type: 'rhythm_grid', description: 'Pattern di complessità crescente.', subdivisions: 8, measures: 1, complexity: 0.5, bpm: 95, beatsPerMeasure: 4 },
      { id: '21_6', name: 'Pattern denso', type: 'rhythm_grid', description: 'Pattern più fitto.', subdivisions: 8, measures: 1, complexity: 0.6, bpm: 100, beatsPerMeasure: 4 },
      { id: '21_7', name: 'Pattern 16th lento', type: 'rhythm_grid', description: 'Pattern con semicrome.', subdivisions: 16, measures: 1, complexity: 0.3, bpm: 85, beatsPerMeasure: 4 },
      { id: '21_8', name: 'Pattern 16th medio', type: 'rhythm_grid', description: 'Semicrome più fitte.', subdivisions: 16, measures: 1, complexity: 0.4, bpm: 90, beatsPerMeasure: 4 },
      { id: '21_9', name: 'Sincope', type: 'rhythm_syncopation', description: 'Identifica la posizione della sincope.', bpm: 100 },
      { id: '21_10', name: 'Pattern 2 misure', type: 'rhythm_grid', description: 'Trascrivi il pattern su 2 misure.', subdivisions: 8, measures: 2, complexity: 0.4, bpm: 95, beatsPerMeasure: 4 },
      { id: '21_11', name: 'Retention ritmico', type: 'rhythm_grid', description: 'Riproduci il pattern dopo 5s di silenzio.', subdivisions: 8, measures: 1, complexity: 0.45, bpm: 100, beatsPerMeasure: 4, retention: 5 },
      { id: '21_12', name: 'Ghost notes', type: 'rhythm_ghost_pattern', description: 'Identifica le posizioni con ghost notes.', bpm: 100, noteCount: 8 },
    ]),
  },

  22: {
    id: 22, worldId: 6,
    name: 'Misure Composte e Odd Time',
    description: 'Metri irregolari e raggruppamenti.',
    exerciseCount: 12,
    exercises: buildExercises(22, [
      { id: '22_1', name: '3/4 vs 4/4', type: 'meter_id', description: 'Distingui il metro.', meterPool: ['3/4', '4/4'], bpm: 100 },
      { id: '22_2', name: '6/8 vs 3/4', type: 'meter_id', description: 'Metro composto o semplice?', meterPool: ['6/8', '3/4'], bpm: 100 },
      { id: '22_3', name: '5/4 raggruppamento', type: 'meter_grouping', description: '3+2 o 2+3?', groupingPool: ['3+2', '2+3'], bpm: 90 },
      { id: '22_4', name: '7/4 raggruppamento', type: 'meter_grouping', description: '4+3 o 3+4?', groupingPool: ['4+3', '3+4'], bpm: 85 },
      { id: '22_5', name: '7/8 raggruppamento', type: 'meter_grouping', description: 'Identifica il raggruppamento.', groupingPool: ['2+2+3', '3+2+2', '2+3+2'], bpm: 90 },
      { id: '22_6', name: 'Pool metri', type: 'meter_id', description: 'Identifica il metro tra 5 opzioni.', meterPool: ['4/4', '3/4', '5/4', '7/4', '7/8'], bpm: 95 },
      { id: '22_7', name: 'Pattern in 3/4', type: 'rhythm_grid', description: 'Trascrivi in 3/4.', subdivisions: 6, measures: 1, complexity: 0.5, bpm: 100, beatsPerMeasure: 3 },
      { id: '22_8', name: 'Pattern in 5/4', type: 'rhythm_grid', description: 'Trascrivi in 5/4.', subdivisions: 10, measures: 1, complexity: 0.4, bpm: 90, beatsPerMeasure: 5 },
      { id: '22_9', name: 'Pattern in 7/4', type: 'rhythm_grid', description: 'Trascrivi in 7/4.', subdivisions: 14, measures: 1, complexity: 0.3, bpm: 85, beatsPerMeasure: 7 },
      { id: '22_10', name: 'Pattern in 7/8', type: 'rhythm_grid', description: 'Trascrivi in 7/8.', subdivisions: 7, measures: 1, complexity: 0.45, bpm: 90, beatsPerMeasure: 7 },
      { id: '22_11', name: 'Retention odd time', type: 'rhythm_grid', description: 'Riproduci in 5/4 dopo 5s.', subdivisions: 10, measures: 1, complexity: 0.4, bpm: 85, beatsPerMeasure: 5, retention: 5 },
      { id: '22_12', name: 'Metro speed round', type: 'meter_id', description: 'Identifica il metro entro 5s.', meterPool: ['4/4', '3/4', '5/4', '7/4', '7/8'], bpm: 110, timeLimit: 5 },
    ]),
  },

  23: {
    id: 23, worldId: 6,
    name: 'Poliritmia',
    description: 'Due voci, un ciclo. Identifica e segui.',
    exerciseCount: 8,
    exercises: buildExercises(23, [
      { id: '23_1', name: '3 contro 2', type: 'polyrhythm_id', description: 'Quale voce fa 3 e quale fa 2?', polyPool: ['3:2', '2:3'], bpm: 80 },
      { id: '23_2', name: '4 contro 3', type: 'polyrhythm_id', description: 'Quale voce fa 4 e quale fa 3?', polyPool: ['4:3', '3:4'], bpm: 80 },
      { id: '23_3', name: 'Segui il basso (3v4)', type: 'polyrhythm_count', description: 'Segui solo il basso — quanti battiti?', voice1Beats: 3, voice2Beats: 4, followVoice: 'basso', bpm: 80 },
      { id: '23_4', name: '3:2 o 4:3?', type: 'polyrhythm_id', description: 'Identifica il rapporto.', polyPool: ['3:2', '2:3', '4:3', '3:4'], bpm: 85 },
      { id: '23_5', name: 'Segui l\'acuto (4v3)', type: 'polyrhythm_count', description: 'Segui solo la voce acuta.', voice1Beats: 4, voice2Beats: 3, followVoice: 'acuto', bpm: 80 },
      { id: '23_6', name: '5 contro 4', type: 'polyrhythm_id', description: 'Identifica il rapporto 5:4.', polyPool: ['5:4', '4:5'], bpm: 75 },
      { id: '23_7', name: 'Pool poliritmie', type: 'polyrhythm_id', description: 'Identifica tra 3:2, 4:3 e 5:4.', polyPool: ['3:2', '4:3', '5:4'], bpm: 80 },
      { id: '23_8', name: 'Pool completo', type: 'polyrhythm_id', description: 'Identifica tra tutte le poliritmie.', polyPool: ['3:2', '2:3', '4:3', '3:4', '5:4', '4:5'], bpm: 85 },
    ]),
  },

  // ─── MONDO VII — TRASCRIZIONE INTEGRATA ────────────────────

  24: {
    id: 24, worldId: 7,
    name: 'Trascrizione Melodica Completa',
    description: 'Melodia + ritmo insieme. Trascrivi tutto.',
    exerciseCount: 12,
    exercises: buildExercises(24, [
      { id: '24_1', name: 'Frase 4 note con ritmo', type: 'melodic_phrase', description: 'Trascrivi i gradi di una frase di 4 note con ritmo.', pool: [1,2,3,4,5,6,7], length: 4, bpm: 60 },
      { id: '24_2', name: 'Frase 6 note', type: 'melodic_phrase', description: 'Frase di 6 note — trascrivi i gradi.', pool: [1,2,3,4,5,6,7], length: 6, bpm: 60 },
      { id: '24_3', name: 'Frase 8 note', type: 'melodic_phrase', description: 'Frase di 8 note — trascrivi tutto.', pool: [1,2,3,4,5,6,7], length: 8, bpm: 60 },
      { id: '24_4', name: 'Frase su progressione', type: 'melody_over_changes', description: 'Frase di 8 note su progressione armonica — il drone cambia.', length: 8, bpm: 80 },
      { id: '24_5', name: 'Velocità 60 BPM', type: 'melodic_phrase', description: 'Frase 6 note a 60 BPM.', pool: [1,2,3,4,5,6,7], length: 6, bpm: 60 },
      { id: '24_6', name: 'Velocità 80 BPM', type: 'melodic_phrase', description: 'Frase 6 note a 80 BPM.', pool: [1,2,3,4,5,6,7], length: 6, bpm: 80 },
      { id: '24_7', name: 'Velocità 100 BPM', type: 'melodic_phrase', description: 'Frase 6 note a 100 BPM.', pool: [1,2,3,4,5,6,7], length: 6, bpm: 100 },
      { id: '24_8', name: 'Velocità 120 BPM', type: 'melodic_phrase', description: 'Frase 6 note a 120 BPM.', pool: [1,2,3,4,5,6,7], length: 6, bpm: 120 },
      { id: '24_9', name: 'Lick di basso complesso', type: 'melodic_phrase', description: 'Lick di basso di 8 note — trascrivi tutto.', pool: [1,2,3,4,5,6,7], length: 8, bpm: 80 },
      { id: '24_10', name: 'Retention totale', type: 'melodic_phrase', description: 'Senti 8 note, silenzio 20s, trascrivi.', pool: [1,2,3,4,5,6,7], length: 8, bpm: 60, retention: 20 },
      { id: '24_11', name: 'Nucleo melodico', type: 'transcription_core', description: 'Frase con ornamenti — trascrivi solo il nucleo melodico.', pool: [1,2,3,4,5,6,7], length: 6, bpm: 80 },
      { id: '24_12', name: 'Domanda-risposta o variazione?', type: 'phrase_relation', description: 'Due frasi: sono domanda-risposta o variazioni?' },
    ]),
  },

  25: {
    id: 25, worldId: 7,
    name: 'Trascrizione Armonica Completa',
    description: 'Progressioni di accordi a tempo reale.',
    exerciseCount: 12,
    exercises: buildExercises(25, [
      { id: '25_1', name: 'Progressione 4 accordi', type: 'full_progression', description: 'Trascrivi i gradi di 4 accordi.', length: 4 },
      { id: '25_2', name: 'Progressione 4 con BPM', type: 'full_progression', description: 'Progressione 4 accordi a 80 BPM.', length: 4, bpm: 80 },
      { id: '25_3', name: 'Progressione 6 accordi', type: 'full_progression', description: 'Trascrivi 6 accordi.', length: 6 },
      { id: '25_4', name: 'Progressione 6 con BPM', type: 'full_progression', description: 'Progressione 6 accordi a 90 BPM.', length: 6, bpm: 90 },
      { id: '25_5', name: 'Progressione 8 accordi', type: 'full_progression', description: 'Trascrivi 8 accordi.', length: 8 },
      { id: '25_6', name: 'Progressione 8 con BPM', type: 'full_progression', description: 'Progressione 8 accordi a 90 BPM.', length: 8, bpm: 90 },
      { id: '25_7', name: 'Progressione 10 accordi', type: 'full_progression', description: 'Trascrivi 10 accordi.', length: 10 },
      { id: '25_8', name: 'Progressione 10 con BPM', type: 'full_progression', description: 'Progressione 10 accordi a 100 BPM.', length: 10, bpm: 100 },
      { id: '25_9', name: 'Progressione 12 accordi', type: 'full_progression', description: 'Trascrivi 12 accordi.', length: 12 },
      { id: '25_10', name: 'Progressione 14 accordi', type: 'full_progression', description: 'Trascrivi 14 accordi.', length: 14, bpm: 100 },
      { id: '25_11', name: 'Progressione 16 accordi', type: 'full_progression', description: 'Trascrivi 16 accordi.', length: 16, bpm: 100 },
      { id: '25_12', name: 'Retention armonica', type: 'full_progression', description: 'Progressione 8 accordi, silenzio 15s, trascrivi.', length: 8, bpm: 80, retention: 15 },
    ]),
  },

  26: {
    id: 26, worldId: 7,
    name: 'Improvvisazione Guidata',
    description: 'Improvvisa sulle progressioni. Autovalutazione.',
    exerciseCount: 12,
    exercises: buildExercises(26, [
      { id: '26_1', name: 'Suona il grado 1', type: 'improv_guided', description: 'Progressione I-IV-V-I — suona il grado 1 su ogni accordo.', progression: [1, 4, 5, 1], bpm: 80, instruction: 'Suona/canta il grado 1 su ogni accordo' },
      { id: '26_2', name: 'Gradi stabili', type: 'improv_guided', description: 'Suona i gradi stabili (1, 3, 5) dell\'accordo corrente.', progression: [1, 4, 5, 1], bpm: 80, instruction: 'Suona i gradi stabili (1, 3, 5) su ogni accordo' },
      { id: '26_3', name: 'Frase risposta', type: 'call_response', description: 'L\'app suona 4 note — inventa una risposta. Autovalutazione.', pool: [1,2,3,4,5,6,7], length: 4, bpm: 80 },
      { id: '26_4', name: 'Improv su I-vi-IV-V', type: 'improv_guided', description: 'Improvvisa su I-vi-IV-V.', progression: [1, 6, 4, 5], bpm: 80, instruction: 'Improvvisa liberamente sulla progressione' },
      { id: '26_5', name: 'Improv su I-IV-vi-V', type: 'improv_guided', description: 'Improvvisa su I-IV-vi-V.', progression: [1, 4, 6, 5], bpm: 85, instruction: 'Improvvisa liberamente sulla progressione' },
      { id: '26_6', name: 'Improv su I-V-vi-IV', type: 'improv_guided', description: 'Improvvisa su I-V-vi-IV.', progression: [1, 5, 6, 4], bpm: 85, instruction: 'Improvvisa liberamente sulla progressione' },
      { id: '26_7', name: 'Improv 6 accordi', type: 'improv_guided', description: 'Progressione di 6 accordi.', progression: [1, 6, 2, 5, 1, 4], bpm: 90, instruction: 'Improvvisa sulla progressione estesa' },
      { id: '26_8', name: 'Improv 8 accordi', type: 'improv_guided', description: 'Progressione di 8 accordi.', progression: [1, 4, 6, 5, 1, 2, 5, 1], bpm: 90, instruction: 'Improvvisa sulla progressione lunga' },
      { id: '26_9', name: 'Improv su ii-V-I', type: 'improv_guided', description: 'Improvvisa su ii-V-I — 2 misure.', progression: [2, 5, 1], bpm: 80, instruction: 'Improvvisa sul ii-V-I' },
      { id: '26_10', name: 'Improv libera 8 misure', type: 'improv_guided', description: 'Improvvisazione libera su 8 misure.', progression: [1, 4, 5, 1, 6, 2, 5, 1], bpm: 85, instruction: 'Improvvisazione libera — esprimi te stesso!' },
      { id: '26_11', name: 'Registra e confronta', type: 'improv_record', description: 'Registra la tua improvvisazione e confronta.', progression: [1, 4, 5, 1], bpm: 80 },
      { id: '26_12', name: 'Call and response', type: 'call_response', description: 'L\'app suona un lick — imitalo immediatamente.', pool: [1,2,3,5,6], length: 6, bpm: 80 },
    ]),
  },

  27: {
    id: 27, worldId: 7,
    name: 'Intonazione',
    description: 'Canta i gradi — usa un intonatore esterno.',
    exerciseCount: 12,
    exercises: buildExercises(27, [
      { id: '27_1', name: 'Canta il grado 3', type: 'intonation_sing', description: 'L\'app suona il grado 1 — canta il grado 3.', targetDegree: 3 },
      { id: '27_2', name: 'Canta il grado 5', type: 'intonation_sing', description: 'L\'app suona il grado 1 — canta il grado 5.', targetDegree: 5 },
      { id: '27_3', name: 'Canta il grado 2', type: 'intonation_sing', description: 'Canta il grado 2 su drone.', targetDegree: 2 },
      { id: '27_4', name: 'Canta il grado 4', type: 'intonation_sing', description: 'Canta il grado 4 su drone.', targetDegree: 4 },
      { id: '27_5', name: 'Canta il grado 6', type: 'intonation_sing', description: 'Canta il grado 6 su drone.', targetDegree: 6 },
      { id: '27_6', name: 'Canta il grado 7', type: 'intonation_sing', description: 'Canta il grado 7 su drone.', targetDegree: 7 },
      { id: '27_7', name: 'Grado casuale (1-5)', type: 'intonation_sing', description: 'Canta il grado richiesto — pool 1-5.', pool: [1,2,3,4,5] },
      { id: '27_8', name: 'Grado casuale (1-7)', type: 'intonation_sing', description: 'Canta il grado richiesto — pool completo.', pool: [1,2,3,4,5,6,7] },
      { id: '27_9', name: 'Grado minore', type: 'intonation_sing', description: 'Canta il grado richiesto su scala minore.', pool: [1,2,3,4,5,6,7], scaleType: 'minor' },
      { id: '27_10', name: 'Grado modale', type: 'intonation_sing', description: 'Canta il grado su modo dorico.', pool: [1,2,3,4,5,6,7], scaleType: 'dorian' },
      { id: '27_11', name: 'Canta la scala completa', type: 'intonation_scale', description: 'Canta tutta la scala maggiore in intonazione.' },
      { id: '27_12', name: 'Canta ii-V-I arpeggiato', type: 'intonation_arpeggio', description: 'Canta gli arpeggi di un ii-V-I.', progression: [2, 5, 1] },
    ]),
  },
};

function buildExercises(chapterId, exerciseList) {
  const result = {};
  exerciseList.forEach((ex, i) => {
    result[ex.id] = {
      ...ex,
      chapterId,
      index: i,
      name: ex.name || `Esercizio ${chapterId}.${i + 1}`,
      description: ex.description || '',
    };
  });
  return result;
}

export function getChapter(chapterId) {
  return CHAPTERS[chapterId] || null;
}

export function getExercise(exerciseId) {
  for (const ch of Object.values(CHAPTERS)) {
    if (ch.exercises[exerciseId]) return ch.exercises[exerciseId];
  }
  return null;
}

export function getWorldForChapter(chapterId) {
  return WORLDS.find(w => w.chapters.includes(Number(chapterId)));
}

export function getAllChapterIds() {
  return WORLDS.flatMap(w => w.chapters);
}

export function getNextChapterId(chapterId) {
  const all = getAllChapterIds();
  const idx = all.indexOf(Number(chapterId));
  if (idx >= 0 && idx < all.length - 1) return all[idx + 1];
  return null;
}
