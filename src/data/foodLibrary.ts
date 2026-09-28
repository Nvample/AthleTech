import { FoodItem } from '../types';

export const COMMON_FOOD_LIBRARY: FoodItem[] = [
  // PROTEINS
  {
    id: 'chicken-breast-raw',
    name: 'Boneless Skinless Chicken Breast',
    servingSize: '100g (raw)',
    calories: 120,
    protein: 26,
    carbs: 0,
    fat: 1.5,
    fiber: 0,
    category: 'Protein'
  },
  {
    id: 'chicken-breast-cooked',
    name: 'Grilled Chicken Breast',
    servingSize: '100g (cooked)',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    category: 'Protein'
  },
  {
    id: 'whole-eggs',
    name: 'Whole Large Egg',
    servingSize: '1 large (50g)',
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 4.8,
    fiber: 0,
    category: 'Protein'
  },
  {
    id: 'egg-whites',
    name: 'Liquid Egg Whites',
    servingSize: '100ml / 100g',
    calories: 52,
    protein: 11,
    carbs: 0.7,
    fat: 0.2,
    fiber: 0,
    category: 'Protein'
  },
  {
    id: 'lean-ground-beef-93-7',
    name: 'Lean Ground Beef 93/7',
    servingSize: '100g (raw)',
    calories: 152,
    protein: 21.5,
    carbs: 0,
    fat: 7.2,
    fiber: 0,
    category: 'Protein'
  },
  {
    id: 'atlantic-salmon',
    name: 'Atlantic Salmon Fillet',
    servingSize: '100g (raw)',
    calories: 208,
    protein: 20.4,
    carbs: 0,
    fat: 13.4,
    fiber: 0,
    category: 'Protein'
  },
  {
    id: 'canned-tuna-water',
    name: 'Canned Albacore Tuna in Water',
    servingSize: '1 can drained (120g)',
    calories: 130,
    protein: 29,
    carbs: 0,
    fat: 1,
    fiber: 0,
    category: 'Protein'
  },
  {
    id: 'whey-protein-isolate',
    name: 'Whey Protein Isolate 100%',
    brand: 'Standard Gold',
    servingSize: '1 scoop (30g)',
    calories: 120,
    protein: 25,
    carbs: 2,
    fat: 1,
    fiber: 0,
    category: 'Supplements'
  },
  {
    id: 'greek-yogurt-0-fat',
    name: 'Nonfat Plain Greek Yogurt',
    servingSize: '170g (3/4 cup)',
    calories: 100,
    protein: 18,
    carbs: 6,
    fat: 0.7,
    fiber: 0,
    category: 'Dairy'
  },
  {
    id: 'cottage-cheese-low-fat',
    name: 'Low-Fat Cottage Cheese 2%',
    servingSize: '113g (1/2 cup)',
    calories: 90,
    protein: 13,
    carbs: 5,
    fat: 2.5,
    fiber: 0,
    category: 'Dairy'
  },

  // CARBS & GRAINS
  {
    id: 'rolled-oats',
    name: 'Old Fashioned Rolled Oats',
    servingSize: '50g (dry)',
    calories: 190,
    protein: 6.5,
    carbs: 34,
    fat: 3,
    fiber: 5,
    category: 'Carbs'
  },
  {
    id: 'white-jasmine-rice',
    name: 'Cooked Jasmine White Rice',
    servingSize: '150g (1 cup cooked)',
    calories: 195,
    protein: 4.1,
    carbs: 43,
    fat: 0.5,
    fiber: 0.6,
    category: 'Carbs'
  },
  {
    id: 'brown-rice-cooked',
    name: 'Cooked Brown Rice',
    servingSize: '150g (1 cup cooked)',
    calories: 180,
    protein: 4.5,
    carbs: 38,
    fat: 1.5,
    fiber: 3.5,
    category: 'Carbs'
  },
  {
    id: 'sweet-potato-baked',
    name: 'Baked Sweet Potato with Skin',
    servingSize: '150g (1 medium)',
    calories: 135,
    protein: 3,
    carbs: 31,
    fat: 0.2,
    fiber: 4.5,
    category: 'Carbs'
  },
  {
    id: 'whole-wheat-bread',
    name: 'Whole Wheat Sourdough Bread',
    servingSize: '1 slice (45g)',
    calories: 110,
    protein: 4.5,
    carbs: 20,
    fat: 1.5,
    fiber: 3,
    category: 'Carbs'
  },
  {
    id: 'banana',
    name: 'Fresh Banana',
    servingSize: '1 medium (118g)',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.3,
    fiber: 3.1,
    category: 'Fruits'
  },
  {
    id: 'blueberries',
    name: 'Fresh Blueberries',
    servingSize: '100g (1 cup)',
    calories: 57,
    protein: 0.7,
    carbs: 14.5,
    fat: 0.3,
    fiber: 2.4,
    category: 'Fruits'
  },
  {
    id: 'pasta-penne-dry',
    name: 'Penne Pasta (durum wheat)',
    servingSize: '85g (dry)',
    calories: 300,
    protein: 11,
    carbs: 61,
    fat: 1.5,
    fiber: 3,
    category: 'Carbs'
  },

  // FATS & OILS
  {
    id: 'avocado',
    name: 'Hass Avocado',
    servingSize: '100g (1/2 avocado)',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    category: 'Fats'
  },
  {
    id: 'extra-virgin-olive-oil',
    name: 'Extra Virgin Olive Oil',
    servingSize: '1 tbsp (14g)',
    calories: 119,
    protein: 0,
    carbs: 0,
    fat: 13.5,
    fiber: 0,
    category: 'Fats'
  },
  {
    id: 'natural-peanut-butter',
    name: 'All Natural Peanut Butter',
    servingSize: '2 tbsp (32g)',
    calories: 190,
    protein: 8,
    carbs: 7,
    fat: 16,
    fiber: 2,
    category: 'Fats'
  },
  {
    id: 'raw-almonds',
    name: 'Whole Raw Almonds',
    servingSize: '28g (approx. 23 nuts)',
    calories: 164,
    protein: 6,
    carbs: 6.1,
    fat: 14.2,
    fiber: 3.5,
    category: 'Fats'
  },

  // VEGETABLES
  {
    id: 'steamed-broccoli',
    name: 'Steamed Broccoli Florets',
    servingSize: '100g',
    calories: 35,
    protein: 2.8,
    carbs: 7.2,
    fat: 0.4,
    fiber: 3.3,
    category: 'Vegetables'
  },
  {
    id: 'spinach-baby',
    name: 'Fresh Baby Spinach',
    servingSize: '100g',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    category: 'Vegetables'
  }
];
