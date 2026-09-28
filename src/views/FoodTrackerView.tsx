import React, { useMemo, useState } from 'react';
import {
  Apple,
  Barcode,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Droplets,
  Flame,
  History,
  Minus,
  PieChart as PieIcon,
  Plus,
  RotateCcw,
  Salad,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Utensils,
  X
} from 'lucide-react';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { useWorkout } from '../context/WorkoutContext';
import { BarcodeProduct } from '../data/barcodeCatalog';
import { COMMON_FOOD_LIBRARY } from '../data/foodLibrary';
import { FoodItem, MealType, RecentFoodItem } from '../types';

const RECENT_FOODS_STORAGE_KEY = 'athletech_recent_foods_v1';

const DEFAULT_RECENT_FOODS: RecentFoodItem[] = [
  {
    id: 'recent-1',
    foodId: 'chicken-breast',
    name: 'Chicken Breast (Cooked)',
    servingSize: '150g',
    servings: 1,
    calories: 248,
    protein: 46.5,
    carbs: 0,
    fat: 5.4,
    lastMealType: 'lunch',
    loggedAtTime: '12:30'
  },
  {
    id: 'recent-2',
    foodId: 'rolled-oats',
    name: 'Rolled Oats (Dry)',
    servingSize: '80g',
    servings: 1,
    calories: 303,
    protein: 10.4,
    carbs: 53.6,
    fat: 5.2,
    fiber: 8.2,
    lastMealType: 'breakfast',
    loggedAtTime: '08:00'
  },
  {
    id: 'recent-3',
    foodId: 'atlantic-salmon',
    name: 'Atlantic Salmon Fillet',
    servingSize: '180g',
    servings: 1,
    calories: 374,
    protein: 39.6,
    carbs: 0,
    fat: 23.4,
    lastMealType: 'dinner',
    loggedAtTime: '19:00'
  },
  {
    id: 'recent-4',
    foodId: 'banana',
    name: 'Fresh Banana',
    servingSize: '1 medium (118g)',
    servings: 1,
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.3,
    fiber: 3.1,
    lastMealType: 'snack',
    loggedAtTime: '16:00'
  },
  {
    id: 'recent-5',
    foodId: 'natural-peanut-butter',
    name: 'All Natural Peanut Butter',
    servingSize: '2 tbsp (32g)',
    servings: 1,
    calories: 190,
    protein: 8,
    carbs: 7,
    fat: 16,
    fiber: 2,
    lastMealType: 'snack',
    loggedAtTime: '16:00'
  }
];

export const FoodTrackerView: React.FC = () => {
  const {
    profile,
    getDailyNutrition,
    logMealItem,
    removeMealItem,
    updateWaterIntake,
    updateMealItemServings
  } = useWorkout();

  // Selected date state (defaults to today 2026-09-27)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(2026, 8, 27).toISOString().split('T')[0]
  );

  // Barcode Scanner Modal state
  const [showBarcodeScanner, setShowBarcodeScanner] = useState<boolean>(false);
  const [barcodeTargetMeal, setBarcodeTargetMeal] = useState<MealType>('lunch');

  // Recent Foods Store (stores and displays the last 5 items added)
  const [recentFoods, setRecentFoods] = useState<RecentFoodItem[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_FOODS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5);
        }
      }
    } catch (err) {
      console.error('Error loading recent foods from storage:', err);
    }
    return DEFAULT_RECENT_FOODS;
  });

  // Target meal selection overrides per recent item card
  const [cardMealSelection, setCardMealSelection] = useState<Record<string, MealType>>({});

  // Quick re-log modal for customizing portion / meal type
  const [customizingRecentItem, setCustomizingRecentItem] = useState<RecentFoodItem | null>(null);
  const [customizeServings, setCustomizeServings] = useState<string>('1.0');
  const [customizeMealType, setCustomizeMealType] = useState<MealType>('lunch');

  // Visual feedback indicators for quick re-logging
  const [recentlyLoggedId, setRecentlyLoggedId] = useState<string | null>(null);
  const [relogToast, setRelogToast] = useState<{ message: string; visible: boolean } | null>(null);

  // Add food modal state
  const [activeAddMealType, setActiveAddMealType] = useState<MealType | null>(null);
  const [foodSearch, setFoodSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingsInput, setServingsInput] = useState<string>('1.0');

  // Modal subtab ('library' | 'recent' | 'custom')
  const [modalTab, setModalTab] = useState<'library' | 'recent' | 'custom'>('library');
  const [customName, setCustomName] = useState('');
  const [customServing, setCustomServing] = useState('1 serving');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  // Daily log for selected date
  const dailyLog = useMemo(() => {
    return getDailyNutrition(selectedDate);
  }, [getDailyNutrition, selectedDate]);

  // Aggregate daily totals
  const totals = useMemo(() => {
    return dailyLog.meals.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        acc.fiber += item.fiber || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [dailyLog.meals]);

  const caloriesRemaining = Math.max(0, profile.dailyCalorieTarget - totals.calories);
  const proteinRemaining = Math.max(0, profile.dailyProteinTarget - Math.round(totals.protein));

  // Date navigation handlers
  const handleShiftDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Group meals by mealType
  const mealsByType: Record<MealType, typeof dailyLog.meals> = {
    breakfast: dailyLog.meals.filter((m) => m.mealType === 'breakfast'),
    lunch: dailyLog.meals.filter((m) => m.mealType === 'lunch'),
    dinner: dailyLog.meals.filter((m) => m.mealType === 'dinner'),
    snack: dailyLog.meals.filter((m) => m.mealType === 'snack')
  };

  // Food library filtered
  const filteredFoods = useMemo(() => {
    return COMMON_FOOD_LIBRARY.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(foodSearch.toLowerCase()));
      const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [foodSearch, categoryFilter]);

  const foodCategories = [
    'All',
    'Protein',
    'Carbs',
    'Fats',
    'Dairy',
    'Fruits',
    'Vegetables',
    'Supplements'
  ];

  // Helper to push an item to the Recent Items store (maintaining last 5 items added)
  const pushToRecent = (item: {
    foodId?: string;
    name: string;
    servingSize: string;
    servings?: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    lastMealType: MealType;
  }) => {
    setRecentFoods((prev) => {
      // Remove any previous entry with matching name (case-insensitive) to prevent clutter and keep most recent
      const filtered = prev.filter(
        (p) => p.name.trim().toLowerCase() !== item.name.trim().toLowerCase()
      );
      const nowTime = new Date().toTimeString().slice(0, 5);
      const newItem: RecentFoodItem = {
        id: `recent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        foodId: item.foodId,
        name: item.name,
        servingSize: item.servingSize,
        servings: item.servings || 1,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.fiber,
        lastMealType: item.lastMealType,
        loggedAtTime: nowTime
      };
      const updated = [newItem, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_FOODS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore storage errors
      }
      return updated;
    });
  };

  // Helper to remove an item from the Recent store
  const removeRecentItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecentFoods((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(RECENT_FOODS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        // ignore
      }
      return updated;
    });
  };

  // Helper to re-log a recent item with optional meal override and serving multiplier
  const handleQuickReLog = (item: RecentFoodItem, targetMeal?: MealType, multiplier = 1) => {
    const meal = targetMeal || cardMealSelection[item.id] || item.lastMealType || 'lunch';
    const baseServings = item.servings || 1;
    const finalServings = Math.round(baseServings * multiplier * 100) / 100;
    const ratio = multiplier;

    const cals = Math.round(item.calories * ratio);
    const p = Math.round(item.protein * ratio * 10) / 10;
    const c = Math.round(item.carbs * ratio * 10) / 10;
    const f = Math.round(item.fat * ratio * 10) / 10;
    const fib = item.fiber !== undefined ? Math.round(item.fiber * ratio * 10) / 10 : undefined;

    logMealItem(selectedDate, {
      foodId: item.foodId,
      name: item.name,
      servingSize: item.servingSize,
      servings: finalServings,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      mealType: meal
    });

    pushToRecent({
      foodId: item.foodId,
      name: item.name,
      servingSize: item.servingSize,
      servings: finalServings,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      lastMealType: meal
    });

    setRecentlyLoggedId(item.id);
    setRelogToast({
      message: `Re-logged "${item.name}" to ${meal.toUpperCase()} (+${cals} kcal)`,
      visible: true
    });

    setTimeout(() => {
      setRecentlyLoggedId((cur) => (cur === item.id ? null : cur));
    }, 1800);

    setTimeout(() => {
      setRelogToast(null);
    }, 3000);
  };

  const handleAddSelectedFood = () => {
    if (!selectedFood || !activeAddMealType) return;
    const servings = parseFloat(servingsInput) || 1.0;
    const cals = Math.round(selectedFood.calories * servings);
    const p = Math.round(selectedFood.protein * servings * 10) / 10;
    const c = Math.round(selectedFood.carbs * servings * 10) / 10;
    const f = Math.round(selectedFood.fat * servings * 10) / 10;
    const fib = selectedFood.fiber ? Math.round(selectedFood.fiber * servings * 10) / 10 : undefined;

    logMealItem(selectedDate, {
      foodId: selectedFood.id,
      name: selectedFood.name,
      servingSize: selectedFood.servingSize,
      servings,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      mealType: activeAddMealType
    });

    pushToRecent({
      foodId: selectedFood.id,
      name: selectedFood.name,
      servingSize: selectedFood.servingSize,
      servings,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      lastMealType: activeAddMealType
    });

    closeAddModal();
  };

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !activeAddMealType) return;

    const cals = parseInt(customCalories) || 0;
    const p = parseFloat(customProtein) || 0;
    const c = parseFloat(customCarbs) || 0;
    const f = parseFloat(customFat) || 0;

    logMealItem(selectedDate, {
      name: customName.trim(),
      servingSize: customServing.trim() || '1 serving',
      servings: 1,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      mealType: activeAddMealType
    });

    pushToRecent({
      name: customName.trim(),
      servingSize: customServing.trim() || '1 serving',
      servings: 1,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      lastMealType: activeAddMealType
    });

    closeAddModal();
  };

  const handleBarcodeProductScanned = (
    mealType: MealType,
    product: BarcodeProduct,
    servingsAmount: number
  ) => {
    const cals = Math.round(product.calories * servingsAmount);
    const p = Math.round(product.protein * servingsAmount * 10) / 10;
    const c = Math.round(product.carbs * servingsAmount * 10) / 10;
    const f = Math.round(product.fat * servingsAmount * 10) / 10;
    const fib = product.fiber ? Math.round(product.fiber * servingsAmount * 10) / 10 : undefined;

    logMealItem(selectedDate, {
      foodId: `barcode-${product.barcode}`,
      name: product.name,
      servingSize: product.servingSize,
      servings: servingsAmount,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      mealType
    });

    pushToRecent({
      foodId: `barcode-${product.barcode}`,
      name: product.name,
      servingSize: product.servingSize,
      servings: servingsAmount,
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      lastMealType: mealType
    });
  };

  const closeAddModal = () => {
    setActiveAddMealType(null);
    setSelectedFood(null);
    setServingsInput('1.0');
    setFoodSearch('');
    setModalTab('library');
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
  };

  // Macro calorie ratios for distribution bar
  const totalMacroCals = totals.protein * 4 + totals.carbs * 4 + totals.fat * 9 || 1;
  const pPct = Math.round(((totals.protein * 4) / totalMacroCals) * 100);
  const cPct = Math.round(((totals.carbs * 4) / totalMacroCals) * 100);
  const fPct = Math.max(0, 100 - pPct - cPct);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header & Date Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-100 flex items-center gap-2">
            <span>AthleTech Nutrition & Macro Tracker</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Log meals, hit your daily macronutrient targets, and scan barcodes with your camera.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Scan Barcode Header CTA */}
          <button
            type="button"
            onClick={() => {
              setBarcodeTargetMeal('lunch');
              setShowBarcodeScanner(true);
            }}
            className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-blue-950/50"
          >
            <Barcode className="w-4 h-4" />
            <span>Scan Barcode</span>
          </button>

          {/* Date Navigator Bar */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => handleShiftDate(-1)}
              className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 py-1 flex items-center gap-2 text-xs font-mono font-semibold text-neutral-200">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{selectedDate}</span>
              {selectedDate === new Date(2026, 8, 27).toISOString().split('T')[0] && (
                <span className="text-[10px] text-blue-400 font-sans font-bold bg-blue-950 border border-blue-800/80 px-1 rounded">
                  TODAY
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleShiftDate(1)}
              className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Macro Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Calories Card */}
        <div className="lg:col-span-5 p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-neutral-400 font-semibold flex items-center gap-1.5 mb-1">
                <Flame className="w-4 h-4 text-blue-400" />
                <span>Calorie Budget</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-neutral-100">
                  {totals.calories.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  / {profile.dailyCalorieTarget.toLocaleString()} kcal
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-neutral-500 block">Remaining</span>
              <span className="text-lg font-bold font-mono text-blue-400">
                {caloriesRemaining.toLocaleString()} kcal
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_8px_#3b82f6]"
                style={{
                  width: `${Math.min(100, Math.round((totals.calories / profile.dailyCalorieTarget) * 100))}%`
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>0 kcal</span>
              <span>{Math.round((totals.calories / profile.dailyCalorieTarget) * 100)}% consumed</span>
              <span>{profile.dailyCalorieTarget} kcal</span>
            </div>
          </div>

          {/* Macro Calorie Distribution Ratio */}
          <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Macro Calorie Split</span>
              <span className="font-mono text-neutral-300">
                P: {pPct}% · C: {cPct}% · F: {fPct}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-neutral-800">
              <div style={{ width: `${pPct}%` }} className="bg-blue-500" title="Protein" />
              <div style={{ width: `${cPct}%` }} className="bg-sky-400" title="Carbs" />
              <div style={{ width: `${fPct}%` }} className="bg-amber-500" title="Fat" />
            </div>
          </div>
        </div>

        {/* Macros Breakdown: Protein, Carbs, Fats */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Protein */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-blue-400">Protein</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {Math.round((totals.protein / profile.dailyProteinTarget) * 100)}%
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-neutral-100">
                {Math.round(totals.protein)}g
                <span className="text-xs font-normal text-neutral-500">
                  {' '}/ {profile.dailyProteinTarget}g
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 shadow-[0_0_6px_#3b82f6]"
                  style={{
                    width: `${Math.min(100, Math.round((totals.protein / profile.dailyProteinTarget) * 100))}%`
                  }}
                />
              </div>
              <div className="text-[10px] text-neutral-500 font-mono text-right">
                {proteinRemaining > 0 ? `${proteinRemaining}g left` : 'Target hit!'}
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-sky-300">Carbs</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {Math.round((totals.carbs / profile.dailyCarbsTarget) * 100)}%
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-neutral-100">
                {Math.round(totals.carbs)}g
                <span className="text-xs font-normal text-neutral-500">
                  {' '}/ {profile.dailyCarbsTarget}g
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((totals.carbs / profile.dailyCarbsTarget) * 100))}%`
                  }}
                />
              </div>
              <div className="text-[10px] text-neutral-500 font-mono text-right">
                Fiber: {Math.round(totals.fiber)}g
              </div>
            </div>
          </div>

          {/* Fat */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-amber-400">Fats</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {Math.round((totals.fat / profile.dailyFatTarget) * 100)}%
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-neutral-100">
                {Math.round(totals.fat)}g
                <span className="text-xs font-normal text-neutral-500">
                  {' '}/ {profile.dailyFatTarget}g
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((totals.fat / profile.dailyFatTarget) * 100))}%`
                  }}
                />
              </div>
              <div className="text-[10px] text-neutral-500 font-mono text-right">
                {Math.max(0, profile.dailyFatTarget - Math.round(totals.fat))}g left
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration / Water Intake Tracker Card */}
      <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-200">Hydration Tracker</div>
            <div className="text-sm font-bold font-mono text-neutral-100">
              {dailyLog.waterIntakeMl}{' '}
              <span className="text-xs font-normal text-neutral-500">
                / {profile.dailyWaterTargetMl} ml (
                {Math.round((dailyLog.waterIntakeMl / profile.dailyWaterTargetMl) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Water Log Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateWaterIntake(selectedDate, -250)}
            className="py-1 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors"
            title="Minus 250ml"
          >
            -250 ml
          </button>
          <button
            type="button"
            onClick={() => updateWaterIntake(selectedDate, 250)}
            className="py-1 px-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>250 ml (Glass)</span>
          </button>
          <button
            type="button"
            onClick={() => updateWaterIntake(selectedDate, 500)}
            className="py-1 px-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>500 ml (Bottle)</span>
          </button>
        </div>
      </div>

      {/* Recent Foods Section (Stores and displays the last 5 items added for quick re-logging) */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-100">Recent Foods</h3>
                <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800/60 px-2 py-0.5 rounded-full">
                  {recentFoods.length} / 5
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Last 5 items added — 1-click quick re-log with custom portions or target meals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {recentFoods.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setRecentFoods([]);
                  localStorage.removeItem(RECENT_FOODS_STORAGE_KEY);
                }}
                className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors px-2 py-1 rounded hover:bg-neutral-800"
                title="Clear recent items"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {recentFoods.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500 italic bg-neutral-950/40 rounded-xl border border-dashed border-neutral-800">
            No recent items yet. Foods you log from the library, barcode scanner, or custom entry will appear here for fast re-logging.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {recentFoods.map((item) => {
              const isJustLogged = recentlyLoggedId === item.id;
              const currentMeal = cardMealSelection[item.id] || item.lastMealType || 'lunch';

              return (
                <div
                  key={item.id}
                  className={`bg-neutral-900/90 border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
                    isJustLogged
                      ? 'border-blue-500 shadow-md shadow-blue-950/50 bg-blue-950/20'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Top Row: Last Logged Meal Badge & Remove Button */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="capitalize font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-800 text-blue-300 border border-neutral-700/80">
                        {item.lastMealType}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => removeRecentItem(item.id, e)}
                        className="p-1 text-neutral-500 hover:text-neutral-300 rounded hover:bg-neutral-800 transition-colors"
                        title="Remove from recent"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Food Name & Serving Size */}
                    <div>
                      <h4
                        className="text-xs font-bold text-neutral-100 truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {item.servingSize} {item.servings > 1 ? `(×${item.servings})` : ''}
                      </p>
                    </div>

                    {/* Macros Info */}
                    <div className="pt-2 border-t border-neutral-800/80 space-y-0.5">
                      <div className="text-xs font-mono font-bold text-neutral-100">
                        {item.calories} kcal
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5">
                        <span className="text-blue-400">{item.protein}g P</span>
                        <span>·</span>
                        <span className="text-sky-300">{item.carbs}g C</span>
                        <span>·</span>
                        <span className="text-amber-400">{item.fat}g F</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Target Meal Selector & 1-Click Re-Log */}
                  <div className="pt-3 mt-2 border-t border-neutral-800/80 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={currentMeal}
                        onChange={(e) =>
                          setCardMealSelection((prev) => ({
                            ...prev,
                            [item.id]: e.target.value as MealType
                          }))
                        }
                        className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-200 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 capitalize cursor-pointer font-medium"
                        title="Select target meal to log"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setCustomizingRecentItem(item);
                          setCustomizeServings(String(item.servings || 1));
                          setCustomizeMealType(currentMeal);
                        }}
                        className="p-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-blue-400 rounded-lg transition-colors border border-neutral-700"
                        title="Customize portion before logging"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickReLog(item, currentMeal)}
                      disabled={isJustLogged}
                      className={`w-full py-1.5 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        isJustLogged
                          ? 'bg-blue-600/30 border border-blue-500/60 text-blue-300 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-950/50'
                      }`}
                    >
                      {isJustLogged ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-blue-400" />
                          <span>Logged!</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>+ Re-Log</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Customize Re-Log Modal */}
      {customizingRecentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-100">Quick Re-Log</h3>
                <p className="text-xs text-neutral-400 truncate max-w-[220px]">
                  {customizingRecentItem.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomizingRecentItem(null)}
                className="p-1 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Target Meal
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((meal) => (
                    <button
                      key={meal}
                      type="button"
                      onClick={() => setCustomizeMealType(meal)}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-lg capitalize border transition-colors ${
                        customizeMealType === meal
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Servings ({customizingRecentItem.servingSize})
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {Math.round(customizingRecentItem.calories * (parseFloat(customizeServings) || 1))} kcal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="10"
                    value={customizeServings}
                    onChange={(e) => setCustomizeServings(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono text-center focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-1">
                    {['0.5', '1.0', '1.5', '2.0'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCustomizeServings(preset)}
                        className={`px-2 py-1 text-[11px] font-mono rounded-lg border transition-colors ${
                          customizeServings === preset
                            ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {preset}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nutrition preview with adjusted servings */}
              {(() => {
                const mult = parseFloat(customizeServings) || 1;
                return (
                  <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs flex justify-between font-mono">
                    <span className="text-blue-400">
                      {Math.round(customizingRecentItem.protein * mult * 10) / 10}g Protein
                    </span>
                    <span className="text-sky-300">
                      {Math.round(customizingRecentItem.carbs * mult * 10) / 10}g Carbs
                    </span>
                    <span className="text-amber-400">
                      {Math.round(customizingRecentItem.fat * mult * 10) / 10}g Fat
                    </span>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setCustomizingRecentItem(null)}
                className="py-1.5 px-3 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const mult = parseFloat(customizeServings) || 1;
                  handleQuickReLog(customizingRecentItem, customizeMealType, mult);
                  setCustomizingRecentItem(null);
                }}
                className="py-1.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-colors"
              >
                Confirm & Re-Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Re-Log Toast Notification */}
      {relogToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-blue-500/50 shadow-2xl shadow-blue-950/80 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-neutral-100 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="p-1 bg-blue-500/20 text-blue-400 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-semibold">{relogToast.message}</span>
        </div>
      )}

      {/* Meal Diary List */}
      <div className="space-y-4">
        {(
          [
            { type: 'breakfast', label: 'Breakfast', icon: Coffee },
            { type: 'lunch', label: 'Lunch', icon: Utensils },
            { type: 'dinner', label: 'Dinner', icon: Salad },
            { type: 'snack', label: 'Snacks & Supplements', icon: Apple }
          ] as const
        ).map(({ type, label, icon: MealIcon }) => {
          const items = mealsByType[type];
          const mealCalories = items.reduce((sum, item) => sum + item.calories, 0);
          const mealProtein = items.reduce((sum, item) => sum + item.protein, 0);

          return (
            <div
              key={type}
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden"
            >
              {/* Meal Section Header */}
              <div className="p-4 bg-neutral-900/90 border-b border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-neutral-800 rounded-lg text-blue-400">
                    <MealIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-100">{label}</h3>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      {mealCalories} kcal · {Math.round(mealProtein)}g protein
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBarcodeTargetMeal(type);
                      setShowBarcodeScanner(true);
                    }}
                    className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-750 text-blue-400 text-xs font-semibold rounded-xl border border-neutral-700/80 transition-colors flex items-center gap-1.5"
                    title={`Scan barcode for ${label}`}
                  >
                    <Barcode className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveAddMealType(type)}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Food</span>
                  </button>
                </div>
              </div>

              {/* Items in this meal */}
              {items.length === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500 italic">
                  No food logged for {label.toLowerCase()} yet.
                </div>
              ) : (
                <div className="divide-y divide-neutral-800/40">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-800/20 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-neutral-200">{item.name}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>
                            {item.servingSize} (×{item.servings})
                          </span>
                          <span>·</span>
                          <span className="font-mono text-blue-400">
                            {item.protein}g P
                          </span>
                          <span>·</span>
                          <span className="font-mono text-sky-300">
                            {item.carbs}g C
                          </span>
                          <span>·</span>
                          <span className="font-mono text-amber-400">
                            {item.fat}g F
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="font-mono text-xs font-bold text-neutral-100">
                          {item.calories} kcal
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMealItem(selectedDate, item.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barcode Scanner Modal Component */}
      {showBarcodeScanner && (
        <BarcodeScannerModal
          initialMealType={barcodeTargetMeal}
          onAddFood={handleBarcodeProductScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Add Food Modal */}
      {activeAddMealType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-100 capitalize">
                  Add to {activeAddMealType}
                </h3>
                <p className="text-xs text-neutral-400">
                  Search food database or scan packaging barcode
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBarcodeTargetMeal(activeAddMealType);
                    closeAddModal();
                    setShowBarcodeScanner(true);
                  }}
                  className="py-1 px-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Barcode className="w-3.5 h-3.5" />
                  <span>Scan</span>
                </button>

                <button
                  type="button"
                  onClick={closeAddModal}
                  className="p-1 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-tabs: Search Library vs Recent Items vs Custom Entry */}
            <div className="flex border-b border-neutral-800 p-2 gap-1.5 bg-neutral-950/50">
              <button
                type="button"
                onClick={() => setModalTab('library')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  modalTab === 'library'
                    ? 'bg-neutral-800 text-blue-400 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Food Library
              </button>
              <button
                type="button"
                onClick={() => setModalTab('recent')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  modalTab === 'recent'
                    ? 'bg-neutral-800 text-blue-400 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Recent ({recentFoods.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('custom')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  modalTab === 'custom'
                    ? 'bg-neutral-800 text-blue-400 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Custom Quick Entry
              </button>
            </div>

            {modalTab === 'recent' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                <div className="text-xs text-neutral-400 mb-1">
                  Quickly re-log one of your last 5 items to <span className="text-blue-400 font-semibold capitalize">{activeAddMealType}</span>:
                </div>
                {recentFoods.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-500 italic bg-neutral-950/40 rounded-xl border border-dashed border-neutral-800">
                    No recent items stored yet. Items you log will appear here for fast re-logging.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentFoods.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-100">{item.name}</span>
                            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded capitalize">
                              was {item.lastMealType}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                            <span>{item.servingSize} {item.servings > 1 ? `(×${item.servings})` : ''}</span>
                            <span>·</span>
                            <span className="font-mono text-blue-400">{item.protein}g P</span>
                            <span>·</span>
                            <span className="font-mono text-sky-300">{item.carbs}g C</span>
                            <span>·</span>
                            <span className="font-mono text-amber-400">{item.fat}g F</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-neutral-100">
                            {item.calories} kcal
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (activeAddMealType) {
                                handleQuickReLog(item, activeAddMealType);
                                closeAddModal();
                              }
                            }}
                            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {modalTab === 'library' && (
              /* Library Search Mode */
              <>
                <div className="p-4 border-b border-neutral-800 space-y-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                    <input
                      type="text"
                      value={foodSearch}
                      onChange={(e) => setFoodSearch(e.target.value)}
                      placeholder="Search food item (e.g. Chicken breast, Eggs, Rice, Oats)..."
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {foodCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                          categoryFilter === cat
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {filteredFoods.map((food) => {
                    const isSelected = selectedFood?.id === food.id;

                    return (
                      <div
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-neutral-800 border-blue-500 shadow-sm'
                            : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-neutral-200">{food.name}</div>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                            <span>{food.servingSize}</span>
                            <span>·</span>
                            <span className="font-mono text-blue-400">{food.protein}g P</span>
                            <span>·</span>
                            <span className="font-mono text-sky-300">{food.carbs}g C</span>
                            <span>·</span>
                            <span className="font-mono text-amber-400">{food.fat}g F</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-neutral-100">
                            {food.calories} kcal
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedFood && (
                  <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-neutral-300 font-semibold">Servings:</label>
                      <input
                        type="number"
                        step="0.25"
                        min="0.25"
                        value={servingsInput}
                        onChange={(e) => setServingsInput(e.target.value)}
                        className="w-16 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-100 font-mono text-center focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-xs text-neutral-500 font-mono">
                        = {Math.round(selectedFood.calories * (parseFloat(servingsInput) || 1))} kcal
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSelectedFood}
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                    >
                      Log Meal
                    </button>
                  </div>
                )}
              </>
            )}

            {modalTab === 'custom' && (
              /* Custom Food Form */
              <form onSubmit={handleAddCustomFood} className="p-5 space-y-3.5 flex-1 overflow-y-auto">
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Food / Meal Name *</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Homemade Chipotle Chicken Bowl"
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300">Serving Description</label>
                  <input
                    type="text"
                    value={customServing}
                    onChange={(e) => setCustomServing(e.target.value)}
                    placeholder="e.g. 1 bowl, 200g, 1 plate"
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div>
                    <label className="text-xs text-neutral-400">Calories (kcal) *</label>
                    <input
                      type="number"
                      required
                      value={customCalories}
                      onChange={(e) => setCustomCalories(e.target.value)}
                      placeholder="e.g. 550"
                      className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-blue-400 font-semibold">Protein (g)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={customProtein}
                      onChange={(e) => setCustomProtein(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-sky-300 font-semibold">Carbs (g)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={customCarbs}
                      onChange={(e) => setCustomCarbs(e.target.value)}
                      placeholder="e.g. 60"
                      className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-amber-400 font-semibold">Fat (g)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={customFat}
                      onChange={(e) => setCustomFat(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="py-1.5 px-3 text-xs text-neutral-400 bg-neutral-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
                  >
                    Save & Add Food
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
