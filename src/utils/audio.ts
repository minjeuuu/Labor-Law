// Web Audio API Retro 8-bit Synthesizer with Configurable Super Mario Soundscapes & SFX

import { MarioSoundscapeId } from './engagementFeatures';

export type TabSfxType = 'pipe' | 'jump' | 'coin' | 'stomp';
export type CardSfxType = 'powerup' | 'coin' | 'fireball' | 'oneup';
export type QuizSfxType = 'fanfare' | 'star' | 'oneup';

export interface SoundToggles {
  jump: boolean;
  coin: boolean;
  powerup: boolean;
  pipe: boolean;
  stomp: boolean;
  fireball: boolean;
  boss: boolean;
  fanfare: boolean;
}

export interface AudioSettings {
  enabled: boolean; // Master toggle
  sfxEnabled: boolean; // Sound effects toggle
  musicEnabled: boolean; // Retro BGM chiptune music toggle (Pause/Resume)
  soundscape: MarioSoundscapeId; // Overworld | Underground | Castle | Star Road
  volume: number; // 0.0 to 1.0 (SFX volume)
  musicVolume: number; // 0.0 to 1.0 (Music volume)
  tabSfx: TabSfxType;
  cardSfx: CardSfxType;
  quizSfx: QuizSfxType;
  soundToggles: SoundToggles;
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  enabled: true,
  sfxEnabled: true,
  musicEnabled: false,
  soundscape: 'overworld',
  volume: 0.8,
  musicVolume: 0.42,
  tabSfx: 'pipe',
  cardSfx: 'coin',
  quizSfx: 'fanfare',
  soundToggles: {
    jump: true,
    coin: true,
    powerup: true,
    pipe: true,
    stomp: true,
    fireball: true,
    boss: true,
    fanfare: true,
  },
};

interface NoteStep {
  f: number; // Lead frequency (0 = rest)
  b?: number; // Optional bass frequency
  d: number; // Duration in seconds
}

const SOUNDSCAPE_SEQUENCES: Record<
  MarioSoundscapeId,
  {
    leadWave: OscillatorType;
    bassWave: OscillatorType;
    loopMs: number;
    gainScale: number;
    steps: NoteStep[];
  }
> = {
  overworld: {
    leadWave: 'square',
    bassWave: 'triangle',
    loopMs: 3200,
    gainScale: 0.075,
    steps: [
      { f: 659.25, b: 196.0, d: 0.14 }, // E5
      { f: 0, d: 0.04 },
      { f: 659.25, b: 196.0, d: 0.14 }, // E5
      { f: 0, d: 0.12 },
      { f: 659.25, b: 196.0, d: 0.14 }, // E5
      { f: 0, d: 0.12 },
      { f: 523.25, b: 130.81, d: 0.14 }, // C5
      { f: 659.25, b: 164.81, d: 0.18 }, // E5
      { f: 0, d: 0.08 },
      { f: 783.99, b: 196.0, d: 0.28 }, // G5
      { f: 0, d: 0.24 },
      { f: 392.0, b: 98.0, d: 0.28 }, // G4
      { f: 0, d: 0.24 },
      { f: 523.25, b: 130.81, d: 0.2 }, // C5
      { f: 392.0, b: 196.0, d: 0.2 }, // G4
      { f: 329.63, b: 164.81, d: 0.24 }, // E4
      { f: 0, d: 0.2 },
    ],
  },
  underground: {
    leadWave: 'triangle',
    bassWave: 'square',
    loopMs: 2900,
    gainScale: 0.09,
    steps: [
      { f: 261.63, b: 130.81, d: 0.14 }, // C4
      { f: 523.25, b: 261.63, d: 0.14 }, // C5
      { f: 220.0, b: 110.0, d: 0.14 }, // A3
      { f: 440.0, b: 220.0, d: 0.14 }, // A4
      { f: 233.08, b: 116.54, d: 0.14 }, // Bb3
      { f: 466.16, b: 233.08, d: 0.18 }, // Bb4
      { f: 0, d: 0.48 },
      { f: 174.61, b: 87.31, d: 0.14 }, // F3
      { f: 349.23, b: 174.61, d: 0.14 }, // F4
      { f: 146.83, b: 73.42, d: 0.14 }, // D3
      { f: 293.66, b: 146.83, d: 0.14 }, // D4
      { f: 155.56, b: 77.78, d: 0.14 }, // Eb3
      { f: 311.13, b: 155.56, d: 0.2 }, // Eb4
      { f: 0, d: 0.45 },
    ],
  },
  castle: {
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    loopMs: 2500,
    gainScale: 0.065,
    steps: [
      { f: 293.66, b: 73.42, d: 0.11 }, // D4
      { f: 277.18, d: 0.11 }, // C#4
      { f: 293.66, d: 0.11 }, // D4
      { f: 311.13, d: 0.11 }, // Eb4
      { f: 293.66, b: 73.42, d: 0.11 }, // D4
      { f: 277.18, d: 0.11 }, // C#4
      { f: 293.66, d: 0.11 }, // D4
      { f: 329.63, d: 0.14 }, // E4
      { f: 293.66, b: 69.3, d: 0.11 }, // D4
      { f: 277.18, d: 0.11 }, // C#4
      { f: 293.66, d: 0.11 }, // D4
      { f: 349.23, d: 0.16 }, // F4
      { f: 311.13, b: 77.78, d: 0.22 }, // Eb4
      { f: 277.18, b: 69.3, d: 0.28 }, // C#4
      { f: 0, d: 0.2 },
    ],
  },
  star_road: {
    leadWave: 'sine',
    bassWave: 'triangle',
    loopMs: 3600,
    gainScale: 0.095,
    steps: [
      { f: 523.25, b: 261.63, d: 0.28 }, // C5
      { f: 659.25, d: 0.28 }, // E5
      { f: 783.99, b: 329.63, d: 0.28 }, // G5
      { f: 987.77, d: 0.36 }, // B5
      { f: 880.0, b: 220.0, d: 0.28 }, // A5
      { f: 783.99, d: 0.28 }, // G5
      { f: 659.25, b: 196.0, d: 0.32 }, // E5
      { f: 587.33, b: 174.61, d: 0.32 }, // D5
      { f: 659.25, d: 0.28 }, // E5
      { f: 783.99, b: 196.0, d: 0.42 }, // G5
      { f: 0, d: 0.32 },
    ],
  },
};

type AudioListener = (settings: AudioSettings) => void;

class MarioAudioEngine {
  private ctx: AudioContext | null = null;
  public settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private listeners: Set<AudioListener> = new Set();

  constructor() {
    this.loadSettings();
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const snapshot = {
      ...this.settings,
      soundToggles: { ...this.settings.soundToggles },
    };
    this.listeners.forEach((fn) => fn(snapshot));
  }

  public get enabled(): boolean {
    return this.settings.enabled;
  }

  public set enabled(val: boolean) {
    this.updateSettings({ enabled: val });
  }

  public get bgmPlaying(): boolean {
    return this.isBgmPlaying && this.settings.enabled && this.settings.musicEnabled;
  }

  public loadSettings() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_audio_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.settings = {
            ...DEFAULT_AUDIO_SETTINGS,
            ...parsed,
            soundscape: parsed.soundscape || 'overworld',
            soundToggles: {
              ...DEFAULT_AUDIO_SETTINGS.soundToggles,
              ...(parsed.soundToggles || {}),
            },
          };
        }
      } catch {
        this.settings = { ...DEFAULT_AUDIO_SETTINGS };
      }
    }
  }

  public saveSettings() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mario_audio_settings', JSON.stringify(this.settings));
      } catch {
        // storage fallback
      }
    }
  }

  public updateSettings(partial: Partial<AudioSettings>) {
    const prevMusic = this.settings.musicEnabled;
    const prevEnabled = this.settings.enabled;
    const prevSoundscape = this.settings.soundscape;

    this.settings = { ...this.settings, ...partial };
    this.saveSettings();

    if (!this.settings.enabled || !this.settings.musicEnabled) {
      this.stopBgm();
    } else if (
      this.settings.enabled &&
      this.settings.musicEnabled &&
      (!prevMusic ||
        !prevEnabled ||
        prevSoundscape !== this.settings.soundscape ||
        !this.isBgmPlaying)
    ) {
      this.startBgm();
    }

    this.notifyListeners();
  }

  // Toggle background music directly from Navbar (Pause / Resume)
  public toggleBgm(): boolean {
    const nextMusic = !(this.settings.enabled && this.settings.musicEnabled);
    if (nextMusic && !this.settings.enabled) {
      this.updateSettings({ enabled: true, musicEnabled: true });
    } else {
      this.updateSettings({ musicEnabled: nextMusic });
    }
    return nextMusic;
  }

  // Switch active Mario ambient soundscape
  public setSoundscape(soundscape: MarioSoundscapeId, autoStartMusic: boolean = true) {
    if (autoStartMusic) {
      this.updateSettings({
        enabled: true,
        musicEnabled: true,
        soundscape,
      });
    } else {
      this.updateSettings({ soundscape });
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private getMasterGain(now: number, baseLevel: number = 0.2) {
    if (!this.ctx || !this.settings.enabled || this.settings.sfxEnabled === false) return null;
    const gain = this.ctx.createGain();
    const effectiveVol = Math.max(0.01, (this.settings.volume ?? 0.8) * baseLevel);
    gain.gain.setValueAtTime(effectiveVol, now);
    gain.connect(this.ctx.destination);
    return gain;
  }

  // Multi-Soundscape Mario Ambient Chiptune Player
  public startBgm() {
    if (!this.settings.enabled || !this.settings.musicEnabled) return;
    this.stopBgm();
    this.initCtx();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    const trackKey: MarioSoundscapeId =
      SOUNDSCAPE_SEQUENCES[this.settings.soundscape] ? this.settings.soundscape : 'overworld';
    const seq = SOUNDSCAPE_SEQUENCES[trackKey];

    const playLoop = () => {
      if (
        !this.isBgmPlaying ||
        !this.ctx ||
        !this.settings.enabled ||
        !this.settings.musicEnabled
      ) {
        this.stopBgm();
        return;
      }
      try {
        const now = this.ctx.currentTime;
        const bgmGain = this.ctx.createGain();
        const vol = Math.max(0.004, (this.settings.musicVolume ?? 0.42) * seq.gainScale);
        bgmGain.gain.setValueAtTime(vol, now);
        bgmGain.connect(this.ctx.destination);

        let timeOffset = 0;
        seq.steps.forEach((step) => {
          if (step.f > 0) {
            const osc = this.ctx!.createOscillator();
            const noteGain = this.ctx!.createGain();
            osc.type = seq.leadWave;
            osc.frequency.setValueAtTime(step.f, now + timeOffset);
            noteGain.gain.setValueAtTime(0.95, now + timeOffset);
            noteGain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + step.d);
            osc.connect(noteGain);
            noteGain.connect(bgmGain);
            osc.start(now + timeOffset);
            osc.stop(now + timeOffset + step.d);
          }
          if (step.b && step.b > 0) {
            const bassOsc = this.ctx!.createOscillator();
            const bassGain = this.ctx!.createGain();
            bassOsc.type = seq.bassWave;
            bassOsc.frequency.setValueAtTime(step.b, now + timeOffset);
            bassGain.gain.setValueAtTime(0.55, now + timeOffset);
            bassGain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + step.d * 1.1);
            bassOsc.connect(bassGain);
            bassGain.connect(bgmGain);
            bassOsc.start(now + timeOffset);
            bassOsc.stop(now + timeOffset + step.d * 1.1);
          }
          timeOffset += step.d;
        });
      } catch {
        // audio policy fallback
      }
    };

    playLoop();
    this.bgmInterval = window.setInterval(playLoop, seq.loopMs);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // Classic Mario Coin sound: B5 (987.77 Hz) to E6 (1318.51 Hz)
  playCoin() {
    if (
      !this.settings.enabled ||
      this.settings.sfxEnabled === false ||
      this.settings.soundToggles?.coin === false
    )
      return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.3);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // Audio fallback
    }
  }

  // Mario Jump sound: quick rising pitch
  playJump() {
    if (!this.settings.enabled || this.settings.soundToggles?.jump === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.2);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.16);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio policy fallback
    }
  }

  // Pipe transition sound: sliding low square tones
  playPipe() {
    if (!this.settings.enabled || this.settings.soundToggles?.pipe === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.25);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(180, now + 0.1);
      osc.frequency.setValueAtTime(120, now + 0.2);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // fallback
    }
  }

  // Goomba / Enemy Stomp sound: low thud
  playStomp() {
    if (!this.settings.enabled || this.settings.soundToggles?.stomp === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.3);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // fallback
    }
  }

  // Wrong Quiz Answer / Damage Miss Sound: descending Mario shrink/miss cue
  playWrongAnswer() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.26);
      if (!master) return;

      const notes = [493.88, 369.99, 293.66, 196.0];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.065);
        noteGain.gain.setValueAtTime(0.9, now + idx * 0.065);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.075);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.065);
        osc.stop(now + (idx + 1) * 0.075);
      });
    } catch {
      // fallback
    }
  }

  // Classic Mario Game Over / Quiz Defeat Jingle
  playGameOver() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.25);
      if (!master) return;

      const seq = [
        { f: 523.25, d: 0.16 }, // C5
        { f: 392.0, d: 0.16 }, // G4
        { f: 329.63, d: 0.2 }, // E4
        { f: 440.0, d: 0.14 }, // A4
        { f: 493.88, d: 0.14 }, // B4
        { f: 440.0, d: 0.14 }, // A4
        { f: 415.3, d: 0.18 }, // G#4
        { f: 466.16, d: 0.18 }, // Bb4
        { f: 415.3, d: 0.18 }, // G#4
        { f: 392.0, d: 0.35 }, // G4
      ];

      let elapsed = 0;
      seq.forEach((step) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(step.f, now + elapsed);
        noteGain.gain.setValueAtTime(1, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + step.d);
        elapsed += step.d * 0.92;
      });
    } catch {
      // fallback
    }
  }

  // Grand World Level-Up Celebration Fanfare
  playLevelUp() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.28);
      if (!master) return;

      const seq = [
        { f: 523.25, d: 0.09 },
        { f: 659.25, d: 0.09 },
        { f: 783.99, d: 0.09 },
        { f: 1046.5, d: 0.16 },
        { f: 783.99, d: 0.1 },
        { f: 1046.5, d: 0.12 },
        { f: 1318.51, d: 0.14 },
        { f: 1567.98, d: 0.38 },
      ];

      let elapsed = 0;
      seq.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, now + elapsed);
        noteGain.gain.setValueAtTime(1, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + n.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + n.d);
        elapsed += n.d * 0.94;
      });
    } catch {
      // fallback
    }
  }

  // Pomodoro 25-Minute Study Interval Completion Alert: Mario Course Clear + 1-UP Bell
  playPomodoroFocusComplete() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.3);
      if (!master) return;

      const melody = [
        { f: 392.0, b: 196.0, d: 0.1 }, // G4
        { f: 523.25, b: 261.63, d: 0.1 }, // C5
        { f: 659.25, b: 329.63, d: 0.1 }, // E5
        { f: 783.99, b: 392.0, d: 0.16 }, // G5
        { f: 659.25, b: 329.63, d: 0.1 }, // E5
        { f: 783.99, b: 392.0, d: 0.14 }, // G5
        { f: 1046.5, b: 523.25, d: 0.24 }, // C6
        { f: 1318.51, b: 659.25, d: 0.34 }, // E6
      ];

      let elapsed = 0;
      melody.forEach((step) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(step.f, now + elapsed);
        noteGain.gain.setValueAtTime(0.95, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + step.d);

        if (step.b) {
          const bass = this.ctx!.createOscillator();
          const bassGain = this.ctx!.createGain();
          bass.type = 'triangle';
          bass.frequency.setValueAtTime(step.b, now + elapsed);
          bassGain.gain.setValueAtTime(0.65, now + elapsed);
          bassGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
          bass.connect(bassGain);
          bassGain.connect(master);
          bass.start(now + elapsed);
          bass.stop(now + elapsed + step.d);
        }

        elapsed += step.d * 0.94;
      });
    } catch {
      // fallback
    }
  }

  // Pomodoro 5-Minute Break Completion Alert: Super Mushroom Power-Up + Coin Ready Chime
  playPomodoroBreakComplete() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.28);
      if (!master) return;

      const seq = [
        { f: 329.63, d: 0.08 },
        { f: 392.0, d: 0.08 },
        { f: 659.25, d: 0.08 },
        { f: 523.25, d: 0.08 },
        { f: 587.33, d: 0.08 },
        { f: 783.99, d: 0.14 },
        { f: 987.77, d: 0.09 },
        { f: 1318.51, d: 0.32 },
      ];

      let elapsed = 0;
      seq.forEach((step) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(step.f, now + elapsed);
        noteGain.gain.setValueAtTime(1, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + step.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + step.d);
        elapsed += step.d * 0.92;
      });
    } catch {
      // fallback
    }
  }

  // Achievement Badge Unlocked Fanfare: Star Sparkle Arpeggio
  playAchievementUnlock() {
    if (!this.settings.enabled || this.settings.sfxEnabled === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.27);
      if (!master) return;

      const notes = [587.33, 783.99, 987.77, 1174.66, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.065);
        noteGain.gain.setValueAtTime(1, now + idx * 0.065);
        noteGain.gain.exponentialRampToValueAtTime(
          0.01,
          now + idx * 0.065 + (idx === notes.length - 1 ? 0.38 : 0.12)
        );
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.065);
        osc.stop(now + idx * 0.065 + (idx === notes.length - 1 ? 0.38 : 0.12));
      });
    } catch {
      // fallback
    }
  }

  // Mystery [?] Block Bump Sound: punchy block hit + high coin ping
  playQuestionBlock() {
    if (!this.settings.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.35);
      if (!master) return;

      const bump = this.ctx.createOscillator();
      const bumpGain = this.ctx.createGain();
      bump.type = 'triangle';
      bump.frequency.setValueAtTime(140, now);
      bump.frequency.exponentialRampToValueAtTime(70, now + 0.08);
      bumpGain.gain.setValueAtTime(1, now);
      bumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      bump.connect(bumpGain);
      bumpGain.connect(master);
      bump.start(now);
      bump.stop(now + 0.09);

      const ding = this.ctx.createOscillator();
      const dingGain = this.ctx.createGain();
      ding.type = 'sine';
      ding.frequency.setValueAtTime(987.77, now + 0.04);
      ding.frequency.setValueAtTime(1318.51, now + 0.1);
      dingGain.gain.setValueAtTime(0.8, now + 0.04);
      dingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      ding.connect(dingGain);
      dingGain.connect(master);
      ding.start(now + 0.04);
      ding.stop(now + 0.32);
    } catch {
      // fallback
    }
  }

  // Fireball shoot sound
  playFireball() {
    if (!this.settings.enabled || this.settings.soundToggles?.fireball === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.25);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // fallback
    }
  }

  // Power Up sound: rising notes
  playPowerUp() {
    if (!this.settings.enabled || this.settings.soundToggles?.powerup === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.2);
      if (!master) return;

      const notes = [330, 392, 659, 523, 587, 784];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        noteGain.gain.setValueAtTime(1, now + idx * 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.05);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.05);
        osc.stop(now + (idx + 1) * 0.05);
      });
    } catch {
      // fallback
    }
  }

  // 1-UP Fanfare
  playOneUp() {
    if (!this.settings.enabled || this.settings.soundToggles?.fanfare === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.22);
      if (!master) return;

      const notes = [659.25, 783.99, 1318.51, 1046.5, 1174.66, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        noteGain.gain.setValueAtTime(1, now + idx * 0.07);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.07);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.07);
        osc.stop(now + (idx + 1) * 0.07);
      });
    } catch {
      // fallback
    }
  }

  // Level Clear / Castle Fanfare
  playFanfare() {
    if (!this.settings.enabled || this.settings.soundToggles?.fanfare === false) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.25);
      if (!master) return;

      const fanfare = [
        { f: 392.0, d: 0.1 },
        { f: 523.25, d: 0.1 },
        { f: 659.25, d: 0.1 },
        { f: 783.99, d: 0.15 },
        { f: 1046.5, d: 0.15 },
        { f: 1318.51, d: 0.18 },
        { f: 1567.98, d: 0.35 },
      ];

      let elapsed = 0;
      fanfare.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, now + elapsed);
        noteGain.gain.setValueAtTime(1, now + elapsed);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + n.d);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + elapsed);
        osc.stop(now + elapsed + n.d);
        elapsed += n.d * 0.95;
      });
    } catch {
      // fallback
    }
  }

  // Invincible Star Theme melody snippet
  playStarTheme() {
    if (!this.settings.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.22);
      if (!master) return;

      const starNotes = [659, 659, 659, 523, 659, 784, 392];
      starNotes.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        noteGain.gain.setValueAtTime(1, now + idx * 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.08);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start(now + idx * 0.08);
        osc.stop(now + (idx + 1) * 0.08);
      });
    } catch {
      // fallback
    }
  }

  // Bowser Roar / Boss Hit sound
  playBowserHit() {
    if (!this.settings.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const master = this.getMasterGain(now, 0.35);
      if (!master) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

      noteGain.gain.setValueAtTime(1, now);
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // fallback
    }
  }

  playTabSwitch() {
    switch (this.settings.tabSfx) {
      case 'jump':
        this.playJump();
        break;
      case 'coin':
        this.playCoin();
        break;
      case 'stomp':
        this.playStomp();
        break;
      case 'pipe':
      default:
        this.playPipe();
        break;
    }
  }

  playCardAction() {
    switch (this.settings.cardSfx) {
      case 'powerup':
        this.playPowerUp();
        break;
      case 'fireball':
        this.playFireball();
        break;
      case 'oneup':
        this.playOneUp();
        break;
      case 'coin':
      default:
        this.playCoin();
        break;
    }
  }

  playQuizComplete() {
    switch (this.settings.quizSfx) {
      case 'star':
        this.playStarTheme();
        break;
      case 'oneup':
        this.playOneUp();
        break;
      case 'fanfare':
      default:
        this.playFanfare();
        break;
    }
  }
}

export const marioAudio = new MarioAudioEngine();
