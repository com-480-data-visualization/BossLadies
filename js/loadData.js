// data file
const CSV_FILE = './archive/cleaned_ingredients.csv';

// nutrients measured in grams
const COLS_G = [
  'Protein_g', 'Saturated_fats_g', 'Fat_g', 'Carb_g', 'Fiber_g', 'Sugar_g'
];

// nutrients measured in mg or mcg
const COLS_MG = [
  'Calcium_mg', 'Iron_mg', 'Magnesium_mg', 'Phosphorus_mg', 'Potassium_mg',
  'Sodium_mg', 'Zinc_mg', 'Copper_mcg', 'Manganese_mg', 'Selenium_mcg',
  'VitC_mg', 'Thiamin_mg', 'Riboflavin_mg', 'Niacin_mg', 'VitB6_mg',
  'Folate_mcg', 'VitB12_mcg', 'VitA_mcg', 'VitE_mg', 'VitD2_mcg'
];

// keywords that make Sugar_g = 0 unreliable (unless "sugar free")
const SUSPICIOUS_SUGAR_KEYWORDS = [
  'muffin', 'donut', 'doughnut', 'pie', 'cake', 'cookie',
  'brownie', 'pastry', 'waffle', 'pancake', 'candy',
  'chocolate', 'ice cream', 'pudding', 'tart', 'croissant',
  'syrup', 'agutuk', 'arrowroot babyfood'
];

const SUGAR_FREE_KEYWORDS = [
  'sugar free', 'sugarfree', 'no sugar', 'unsweetened'
];

/**
 * returns true if this row has a suspicious Sugar_g = 0
 * (implausible zero, not explicitly sugar-free)
 */
function isSugarUnreliable(row) {
  const descrip = (row['Descrip'] || '').toLowerCase();
  if (row['Sugar_g'] !== 0) return false;
  const isSugarFree = SUGAR_FREE_KEYWORDS.some(kw => descrip.includes(kw));
  if (isSugarFree) return false;
  return SUSPICIOUS_SUGAR_KEYWORDS.some(kw => descrip.includes(kw));
}

/**
 * applies minimal cleaning:
 *   1. internal coherence (Sugars ⊆ Carbs, SatFat ⊆ Fat)
 *   2. flags suspicious Sugar_g = 0 rows (sets Sugar_g to null)
 *
 * no outlier removal — already handled in Python EDA.
 */
function filterOutliers(data) {
  return data
    .filter(row => {
      // Sugars must be a subset of Carbs (with small tolerance for rounding)
      const sugarsOk = (row['Sugar_g'] || 0) <= (row['Carb_g'] || 0) + 1;
      // Saturated fat must be a subset of total fat
      const satFatOk = (row['Saturated_fats_g'] || 0) <= (row['Fat_g'] || 0) + 1;
      return sugarsOk && satFatOk;
    })
    .map(row => {
      // flag unreliable sugar as null so UI can show "N/A" instead of 0
      if (isSugarUnreliable(row)) {
        return { ...row, Sugar_g: null, sugar_unreliable: true };
      }
      return { ...row, sugar_unreliable: false };
    });
}

/**
 * fetches and parses the CSV, returns cleaned dataset.
 */
async function loadData() {
  const data = await new Promise((resolve, reject) => {
    Papa.parse(CSV_FILE, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: err => reject(err),
    });
  });
  return filterOutliers(data);
}