import { EXERCISE_LIBRARY } from '../data/exercises';
import { MuscleFatigue, MuscleGroup, WorkoutSession } from '../types';

// Convert weight between kg and lbs
export function convertWeight(weight: number, fromUnit: 'metric' | 'imperial', toUnit: 'metric' | 'imperial'): number {
  if (fromUnit === toUnit) return weight;
  if (fromUnit === 'metric' && toUnit === 'imperial') {
    return Math.round(weight * 2.20462 * 10) / 10;
  }
  return Math.round((weight / 2.20462) * 10) / 10;
}

// Calculate Estimated 1-Rep Max using Epley formula
export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  // Epley formula: 1RM = w * (1 + r / 30)
  const epley = weight * (1 + reps / 30);
  return Math.round(epley * 10) / 10;
}

// Calculate total volume for a set or workout
export function calculateSetVolume(weight: number, reps: number): number {
  return Math.max(0, weight * reps);
}

// Format duration from seconds into "1h 14m" or "48m 20s"
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m ${secs}s`;
}

// Format seconds to mm:ss (for timers)
export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'core'
];

// Calculate muscle fatigue & recovery based on workouts in the last 7 days
export function calculateMuscleFatigue(workoutSessions: WorkoutSession[], now = new Date(2026, 8, 27)): Record<MuscleGroup, MuscleFatigue> {
  const result: Record<MuscleGroup, MuscleFatigue> = {} as any;

  ALL_MUSCLE_GROUPS.forEach((m) => {
    result[m] = {
      muscle: m,
      fatiguePercent: 0,
      lastTrainedDaysAgo: null,
      setsLast7Days: 0
    };
  });

  const sevenDaysAgoTime = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  // Exercise lookup map
  const exerciseMap = new Map(EXERCISE_LIBRARY.map((ex) => [ex.id, ex]));

  // Process completed workouts sorted newest first
  const completed = [...workoutSessions]
    .filter((w) => w.isCompleted && w.startTime)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  completed.forEach((session) => {
    const sessionDate = new Date(session.startTime);
    const sessionTime = sessionDate.getTime();
    if (sessionTime < sevenDaysAgoTime) return;

    const daysAgo = Math.max(0, Math.floor((now.getTime() - sessionTime) / (24 * 60 * 60 * 1000)));

    session.exercises.forEach((item) => {
      const ex = exerciseMap.get(item.exerciseId);
      if (!ex) return;

      const completedSets = item.sets.filter((s) => s.completed).length;
      if (completedSets === 0) return;

      // Primary muscles
      ex.primaryMuscles.forEach((muscle) => {
        if (!result[muscle]) return;
        result[muscle].setsLast7Days += completedSets;
        if (result[muscle].lastTrainedDaysAgo === null || daysAgo < result[muscle].lastTrainedDaysAgo!) {
          result[muscle].lastTrainedDaysAgo = daysAgo;
        }

        // Each set adds fatigue that decays by ~35% each day
        const setFatigue = completedSets * 12;
        const decayFactor = Math.pow(0.55, daysAgo);
        result[muscle].fatiguePercent += setFatigue * decayFactor;
      });

      // Secondary muscles
      ex.secondaryMuscles.forEach((muscle) => {
        if (!result[muscle]) return;
        result[muscle].setsLast7Days += Math.round(completedSets * 0.5);
        if (result[muscle].lastTrainedDaysAgo === null || daysAgo < result[muscle].lastTrainedDaysAgo!) {
          result[muscle].lastTrainedDaysAgo = daysAgo;
        }

        const setFatigue = completedSets * 6;
        const decayFactor = Math.pow(0.55, daysAgo);
        result[muscle].fatiguePercent += setFatigue * decayFactor;
      });
    });
  });

  // Clamp fatigue percent between 0 and 100
  ALL_MUSCLE_GROUPS.forEach((m) => {
    result[m].fatiguePercent = Math.min(100, Math.round(result[m].fatiguePercent));
  });

  return result;
}

// Sound alerts using Web Audio API (cross-browser, self-contained, no external asset dependency)
class AudioManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playBeep(freq = 880, duration = 0.12, type: OscillatorType = 'sine'): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio permission or blocked context
    }
  }

  playRestCompleteSound(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // 3 ascending chime beeps
      [660, 880, 1100].forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 0.15, 'triangle');
        }, idx * 160);
      });
    } catch {
      // ignore
    }
  }

  playPrFanfare(): void {
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, High C
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 0.18, 'sine');
        }, idx * 140);
      });
    } catch {
      // ignore
    }
  }
}

export const soundManager = new AudioManager();
