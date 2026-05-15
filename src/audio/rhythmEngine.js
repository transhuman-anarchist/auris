import audioEngine from './audioEngine.js';

class RhythmEngine {
  constructor() {
    this._timers = [];
    this.playing = false;
  }

  _later(fn, ms) {
    const id = setTimeout(fn, ms);
    this._timers.push(id);
    return id;
  }

  playGridPattern(grid, {
    bpm = 120,
    beatsPerMeasure = 4,
    subdivisionsPerBeat = 2,
    midi = 60,
    volume = 0.6,
    withClick = true,
    timbreKey = 'marimba',
  } = {}) {
    this.stop();
    audioEngine.init();
    audioEngine.resume();
    this.playing = true;

    const subdivDuration = 60 / bpm / subdivisionsPerBeat;

    grid.forEach((hit, i) => {
      const delay = i * subdivDuration * 1000;

      if (withClick && i % subdivisionsPerBeat === 0) {
        const beatIndex = i / subdivisionsPerBeat;
        const isDownbeat = beatIndex % beatsPerMeasure === 0;
        this._later(() => {
          if (!this.playing) return;
          audioEngine.playNote('marimba', isDownbeat ? 84 : 80, 0.03, isDownbeat ? 0.35 : 0.2);
        }, delay);
      }

      if (hit === 1) {
        this._later(() => {
          if (!this.playing) return;
          audioEngine.playNote(timbreKey, midi, subdivDuration * 0.8, volume);
        }, delay);
      } else if (hit === 0.5) {
        this._later(() => {
          if (!this.playing) return;
          audioEngine.playGhostNote(0.06, volume * 0.4);
        }, delay);
      }
    });

    const totalMs = grid.length * subdivDuration * 1000;
    this._later(() => { this.playing = false; }, totalMs);
    return totalMs / 1000;
  }

  playDurationNote(midi, durationBeats, bpm, { timbreKey = 'piano', volume = 0.6 } = {}) {
    this.stop();
    audioEngine.init();
    audioEngine.resume();
    this.playing = true;

    const beatDur = 60 / bpm;

    audioEngine.playNote('marimba', 84, 0.03, 0.35);
    audioEngine.playNote(timbreKey, midi, beatDur * durationBeats * 0.95, volume);

    const totalMs = beatDur * (durationBeats + 0.5) * 1000;
    this._later(() => { this.playing = false; }, totalMs);
    return totalMs / 1000;
  }

  playCountNotes(count, bpm, { midi = 60, timbreKey = 'marimba', volume = 0.6 } = {}) {
    this.stop();
    audioEngine.init();
    audioEngine.resume();
    this.playing = true;

    const beatDur = 60 / bpm / 2;
    for (let i = 0; i < count; i++) {
      this._later(() => {
        if (!this.playing) return;
        audioEngine.playNote(timbreKey, midi, beatDur * 0.7, volume);
      }, i * beatDur * 1000);
    }

    const totalMs = count * beatDur * 1000 + 200;
    this._later(() => { this.playing = false; }, totalMs);
    return totalMs / 1000;
  }

  playMetronome(bpm, beatsPerMeasure, measures = 2) {
    this.stop();
    audioEngine.init();
    audioEngine.resume();
    this.playing = true;

    const beatDur = 60 / bpm;
    const total = beatsPerMeasure * measures;

    for (let i = 0; i < total; i++) {
      const isDownbeat = i % beatsPerMeasure === 0;
      this._later(() => {
        if (!this.playing) return;
        audioEngine.playNote('marimba', isDownbeat ? 84 : 80, 0.05, isDownbeat ? 0.6 : 0.35);
      }, i * beatDur * 1000);
    }

    const totalMs = total * beatDur * 1000;
    this._later(() => { this.playing = false; }, totalMs);
    return totalMs / 1000;
  }

  playMetronomeGrouped(bpm, grouping, measures = 2) {
    this.stop();
    audioEngine.init();
    audioEngine.resume();
    this.playing = true;

    const beatDur = 60 / bpm;
    const beatsPerMeasure = grouping.reduce((a, b) => a + b, 0);
    let time = 0;

    for (let m = 0; m < measures; m++) {
      let beatInMeasure = 0;
      for (let g = 0; g < grouping.length; g++) {
        for (let b = 0; b < grouping[g]; b++) {
          const isDownbeat = beatInMeasure === 0;
          const isGroupStart = b === 0;
          const delayMs = time * 1000;
          this._later(() => {
            if (!this.playing) return;
            const midi = isDownbeat ? 84 : (isGroupStart ? 82 : 80);
            const vol = isDownbeat ? 0.6 : (isGroupStart ? 0.45 : 0.3);
            audioEngine.playNote('marimba', midi, 0.05, vol);
          }, delayMs);
          time += beatDur;
          beatInMeasure++;
        }
      }
    }

    this._later(() => { this.playing = false; }, time * 1000);
    return time;
  }

  playPolyrhythm(voice1Beats, voice2Beats, cycleDuration, {
    cycles = 2,
    midi1 = 48,
    midi2 = 72,
    volume = 0.6,
    timbre1 = 'bass_electric',
    timbre2 = 'bell',
  } = {}) {
    this.stop();
    audioEngine.init();
    audioEngine.resume();
    this.playing = true;

    const totalDuration = cycleDuration * cycles;
    const int1 = cycleDuration / voice1Beats;
    const int2 = cycleDuration / voice2Beats;

    for (let c = 0; c < cycles; c++) {
      const offset = c * cycleDuration;
      for (let i = 0; i < voice1Beats; i++) {
        const delayMs = (offset + i * int1) * 1000;
        this._later(() => {
          if (!this.playing) return;
          audioEngine.playNote(timbre1, midi1, int1 * 0.7, volume);
        }, delayMs);
      }
      for (let i = 0; i < voice2Beats; i++) {
        const delayMs = (offset + i * int2) * 1000;
        this._later(() => {
          if (!this.playing) return;
          audioEngine.playNote(timbre2, midi2, int2 * 0.7, volume * 0.8);
        }, delayMs);
      }
    }

    this._later(() => { this.playing = false; }, totalDuration * 1000);
    return totalDuration;
  }

  playPattern(pattern, bpm = 120, timbreKey = 'marimba', midi = 60, volume = 0.6) {
    this.stop();
    audioEngine.init();
    audioEngine.resume();
    this.playing = true;

    const beatDuration = 60 / bpm;
    pattern.forEach((hit, i) => {
      if (hit) {
        this._later(() => {
          if (this.playing) {
            audioEngine.playNote(timbreKey, midi, beatDuration * 0.8, volume);
          }
        }, i * beatDuration * 1000);
      }
    });

    const totalDuration = pattern.length * beatDuration * 1000;
    this._later(() => { this.playing = false; }, totalDuration);
  }

  playClick(bpm = 120, beats = 4, measures = 1) {
    this.stop();
    audioEngine.init();
    audioEngine.resume();
    this.playing = true;

    const beatDuration = 60 / bpm;
    const total = beats * measures;

    for (let i = 0; i < total; i++) {
      const isDownbeat = i % beats === 0;
      this._later(() => {
        if (this.playing) {
          audioEngine.playNote('marimba', isDownbeat ? 76 : 72, 0.05, isDownbeat ? 0.8 : 0.5);
        }
      }, i * beatDuration * 1000);
    }

    this._later(() => { this.playing = false; }, total * beatDuration * 1000);
  }

  stop() {
    this.playing = false;
    this._timers.forEach(id => clearTimeout(id));
    this._timers = [];
  }
}

const rhythmEngine = new RhythmEngine();
export default rhythmEngine;
