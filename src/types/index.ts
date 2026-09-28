export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'cardio';

export type EquipmentCategory =
  | 'Barbell'
  | 'Dumbbell'
  | 'Machine'
  | 'Cable'
  | 'Bodyweight'
  | 'Kettlebell'
  | 'Smith Machine'
  | 'Cardio';

export interface Exercise {
  id: string;
  name: string;
  category: EquipmentCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  instructions: string[];
  tips: string[];
  isCardio?: boolean;
}

export type SetType = 'normal' | 'warmup' | 'dropset' | 'failure';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  type: SetType;
  weight: number; // in current active unit (kg or lbs)
  reps: number;
  rpe?: number; // 6-10
  completed: boolean;
  previousWeight?: number;
  previousReps?: number;
  isPr?: boolean;
  // Cardio specific fields
  distanceKm?: number;
  durationMinutes?: number;
  speedKmh?: number;
  calories?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  notes?: string;
  sets: WorkoutSet[];
  supersetId?: string; // e.g. 'A', 'B'
}

export interface WorkoutSession {
  id: string;
  title: string;
  routineId?: string;
  routineName?: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  durationSeconds: number;
  exercises: WorkoutExercise[];
  notes?: string;
  totalVolume: number; // kg or lbs based on user unit
  isCompleted: boolean;
  prsAchieved?: string[];
}

export interface RoutineExerciseConfig {
  exerciseId: string;
  targetSets: number;
  targetReps: string; // e.g. "8-12"
  targetWeight?: number;
  targetRpe?: number;
  supersetId?: string;
}

export interface Routine {
  id: string;
  name: string;
  dayOfWeek?: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat, or undefined
  targetMuscles: MuscleGroup[];
  exercises: RoutineExerciseConfig[];
  notes?: string;
}

export interface BodyWeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  bodyFatPercentage?: number;
  notes?: string;
}

export interface BodyMeasurementEntry {
  id: string;
  date: string; // YYYY-MM-DD
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
  hips?: number;
  calves?: number;
  shoulders?: number;
  neck?: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  unit: 'metric' | 'imperial'; // metric = kg, imperial = lbs
  targetWeight: number;
  startingWeight: number;
  weightGoalType: 'cut' | 'bulk' | 'maintain';
  theme: 'dark' | 'amoled' | 'light';
  accentColor: 'blue' | 'cyan' | 'violet' | 'amber' | 'crimson';
  defaultRestTime: number; // seconds
  autoStartRestTimer: boolean;
  soundAlerts: boolean;
  vibrationAlerts: boolean;
  keepScreenAwake: boolean;
  // Nutrition Targets
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
  dailyWaterTargetMl: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  category?: 'Protein' | 'Carbs' | 'Fats' | 'Dairy' | 'Fruits' | 'Vegetables' | 'Snacks' | 'Supplements';
}

export interface LoggedMealItem {
  id: string;
  foodId?: string;
  name: string;
  servingSize: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  mealType: MealType;
  loggedAt: string; // ISO or time string
}

export interface RecentFoodItem {
  id: string;
  foodId?: string;
  name: string;
  servingSize: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  lastMealType: MealType;
  loggedAtTime?: string;
}

export interface DailyNutritionLog {
  id: string;
  date: string; // YYYY-MM-DD
  meals: LoggedMealItem[];
  waterIntakeMl: number;
}

export interface MuscleFatigue {
  muscle: MuscleGroup;
  fatiguePercent: number; // 0 = fully recovered, 100 = completely fatigued
  lastTrainedDaysAgo: number | null;
  setsLast7Days: number;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxRepsAtMaxWeight: number;
  estimatedOneRepMax: number;
  date: string;
}
