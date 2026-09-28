import { FoodItem } from '../types';

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  category?: 'Protein' | 'Carbs' | 'Fats' | 'Dairy' | 'Fruits' | 'Vegetables' | 'Snacks' | 'Supplements';
}

// Built-in verified barcode registry of popular fitness staples
export const POPULAR_BARCODES: BarcodeProduct[] = [
  {
    barcode: '888849000010',
    name: 'Quest Protein Bar - Chocolate Chip Cookie Dough',
    brand: 'Quest Nutrition',
    servingSize: '1 bar (60g)',
    calories: 200,
    protein: 21,
    carbs: 22,
    fat: 9,
    fiber: 14,
    category: 'Protein'
  },
  {
    barcode: '074236500472',
    name: 'Gold Standard 100% Whey - Double Rich Chocolate',
    brand: 'Optimum Nutrition',
    servingSize: '1 scoop (30.4g)',
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1.5,
    fiber: 1,
    category: 'Supplements'
  },
  {
    barcode: '856312002758',
    name: 'Core Power Elite High Protein Milk Shake (Vanilla)',
    brand: 'Fairlife',
    servingSize: '1 bottle (414ml)',
    calories: 230,
    protein: 42,
    carbs: 8,
    fat: 3.5,
    fiber: 1,
    category: 'Dairy'
  },
  {
    barcode: '894700010045',
    name: 'Non-Fat Plain Greek Yogurt',
    brand: 'Chobani',
    servingSize: '170g (3/4 cup)',
    calories: 90,
    protein: 16,
    carbs: 6,
    fat: 0,
    fiber: 0,
    category: 'Dairy'
  },
  {
    barcode: '643843714023',
    name: 'Premier Protein High Protein Shake - Chocolate',
    brand: 'Premier Protein',
    servingSize: '1 carton (325ml)',
    calories: 160,
    protein: 30,
    carbs: 4,
    fat: 3,
    fiber: 1,
    category: 'Protein'
  },
  {
    barcode: '016000275283',
    name: 'Nature Valley Oats \'n Honey Crunchy Granola Bars',
    brand: 'General Mills',
    servingSize: '2 bars (42g)',
    calories: 190,
    protein: 3,
    carbs: 29,
    fat: 7,
    fiber: 2,
    category: 'Snacks'
  },
  {
    barcode: '051500255162',
    name: 'Jif Creamy Peanut Butter',
    brand: 'Jif',
    servingSize: '2 tbsp (33g)',
    calories: 190,
    protein: 7,
    carbs: 8,
    fat: 16,
    fiber: 2,
    category: 'Fats'
  },
  {
    barcode: '041570054368',
    name: 'Chunk Light Tuna in Water',
    brand: 'StarKist',
    servingSize: '1 pouch (74g)',
    calories: 70,
    protein: 17,
    carbs: 0,
    fat: 0.5,
    fiber: 0,
    category: 'Protein'
  },
  {
    barcode: '030000010204',
    name: 'Quaker Quick 1-Minute Oats',
    brand: 'Quaker',
    servingSize: '1/2 cup dry (40g)',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    category: 'Carbs'
  }
];

// Helper to look up barcode locally or via Open Food Facts API
export async function lookupBarcodeNutrition(barcode: string): Promise<BarcodeProduct | null> {
  const cleanCode = barcode.trim().replace(/\s+/g, '');
  if (!cleanCode) return null;

  // 1. Check local catalog
  const localMatch = POPULAR_BARCODES.find(
    (p) => p.barcode === cleanCode || p.barcode.endsWith(cleanCode) || cleanCode.endsWith(p.barcode)
  );
  if (localMatch) {
    return localMatch;
  }

  // 2. Query Open Food Facts API (Public free endpoint)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleanCode)}.json`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 1 && data.product) {
        const prod = data.product;
        const nutriments = prod.nutriments || {};

        // Serving size
        const serving = prod.serving_size || '100g';

        // Read calories per serving or per 100g
        let calories = Math.round(
          nutriments['energy-kcal_serving'] ??
          nutriments['energy-kcal_100g'] ??
          (nutriments['energy_100g'] ? nutriments['energy_100g'] / 4.184 : 100)
        );

        let protein = Math.round((nutriments['proteins_serving'] ?? nutriments['proteins_100g'] ?? 0) * 10) / 10;
        let carbs = Math.round((nutriments['carbohydrates_serving'] ?? nutriments['carbohydrates_100g'] ?? 0) * 10) / 10;
        let fat = Math.round((nutriments['fat_serving'] ?? nutriments['fat_100g'] ?? 0) * 10) / 10;
        let fiber = nutriments['fiber_serving'] ?? nutriments['fiber_100g'] ? Math.round((nutriments['fiber_serving'] ?? nutriments['fiber_100g']) * 10) / 10 : undefined;

        const name = prod.product_name || prod.product_name_en || 'Scanned Food Product';
        const brand = prod.brands || 'Commercial Product';

        return {
          barcode: cleanCode,
          name,
          brand,
          servingSize: serving,
          calories: Math.max(0, calories),
          protein: Math.max(0, protein),
          carbs: Math.max(0, carbs),
          fat: Math.max(0, fat),
          fiber
        };
      }
    }
  } catch {
    // Open Food Facts API network failure or timeout
  }

  return null;
}
