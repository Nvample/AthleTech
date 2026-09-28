import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { EXERCISE_LIBRARY } from '../data/exercises';
import {
  INITIAL_MEASUREMENTS,
  INITIAL_NUTRITION_LOGS,
  INITIAL_PRS,
  INITIAL_ROUTINES,
  INITIAL_USER_PROFILE,
  INITIAL_WEIGHT_LOGS,
  INITIAL_WORKOUT_HISTORY
} from '../data/initialData';
import {
  BodyMeasurementEntry,
  BodyWeightEntry,
  DailyNutritionLog,
  LoggedMealItem,
  PersonalRecord,
  Routine,
  UserProfile,
  WorkoutExercise,
  WorkoutSession,
  WorkoutSet
} from '../types';
import { calculateOneRepMax, soundManager } from '../utils/fitness';

interface RestTimerState {
  active: boolean;
  timeLeft: number;
  totalTime: number;
  exerciseName?: string;
}

interface WorkoutContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  workoutHistory: WorkoutSession[];
  routines: Routine[];
  weightLogs: BodyWeightEntry[];
  measurements: BodyMeasurementEntry[];
  personalRecords: PersonalRecord[];
  activeWorkout: WorkoutSession | null;
  restTimer: RestTimerState;
  prNotification: string | null;
  finishedWorkoutSummary: WorkoutSession | null;
  startWorkout: (routineId?: string, customTitle?: string) => void;
  updateActiveWorkout: (workout: WorkoutSession) => void;
  finishActiveWorkout: () => void;
  cancelActiveWorkout: () => void;
  addExerciseToActiveWorkout: (exerciseId: string) => void;
  removeExerciseFromActiveWorkout: (workoutExerciseId: string) => void;
  addSetToExercise: (workoutExerciseId: string) => void;
  updateSet: (workoutExerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  toggleSetCompleted: (workoutExerciseId: string, setId: string) => void;
  deleteSet: (workoutExerciseId: string, setId: string) => void;
  setSuperset: (workoutExerciseId: string, supersetId: string | undefined) => void;
  startRestTimer: (seconds?: number, exerciseName?: string) => void;
  pauseRestTimer: () => void;
  stopRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;
  dismissPrNotification: () => void;
  dismissFinishedWorkout: () => void;
  saveRoutine: (routine: Routine) => void;
  deleteRoutine: (routineId: string) => void;
  logWeight: (weight: number, bodyFatPercentage?: number, date?: string, notes?: string) => void;
  logMeasurement: (data: Omit<BodyMeasurementEntry, 'id'>) => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetToDemoData: () => void;
  wakeLockActive: boolean;
  toggleWakeLock: () => Promise<void>;
  // Nutrition & Food Tracker
  nutritionLogs: DailyNutritionLog[];
  logMealItem: (date: string, item: Omit<LoggedMealItem, 'id' | 'loggedAt'>) => void;
  removeMealItem: (date: string, mealItemId: string) => void;
  updateMealItemServings: (date: string, mealItemId: string, servings: number) => void;
  updateWaterIntake: (date: string, deltaMl: number) => void;
  getDailyNutrition: (date: string) => DailyNutritionLog;
}

const STORAGE_KEYS = {
  PROFILE: 'athletech_profile_v1',
  WORKOUTS: 'athletech_workouts_v1',
  ROUTINES: 'athletech_routines_v1',
  WEIGHT: 'athletech_weight_v1',
  MEASUREMENTS: 'athletech_measurements_v1',
  PRS: 'athletech_prs_v1',
  ACTIVE_WORKOUT: 'athletech_active_workout_v1',
  NUTRITION: 'athletech_nutrition_v1'
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states with LocalStorage fallbacks
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return stored ? JSON.parse(stored) : INITIAL_WORKOUT_HISTORY;
    } catch {
      return INITIAL_WORKOUT_HISTORY;
    }
  });

  const [routines, setRoutines] = useState<Routine[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      return stored ? JSON.parse(stored) : INITIAL_ROUTINES;
    } catch {
      return INITIAL_ROUTINES;
    }
  });

  const [weightLogs, setWeightLogs] = useState<BodyWeightEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEIGHT);
      return stored ? JSON.parse(stored) : INITIAL_WEIGHT_LOGS;
    } catch {
      return INITIAL_WEIGHT_LOGS;
    }
  });

  const [measurements, setMeasurements] = useState<BodyMeasurementEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
      return stored ? JSON.parse(stored) : INITIAL_MEASUREMENTS;
    } catch {
      return INITIAL_MEASUREMENTS;
    }
  });

  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRS);
      return stored ? JSON.parse(stored) : INITIAL_PRS;
    } catch {
      return INITIAL_PRS;
    }
  });

  const [nutritionLogs, setNutritionLogs] = useState<DailyNutritionLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NUTRITION);
      return stored ? JSON.parse(stored) : INITIAL_NUTRITION_LOGS;
    } catch {
      return INITIAL_NUTRITION_LOGS;
    }
  });

  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [restTimer, setRestTimer] = useState<RestTimerState>({
    active: false,
    timeLeft: 0,
    totalTime: 0
  });

  const [prNotification, setPrNotification] = useState<string | null>(null);
  const [finishedWorkoutSummary, setFinishedWorkoutSummary] = useState<WorkoutSession | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<any>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(personalRecords));
  }, [personalRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(nutritionLogs));
  }, [nutritionLogs]);

  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    }
  }, [activeWorkout]);

  // Active workout duration tick
  useEffect(() => {
    if (!activeWorkout) return;
    const interval = setInterval(() => {
      setActiveWorkout((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          durationSeconds: prev.durationSeconds + 1
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout?.id]);

  // Rest Timer countdown interval
  useEffect(() => {
    if (!restTimer.active || restTimer.timeLeft <= 0) return;

    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (prev.timeLeft <= 1) {
          // Timer finished!
          if (profile.soundAlerts) {
            soundManager.playRestCompleteSound();
          }
          if (profile.vibrationAlerts && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          return { ...prev, active: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer.active, restTimer.timeLeft, profile.soundAlerts, profile.vibrationAlerts]);

  // Wake lock toggle
  const toggleWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        if (wakeLockActive && wakeLockSentinel) {
          await wakeLockSentinel.release();
          setWakeLockSentinel(null);
          setWakeLockActive(false);
        } else {
          const sentinel = await (navigator as any).wakeLock.request('screen');
          setWakeLockSentinel(sentinel);
          setWakeLockActive(true);
          sentinel.addEventListener('release', () => {
            setWakeLockActive(false);
            setWakeLockSentinel(null);
          });
        }
      } else {
        setWakeLockActive(!wakeLockActive);
      }
    } catch {
      setWakeLockActive(!wakeLockActive);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  // Find previous weight/reps for an exercise to pre-populate sets
  const getPreviousPerformance = (exerciseId: string) => {
    for (const session of workoutHistory) {
      const match = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (match && match.sets.length > 0) {
        const completedSets = match.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          const bestSet = [...completedSets].sort((a, b) => b.weight - a.weight)[0];
          return { weight: bestSet.weight, reps: bestSet.reps };
        }
      }
    }
    return { weight: 20, reps: 10 };
  };

  // Start a new workout session
  const startWorkout = (routineId?: string, customTitle?: string) => {
    const routine = routines.find((r) => r.id === routineId);
    const title = customTitle || (routine ? routine.name : 'Quick Workout');

    const workoutExercises: WorkoutExercise[] = [];

    if (routine) {
      routine.exercises.forEach((item, exIdx) => {
        const exMeta = EXERCISE_LIBRARY.find((e) => e.id === item.exerciseId);
        const name = exMeta ? exMeta.name : item.exerciseId;
        const prev = getPreviousPerformance(item.exerciseId);

        const sets: WorkoutSet[] = Array.from({ length: item.targetSets }, (_, setIdx) => ({
          id: `s-${Date.now()}-${exIdx}-${setIdx}`,
          setNumber: setIdx + 1,
          type: 'normal',
          weight: item.targetWeight || prev.weight,
          reps: parseInt(item.targetReps.split('-')[0]) || prev.reps,
          completed: false,
          previousWeight: prev.weight,
          previousReps: prev.reps
        }));

        workoutExercises.push({
          id: `we-${Date.now()}-${exIdx}`,
          exerciseId: item.exerciseId,
          exerciseName: name,
          supersetId: item.supersetId,
          sets
        });
      });
    }

    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      title,
      routineId,
      routineName: routine?.name,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises: workoutExercises,
      totalVolume: 0,
      isCompleted: false,
      prsAchieved: []
    };

    setActiveWorkout(newSession);
  };

  const updateActiveWorkout = (workout: WorkoutSession) => {
    setActiveWorkout(workout);
  };

  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
    setRestTimer({ active: false, timeLeft: 0, totalTime: 0 });
  };

  const addExerciseToActiveWorkout = (exerciseId: string) => {
    if (!activeWorkout) return;
    const exMeta = EXERCISE_LIBRARY.find((e) => e.id === exerciseId);
    const name = exMeta ? exMeta.name : exerciseId;
    const prev = getPreviousPerformance(exerciseId);

    const initialSets: WorkoutSet[] = [
      {
        id: `s-${Date.now()}-1`,
        setNumber: 1,
        type: 'normal',
        weight: prev.weight,
        reps: prev.reps,
        completed: false,
        previousWeight: prev.weight,
        previousReps: prev.reps
      }
    ];

    const newExercise: WorkoutExercise = {
      id: `we-${Date.now()}`,
      exerciseId,
      exerciseName: name,
      sets: initialSets
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newExercise]
    });
  };

  const removeExerciseFromActiveWorkout = (workoutExerciseId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((e) => e.id !== workoutExerciseId)
    });
  };

  const addSetToExercise = (workoutExerciseId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((item) => {
        if (item.id !== workoutExerciseId) return item;
        const lastSet = item.sets[item.sets.length - 1];
        const newSetNumber = item.sets.length + 1;
        const newSet: WorkoutSet = {
          id: `s-${Date.now()}-${newSetNumber}`,
          setNumber: newSetNumber,
          type: 'normal',
          weight: lastSet ? lastSet.weight : 20,
          reps: lastSet ? lastSet.reps : 10,
          completed: false,
          previousWeight: lastSet?.previousWeight,
          previousReps: lastSet?.previousReps
        };
        return {
          ...item,
          sets: [...item.sets, newSet]
        };
      })
    });
  };

  const updateSet = (workoutExerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((item) => {
        if (item.id !== workoutExerciseId) return item;
        return {
          ...item,
          sets: item.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s))
        };
      })
    });
  };

  const deleteSet = (workoutExerciseId: string, setId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((item) => {
        if (item.id !== workoutExerciseId) return item;
        const filtered = item.sets.filter((s) => s.id !== setId);
        // renumber sets
        const renumbered = filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
        return { ...item, sets: renumbered };
      })
    });
  };

  const setSuperset = (workoutExerciseId: string, supersetId: string | undefined) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((item) =>
        item.id === workoutExerciseId ? { ...item, supersetId: supersetId || undefined } : item
      )
    });
  };

  const toggleSetCompleted = (workoutExerciseId: string, setId: string) => {
    if (!activeWorkout) return;
    let exerciseName = '';
    let completedSetWeight = 0;
    let completedSetReps = 0;
    let willBeCompleted = false;
    let targetExId = '';

    const updatedExercises = activeWorkout.exercises.map((item) => {
      if (item.id !== workoutExerciseId) return item;
      exerciseName = item.exerciseName;
      targetExId = item.exerciseId;
      return {
        ...item,
        sets: item.sets.map((s) => {
          if (s.id !== setId) return s;
          willBeCompleted = !s.completed;
          completedSetWeight = s.weight;
          completedSetReps = s.reps;

          // Check if PR broken
          let isPr = false;
          if (willBeCompleted && completedSetWeight > 0 && completedSetReps > 0) {
            const existingPr = personalRecords.find((p) => p.exerciseId === item.exerciseId);
            const est1RM = calculateOneRepMax(completedSetWeight, completedSetReps);
            if (!existingPr || est1RM > existingPr.estimatedOneRepMax) {
              isPr = true;
            }
          }

          return { ...s, completed: willBeCompleted, isPr };
        })
      };
    });

    // Check PR update
    if (willBeCompleted && completedSetWeight > 0 && completedSetReps > 0) {
      const est1RM = calculateOneRepMax(completedSetWeight, completedSetReps);
      const existingPr = personalRecords.find((p) => p.exerciseId === targetExId);

      if (!existingPr || est1RM > existingPr.estimatedOneRepMax) {
        const prMsg = `${exerciseName}: ${completedSetWeight} ${profile.unit === 'metric' ? 'kg' : 'lbs'} × ${completedSetReps} reps (Est. 1RM: ${est1RM} ${profile.unit === 'metric' ? 'kg' : 'lbs'})`;
        setPrNotification(prMsg);
        soundManager.playPrFanfare();

        // Update personal records table
        setPersonalRecords((prev) => {
          const filtered = prev.filter((p) => p.exerciseId !== targetExId);
          return [
            ...filtered,
            {
              exerciseId: targetExId,
              exerciseName,
              maxWeight: completedSetWeight,
              maxRepsAtMaxWeight: completedSetReps,
              estimatedOneRepMax: est1RM,
              date: new Date().toISOString().split('T')[0]
            }
          ];
        });
      }
    }

    // Trigger rest timer if set was completed and auto-rest is enabled
    if (willBeCompleted && profile.autoStartRestTimer) {
      startRestTimer(profile.defaultRestTime, exerciseName);
      soundManager.playBeep(440, 0.1);
    }

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const startRestTimer = (seconds?: number, exerciseName?: string) => {
    const duration = seconds ?? profile.defaultRestTime;
    setRestTimer({
      active: true,
      timeLeft: duration,
      totalTime: duration,
      exerciseName
    });
  };

  const pauseRestTimer = () => {
    setRestTimer((prev) => ({ ...prev, active: !prev.active }));
  };

  const stopRestTimer = () => {
    setRestTimer({ active: false, timeLeft: 0, totalTime: 0 });
  };

  const adjustRestTimer = (deltaSeconds: number) => {
    setRestTimer((prev) => {
      const newTime = Math.max(5, prev.timeLeft + deltaSeconds);
      return {
        ...prev,
        timeLeft: newTime,
        totalTime: Math.max(prev.totalTime, newTime)
      };
    });
  };

  const finishActiveWorkout = () => {
    if (!activeWorkout) return;

    // Calculate total completed volume
    let totalVolume = 0;
    const prsList: string[] = [];

    activeWorkout.exercises.forEach((item) => {
      item.sets.forEach((s) => {
        if (s.completed && s.weight > 0 && s.reps > 0) {
          totalVolume += s.weight * s.reps;
          if (s.isPr) {
            prsList.push(`${item.exerciseName} ${s.weight} ${profile.unit === 'metric' ? 'kg' : 'lbs'} × ${s.reps}`);
          }
        }
      });
    });

    const finishedSession: WorkoutSession = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      totalVolume: Math.round(totalVolume),
      isCompleted: true,
      prsAchieved: Array.from(new Set(prsList))
    };

    setWorkoutHistory((prev) => [finishedSession, ...prev]);
    setActiveWorkout(null);
    setRestTimer({ active: false, timeLeft: 0, totalTime: 0 });
    setFinishedWorkoutSummary(finishedSession);

    // Launch confetti celebration!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const dismissPrNotification = () => {
    setPrNotification(null);
  };

  const dismissFinishedWorkout = () => {
    setFinishedWorkoutSummary(null);
  };

  const saveRoutine = (routine: Routine) => {
    setRoutines((prev) => {
      const idx = prev.findIndex((r) => r.id === routine.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = routine;
        return copy;
      }
      return [routine, ...prev];
    });
  };

  const deleteRoutine = (routineId: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  };

  const logWeight = (weight: number, bodyFatPercentage?: number, date?: string, notes?: string) => {
    const entryDate = date || new Date().toISOString().split('T')[0];
    const newEntry: BodyWeightEntry = {
      id: `bw-${Date.now()}`,
      date: entryDate,
      weight,
      bodyFatPercentage,
      notes
    };

    setWeightLogs((prev) => {
      // Replace existing entry for the same date or add new
      const filtered = prev.filter((p) => p.date !== entryDate);
      return [newEntry, ...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };

  const logMeasurement = (data: Omit<BodyMeasurementEntry, 'id'>) => {
    const newEntry: BodyMeasurementEntry = {
      id: `bm-${Date.now()}`,
      ...data
    };
    setMeasurements((prev) => [newEntry, ...prev]);
  };

  // Nutrition Methods
  const getDailyNutrition = (date: string): DailyNutritionLog => {
    const found = nutritionLogs.find((l) => l.date === date);
    if (found) return found;
    return {
      id: `nutri-${date}`,
      date,
      meals: [],
      waterIntakeMl: 0
    };
  };

  const logMealItem = (date: string, item: Omit<LoggedMealItem, 'id' | 'loggedAt'>) => {
    const nowTime = new Date().toTimeString().slice(0, 5); // HH:MM
    const newMealItem: LoggedMealItem = {
      ...item,
      id: `meal-${Date.now()}`,
      loggedAt: nowTime
    };

    setNutritionLogs((prev) => {
      const existing = prev.find((l) => l.date === date);
      if (existing) {
        return prev.map((l) =>
          l.date === date
            ? { ...l, meals: [newMealItem, ...l.meals] }
            : l
        );
      } else {
        const newLog: DailyNutritionLog = {
          id: `nutri-${date}`,
          date,
          waterIntakeMl: 0,
          meals: [newMealItem]
        };
        return [newLog, ...prev];
      }
    });
  };

  const removeMealItem = (date: string, mealItemId: string) => {
    setNutritionLogs((prev) =>
      prev.map((l) =>
        l.date === date
          ? { ...l, meals: l.meals.filter((m) => m.id !== mealItemId) }
          : l
      )
    );
  };

  const updateMealItemServings = (date: string, mealItemId: string, servings: number) => {
    if (servings <= 0) return;
    setNutritionLogs((prev) =>
      prev.map((l) => {
        if (l.date !== date) return l;
        return {
          ...l,
          meals: l.meals.map((m) => {
            if (m.id !== mealItemId) return m;
            const ratio = servings / (m.servings || 1);
            return {
              ...m,
              servings,
              calories: Math.round(m.calories * ratio),
              protein: Math.round(m.protein * ratio * 10) / 10,
              carbs: Math.round(m.carbs * ratio * 10) / 10,
              fat: Math.round(m.fat * ratio * 10) / 10,
              fiber: m.fiber !== undefined ? Math.round(m.fiber * ratio * 10) / 10 : undefined
            };
          })
        };
      })
    );
  };

  const updateWaterIntake = (date: string, deltaMl: number) => {
    setNutritionLogs((prev) => {
      const existing = prev.find((l) => l.date === date);
      if (existing) {
        return prev.map((l) =>
          l.date === date
            ? { ...l, waterIntakeMl: Math.max(0, l.waterIntakeMl + deltaMl) }
            : l
        );
      } else {
        const newLog: DailyNutritionLog = {
          id: `nutri-${date}`,
          date,
          waterIntakeMl: Math.max(0, deltaMl),
          meals: []
        };
        return [newLog, ...prev];
      }
    });
  };

  const exportData = () => {
    const fullBackup = {
      version: 'AthleTech-2.0',
      exportedAt: new Date().toISOString(),
      profile,
      workoutHistory,
      routines,
      weightLogs,
      measurements,
      personalRecords,
      nutritionLogs
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (data.workoutHistory) setWorkoutHistory(data.workoutHistory);
      if (data.routines) setRoutines(data.routines);
      if (data.weightLogs) setWeightLogs(data.weightLogs);
      if (data.measurements) setMeasurements(data.measurements);
      if (data.personalRecords) setPersonalRecords(data.personalRecords);
      if (data.nutritionLogs) setNutritionLogs(data.nutritionLogs);
      return true;
    } catch {
      return false;
    }
  };

  const resetToDemoData = () => {
    setProfile(INITIAL_USER_PROFILE);
    setWorkoutHistory(INITIAL_WORKOUT_HISTORY);
    setRoutines(INITIAL_ROUTINES);
    setWeightLogs(INITIAL_WEIGHT_LOGS);
    setMeasurements(INITIAL_MEASUREMENTS);
    setPersonalRecords(INITIAL_PRS);
    setNutritionLogs(INITIAL_NUTRITION_LOGS);
    setActiveWorkout(null);
    setRestTimer({ active: false, timeLeft: 0, totalTime: 0 });
  };

  return (
    <WorkoutContext.Provider
      value={{
        profile,
        updateProfile,
        workoutHistory,
        routines,
        weightLogs,
        measurements,
        personalRecords,
        activeWorkout,
        restTimer,
        prNotification,
        finishedWorkoutSummary,
        startWorkout,
        updateActiveWorkout,
        finishActiveWorkout,
        cancelActiveWorkout,
        addExerciseToActiveWorkout,
        removeExerciseFromActiveWorkout,
        addSetToExercise,
        updateSet,
        toggleSetCompleted,
        deleteSet,
        setSuperset,
        startRestTimer,
        pauseRestTimer,
        stopRestTimer,
        adjustRestTimer,
        dismissPrNotification,
        dismissFinishedWorkout,
        saveRoutine,
        deleteRoutine,
        logWeight,
        logMeasurement,
        exportData,
        importData,
        resetToDemoData,
        wakeLockActive,
        toggleWakeLock,
        nutritionLogs,
        logMealItem,
        removeMealItem,
        updateMealItemServings,
        updateWaterIntake,
        getDailyNutrition
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
