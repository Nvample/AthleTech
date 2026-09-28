import {
  BodyMeasurementEntry,
  BodyWeightEntry,
  DailyNutritionLog,
  PersonalRecord,
  Routine,
  UserProfile,
  WorkoutSession
} from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  avatar: '/src/assets/images/avatar_lifter_1790563520524.jpg',
  unit: 'metric',
  targetWeight: 78.0,
  startingWeight: 84.5,
  weightGoalType: 'cut',
  theme: 'dark',
  accentColor: 'blue',
  defaultRestTime: 90,
  autoStartRestTimer: true,
  soundAlerts: true,
  vibrationAlerts: true,
  keepScreenAwake: true,
  dailyCalorieTarget: 2250,
  dailyProteinTarget: 175,
  dailyCarbsTarget: 230,
  dailyFatTarget: 65,
  dailyWaterTargetMl: 3000
};

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine-push-a',
    name: 'Push A (Chest & Delts Focus)',
    dayOfWeek: 1, // Monday
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    exercises: [
      { exerciseId: 'barbell-bench-press', targetSets: 4, targetReps: '6-8', targetRpe: 8.5 },
      { exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: '8-10', targetRpe: 8 },
      { exerciseId: 'dumbbell-lateral-raise', targetSets: 4, targetReps: '12-15', targetRpe: 9, supersetId: 'A' },
      { exerciseId: 'cable-tricep-pushdown', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, supersetId: 'A' },
      { exerciseId: 'cable-chest-flye', targetSets: 3, targetReps: '12-15', targetRpe: 9 }
    ],
    notes: 'Heavy compound chest opener followed by side delt and tricep volume superset.'
  },
  {
    id: 'routine-pull-a',
    name: 'Pull A (Lats & Biceps Focus)',
    dayOfWeek: 2, // Tuesday
    targetMuscles: ['back', 'biceps', 'forearms'],
    exercises: [
      { exerciseId: 'barbell-deadlift', targetSets: 3, targetReps: '5', targetRpe: 8.5 },
      { exerciseId: 'lat-pulldown', targetSets: 4, targetReps: '8-10', targetRpe: 8 },
      { exerciseId: 'seated-cable-row', targetSets: 3, targetReps: '10-12', targetRpe: 8.5 },
      { exerciseId: 'face-pull', targetSets: 3, targetReps: '12-15', targetRpe: 9 },
      { exerciseId: 'incline-dumbbell-bicep-curl', targetSets: 3, targetReps: '10-12', targetRpe: 9 }
    ],
    notes: 'Primary hinge session with vertical & horizontal rowing density.'
  },
  {
    id: 'routine-legs-a',
    name: 'Legs A (Quads & Calves Focus)',
    dayOfWeek: 4, // Thursday
    targetMuscles: ['quads', 'glutes', 'calves', 'core'],
    exercises: [
      { exerciseId: 'barbell-back-squat', targetSets: 4, targetReps: '6-8', targetRpe: 8.5 },
      { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: '8-10', targetRpe: 8 },
      { exerciseId: 'leg-press-machine', targetSets: 3, targetReps: '10-12', targetRpe: 8.5 },
      { exerciseId: 'standing-calf-raise', targetSets: 4, targetReps: '15', targetRpe: 9 },
      { exerciseId: 'hanging-leg-raise', targetSets: 3, targetReps: '12-15', targetRpe: 8.5 }
    ],
    notes: 'High intensity squatting followed by controlled posterior chain and core stabilization.'
  },
  {
    id: 'routine-upper-hypertrophy',
    name: 'Upper Body Hypertrophy',
    dayOfWeek: 5, // Friday
    targetMuscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    exercises: [
      { exerciseId: 'overhead-barbell-press', targetSets: 4, targetReps: '6-8', targetRpe: 8.5 },
      { exerciseId: 'pull-up', targetSets: 3, targetReps: '8-10', targetRpe: 9 },
      { exerciseId: 'pec-deck-machine', targetSets: 3, targetReps: '12-15', targetRpe: 9, supersetId: 'B' },
      { exerciseId: 'single-arm-dumbbell-row', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, supersetId: 'B' },
      { exerciseId: 'skull-crusher-ez-bar', targetSets: 3, targetReps: '10-12', targetRpe: 8.5 },
      { exerciseId: 'hammer-curl', targetSets: 3, targetReps: '10-12', targetRpe: 8.5 }
    ],
    notes: 'Upper volume pump session to round out weekly hypertrophy demands.'
  }
];

// Helper to generate past dates relative to current date (Sept 2026)
function getPastDate(daysAgo: number): string {
  const d = new Date(2026, 8, 27); // 2026-09-27
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Generate realistic workout history for the past 6 weeks (yielding rich activity heatmap)
export const INITIAL_WORKOUT_HISTORY: WorkoutSession[] = [
  {
    id: 'session-1',
    title: 'Push A (Chest & Delts Focus)',
    routineId: 'routine-push-a',
    routineName: 'Push A',
    startTime: `${getPastDate(1)}T09:15:00.000Z`,
    endTime: `${getPastDate(1)}T10:22:00.000Z`,
    durationSeconds: 4020,
    totalVolume: 8450,
    isCompleted: true,
    prsAchieved: ['Barbell Bench Press 102.5 kg x 6'],
    exercises: [
      {
        id: 'we-1',
        exerciseId: 'barbell-bench-press',
        exerciseName: 'Barbell Bench Press',
        sets: [
          { id: 's1', setNumber: 1, type: 'warmup', weight: 60, reps: 10, completed: true },
          { id: 's2', setNumber: 2, type: 'normal', weight: 95, reps: 8, completed: true, previousWeight: 92.5, previousReps: 8 },
          { id: 's3', setNumber: 3, type: 'normal', weight: 100, reps: 6, completed: true, previousWeight: 97.5, previousReps: 6 },
          { id: 's4', setNumber: 4, type: 'normal', weight: 102.5, reps: 6, completed: true, isPr: true, previousWeight: 100, previousReps: 5 }
        ]
      },
      {
        id: 'we-2',
        exerciseId: 'incline-dumbbell-press',
        exerciseName: 'Incline Dumbbell Press',
        sets: [
          { id: 's5', setNumber: 1, type: 'normal', weight: 34, reps: 10, completed: true, previousWeight: 32, previousReps: 10 },
          { id: 's6', setNumber: 2, type: 'normal', weight: 34, reps: 9, completed: true, previousWeight: 34, previousReps: 8 },
          { id: 's7', setNumber: 3, type: 'normal', weight: 36, reps: 8, completed: true, isPr: true }
        ]
      },
      {
        id: 'we-3',
        exerciseId: 'dumbbell-lateral-raise',
        exerciseName: 'Dumbbell Lateral Raise',
        supersetId: 'A',
        sets: [
          { id: 's8', setNumber: 1, type: 'normal', weight: 14, reps: 14, completed: true },
          { id: 's9', setNumber: 2, type: 'normal', weight: 14, reps: 13, completed: true },
          { id: 's10', setNumber: 3, type: 'dropset', weight: 12, reps: 16, completed: true }
        ]
      },
      {
        id: 'we-4',
        exerciseId: 'cable-tricep-pushdown',
        exerciseName: 'Cable Tricep Pushdown',
        supersetId: 'A',
        sets: [
          { id: 's11', setNumber: 1, type: 'normal', weight: 35, reps: 12, completed: true },
          { id: 's12', setNumber: 2, type: 'normal', weight: 40, reps: 10, completed: true },
          { id: 's13', setNumber: 3, type: 'normal', weight: 40, reps: 10, completed: true }
        ]
      }
    ]
  },
  {
    id: 'session-2',
    title: 'Pull A (Lats & Biceps Focus)',
    routineId: 'routine-pull-a',
    routineName: 'Pull A',
    startTime: `${getPastDate(3)}T17:30:00.000Z`,
    endTime: `${getPastDate(3)}T18:40:00.000Z`,
    durationSeconds: 4200,
    totalVolume: 10240,
    isCompleted: true,
    prsAchieved: ['Conventional Barbell Deadlift 175 kg x 5'],
    exercises: [
      {
        id: 'we-5',
        exerciseId: 'barbell-deadlift',
        exerciseName: 'Conventional Barbell Deadlift',
        sets: [
          { id: 's14', setNumber: 1, type: 'warmup', weight: 100, reps: 8, completed: true },
          { id: 's15', setNumber: 2, type: 'normal', weight: 150, reps: 6, completed: true },
          { id: 's16', setNumber: 3, type: 'normal', weight: 170, reps: 5, completed: true },
          { id: 's17', setNumber: 4, type: 'normal', weight: 175, reps: 5, completed: true, isPr: true }
        ]
      },
      {
        id: 'we-6',
        exerciseId: 'lat-pulldown',
        exerciseName: 'Lat Pulldown',
        sets: [
          { id: 's18', setNumber: 1, type: 'normal', weight: 70, reps: 10, completed: true },
          { id: 's19', setNumber: 2, type: 'normal', weight: 75, reps: 8, completed: true },
          { id: 's20', setNumber: 3, type: 'normal', weight: 75, reps: 8, completed: true }
        ]
      },
      {
        id: 'we-7',
        exerciseId: 'incline-dumbbell-bicep-curl',
        exerciseName: 'Incline Dumbbell Curl',
        sets: [
          { id: 's21', setNumber: 1, type: 'normal', weight: 16, reps: 12, completed: true },
          { id: 's22', setNumber: 2, type: 'normal', weight: 16, reps: 10, completed: true },
          { id: 's23', setNumber: 3, type: 'dropset', weight: 12, reps: 14, completed: true }
        ]
      }
    ]
  },
  {
    id: 'session-3',
    title: 'Legs A (Quads & Calves Focus)',
    routineId: 'routine-legs-a',
    routineName: 'Legs A',
    startTime: `${getPastDate(5)}T10:00:00.000Z`,
    endTime: `${getPastDate(5)}T11:15:00.000Z`,
    durationSeconds: 4500,
    totalVolume: 12100,
    isCompleted: true,
    prsAchieved: ['Barbell Back Squat 142.5 kg x 6'],
    exercises: [
      {
        id: 'we-8',
        exerciseId: 'barbell-back-squat',
        exerciseName: 'Barbell Back Squat',
        sets: [
          { id: 's24', setNumber: 1, type: 'warmup', weight: 80, reps: 10, completed: true },
          { id: 's25', setNumber: 2, type: 'normal', weight: 130, reps: 8, completed: true },
          { id: 's26', setNumber: 3, type: 'normal', weight: 140, reps: 6, completed: true },
          { id: 's27', setNumber: 4, type: 'normal', weight: 142.5, reps: 6, completed: true, isPr: true }
        ]
      },
      {
        id: 'we-9',
        exerciseId: 'romanian-deadlift',
        exerciseName: 'Romanian Deadlift (RDL)',
        sets: [
          { id: 's28', setNumber: 1, type: 'normal', weight: 110, reps: 10, completed: true },
          { id: 's29', setNumber: 2, type: 'normal', weight: 120, reps: 8, completed: true },
          { id: 's30', setNumber: 3, type: 'normal', weight: 120, reps: 8, completed: true }
        ]
      },
      {
        id: 'we-10',
        exerciseId: 'standing-calf-raise',
        exerciseName: 'Standing Calf Raise',
        sets: [
          { id: 's31', setNumber: 1, type: 'normal', weight: 85, reps: 15, completed: true },
          { id: 's32', setNumber: 2, type: 'normal', weight: 85, reps: 15, completed: true },
          { id: 's33', setNumber: 3, type: 'normal', weight: 90, reps: 14, completed: true }
        ]
      }
    ]
  },
  {
    id: 'session-4',
    title: 'Upper Body Hypertrophy',
    routineId: 'routine-upper-hypertrophy',
    routineName: 'Upper Hypertrophy',
    startTime: `${getPastDate(6)}T16:00:00.000Z`,
    endTime: `${getPastDate(6)}T17:05:00.000Z`,
    durationSeconds: 3900,
    totalVolume: 7900,
    isCompleted: true,
    prsAchieved: ['Overhead Barbell Press 65 kg x 6'],
    exercises: [
      {
        id: 'we-11',
        exerciseId: 'overhead-barbell-press',
        exerciseName: 'Overhead Barbell Press (OHP)',
        sets: [
          { id: 's34', setNumber: 1, type: 'normal', weight: 55, reps: 8, completed: true },
          { id: 's35', setNumber: 2, type: 'normal', weight: 60, reps: 7, completed: true },
          { id: 's36', setNumber: 3, type: 'normal', weight: 65, reps: 6, completed: true, isPr: true }
        ]
      },
      {
        id: 'we-12',
        exerciseId: 'pull-up',
        exerciseName: 'Pull-Up',
        sets: [
          { id: 's37', setNumber: 1, type: 'normal', weight: 0, reps: 12, completed: true },
          { id: 's38', setNumber: 2, type: 'normal', weight: 0, reps: 10, completed: true },
          { id: 's39', setNumber: 3, type: 'normal', weight: 0, reps: 8, completed: true }
        ]
      }
    ]
  },
  // Additional past sessions for heatmap frequency
  {
    id: 'session-5',
    title: 'Push A (Chest & Delts Focus)',
    routineId: 'routine-push-a',
    routineName: 'Push A',
    startTime: `${getPastDate(8)}T09:30:00.000Z`,
    durationSeconds: 3800,
    totalVolume: 8100,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-6',
    title: 'Pull A (Lats & Biceps Focus)',
    routineId: 'routine-pull-a',
    routineName: 'Pull A',
    startTime: `${getPastDate(10)}T18:00:00.000Z`,
    durationSeconds: 4100,
    totalVolume: 9800,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-7',
    title: 'Legs A (Quads & Calves Focus)',
    routineId: 'routine-legs-a',
    routineName: 'Legs A',
    startTime: `${getPastDate(12)}T10:15:00.000Z`,
    durationSeconds: 4300,
    totalVolume: 11500,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-8',
    title: 'Upper Body Hypertrophy',
    routineId: 'routine-upper-hypertrophy',
    startTime: `${getPastDate(14)}T15:30:00.000Z`,
    durationSeconds: 3700,
    totalVolume: 7400,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-9',
    title: 'Push A (Chest & Delts Focus)',
    routineId: 'routine-push-a',
    startTime: `${getPastDate(15)}T08:45:00.000Z`,
    durationSeconds: 4000,
    totalVolume: 8000,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-10',
    title: 'Pull A (Lats & Biceps Focus)',
    routineId: 'routine-pull-a',
    startTime: `${getPastDate(17)}T17:45:00.000Z`,
    durationSeconds: 4150,
    totalVolume: 9500,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-11',
    title: 'Legs A (Quads & Calves Focus)',
    routineId: 'routine-legs-a',
    startTime: `${getPastDate(19)}T11:00:00.000Z`,
    durationSeconds: 4400,
    totalVolume: 11200,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-12',
    title: 'Upper Body Hypertrophy',
    routineId: 'routine-upper-hypertrophy',
    startTime: `${getPastDate(21)}T16:30:00.000Z`,
    durationSeconds: 3800,
    totalVolume: 7200,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-13',
    title: 'Push A (Chest & Delts Focus)',
    routineId: 'routine-push-a',
    startTime: `${getPastDate(22)}T09:00:00.000Z`,
    durationSeconds: 3950,
    totalVolume: 7800,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-14',
    title: 'Pull A (Lats & Biceps Focus)',
    routineId: 'routine-pull-a',
    startTime: `${getPastDate(24)}T18:15:00.000Z`,
    durationSeconds: 4050,
    totalVolume: 9200,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-15',
    title: 'Legs A (Quads & Calves Focus)',
    routineId: 'routine-legs-a',
    startTime: `${getPastDate(26)}T10:30:00.000Z`,
    durationSeconds: 4200,
    totalVolume: 10900,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-16',
    title: 'Upper Body Hypertrophy',
    routineId: 'routine-upper-hypertrophy',
    startTime: `${getPastDate(28)}T15:00:00.000Z`,
    durationSeconds: 3600,
    totalVolume: 7100,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-17',
    title: 'Push A (Chest & Delts Focus)',
    routineId: 'routine-push-a',
    startTime: `${getPastDate(29)}T09:15:00.000Z`,
    durationSeconds: 3900,
    totalVolume: 7600,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-18',
    title: 'Pull A (Lats & Biceps Focus)',
    routineId: 'routine-pull-a',
    startTime: `${getPastDate(31)}T17:30:00.000Z`,
    durationSeconds: 4000,
    totalVolume: 8900,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-19',
    title: 'Legs A (Quads & Calves Focus)',
    routineId: 'routine-legs-a',
    startTime: `${getPastDate(33)}T10:00:00.000Z`,
    durationSeconds: 4100,
    totalVolume: 10500,
    isCompleted: true,
    exercises: []
  },
  {
    id: 'session-20',
    title: 'Upper Body Hypertrophy',
    routineId: 'routine-upper-hypertrophy',
    startTime: `${getPastDate(35)}T16:00:00.000Z`,
    durationSeconds: 3500,
    totalVolume: 6900,
    isCompleted: true,
    exercises: []
  }
];

export const INITIAL_PRS: PersonalRecord[] = [
  {
    exerciseId: 'barbell-bench-press',
    exerciseName: 'Barbell Bench Press',
    maxWeight: 102.5,
    maxRepsAtMaxWeight: 6,
    estimatedOneRepMax: 123.0,
    date: getPastDate(1)
  },
  {
    exerciseId: 'barbell-deadlift',
    exerciseName: 'Conventional Barbell Deadlift',
    maxWeight: 175.0,
    maxRepsAtMaxWeight: 5,
    estimatedOneRepMax: 204.0,
    date: getPastDate(3)
  },
  {
    exerciseId: 'barbell-back-squat',
    exerciseName: 'Barbell Back Squat',
    maxWeight: 142.5,
    maxRepsAtMaxWeight: 6,
    estimatedOneRepMax: 171.0,
    date: getPastDate(5)
  },
  {
    exerciseId: 'overhead-barbell-press',
    exerciseName: 'Overhead Barbell Press',
    maxWeight: 65.0,
    maxRepsAtMaxWeight: 6,
    estimatedOneRepMax: 78.0,
    date: getPastDate(6)
  },
  {
    exerciseId: 'incline-dumbbell-press',
    exerciseName: 'Incline Dumbbell Press',
    maxWeight: 36.0,
    maxRepsAtMaxWeight: 8,
    estimatedOneRepMax: 45.6,
    date: getPastDate(1)
  }
];

// Generate 45 realistic days of body weight showing a steady cut from 83.8 kg to 79.4 kg
export const INITIAL_WEIGHT_LOGS: BodyWeightEntry[] = Array.from({ length: 40 }, (_, idx) => {
  const daysAgo = 39 - idx;
  const progressRatio = idx / 39;
  const baseWeight = 83.5 - progressRatio * 4.1; // Drops to ~79.4 kg
  const noise = (Math.sin(idx * 1.5) * 0.35);
  const roundedWeight = Math.round((baseWeight + noise) * 10) / 10;
  const bodyFat = Math.round((19.5 - progressRatio * 3.8 + (Math.cos(idx) * 0.2)) * 10) / 10;

  return {
    id: `bw-${idx}`,
    date: getPastDate(daysAgo),
    weight: roundedWeight,
    bodyFatPercentage: bodyFat,
    notes: idx % 7 === 0 ? 'Morning weigh-in after rest day' : undefined
  };
});

export const INITIAL_MEASUREMENTS: BodyMeasurementEntry[] = [
  {
    id: 'bm-1',
    date: getPastDate(35),
    chest: 104,
    waist: 86.5,
    arms: 37.5,
    thighs: 60.5,
    hips: 99,
    calves: 38,
    shoulders: 122,
    neck: 39
  },
  {
    id: 'bm-2',
    date: getPastDate(21),
    chest: 103.5,
    waist: 84.8,
    arms: 37.8,
    thighs: 60.0,
    hips: 98,
    calves: 38,
    shoulders: 122.5,
    neck: 38.5
  },
  {
    id: 'bm-3',
    date: getPastDate(7),
    chest: 103.0,
    waist: 83.2,
    arms: 38.0,
    thighs: 59.5,
    hips: 97,
    calves: 38.2,
    shoulders: 123.0,
    neck: 38.2
  }
];

export const INITIAL_NUTRITION_LOGS: DailyNutritionLog[] = [
  {
    id: 'nutri-today',
    date: getPastDate(0), // Today
    waterIntakeMl: 2250,
    meals: [
      {
        id: 'm-1',
        foodId: 'rolled-oats',
        name: 'Old Fashioned Rolled Oats',
        servingSize: '50g (dry)',
        servings: 1.5,
        calories: 285,
        protein: 9.8,
        carbs: 51,
        fat: 4.5,
        fiber: 7.5,
        mealType: 'breakfast',
        loggedAt: '08:15'
      },
      {
        id: 'm-2',
        foodId: 'whey-protein-isolate',
        name: 'Whey Protein Isolate 100%',
        servingSize: '1 scoop (30g)',
        servings: 1.0,
        calories: 120,
        protein: 25,
        carbs: 2,
        fat: 1,
        fiber: 0,
        mealType: 'breakfast',
        loggedAt: '08:20'
      },
      {
        id: 'm-3',
        foodId: 'blueberries',
        name: 'Fresh Blueberries',
        servingSize: '100g (1 cup)',
        servings: 1.0,
        calories: 57,
        protein: 0.7,
        carbs: 14.5,
        fat: 0.3,
        fiber: 2.4,
        mealType: 'breakfast',
        loggedAt: '08:20'
      },
      {
        id: 'm-4',
        foodId: 'chicken-breast-cooked',
        name: 'Grilled Chicken Breast',
        servingSize: '100g (cooked)',
        servings: 2.0,
        calories: 330,
        protein: 62,
        carbs: 0,
        fat: 7.2,
        fiber: 0,
        mealType: 'lunch',
        loggedAt: '12:45'
      },
      {
        id: 'm-5',
        foodId: 'white-jasmine-rice',
        name: 'Cooked Jasmine White Rice',
        servingSize: '150g (1 cup cooked)',
        servings: 1.5,
        calories: 292,
        protein: 6.2,
        carbs: 64.5,
        fat: 0.8,
        fiber: 0.9,
        mealType: 'lunch',
        loggedAt: '12:45'
      },
      {
        id: 'm-6',
        foodId: 'steamed-broccoli',
        name: 'Steamed Broccoli Florets',
        servingSize: '100g',
        servings: 1.5,
        calories: 52,
        protein: 4.2,
        carbs: 10.8,
        fat: 0.6,
        fiber: 5.0,
        mealType: 'lunch',
        loggedAt: '12:45'
      },
      {
        id: 'm-7',
        foodId: 'banana',
        name: 'Fresh Banana',
        servingSize: '1 medium (118g)',
        servings: 1.0,
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.3,
        fiber: 3.1,
        mealType: 'snack',
        loggedAt: '16:00'
      },
      {
        id: 'm-8',
        foodId: 'natural-peanut-butter',
        name: 'All Natural Peanut Butter',
        servingSize: '2 tbsp (32g)',
        servings: 1.0,
        calories: 190,
        protein: 8,
        carbs: 7,
        fat: 16,
        fiber: 2,
        mealType: 'snack',
        loggedAt: '16:00'
      }
    ]
  },
  {
    id: 'nutri-yesterday',
    date: getPastDate(1),
    waterIntakeMl: 3100,
    meals: [
      {
        id: 'm-prev-1',
        name: 'Greek Yogurt & Berries Bowl',
        servingSize: '1 bowl',
        servings: 1,
        calories: 260,
        protein: 26,
        carbs: 28,
        fat: 4,
        fiber: 4,
        mealType: 'breakfast',
        loggedAt: '08:30'
      },
      {
        id: 'm-prev-2',
        name: 'Atlantic Salmon & Sweet Potato',
        servingSize: '1 plate',
        servings: 1,
        calories: 540,
        protein: 44,
        carbs: 48,
        fat: 18,
        fiber: 6,
        mealType: 'lunch',
        loggedAt: '13:00'
      },
      {
        id: 'm-prev-3',
        name: 'Lean Beef Stir Fry & Rice',
        servingSize: '1 plate',
        servings: 1,
        calories: 680,
        protein: 52,
        carbs: 72,
        fat: 20,
        fiber: 5,
        mealType: 'dinner',
        loggedAt: '19:30'
      },
      {
        id: 'm-prev-4',
        name: 'Whey Protein Shake & Almonds',
        servingSize: '1 serving',
        servings: 1,
        calories: 280,
        protein: 31,
        carbs: 8,
        fat: 15,
        fiber: 3.5,
        mealType: 'snack',
        loggedAt: '21:30'
      }
    ]
  }
];

