const TIMBRES = {
  bass_electric: {
    name: 'Basso Elettrico',
    create(ctx, freq, duration, volume) {
      const now = ctx.currentTime;
      const out = ctx.createGain();
      // Guard: clamp envelope times so they are monotonically increasing even for very short durations
      const end = now + duration;
      const attackEnd = Math.min(now + 0.008, end - 0.002);
      const decayEnd = Math.max(attackEnd + 0.001, Math.min(now + 0.208, now + duration * 0.3));
      const releaseStart = Math.max(decayEnd + 0.001, end - 0.4);
      out.gain.setValueAtTime(0, now);
      out.gain.linearRampToValueAtTime(volume, attackEnd);
      out.gain.linearRampToValueAtTime(volume * 0.7, decayEnd);
      out.gain.setValueAtTime(volume * 0.7, releaseStart);
      out.gain.linearRampToValueAtTime(0, end);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      filter.Q.value = 1.5;
      filter.connect(out);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.value = freq;
      osc1.connect(filter);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.value = freq * Math.pow(2, 4 / 1200);
      osc2.connect(filter);

      const osc3 = ctx.createOscillator();
      osc3.type = 'sawtooth';
      osc3.frequency.value = freq * Math.pow(2, -4 / 1200);
      osc3.connect(filter);

      const subGain = ctx.createGain();
      subGain.gain.value = 0.3;
      subGain.connect(filter);
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = freq / 2;
      sub.connect(subGain);

      [osc1, osc2, osc3, sub].forEach(o => { o.start(now); o.stop(now + duration); });
      return out;
    }
  },

  bass_fretless: {
    name: 'Basso Fretless',
    create(ctx, freq, duration, volume) {
      const now = ctx.currentTime;
      const out = ctx.createGain();
      // Guard: clamp envelope times so they are monotonically increasing even for very short durations
      const end = now + duration;
      const attackEnd = Math.min(now + 0.008, end - 0.002);
      const decayEnd = Math.max(attackEnd + 0.001, Math.min(now + 0.208, now + duration * 0.3));
      const releaseStart = Math.max(decayEnd + 0.001, end - 0.4);
      out.gain.setValueAtTime(0, now);
      out.gain.linearRampToValueAtTime(volume, attackEnd);
      out.gain.linearRampToValueAtTime(volume * 0.7, decayEnd);
      out.gain.setValueAtTime(volume * 0.7, releaseStart);
      out.gain.linearRampToValueAtTime(0, end);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      filter.Q.value = 1.0;
      filter.connect(out);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      const g1 = ctx.createGain();
      g1.gain.value = 0.6;
      osc1.connect(g1);
      g1.connect(filter);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      const g2 = ctx.createGain();
      g2.gain.value = 0.4;
      osc2.connect(g2);
      g2.connect(filter);

      [osc1, osc2].forEach(o => {
        o.frequency.value = freq;
        o.start(now);
        o.stop(now + duration);
      });

      // Only add vibrato LFO if duration is long enough for the delay
      if (duration > 0.25) {
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 5;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = freq * (15 / 1200);
        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);
        lfo.start(now + 0.2);
        lfo.stop(now + duration);
      }

      return out;
    }
  },

  piano: {
    name: 'Piano',
    create(ctx, freq, duration, volume) {
      const now = ctx.currentTime;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0, now);
      out.gain.linearRampToValueAtTime(volume, now + 0.005);
      // Clamp decayTime so it never exceeds duration
      const rawDecay = Math.max(0.3, 2.0 - (freq / 1000));
      const decayTime = Math.min(rawDecay, duration * 0.85);
      out.gain.exponentialRampToValueAtTime(Math.max(volume * 0.1, 0.001), now + decayTime);
      out.gain.linearRampToValueAtTime(0, now + duration);

      const harmonics = [1, 2, 3, 4, 5, 6];
      const amps = [1, 0.5, 0.3, 0.15, 0.08, 0.04];
      harmonics.forEach((h, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq * h;
        const g = ctx.createGain();
        g.gain.value = amps[i];
        osc.connect(g);
        g.connect(out);
        osc.start(now);
        osc.stop(now + duration);
      });
      return out;
    }
  },

  bell: {
    name: 'Campana',
    create(ctx, freq, duration, volume) {
      const now = ctx.currentTime;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.001, now);
      out.gain.linearRampToValueAtTime(volume, now + 0.002);
      out.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const partials = [1, 2.756, 5.404, 8.933];
      const amps = [1, 0.6, 0.3, 0.15];
      partials.forEach((p, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq * p;
        const g = ctx.createGain();
        g.gain.value = amps[i];
        osc.connect(g);
        g.connect(out);
        osc.start(now);
        osc.stop(now + duration);
      });
      return out;
    }
  },

  organ: {
    name: 'Organo',
    create(ctx, freq, duration, volume) {
      const now = ctx.currentTime;
      const out = ctx.createGain();
      const end = now + duration;
      const attackEnd = Math.min(now + 0.01, end - 0.002);
      const releaseStart = Math.max(attackEnd + 0.001, end - 0.05);
      out.gain.setValueAtTime(0, now);
      out.gain.linearRampToValueAtTime(volume, attackEnd);
      out.gain.setValueAtTime(volume, releaseStart);
      out.gain.linearRampToValueAtTime(0, end);

      const drawbars = [1, 2, 3, 4, 5, 6, 7, 8];
      const amps = [1, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1, 0.05];
      drawbars.forEach((h, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq * h;
        const g = ctx.createGain();
        g.gain.value = amps[i] * 0.5;
        osc.connect(g);
        g.connect(out);
        osc.start(now);
        osc.stop(now + duration);
      });
      return out;
    }
  },

  strings: {
    name: 'Archi',
    create(ctx, freq, duration, volume) {
      const now = ctx.currentTime;
      const out = ctx.createGain();
      // Guard: ensure sustain start is after attack end
      const attackEnd = now + Math.min(0.18, duration * 0.3);
      const releaseStart = now + Math.max(duration * 0.3 + 0.001, duration - 0.6);
      out.gain.setValueAtTime(0, now);
      out.gain.linearRampToValueAtTime(volume, attackEnd);
      out.gain.setValueAtTime(volume, releaseStart);
      out.gain.linearRampToValueAtTime(0, now + duration);

      const detunes = [-16, -8, 8, 16];
      detunes.forEach(d => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        osc.detune.value = d;
        const g = ctx.createGain();
        g.gain.value = 0.25;
        osc.connect(g);
        g.connect(out);
        osc.start(now);
        osc.stop(now + duration);
      });
      return out;
    }
  },

  pad: {
    name: 'Synth Pad',
    create(ctx, freq, duration, volume) {
      const now = ctx.currentTime;
      const out = ctx.createGain();
      // Guard: ensure sustain start is after attack end
      const attackEnd = now + Math.min(0.2, duration * 0.3);
      const releaseStart = now + Math.max(duration * 0.3 + 0.001, duration - 0.3);
      out.gain.setValueAtTime(0, now);
      out.gain.linearRampToValueAtTime(volume, attackEnd);
      out.gain.setValueAtTime(volume, releaseStart);
      out.gain.linearRampToValueAtTime(0, now + duration);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = freq;
      const g1 = ctx.createGain();
      g1.gain.value = 0.5;
      osc1.connect(g1);
      g1.connect(out);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = freq;
      osc2.detune.value = 6;
      const g2 = ctx.createGain();
      g2.gain.value = 0.3;
      osc2.connect(g2);
      g2.connect(out);

      const osc3 = ctx.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.value = freq;
      osc3.detune.value = -6;
      const g3 = ctx.createGain();
      g3.gain.value = 0.3;
      osc3.connect(g3);
      g3.connect(out);

      [osc1, osc2, osc3].forEach(o => { o.start(now); o.stop(now + duration); });
      return out;
    }
  },

  marimba: {
    name: 'Marimba',
    create(ctx, freq, duration, volume) {
      const now = ctx.currentTime;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.001, now);
      out.gain.linearRampToValueAtTime(volume, now + 0.002);
      out.gain.exponentialRampToValueAtTime(0.001, now + Math.min(duration, 1.5));

      const partials = [1, 4, 10];
      const amps = [1, 0.2, 0.05];
      const decays = [1.0, 0.3, 0.1];
      partials.forEach((p, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq * p;
        const g = ctx.createGain();
        g.gain.setValueAtTime(amps[i], now);
        g.gain.exponentialRampToValueAtTime(0.001, now + decays[i]);
        osc.connect(g);
        g.connect(out);
        osc.start(now);
        osc.stop(now + duration);
      });
      return out;
    }
  }
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this._activeNodes = [];
    this._sequenceTimers = [];
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.ctx.destination);
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      return this.ctx.resume();
    }
    return Promise.resolve();
  }

  stopAll() {
    this._sequenceTimers.forEach(id => clearTimeout(id));
    this._sequenceTimers = [];
    if (this.ctx) {
      const now = this.ctx.currentTime;
      this._activeNodes.forEach(node => {
        try {
          node.gain.cancelScheduledValues(now);
          node.gain.setValueAtTime(node.gain.value, now);
          node.gain.linearRampToValueAtTime(0, now + 0.03);
        } catch (_) {}
      });
    }
    this._activeNodes = [];
  }

  _track(gainNode) {
    this._activeNodes.push(gainNode);
    if (this._activeNodes.length > 30) {
      this._activeNodes = this._activeNodes.slice(-20);
    }
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  noteNameToMidi(name) {
    const map = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const match = name.match(/^([A-G])(#|b)?(\d)$/);
    if (!match) return 60;
    let midi = (parseInt(match[3]) + 1) * 12 + map[match[1]];
    if (match[2] === '#') midi++;
    if (match[2] === 'b') midi--;
    return midi;
  }

  async playNote(timbreKey, midi, duration = 1.0, volume = 0.6) {
    this.init();
    await this.resume();
    const timbre = TIMBRES[timbreKey] || TIMBRES.piano;
    const freq = this.midiToFreq(midi);
    const node = timbre.create(this.ctx, freq, duration, volume);
    node.connect(this.masterGain);
    this._track(node);
  }

  async playNoteSequence(timbreKey, midiNotes, noteDuration = 0.5, gap = 0.05, volume = 0.6) {
    this.init();
    await this.resume();
    const timbre = TIMBRES[timbreKey] || TIMBRES.piano;
    midiNotes.forEach((midi, i) => {
      const delay = i * (noteDuration + gap);
      const timerId = setTimeout(() => {
        const freq = this.midiToFreq(midi);
        const node = timbre.create(this.ctx, freq, noteDuration, volume);
        node.connect(this.masterGain);
        this._track(node);
      }, delay * 1000);
      this._sequenceTimers.push(timerId);
    });
  }

  async playPhraseAtBPM(timbreKey, midiNotes, bpm, rhythmPattern, volume = 0.6) {
    this.init();
    await this.resume();
    const timbre = TIMBRES[timbreKey] || TIMBRES.piano;
    const beatDuration = 60 / bpm;
    let offset = 0;
    midiNotes.forEach((midi, i) => {
      const beats = rhythmPattern ? (rhythmPattern[i] || 1) : 1;
      const noteDur = beatDuration * beats * 0.9;
      const timerId = setTimeout(() => {
        const freq = this.midiToFreq(midi);
        const node = timbre.create(this.ctx, freq, noteDur, volume);
        node.connect(this.masterGain);
        this._track(node);
      }, offset * 1000);
      this._sequenceTimers.push(timerId);
      offset += beatDuration * beats;
    });
    return offset;
  }

  async playBend(timbreKey, startMidi, targetMidi, duration = 0.8, volume = 0.6) {
    this.init();
    await this.resume();
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(volume, now + 0.008);
    out.gain.setValueAtTime(volume, now + duration - 0.1);
    out.gain.linearRampToValueAtTime(0, now + duration);
    out.connect(this.masterGain);

    const startFreq = this.midiToFreq(startMidi);
    const endFreq = this.midiToFreq(targetMidi);

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.setValueAtTime(startFreq, now + duration * 0.3);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.7);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    osc.connect(filter);
    filter.connect(out);
    osc.start(now);
    osc.stop(now + duration);
    this._track(out);
  }

  async playLegatoPair(timbreKey, midi1, midi2, totalDuration = 1.0, volume = 0.6) {
    this.init();
    await this.resume();
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const half = totalDuration / 2;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(volume, now + 0.008);
    out.gain.setValueAtTime(volume, now + totalDuration - 0.1);
    out.gain.linearRampToValueAtTime(0, now + totalDuration);
    out.connect(this.masterGain);

    const freq1 = this.midiToFreq(midi1);
    const freq2 = this.midiToFreq(midi2);

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq1, now);
    osc.frequency.setValueAtTime(freq1, now + half - 0.02);
    osc.frequency.exponentialRampToValueAtTime(freq2, now + half + 0.02);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    osc.connect(filter);
    filter.connect(out);
    osc.start(now);
    osc.stop(now + totalDuration);
    this._track(out);
  }

  async playSlide(timbreKey, startMidi, endMidi, duration = 1.0, volume = 0.6) {
    this.init();
    await this.resume();
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(volume, now + 0.008);
    out.gain.setValueAtTime(volume, now + duration - 0.1);
    out.gain.linearRampToValueAtTime(0, now + duration);
    out.connect(this.masterGain);

    const startFreq = this.midiToFreq(startMidi);
    const endFreq = this.midiToFreq(endMidi);

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.6);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    osc.connect(filter);
    filter.connect(out);
    osc.start(now);
    osc.stop(now + duration);
    this._track(out);
  }

  async playNoteWithVibrato(timbreKey, midi, duration = 1.2, vibratoDirection = 1, volume = 0.6) {
    this.init();
    await this.resume();
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freq = this.midiToFreq(midi);

    const out = ctx.createGain();
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(volume, now + 0.008);
    out.gain.setValueAtTime(volume, now + duration - 0.2);
    out.gain.linearRampToValueAtTime(0, now + duration);
    out.connect(this.masterGain);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 5.5;
    const lfoGain = ctx.createGain();
    // Wide vibrato biased in one direction
    const depthCents = 30;
    lfoGain.gain.value = freq * (depthCents / 1200) * vibratoDirection;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 700;
    osc.connect(filter);
    filter.connect(out);

    osc.start(now);
    osc.stop(now + duration);
    lfo.start(now + 0.15);
    lfo.stop(now + duration);
    this._track(out);
  }

  async playGhostNote(duration = 0.08, volume = 0.3) {
    this.init();
    await this.resume();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 200;
    filter.Q.value = 2;

    const out = ctx.createGain();
    out.gain.setValueAtTime(volume, now);
    out.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(out);
    out.connect(this.masterGain);
    source.start(now);
    this._track(out);
  }

  async playChord(timbreKey, midiNotes, duration = 1.0, volume = 0.6) {
    this.init();
    await this.resume();
    const timbre = TIMBRES[timbreKey] || TIMBRES.piano;
    const noteVol = volume * (1.2 / Math.sqrt(midiNotes.length));
    midiNotes.forEach(midi => {
      const freq = this.midiToFreq(midi);
      const node = timbre.create(this.ctx, freq, duration, noteVol);
      node.connect(this.masterGain);
      this._track(node);
    });
  }

  async playChordSequence(timbreKey, chordsArray, chordDuration = 1.0, gap = 0.3, volume = 0.6) {
    this.init();
    await this.resume();
    chordsArray.forEach((chord, i) => {
      const delay = i * (chordDuration + gap);
      const timerId = setTimeout(() => {
        this.playChord(timbreKey, chord, chordDuration, volume);
      }, delay * 1000);
      this._sequenceTimers.push(timerId);
    });
    return chordsArray.length * (chordDuration + gap);
  }

  async playChordProgressionAtBPM(timbreKey, chordsArray, bpm, volume = 0.6) {
    this.init();
    await this.resume();
    const beatDuration = 60 / bpm;
    const chordDuration = beatDuration * 0.9;
    chordsArray.forEach((chord, i) => {
      const delay = i * beatDuration;
      const timerId = setTimeout(() => {
        this.playChord(timbreKey, chord, chordDuration, volume);
      }, delay * 1000);
      this._sequenceTimers.push(timerId);
    });
    return chordsArray.length * beatDuration;
  }

  getTimbreList() {
    return Object.entries(TIMBRES).map(([key, val]) => ({ key, name: val.name }));
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
export { TIMBRES };
