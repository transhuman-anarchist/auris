const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
const HARMONIC_MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 11];
const MELODIC_MINOR_INTERVALS = [0, 2, 3, 5, 7, 9, 11];

const MODE_INTERVALS = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
};

const SCALE_MAP = {
  major: MAJOR_SCALE_INTERVALS,
  minor: MINOR_SCALE_INTERVALS,
  harmonic_minor: HARMONIC_MINOR_INTERVALS,
  melodic_minor: MELODIC_MINOR_INTERVALS,
  ...MODE_INTERVALS,
};

const CHROMATIC_TENSION_SEMITONES = {
  'b2': 1,
  'b3': 3,
  '#4': 6,
  '#5': 8,
  'b7': 10,
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getScaleIntervals(scaleType) {
  return SCALE_MAP[scaleType] || MAJOR_SCALE_INTERVALS;
}

function degreeToSemitones(degree, scaleType = 'major') {
  const intervals = getScaleIntervals(scaleType);
  return intervals[degree - 1] || 0;
}

function degreeToMidi(degree, rootMidi, scaleType = 'major', octaveShift = 0) {
  return rootMidi + degreeToSemitones(degree, scaleType) + octaveShift * 12;
}

export function generateScaleDegreeQuestion({ pool, rootMidi = 60, scaleType = 'major', multiOctave = false }) {
  const degree = pickRandom(pool);
  let octaveShift = 0;
  if (multiOctave) {
    octaveShift = pickRandom([-1, 0, 1]);
  }
  const midi = degreeToMidi(degree, rootMidi, scaleType, octaveShift);
  return {
    type: 'degree_single',
    noteMidi: midi,
    correctDegree: degree,
    rootMidi,
    scaleType,
    octaveShift,
  };
}

export function generateSequenceQuestion({ pool, length, rootMidi = 60, scaleType = 'major' }) {
  const degrees = [];
  for (let i = 0; i < length; i++) {
    degrees.push(pickRandom(pool));
  }
  const midiNotes = degrees.map(d => degreeToMidi(d, rootMidi, scaleType));
  return {
    type: 'degree_sequence',
    midiNotes,
    correctDegrees: degrees,
    rootMidi,
    scaleType,
    length,
  };
}

export function generateBinaryQuestion({ rootMidi = 60, scaleType = 'major' }) {
  const pool = [2, 3, 4, 5, 6, 7];
  const degree = pickRandom(pool);
  // Randomly place the note above or below the tonica
  const isAbove = Math.random() > 0.5;
  const octaveShift = isAbove ? 0 : -1;
  const midi = degreeToMidi(degree, rootMidi, scaleType, octaveShift);
  return {
    type: 'binary',
    noteMidi: midi,
    correctDegree: degree,
    correctAnswer: isAbove ? 'sopra' : 'sotto',
    rootMidi,
    scaleType,
  };
}

export function generateMissingDegreeQuestion({ rootMidi = 60, scaleType = 'major' }) {
  const allDegrees = [1, 2, 3, 4, 5, 6, 7];
  const missing = pickRandom(allDegrees);
  const played = allDegrees.filter(d => d !== missing);
  const midiNotes = played.map(d => degreeToMidi(d, rootMidi, scaleType));
  return {
    type: 'missing_degree',
    midiNotes,
    correctDegree: missing,
    rootMidi,
    scaleType,
  };
}

export function generateMissingFromSetQuestion({ pool, rootMidi = 60, scaleType = 'major' }) {
  const missing = pickRandom(pool);
  const played = pool.filter(d => d !== missing);
  const midiNotes = played.map(d => degreeToMidi(d, rootMidi, scaleType));
  return {
    type: 'missing_from_set',
    midiNotes,
    correctDegree: missing,
    playedDegrees: played,
    rootMidi,
    scaleType,
    pool,
  };
}

export function generateListenOnlyScale({ rootMidi = 60, scaleType = 'major', ascending = true }) {
  const intervals = getScaleIntervals(scaleType);
  let midiNotes = intervals.map(i => rootMidi + i);
  midiNotes.push(rootMidi + 12);
  if (!ascending) midiNotes = midiNotes.reverse();
  return {
    type: 'listen_only',
    midiNotes,
    rootMidi,
    scaleType,
  };
}

export function generateMinorCompareQuestion({ degree, rootMidi = 60 }) {
  const isMajor = Math.random() > 0.5;
  const scaleType = isMajor ? 'major' : 'minor';
  const midi = degreeToMidi(degree, rootMidi, scaleType);
  const majorMidi = degreeToMidi(degree, rootMidi, 'major');
  const minorMidi = degreeToMidi(degree, rootMidi, 'minor');
  return {
    type: 'minor_compare',
    noteMidi: midi,
    degree,
    correctAnswer: isMajor ? 'major' : 'minor',
    majorLabel: `${degree}`,
    minorLabel: `b${degree}`,
    majorMidi,
    minorMidi,
    rootMidi,
  };
}

// ─── MONDO II generators ──────────────────────────────────────

const PENTATONIC_MAJOR_INTERVALS = [0, 2, 4, 7, 9];
const PENTATONIC_MINOR_INTERVALS = [0, 3, 5, 7, 10];

function generateRhythmPattern(length) {
  const patterns = [1, 0.5];
  return Array.from({ length }, () => pickRandom(patterns));
}

export function generateMelodicPhraseQuestion({ pool, length, rootMidi = 60, scaleType = 'major', bpm = null, allowRepeats = false }) {
  const degrees = [];
  for (let i = 0; i < length; i++) {
    let d = pickRandom(pool);
    if (!allowRepeats && i > 0 && degrees[i - 1] === d) {
      const others = pool.filter(x => x !== d);
      if (others.length > 0) d = pickRandom(others);
    }
    degrees.push(d);
  }
  const midiNotes = degrees.map(d => degreeToMidi(d, rootMidi, scaleType));
  const rhythm = bpm ? generateRhythmPattern(length) : null;
  return {
    type: 'melodic_phrase',
    midiNotes,
    correctDegrees: degrees,
    rootMidi,
    scaleType,
    length,
    bpm,
    rhythm,
  };
}

export function generatePhraseDirectionQuestion({ pool, length = 4, rootMidi = 60, scaleType = 'major' }) {
  const sorted = [...pool].sort((a, b) => a - b);
  const isAscending = Math.random() > 0.5;
  let degrees = [];

  // If the pool is too small for a strictly monotonic sequence of the requested
  // length, allow spanning multiple octaves by extending the pool.
  if (sorted.length < length) {
    const extended = [];
    for (let oct = 0; oct <= 1; oct++) {
      sorted.forEach(d => extended.push(d + oct * 7));
    }
    // Pick a contiguous ascending slice from the extended pool
    const maxStart = Math.max(0, extended.length - length);
    const cursor = Math.floor(Math.random() * (maxStart + 1));
    for (let i = 0; i < length; i++) {
      degrees.push(extended[cursor + i]);
    }
  } else {
    const maxStart = sorted.length - length;
    const cursor = Math.floor(Math.random() * (maxStart + 1));
    for (let i = 0; i < length; i++) {
      degrees.push(sorted[cursor + i]);
    }
  }

  if (!isAscending) degrees = degrees.reverse();

  const midiNotes = degrees.map(d => {
    // Degrees > 7 mean upper octave (from pool extension)
    const octShift = Math.floor((d - 1) / 7);
    const realDegree = ((d - 1) % 7) + 1;
    return degreeToMidi(realDegree, rootMidi, scaleType, octShift);
  });

  return {
    type: 'phrase_direction',
    midiNotes,
    correctDegrees: degrees.map(d => ((d - 1) % 7) + 1),
    correctAnswer: isAscending ? 'ascendente' : 'discendente',
    rootMidi,
    scaleType,
    length,
  };
}

export function generatePhraseLastDegreeQuestion({ pool, length = 4, rootMidi = 60, scaleType = 'major' }) {
  const degrees = [];
  for (let i = 0; i < length; i++) degrees.push(pickRandom(pool));
  const midiNotes = degrees.map(d => degreeToMidi(d, rootMidi, scaleType));
  return {
    type: 'phrase_last_degree',
    midiNotes,
    correctDegrees: degrees,
    correctDegree: degrees[degrees.length - 1],
    rootMidi,
    scaleType,
    length,
  };
}

export function generatePhraseFirstDegreeQuestion({ pool, length = 4, rootMidi = 60, scaleType = 'major', bpm = null }) {
  const degrees = [];
  for (let i = 0; i < length; i++) degrees.push(pickRandom(pool));
  const midiNotes = degrees.map(d => degreeToMidi(d, rootMidi, scaleType));
  const rhythm = bpm ? generateRhythmPattern(length) : null;
  return {
    type: 'phrase_first_degree',
    midiNotes,
    correctDegrees: degrees,
    correctDegree: degrees[0],
    rootMidi,
    scaleType,
    length,
    bpm,
    rhythm,
  };
}

export function generatePhraseCompareQuestion({ pool, length = 3, rootMidi = 60, scaleType = 'major' }) {
  const degrees1 = [];
  for (let i = 0; i < length; i++) degrees1.push(pickRandom(pool));
  const isSame = Math.random() > 0.5;
  let degrees2;
  if (isSame) {
    degrees2 = [...degrees1];
  } else {
    degrees2 = [...degrees1];
    const changeIdx = Math.floor(Math.random() * length);
    const others = pool.filter(d => d !== degrees2[changeIdx]);
    if (others.length > 0) degrees2[changeIdx] = pickRandom(others);
    else degrees2[changeIdx] = pickRandom(pool);
  }
  return {
    type: 'phrase_compare',
    midiNotes1: degrees1.map(d => degreeToMidi(d, rootMidi, scaleType)),
    midiNotes2: degrees2.map(d => degreeToMidi(d, rootMidi, scaleType)),
    degrees1,
    degrees2,
    correctAnswer: isSame ? 'uguale' : 'diversa',
    rootMidi,
    scaleType,
    length,
  };
}

export function generatePhraseDiffQuestion({ pool, length = 4, rootMidi = 60, scaleType = 'major' }) {
  const degrees1 = [];
  for (let i = 0; i < length; i++) degrees1.push(pickRandom(pool));
  const changeIdx = Math.floor(Math.random() * length);
  const degrees2 = [...degrees1];
  const others = pool.filter(d => d !== degrees2[changeIdx]);
  if (others.length > 0) degrees2[changeIdx] = pickRandom(others);
  else degrees2[changeIdx] = pickRandom(pool);
  return {
    type: 'phrase_diff',
    midiNotes1: degrees1.map(d => degreeToMidi(d, rootMidi, scaleType)),
    midiNotes2: degrees2.map(d => degreeToMidi(d, rootMidi, scaleType)),
    degrees1,
    degrees2,
    correctAnswer: changeIdx + 1,
    rootMidi,
    scaleType,
    length,
  };
}

export function generatePentatonicIdQuestion({ rootMidi = 60 }) {
  const isMajor = Math.random() > 0.5;
  const pool = isMajor ? [1, 2, 3, 5, 6] : [1, 3, 4, 5, 7];
  const scaleType = isMajor ? 'major' : 'minor';
  const degrees = [];
  for (let i = 0; i < 5; i++) degrees.push(pickRandom(pool));
  const midiNotes = degrees.map(d => degreeToMidi(d, rootMidi, scaleType));
  return {
    type: 'pentatonic_id',
    midiNotes,
    correctDegrees: degrees,
    correctAnswer: isMajor ? 'maggiore' : 'minore',
    rootMidi,
    scaleType,
  };
}

export function generateOrnamentBendQuestion({ pool, rootMidi = 60, scaleType = 'major', bendSemitones = 1, fast = false }) {
  const targetDegree = pickRandom(pool);
  const targetMidi = degreeToMidi(targetDegree, rootMidi, scaleType);
  const startMidi = targetMidi - bendSemitones;
  return {
    type: 'ornament_bend',
    startMidi,
    targetMidi,
    correctDegree: targetDegree,
    bendSemitones,
    fast,
    rootMidi,
    scaleType,
  };
}

export function generateOrnamentPairQuestion({ pool, rootMidi = 60, scaleType = 'major', ornamentType = 'hammer_on', fast = false }) {
  let d1 = pickRandom(pool);
  let d2 = pickRandom(pool.filter(d => d !== d1));
  if (d2 === undefined) d2 = pickRandom(pool);
  if (ornamentType === 'hammer_on' && d2 < d1) [d1, d2] = [d2, d1];
  if (ornamentType === 'pull_off' && d2 > d1) [d1, d2] = [d2, d1];
  const midi1 = degreeToMidi(d1, rootMidi, scaleType);
  const midi2 = degreeToMidi(d2, rootMidi, scaleType);
  return {
    type: 'ornament_pair',
    midiNotes: [midi1, midi2],
    correctDegrees: [d1, d2],
    ornamentType,
    fast,
    rootMidi,
    scaleType,
    length: 2,
  };
}

export function generateOrnamentVibratoQuestion({ pool, rootMidi = 60, scaleType = 'major' }) {
  const degree = pickRandom(pool);
  const midi = degreeToMidi(degree, rootMidi, scaleType);
  const isAbove = Math.random() > 0.5;
  return {
    type: 'ornament_vibrato',
    noteMidi: midi,
    correctDegree: degree,
    correctAnswer: isAbove ? 'sopra' : 'sotto',
    vibratoDirection: isAbove ? 1 : -1,
    rootMidi,
    scaleType,
  };
}

export function generateOrnamentGhostQuestion({ pool, length = 4, rootMidi = 60, scaleType = 'major' }) {
  const degrees = [];
  for (let i = 0; i < length; i++) degrees.push(pickRandom(pool));
  const ghostPosition = Math.floor(Math.random() * length) + 1;
  const midiNotes = degrees.map(d => degreeToMidi(d, rootMidi, scaleType));
  return {
    type: 'ornament_ghost',
    midiNotes,
    correctDegrees: degrees,
    correctAnswer: ghostPosition,
    ghostPosition,
    rootMidi,
    scaleType,
    length,
  };
}

export function generateOrnamentLickQuestion({ pool, length = 4, rootMidi = 60, scaleType = 'major', bpm = 60 }) {
  const degrees = [];
  for (let i = 0; i < length; i++) degrees.push(pickRandom(pool));
  const midiNotes = degrees.map(d => degreeToMidi(d, rootMidi, scaleType));
  const ornamentPositions = [];
  for (let i = 0; i < length; i++) {
    if (Math.random() > 0.6 && i < length - 1) {
      ornamentPositions.push(i);
    }
  }
  return {
    type: 'ornament_lick',
    midiNotes,
    correctDegrees: degrees,
    ornamentPositions,
    rootMidi,
    scaleType,
    length,
    bpm,
  };
}

// ─── MONDO III — Harmonic generators ──────────────────────────

const TRIAD_INTERVALS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
};

const DIATONIC_TRIAD_QUALITIES = {
  1: 'major', 2: 'minor', 3: 'minor', 4: 'major',
  5: 'major', 6: 'minor', 7: 'diminished',
};

const CADENCE_DEFINITIONS = {
  autentica: [5, 1],
  plagale: [4, 1],
  evitata: [5, 6],
  sospesa: [1, 5],
};

function buildChordByQuality(quality, baseMidi) {
  return TRIAD_INTERVALS[quality].map(i => baseMidi + i);
}

function buildDiatonicTriadMidi(degree, rootMidi = 60) {
  const root = MAJOR_SCALE_INTERVALS[degree - 1];
  const thirdIdx = ((degree - 1) + 2) % 7;
  const fifthIdx = ((degree - 1) + 4) % 7;
  let third = MAJOR_SCALE_INTERVALS[thirdIdx];
  let fifth = MAJOR_SCALE_INTERVALS[fifthIdx];
  if (third <= root) third += 12;
  if (fifth <= root) fifth += 12;
  return [rootMidi + root, rootMidi + third, rootMidi + fifth];
}

function applyInversion(midiNotes, inversion) {
  const notes = [...midiNotes];
  for (let i = 0; i < inversion; i++) {
    notes.push(notes.shift() + 12);
  }
  return notes;
}

function getTriadScaleDegrees(chordDegree) {
  const root = chordDegree;
  const third = ((chordDegree - 1 + 2) % 7) + 1;
  const fifth = ((chordDegree - 1 + 4) % 7) + 1;
  return [root, third, fifth];
}

export function generateChordQualityQuestion({ qualityPool, rootMidi = 60 }) {
  const quality = pickRandom(qualityPool);
  const baseMidi = rootMidi + pickRandom([-12, -7, -5, 0, 5, 7]);
  const chordMidi = buildChordByQuality(quality, baseMidi);
  return {
    type: 'chord_quality',
    chordMidi,
    correctAnswer: quality,
    qualityPool,
    rootMidi,
  };
}

export function generateChordInversionQuestion({ rootMidi = 60 }) {
  const degree = pickRandom([1, 4, 5]);
  const baseNotes = buildDiatonicTriadMidi(degree, rootMidi);
  const inversion = pickRandom([0, 1, 2]);
  const chordMidi = applyInversion(baseNotes, inversion);
  return {
    type: 'chord_inversion',
    chordMidi,
    correctAnswer: inversion,
    rootMidi,
  };
}

export function generateChordQualityInversionQuestion({ qualityPool, rootMidi = 60 }) {
  const quality = pickRandom(qualityPool);
  const baseMidi = rootMidi + pickRandom([0, -7, 5, 7]);
  const rootPosition = buildChordByQuality(quality, baseMidi);
  const inversion = pickRandom([0, 1, 2]);
  const chordMidi = applyInversion(rootPosition, inversion);
  return {
    type: 'chord_quality_inversion',
    chordMidi,
    correctQuality: quality,
    correctInversion: inversion,
    qualityPool,
    rootMidi,
    length: 2,
  };
}

export function generateChordSequenceQualityQuestion({ qualityPool, length = 2, rootMidi = 60 }) {
  const qualities = [];
  const chordsMidi = [];
  for (let i = 0; i < length; i++) {
    const q = pickRandom(qualityPool);
    qualities.push(q);
    const baseMidi = rootMidi + pickRandom([0, -7, 5, 7, -5]);
    chordsMidi.push(buildChordByQuality(q, baseMidi));
  }
  return {
    type: 'chord_sequence_quality',
    chordsMidi,
    correctAnswers: qualities,
    qualityPool,
    length,
    rootMidi,
  };
}

export function generateChordDegreeConfirmQuestion({ pool, rootMidi = 60 }) {
  const actualDegree = pickRandom(pool);
  const chordMidi = buildDiatonicTriadMidi(actualDegree, rootMidi);
  const isCorrect = Math.random() > 0.5;
  let askedDegree;
  if (isCorrect) {
    askedDegree = actualDegree;
  } else {
    const others = pool.filter(d => d !== actualDegree);
    askedDegree = others.length > 0 ? pickRandom(others) : actualDegree;
  }
  return {
    type: 'chord_degree_confirm',
    chordMidi,
    askedDegree,
    actualDegree,
    correctAnswer: askedDegree === actualDegree ? 'sì' : 'no',
    rootMidi,
  };
}

export function generateChordDegreeQuestion({ pool, rootMidi = 60 }) {
  const degree = pickRandom(pool);
  const chordMidi = buildDiatonicTriadMidi(degree, rootMidi);
  return {
    type: 'chord_degree',
    chordMidi,
    correctDegree: degree,
    pool,
    rootMidi,
  };
}

export function generateChordProgressionQuestion({ pool, length, rootMidi = 60, bpm = null }) {
  const degrees = [];
  for (let i = 0; i < length; i++) {
    degrees.push(pickRandom(pool));
  }
  const chordsMidi = degrees.map(d => buildDiatonicTriadMidi(d, rootMidi));
  return {
    type: 'chord_progression',
    chordsMidi,
    correctDegrees: degrees,
    pool,
    length,
    rootMidi,
    bpm,
  };
}

export function generateProgressionResolutionQuestion({ pool, rootMidi = 60 }) {
  const resolves = Math.random() > 0.5;
  const length = pickRandom([3, 4]);
  const degrees = [];
  for (let i = 0; i < length - 1; i++) {
    degrees.push(pickRandom(pool));
  }
  degrees.push(resolves ? 1 : 5);
  const chordsMidi = degrees.map(d => buildDiatonicTriadMidi(d, rootMidi));
  return {
    type: 'progression_resolution',
    chordsMidi,
    correctDegrees: degrees,
    correctAnswer: resolves ? 'risolve' : 'sospesa',
    rootMidi,
    length,
  };
}

export function generateProgressionBassQuestion({ pool, length, rootMidi = 60 }) {
  const degrees = [];
  for (let i = 0; i < length; i++) {
    degrees.push(pickRandom(pool));
  }
  const chordsMidi = degrees.map(d => buildDiatonicTriadMidi(d, rootMidi));
  return {
    type: 'progression_bass',
    chordsMidi,
    correctDegrees: degrees,
    correctBass: [...degrees],
    pool,
    length,
    rootMidi,
  };
}

export function generateProgressionSopranoQuestion({ pool, length, rootMidi = 60 }) {
  const degrees = [];
  for (let i = 0; i < length; i++) {
    degrees.push(pickRandom(pool));
  }
  const chordsMidi = degrees.map(d => buildDiatonicTriadMidi(d, rootMidi));
  const sopranoDegrees = degrees.map(d => {
    const [, , fifth] = getTriadScaleDegrees(d);
    return fifth;
  });
  return {
    type: 'progression_soprano',
    chordsMidi,
    correctDegrees: degrees,
    correctSoprano: sopranoDegrees,
    pool,
    length,
    rootMidi,
  };
}

export function generateCadenceTypeQuestion({ cadencePool, rootMidi = 60, bpm = null }) {
  const cadence = pickRandom(cadencePool);
  const cadenceDegrees = CADENCE_DEFINITIONS[cadence];
  const chordsMidi = cadenceDegrees.map(d => buildDiatonicTriadMidi(d, rootMidi));
  return {
    type: 'cadence_type',
    chordsMidi,
    cadenceDegrees,
    correctAnswer: cadence,
    cadencePool,
    rootMidi,
    bpm,
  };
}

export function generateCadenceInProgressionQuestion({ cadencePool, rootMidi = 60 }) {
  const cadence = pickRandom(cadencePool);
  const cadenceDegrees = CADENCE_DEFINITIONS[cadence];
  const prefixPool = [1, 2, 4, 5, 6];
  const prefix = [pickRandom(prefixPool), pickRandom(prefixPool)];
  const degrees = [...prefix, ...cadenceDegrees];
  const chordsMidi = degrees.map(d => buildDiatonicTriadMidi(d, rootMidi));
  return {
    type: 'cadence_in_progression',
    chordsMidi,
    correctDegrees: degrees,
    correctAnswer: cadence,
    cadencePool,
    rootMidi,
    length: degrees.length,
  };
}

// ─── MONDO V — Armonia avanzata ──────────────────────────────

const SEVENTH_CHORD_INTERVALS = {
  maj7: [0, 4, 7, 11],
  dom7: [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  m7b5: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],
};

const DIATONIC_SEVENTH_QUALITIES = {
  1: 'maj7', 2: 'm7', 3: 'm7', 4: 'maj7',
  5: 'dom7', 6: 'm7', 7: 'm7b5',
};

function buildSeventhByQuality(quality, baseMidi) {
  return SEVENTH_CHORD_INTERVALS[quality].map(i => baseMidi + i);
}

function buildDiatonicSeventhMidi(degree, rootMidi = 60) {
  const root = MAJOR_SCALE_INTERVALS[degree - 1];
  const thirdIdx = ((degree - 1) + 2) % 7;
  const fifthIdx = ((degree - 1) + 4) % 7;
  const seventhIdx = ((degree - 1) + 6) % 7;
  let third = MAJOR_SCALE_INTERVALS[thirdIdx];
  let fifth = MAJOR_SCALE_INTERVALS[fifthIdx];
  let seventh = MAJOR_SCALE_INTERVALS[seventhIdx];
  if (third <= root) third += 12;
  if (fifth <= root) fifth += 12;
  if (seventh <= root) seventh += 12;
  return [rootMidi + root, rootMidi + third, rootMidi + fifth, rootMidi + seventh];
}

function applyInversion4(midiNotes, inversion) {
  const notes = [...midiNotes];
  for (let i = 0; i < inversion; i++) {
    notes.push(notes.shift() + 12);
  }
  return notes;
}

export function generateSeventhQualityQuestion({ qualityPool, rootMidi = 60 }) {
  const quality = pickRandom(qualityPool);
  const baseMidi = rootMidi + pickRandom([-12, -7, -5, 0, 5, 7]);
  const chordMidi = buildSeventhByQuality(quality, baseMidi);
  return {
    type: 'seventh_quality',
    chordMidi,
    correctAnswer: quality,
    qualityPool,
    rootMidi,
  };
}

export function generateSeventhInversionQuestion({ rootMidi = 60 }) {
  const degree = pickRandom([1, 4, 5]);
  const baseNotes = buildDiatonicSeventhMidi(degree, rootMidi);
  const inversion = pickRandom([0, 1, 2, 3]);
  const chordMidi = applyInversion4(baseNotes, inversion);
  return {
    type: 'seventh_inversion',
    chordMidi,
    correctAnswer: inversion,
    rootMidi,
  };
}

export function generateSeventhQualityInversionQuestion({ qualityPool, rootMidi = 60 }) {
  const quality = pickRandom(qualityPool);
  const baseMidi = rootMidi + pickRandom([0, -7, 5, 7]);
  const rootPosition = buildSeventhByQuality(quality, baseMidi);
  const inversion = pickRandom([0, 1, 2, 3]);
  const chordMidi = applyInversion4(rootPosition, inversion);
  return {
    type: 'seventh_quality_inversion',
    chordMidi,
    correctQuality: quality,
    correctInversion: inversion,
    qualityPool,
    rootMidi,
    length: 2,
  };
}

export function generateSeventhSequenceQuestion({ qualityPool, length = 2, rootMidi = 60 }) {
  const qualities = [];
  const chordsMidi = [];
  for (let i = 0; i < length; i++) {
    const q = pickRandom(qualityPool);
    qualities.push(q);
    const baseMidi = rootMidi + pickRandom([0, -7, 5, 7, -5]);
    chordsMidi.push(buildSeventhByQuality(q, baseMidi));
  }
  return {
    type: 'seventh_sequence',
    chordsMidi,
    correctAnswers: qualities,
    qualityPool,
    length,
    rootMidi,
  };
}

export function generateSeventhDegreeQuestion({ pool, rootMidi = 60 }) {
  const degree = pickRandom(pool);
  const chordMidi = buildDiatonicSeventhMidi(degree, rootMidi);
  return {
    type: 'seventh_degree',
    chordMidi,
    correctDegree: degree,
    pool,
    rootMidi,
  };
}

export function generateSeventhVoiceIdQuestion({ rootMidi = 60 }) {
  const degree = pickRandom([1, 2, 4, 5, 6]);
  const chordMidi = buildDiatonicSeventhMidi(degree, rootMidi);
  const isThird = Math.random() > 0.5;
  const voiceMidi = isThird ? chordMidi[1] : chordMidi[3];
  return {
    type: 'seventh_voice_id',
    chordMidi,
    voiceMidi,
    correctAnswer: isThird ? 'terza' : 'settima',
    rootMidi,
  };
}

export function generateBassMovementQuestion({ rootMidi = 60 }) {
  const pool = [1, 2, 3, 4, 5, 6];
  const d1 = pickRandom(pool);
  const isStep = Math.random() > 0.5;
  let d2;
  if (isStep) {
    const neighbors = pool.filter(d => Math.abs(d - d1) === 1);
    d2 = neighbors.length > 0 ? pickRandom(neighbors) : (d1 < 6 ? d1 + 1 : d1 - 1);
  } else {
    const leaps = pool.filter(d => Math.abs(d - d1) >= 3);
    d2 = leaps.length > 0 ? pickRandom(leaps) : pickRandom(pool.filter(d => d !== d1));
  }
  const chord1 = buildDiatonicSeventhMidi(d1, rootMidi);
  const chord2 = buildDiatonicSeventhMidi(d2, rootMidi);
  return {
    type: 'bass_movement',
    chordsMidi: [chord1, chord2],
    correctAnswer: isStep ? 'grado' : 'salto',
    rootMidi,
  };
}

// ─── ii-V-I generators ──────────────────────────────────────

function buildIIVI_Major(rootMidi) {
  const ii = buildSeventhByQuality('m7', rootMidi + 2);
  const V = buildSeventhByQuality('dom7', rootMidi + 7);
  const I = buildSeventhByQuality('maj7', rootMidi);
  return [ii, V, I];
}

function buildIIVI_Minor(rootMidi) {
  const ii = buildSeventhByQuality('m7b5', rootMidi + 2);
  const V = buildSeventhByQuality('dom7', rootMidi + 7);
  const i = buildSeventhByQuality('m7', rootMidi);
  return [ii, V, i];
}

function buildIIV(rootMidi, minor = false) {
  const ii = buildSeventhByQuality(minor ? 'm7b5' : 'm7', rootMidi + 2);
  const V = buildSeventhByQuality('dom7', rootMidi + 7);
  return [ii, V];
}

function buildIIVV_Major(rootMidi) {
  const I = buildSeventhByQuality('maj7', rootMidi);
  const IV = buildSeventhByQuality('maj7', rootMidi + 5);
  const V = buildSeventhByQuality('dom7', rootMidi + 7);
  return [I, IV, V];
}

export function generateIIVIConfirmQuestion({ rootMidi = 60, minor = false }) {
  const isIIVI = Math.random() > 0.5;
  let chordsMidi;
  if (isIIVI) {
    chordsMidi = minor ? buildIIVI_Minor(rootMidi) : buildIIVI_Major(rootMidi);
  } else {
    const pool = [1, 2, 4, 5, 6];
    const degrees = [pickRandom(pool), pickRandom(pool), pickRandom(pool)];
    chordsMidi = degrees.map(d => buildDiatonicSeventhMidi(d, rootMidi));
  }
  return {
    type: 'ii_v_i_confirm',
    chordsMidi,
    correctAnswer: isIIVI ? 'sì' : 'no',
    rootMidi,
    minor,
  };
}

export function generateIIVOpenQuestion({ rootMidi = 60 }) {
  const minor = Math.random() > 0.5;
  const chordsMidi = buildIIV(rootMidi, minor);
  return {
    type: 'ii_v_open',
    chordsMidi,
    correctAnswer: 'aperta',
    rootMidi,
  };
}

export function generateIIVI_vs_IIVV_Question({ rootMidi = 60 }) {
  const isIIVI = Math.random() > 0.5;
  const chordsMidi = isIIVI ? buildIIVI_Major(rootMidi) : buildIIVV_Major(rootMidi);
  return {
    type: 'ii_v_i_vs_I_IV_V',
    chordsMidi,
    correctAnswer: isIIVI ? 'ii-V-I' : 'I-IV-V',
    rootMidi,
  };
}

export function generateIIVISecondaryQuestion({ degreePool, rootMidi = 60 }) {
  const targetDegree = pickRandom(degreePool);
  const targetRoot = rootMidi + MAJOR_SCALE_INTERVALS[targetDegree - 1];
  const chordsMidi = buildIIVI_Major(targetRoot);
  return {
    type: 'ii_v_i_secondary',
    chordsMidi,
    correctDegree: targetDegree,
    degreePool,
    rootMidi,
  };
}

export function generateIIVIChainQuestion({ chainLength = 2, rootMidi = 60 }) {
  const centers = [];
  const allChords = [];
  let current = rootMidi;
  const moveSemitones = [-5, -7, 5, 7, 2, -2];
  for (let i = 0; i < chainLength; i++) {
    const iiVI = buildIIVI_Major(current);
    allChords.push(...iiVI);
    const degreeSemitones = current - rootMidi;
    centers.push(degreeSemitones);
    current = current + pickRandom(moveSemitones);
  }
  return {
    type: 'ii_v_i_chain',
    chordsMidi: allChords,
    correctAnswer: chainLength,
    centers,
    rootMidi,
    chainLength,
  };
}

export function generateIIVIResolutionQualityQuestion({ rootMidi = 60 }) {
  const isMajor = Math.random() > 0.5;
  const chordsMidi = isMajor ? buildIIVI_Major(rootMidi) : buildIIVI_Minor(rootMidi);
  return {
    type: 'ii_v_i_resolution',
    chordsMidi,
    correctAnswer: isMajor ? 'maggiore' : 'minore',
    rootMidi,
  };
}

// ─── Sostituzioni generators ────────────────────────────────

export function generateTritoneSubQuestion({ rootMidi = 60 }) {
  const hasSub = Math.random() > 0.5;
  let chordsMidi;
  if (hasSub) {
    const ii = buildSeventhByQuality('m7', rootMidi + 2);
    const bII7 = buildSeventhByQuality('dom7', rootMidi + 1);
    const I = buildSeventhByQuality('maj7', rootMidi);
    chordsMidi = [ii, bII7, I];
  } else {
    chordsMidi = buildIIVI_Major(rootMidi);
  }
  return {
    type: 'tritone_sub',
    chordsMidi,
    correctAnswer: hasSub ? 'sì' : 'no',
    rootMidi,
  };
}

export function generateChromaticPassingChordQuestion({ rootMidi = 60 }) {
  const hasPassing = Math.random() > 0.5;
  const I = buildDiatonicSeventhMidi(1, rootMidi);
  const ii = buildDiatonicSeventhMidi(2, rootMidi);
  let chordsMidi;
  if (hasPassing) {
    const passing = buildSeventhByQuality('dim7', rootMidi + 1);
    chordsMidi = [I, passing, ii];
  } else {
    chordsMidi = [I, ii];
  }
  return {
    type: 'chromatic_passing',
    chordsMidi,
    correctAnswer: hasPassing ? 'sì' : 'no',
    rootMidi,
  };
}

export function generateSecondaryDominantQuestion({ targetPool, rootMidi = 60 }) {
  const target = pickRandom(targetPool);
  const targetSemitones = MAJOR_SCALE_INTERVALS[target - 1];
  const secDom = buildSeventhByQuality('dom7', rootMidi + targetSemitones + 7 - 12);
  const resolution = buildDiatonicSeventhMidi(target, rootMidi);
  const prefix = buildDiatonicSeventhMidi(pickRandom([1, 4, 6]), rootMidi);
  return {
    type: 'secondary_dominant',
    chordsMidi: [prefix, secDom, resolution],
    correctAnswer: target,
    targetPool,
    rootMidi,
  };
}

export function generateBorrowedChordQuestion({ rootMidi = 60 }) {
  const borrowedDegrees = {
    bIII: { quality: 'major', semitones: 3 },
    bVI: { quality: 'major', semitones: 8 },
    bVII: { quality: 'major', semitones: 10 },
    iv: { quality: 'minor', semitones: 5 },
  };
  const borrowedNames = Object.keys(borrowedDegrees);
  const chosen = pickRandom(borrowedNames);
  const { quality, semitones } = borrowedDegrees[chosen];
  const chordMidi = buildChordByQuality(quality, rootMidi + semitones);
  const prefix = buildDiatonicSeventhMidi(1, rootMidi);
  const suffix = buildDiatonicSeventhMidi(pickRandom([4, 5]), rootMidi);
  return {
    type: 'borrowed_chord',
    chordsMidi: [prefix, chordMidi, suffix],
    correctAnswer: chosen,
    borrowedPool: borrowedNames,
    rootMidi,
  };
}

export function generateSubstitutionSpotQuestion({ rootMidi = 60 }) {
  const length = pickRandom([4, 5, 6]);
  const pool = [1, 2, 4, 5, 6];
  const degrees = [];
  for (let i = 0; i < length; i++) degrees.push(pickRandom(pool));
  const subPosition = Math.floor(Math.random() * length);
  const chordsMidi = degrees.map(d => buildDiatonicSeventhMidi(d, rootMidi));
  const subTypes = ['tritone', 'secondary_dom', 'chromatic_passing'];
  const subType = pickRandom(subTypes);
  const targetDegree = degrees[subPosition];
  const targetSemitones = MAJOR_SCALE_INTERVALS[targetDegree - 1];
  if (subType === 'tritone') {
    chordsMidi[subPosition] = buildSeventhByQuality('dom7', rootMidi + targetSemitones + 6);
  } else if (subType === 'secondary_dom') {
    chordsMidi[subPosition] = buildSeventhByQuality('dom7', rootMidi + targetSemitones + 7 - 12);
  } else {
    chordsMidi[subPosition] = buildSeventhByQuality('dim7', rootMidi + targetSemitones - 1);
  }
  return {
    type: 'substitution_spot',
    chordsMidi,
    correctAnswer: subPosition + 1,
    length,
    rootMidi,
  };
}

export function generateFullProgressionQuestion({ length = 8, rootMidi = 60, bpm = null }) {
  const pool = [1, 2, 3, 4, 5, 6, 7];
  const degrees = [];
  for (let i = 0; i < length; i++) degrees.push(pickRandom(pool));
  const chordsMidi = degrees.map(d => buildDiatonicSeventhMidi(d, rootMidi));
  return {
    type: 'full_progression',
    chordsMidi,
    correctDegrees: degrees,
    pool,
    length,
    rootMidi,
    bpm,
  };
}

// ─── MONDO IV — Cromatismo e modalità ────────────────────────

export function generateMinorScaleIdQuestion({ scalePool, rootMidi = 60 }) {
  const scaleType = pickRandom(scalePool);
  const intervals = getScaleIntervals(scaleType);
  let midiNotes = intervals.map(i => rootMidi + i);
  midiNotes.push(rootMidi + 12);
  const SCALE_IT = { minor: 'naturale', harmonic_minor: 'armonica', melodic_minor: 'melodica' };
  return {
    type: 'minor_scale_id',
    midiNotes,
    correctAnswer: SCALE_IT[scaleType],
    scalePool: scalePool.map(s => SCALE_IT[s]),
    rootMidi,
    scaleType,
  };
}

export function generateModeIdQuestion({ modePool, rootMidi = 60 }) {
  const mode = pickRandom(modePool);
  const intervals = getScaleIntervals(mode);
  let midiNotes = intervals.map(i => rootMidi + i);
  midiNotes.push(rootMidi + 12);
  return {
    type: 'mode_id',
    midiNotes,
    correctAnswer: mode,
    modePool,
    rootMidi,
  };
}

export function generateChromaticTensionQuestion({ tensionPool, rootMidi = 60 }) {
  const tension = pickRandom(tensionPool);
  const semitones = CHROMATIC_TENSION_SEMITONES[tension];
  const noteMidi = rootMidi + semitones;
  return {
    type: 'chromatic_tension',
    noteMidi,
    correctAnswer: tension,
    tensionPool,
    rootMidi,
  };
}

export function generateChromaticTensionSequenceQuestion({ tensionPool, length = 2, rootMidi = 60 }) {
  const tensions = [];
  for (let i = 0; i < length; i++) {
    tensions.push(pickRandom(tensionPool));
  }
  const midiNotes = tensions.map(t => rootMidi + CHROMATIC_TENSION_SEMITONES[t]);
  return {
    type: 'chromatic_tension_sequence',
    midiNotes,
    correctAnswers: tensions,
    tensionPool,
    length,
    rootMidi,
  };
}

export function generateModalLickQuestion({ pool, length, scaleType, rootMidi = 60, bpm = 60 }) {
  const degrees = [];
  for (let i = 0; i < length; i++) {
    let d = pickRandom(pool);
    if (i > 0 && degrees[i - 1] === d) {
      const others = pool.filter(x => x !== d);
      if (others.length > 0) d = pickRandom(others);
    }
    degrees.push(d);
  }
  const midiNotes = degrees.map(d => degreeToMidi(d, rootMidi, scaleType));
  const rhythm = generateRhythmPattern(length);
  return {
    type: 'modal_lick',
    midiNotes,
    correctDegrees: degrees,
    rootMidi,
    scaleType,
    length,
    bpm,
    rhythm,
  };
}

export function generateModalLickIdQuestion({ modePool, length = 5, rootMidi = 60, bpm = 60 }) {
  const mode = pickRandom(modePool);
  const intervals = getScaleIntervals(mode);
  const pool = [1, 2, 3, 4, 5, 6, 7];
  const degrees = [];
  for (let i = 0; i < length; i++) {
    let d = pickRandom(pool);
    if (i > 0 && degrees[i - 1] === d) {
      const others = pool.filter(x => x !== d);
      if (others.length > 0) d = pickRandom(others);
    }
    degrees.push(d);
  }
  const midiNotes = degrees.map(d => rootMidi + intervals[d - 1]);
  return {
    type: 'modal_lick_id',
    midiNotes,
    correctDegrees: degrees,
    correctAnswer: mode,
    modePool,
    rootMidi,
    scaleType: mode,
    length,
    bpm,
  };
}

// ─── MONDO VI generators ──────────────────────────────────────

const DURATION_BEATS = {
  croma: 0.5,
  semiminima: 1,
  'semiminima puntata': 1.5,
  minima: 2,
  semibreve: 4,
};

export function generateRhythmDurationQuestion({ durationPool, bpm = 100 }) {
  const dur = pickRandom(durationPool);
  return {
    type: 'rhythm_duration',
    correctAnswer: dur,
    durationBeats: DURATION_BEATS[dur],
    durationPool,
    midi: 60,
    bpm,
  };
}

export function generateRhythmCountQuestion({ maxCount = 6, bpm = 120 }) {
  const count = Math.floor(Math.random() * (maxCount - 1)) + 2;
  return {
    type: 'rhythm_count',
    correctAnswer: count,
    maxCount,
    midi: 60,
    bpm,
  };
}

export function generateRhythmGridQuestion({ subdivisions = 8, measures = 1, complexity = 0.4, bpm = 100, beatsPerMeasure = 4 }) {
  const totalSlots = subdivisions * measures;
  const subdivisionsPerBeat = subdivisions / beatsPerMeasure;
  const grid = new Array(totalSlots).fill(0);

  for (let m = 0; m < measures; m++) {
    grid[m * subdivisions] = 1;
  }

  for (let i = 0; i < totalSlots; i++) {
    if (grid[i] === 1) continue;
    const isOnBeat = i % subdivisionsPerBeat === 0;
    if (Math.random() < (isOnBeat ? complexity * 1.4 : complexity)) {
      grid[i] = 1;
    }
  }

  for (let m = 0; m < measures; m++) {
    const start = m * subdivisions;
    let hits = 0;
    for (let i = start; i < start + subdivisions; i++) if (grid[i]) hits++;
    while (hits < 3) {
      const pos = start + Math.floor(Math.random() * subdivisions);
      if (!grid[pos]) { grid[pos] = 1; hits++; }
    }
  }

  return {
    type: 'rhythm_grid',
    correctGrid: [...grid],
    grid,
    subdivisions,
    measures,
    beatsPerMeasure,
    subdivisionsPerBeat,
    bpm,
    midi: 60,
  };
}

export function generateRhythmSyncopationQuestion({ bpm = 100 }) {
  const grid = [1, 0, 0, 0, 1, 0, 0, 0];
  const offbeats = [1, 3, 5, 7];
  const syncopePos = pickRandom(offbeats);
  grid[syncopePos] = 1;
  const nextOnBeat = (syncopePos + 1) % 8;
  if (grid[nextOnBeat] === 1 && nextOnBeat !== 0) {
    grid[nextOnBeat] = 0;
  }

  return {
    type: 'rhythm_syncopation',
    correctAnswer: syncopePos + 1,
    grid,
    subdivisions: 8,
    beatsPerMeasure: 4,
    subdivisionsPerBeat: 2,
    bpm,
    midi: 60,
    length: 8,
  };
}

export function generateRhythmGhostPatternQuestion({ bpm = 100, noteCount = 8 }) {
  const grid = new Array(noteCount).fill(1);
  const candidates = [];
  for (let i = 1; i < noteCount; i++) if (i % 2 !== 0) candidates.push(i);
  const ghostPos = pickRandom(candidates.length ? candidates : [1]);
  grid[ghostPos] = 0.5;

  return {
    type: 'rhythm_ghost_pattern',
    correctAnswer: ghostPos + 1,
    grid,
    noteCount,
    bpm,
    midi: 60,
    length: noteCount,
  };
}

export function generateMeterIdQuestion({ meterPool, bpm = 100 }) {
  const meter = pickRandom(meterPool);
  const configs = {
    '4/4': { beats: 4, grouping: [4] },
    '3/4': { beats: 3, grouping: [3] },
    '6/8': { beats: 6, grouping: [3, 3] },
    '5/4': { beats: 5, grouping: pickRandom([[3, 2], [2, 3]]) },
    '7/4': { beats: 7, grouping: pickRandom([[4, 3], [3, 4]]) },
    '7/8': { beats: 7, grouping: pickRandom([[2, 2, 3], [3, 2, 2], [2, 3, 2]]) },
  };
  const cfg = configs[meter];

  return {
    type: 'meter_id',
    correctAnswer: meter,
    meterPool,
    beatsPerMeasure: cfg.beats,
    grouping: cfg.grouping,
    bpm,
    measures: 2,
  };
}

export function generateMeterGroupingQuestion({ groupingPool, bpm = 90 }) {
  const groupingStr = pickRandom(groupingPool);
  const grouping = groupingStr.split('+').map(Number);

  return {
    type: 'meter_grouping',
    correctAnswer: groupingStr,
    groupingPool,
    grouping,
    beatsPerMeasure: grouping.reduce((a, b) => a + b, 0),
    bpm,
    measures: 2,
  };
}

export function generatePolyrhythmIdQuestion({ polyPool, bpm = 80 }) {
  const poly = pickRandom(polyPool);
  const [a, b] = poly.split(':').map(Number);

  return {
    type: 'polyrhythm_id',
    correctAnswer: poly,
    polyPool,
    voice1Beats: a,
    voice2Beats: b,
    bpm,
    cycleDuration: (60 / bpm) * Math.max(a, b),
  };
}

export function generatePolyrhythmCountQuestion({ voice1Beats, voice2Beats, followVoice = 'basso', bpm = 80 }) {
  const cycleDuration = (60 / bpm) * Math.max(voice1Beats, voice2Beats);
  const correctAnswer = followVoice === 'basso' ? voice1Beats : voice2Beats;
  const maxOption = Math.max(voice1Beats, voice2Beats) + 1;

  return {
    type: 'polyrhythm_count',
    correctAnswer,
    voice1Beats,
    voice2Beats,
    followVoice,
    bpm,
    cycleDuration,
    maxOption,
  };
}

export function generateQuestionForExercise(exercise, rootMidi = 60) {
  const scaleType = exercise.scaleType || 'major';

  switch (exercise.type) {
    case 'listen_only':
      return generateListenOnlyScale({ rootMidi, scaleType });

    case 'binary':
      return generateBinaryQuestion({ rootMidi, scaleType });

    case 'degree_single':
      return generateScaleDegreeQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
        scaleType,
        multiOctave: exercise.multiOctave || false,
      });

    case 'degree_direction':
      return generateScaleDegreeQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
        scaleType,
      });

    case 'degree_sequence':
      return generateSequenceQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 2,
        rootMidi,
        scaleType,
      });

    case 'missing_degree':
      return generateMissingDegreeQuestion({ rootMidi, scaleType });

    case 'missing_from_set':
      return generateMissingFromSetQuestion({
        pool: exercise.pool || [1, 3, 5],
        rootMidi,
        scaleType,
      });

    case 'minor_compare':
      return generateMinorCompareQuestion({
        degree: exercise.degree || 3,
        rootMidi,
      });

    case 'sing_degree': {
      const q = generateScaleDegreeQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
        scaleType,
      });
      return { ...q, type: 'sing_degree' };
    }

    case 'major_minor_id': {
      const isMajor = Math.random() > 0.5;
      const scale = isMajor ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
      const midiNotes = scale.map(i => rootMidi + i);
      midiNotes.push(rootMidi + 12);
      return {
        type: 'major_minor_id',
        midiNotes,
        correctAnswer: isMajor ? 'maggiore' : 'minore',
        rootMidi,
      };
    }

    // ─── MONDO II types ──────────────────────────────────────

    case 'melodic_phrase':
      return generateMelodicPhraseQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 3,
        rootMidi,
        scaleType,
        bpm: exercise.bpm || null,
        allowRepeats: exercise.allowRepeats || false,
      });

    case 'phrase_direction':
      return generatePhraseDirectionQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 4,
        rootMidi,
        scaleType,
      });

    case 'phrase_last_degree':
      return generatePhraseLastDegreeQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 4,
        rootMidi,
        scaleType,
      });

    case 'phrase_first_degree':
      return generatePhraseFirstDegreeQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 4,
        rootMidi,
        scaleType,
        bpm: exercise.bpm || null,
      });

    case 'phrase_compare':
      return generatePhraseCompareQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 3,
        rootMidi,
        scaleType,
      });

    case 'phrase_diff':
      return generatePhraseDiffQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 4,
        rootMidi,
        scaleType,
      });

    case 'pentatonic_id':
      return generatePentatonicIdQuestion({ rootMidi });

    case 'ornament_bend':
      return generateOrnamentBendQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
        scaleType,
        bendSemitones: exercise.bendSemitones || 1,
        fast: exercise.fast || false,
      });

    case 'ornament_pair':
      return generateOrnamentPairQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
        scaleType,
        ornamentType: exercise.ornamentType || 'hammer_on',
        fast: exercise.fast || false,
      });

    case 'ornament_vibrato':
      return generateOrnamentVibratoQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
        scaleType,
      });

    case 'ornament_ghost':
      return generateOrnamentGhostQuestion({
        pool: exercise.pool || [1,2,3,5,6],
        length: exercise.length || 4,
        rootMidi,
        scaleType,
      });

    case 'ornament_lick':
      return generateOrnamentLickQuestion({
        pool: exercise.pool || [1,2,3,5,6],
        length: exercise.length || 4,
        rootMidi,
        scaleType,
        bpm: exercise.bpm || 60,
      });

    // ─── MONDO III types ──────────────────────────────────────

    case 'chord_quality':
      return generateChordQualityQuestion({
        qualityPool: exercise.qualityPool || ['major', 'minor'],
        rootMidi,
      });

    case 'chord_inversion':
      return generateChordInversionQuestion({ rootMidi });

    case 'chord_quality_inversion':
      return generateChordQualityInversionQuestion({
        qualityPool: exercise.qualityPool || ['major', 'minor', 'diminished', 'augmented'],
        rootMidi,
      });

    case 'chord_sequence_quality':
      return generateChordSequenceQualityQuestion({
        qualityPool: exercise.qualityPool || ['major', 'minor'],
        length: exercise.length || 2,
        rootMidi,
      });

    case 'chord_degree_confirm':
      return generateChordDegreeConfirmQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
      });

    case 'chord_degree':
      return generateChordDegreeQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
      });

    case 'chord_progression':
      return generateChordProgressionQuestion({
        pool: exercise.pool || [1,4,5],
        length: exercise.length || 3,
        rootMidi,
        bpm: exercise.bpm || null,
      });

    case 'progression_resolution':
      return generateProgressionResolutionQuestion({
        pool: exercise.pool || [1,4,5],
        rootMidi,
      });

    case 'progression_bass':
      return generateProgressionBassQuestion({
        pool: exercise.pool || [1,4,5],
        length: exercise.length || 3,
        rootMidi,
      });

    case 'progression_soprano':
      return generateProgressionSopranoQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 4,
        rootMidi,
      });

    case 'cadence_type':
      return generateCadenceTypeQuestion({
        cadencePool: exercise.cadencePool || ['autentica', 'plagale', 'evitata', 'sospesa'],
        rootMidi,
        bpm: exercise.bpm || null,
      });

    case 'cadence_in_progression':
      return generateCadenceInProgressionQuestion({
        cadencePool: exercise.cadencePool || ['autentica', 'plagale', 'evitata', 'sospesa'],
        rootMidi,
      });

    // ─── MONDO IV types ──────────────────────────────────────

    case 'minor_scale_id':
      return generateMinorScaleIdQuestion({
        scalePool: exercise.scalePool || ['minor', 'harmonic_minor', 'melodic_minor'],
        rootMidi,
      });

    case 'mode_id':
      return generateModeIdQuestion({
        modePool: exercise.modePool || ['dorian', 'aeolian'],
        rootMidi,
      });

    case 'chromatic_tension':
      return generateChromaticTensionQuestion({
        tensionPool: exercise.tensionPool || ['b2'],
        rootMidi,
      });

    case 'chromatic_tension_sequence':
      return generateChromaticTensionSequenceQuestion({
        tensionPool: exercise.tensionPool || ['b2', '#4', '#5', 'b7'],
        length: exercise.length || 2,
        rootMidi,
      });

    case 'modal_lick':
      return generateModalLickQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        length: exercise.length || 4,
        scaleType,
        rootMidi,
        bpm: exercise.bpm || 60,
      });

    case 'modal_lick_id':
      return generateModalLickIdQuestion({
        modePool: exercise.modePool || ['dorian', 'aeolian'],
        length: exercise.length || 5,
        rootMidi,
        bpm: exercise.bpm || 60,
      });

    // ─── MONDO V types ──────────────────────────────────────

    case 'seventh_quality':
      return generateSeventhQualityQuestion({
        qualityPool: exercise.qualityPool || ['maj7', 'dom7'],
        rootMidi,
      });

    case 'seventh_inversion':
      return generateSeventhInversionQuestion({ rootMidi });

    case 'seventh_quality_inversion':
      return generateSeventhQualityInversionQuestion({
        qualityPool: exercise.qualityPool || ['maj7', 'dom7', 'm7', 'm7b5', 'dim7'],
        rootMidi,
      });

    case 'seventh_sequence':
      return generateSeventhSequenceQuestion({
        qualityPool: exercise.qualityPool || ['maj7', 'dom7', 'm7'],
        length: exercise.length || 2,
        rootMidi,
      });

    case 'seventh_degree':
      return generateSeventhDegreeQuestion({
        pool: exercise.pool || [1, 2, 3, 4, 5, 6, 7],
        rootMidi,
      });

    case 'seventh_voice_id':
      return generateSeventhVoiceIdQuestion({ rootMidi });

    case 'bass_movement':
      return generateBassMovementQuestion({ rootMidi });

    case 'ii_v_i_confirm':
      return generateIIVIConfirmQuestion({
        rootMidi,
        minor: exercise.minor || false,
      });

    case 'ii_v_open':
      return generateIIVOpenQuestion({ rootMidi });

    case 'ii_v_i_vs_I_IV_V':
      return generateIIVI_vs_IIVV_Question({ rootMidi });

    case 'ii_v_i_secondary':
      return generateIIVISecondaryQuestion({
        degreePool: exercise.degreePool || [1, 2, 4, 5, 6],
        rootMidi,
      });

    case 'ii_v_i_chain':
      return generateIIVIChainQuestion({
        chainLength: exercise.chainLength || 2,
        rootMidi,
      });

    case 'ii_v_i_resolution':
      return generateIIVIResolutionQualityQuestion({ rootMidi });

    case 'tritone_sub':
      return generateTritoneSubQuestion({ rootMidi });

    case 'chromatic_passing':
      return generateChromaticPassingChordQuestion({ rootMidi });

    case 'secondary_dominant':
      return generateSecondaryDominantQuestion({
        targetPool: exercise.targetPool || [2, 5, 6],
        rootMidi,
      });

    case 'borrowed_chord':
      return generateBorrowedChordQuestion({ rootMidi });

    case 'substitution_spot':
      return generateSubstitutionSpotQuestion({ rootMidi });

    case 'full_progression':
      return generateFullProgressionQuestion({
        length: exercise.length || 8,
        rootMidi,
        bpm: exercise.bpm || null,
      });

    // ─── MONDO VI types ──────────────────────────────────────

    case 'rhythm_duration':
      return generateRhythmDurationQuestion({
        durationPool: exercise.durationPool || ['semiminima', 'minima'],
        bpm: exercise.bpm || 100,
      });

    case 'rhythm_count':
      return generateRhythmCountQuestion({
        maxCount: exercise.maxCount || 6,
        bpm: exercise.bpm || 120,
      });

    case 'rhythm_grid':
      return generateRhythmGridQuestion({
        subdivisions: exercise.subdivisions || 8,
        measures: exercise.measures || 1,
        complexity: exercise.complexity || 0.4,
        bpm: exercise.bpm || 100,
        beatsPerMeasure: exercise.beatsPerMeasure || 4,
      });

    case 'rhythm_syncopation':
      return generateRhythmSyncopationQuestion({
        bpm: exercise.bpm || 100,
      });

    case 'rhythm_ghost_pattern':
      return generateRhythmGhostPatternQuestion({
        bpm: exercise.bpm || 100,
        noteCount: exercise.noteCount || 8,
      });

    case 'meter_id':
      return generateMeterIdQuestion({
        meterPool: exercise.meterPool || ['4/4', '3/4'],
        bpm: exercise.bpm || 100,
      });

    case 'meter_grouping':
      return generateMeterGroupingQuestion({
        groupingPool: exercise.groupingPool || ['3+2', '2+3'],
        bpm: exercise.bpm || 90,
      });

    case 'polyrhythm_id':
      return generatePolyrhythmIdQuestion({
        polyPool: exercise.polyPool || ['3:2', '2:3'],
        bpm: exercise.bpm || 80,
      });

    case 'polyrhythm_count':
      return generatePolyrhythmCountQuestion({
        voice1Beats: exercise.voice1Beats || 3,
        voice2Beats: exercise.voice2Beats || 4,
        followVoice: exercise.followVoice || 'basso',
        bpm: exercise.bpm || 80,
      });

    default:
      return generateScaleDegreeQuestion({
        pool: exercise.pool || [1,2,3,4,5,6,7],
        rootMidi,
        scaleType,
      });
  }
}
