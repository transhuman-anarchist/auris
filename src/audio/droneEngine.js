import audioEngine from './AudioEngine.js';

class DroneEngine {
  constructor() {
    this.oscillators = [];
    this.gainNode = null;
    this.playing = false;
    this.currentMidi = null;
    this.timbreKey = 'pad';
    this.withFifth = false;
    this._stopTimer = null;
  }

  start(midi, { volume = 0.4, timbreKey = 'pad', withFifth = false } = {}) {
    this._forceStopOscillators();
    audioEngine.init();
    audioEngine.resume();

    const ctx = audioEngine.ctx;
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.2);
    this.gainNode.connect(audioEngine.masterGain);

    this.currentMidi = midi;
    this.timbreKey = timbreKey;
    this.withFifth = withFifth;

    const freq = audioEngine.midiToFreq(midi);
    this._createDroneOsc(ctx, freq);

    if (withFifth) {
      const fifthFreq = audioEngine.midiToFreq(midi + 7);
      this._createDroneOsc(ctx, fifthFreq, 0.7);
    }

    this.playing = true;
  }

  _createDroneOsc(ctx, freq, volumeScale = 1.0) {
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    const g1 = ctx.createGain();
    g1.gain.value = 0.5 * volumeScale;
    osc1.connect(g1);
    g1.connect(this.gainNode);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = freq;
    osc2.detune.value = 5;
    const g2 = ctx.createGain();
    g2.gain.value = 0.3 * volumeScale;
    osc2.connect(g2);
    g2.connect(this.gainNode);

    osc1.start();
    osc2.start();
    this.oscillators.push(osc1, osc2);
  }

  // Force-stop all oscillators immediately (used before start to avoid zombie oscillators)
  _forceStopOscillators() {
    if (this._stopTimer) {
      clearTimeout(this._stopTimer);
      this._stopTimer = null;
    }
    if (this.gainNode && audioEngine.ctx) {
      try {
        this.gainNode.gain.cancelScheduledValues(audioEngine.ctx.currentTime);
        this.gainNode.gain.setValueAtTime(0, audioEngine.ctx.currentTime);
      } catch (_) {}
    }
    this.oscillators.forEach(o => { try { o.stop(); } catch (_) {} });
    this.oscillators = [];
    this.playing = false;
    this.currentMidi = null;
  }

  stop() {
    if (!this.playing && this.oscillators.length === 0) return;
    if (this._stopTimer) {
      clearTimeout(this._stopTimer);
      this._stopTimer = null;
    }
    const ctx = audioEngine.ctx;
    if (this.gainNode && ctx) {
      this.gainNode.gain.cancelScheduledValues(ctx.currentTime);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    }
    const oscsToStop = [...this.oscillators];
    this._stopTimer = setTimeout(() => {
      oscsToStop.forEach(o => { try { o.stop(); } catch (_) {} });
      this._stopTimer = null;
    }, 250);
    this.oscillators = [];
    this.playing = false;
    this.currentMidi = null;
  }

  setVolume(volume) {
    if (this.gainNode && audioEngine.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(volume, audioEngine.ctx.currentTime + 0.1);
    }
  }

  isPlaying() {
    return this.playing;
  }
}

const droneEngine = new DroneEngine();
export default droneEngine;
