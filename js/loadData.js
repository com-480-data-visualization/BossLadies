// data files
const csv_files = [
    './data/FOOD-DATA-GROUP1.csv',
    './data/FOOD-DATA-GROUP2.csv',
    './data/FOOD-DATA-GROUP3.csv',
    './data/FOOD-DATA-GROUP4.csv',
    './data/FOOD-DATA-GROUP5.csv',
  ];
  
  // nutrients measured in grams 
  const COLS_G = [
    'Fat', 'Saturated Fats', 'Monounsaturated Fats', 'Polyunsaturated Fats',
    'Carbohydrates', 'Sugars', 'Protein', 'Dietary Fiber', 'Water'
  ];
  // nutrients measured in mg 
  const COLS_MG = [
    'Cholesterol', 'Vitamin A', 'Vitamin B1', 'Vitamin B11', 'Vitamin B12',
    'Vitamin B2', 'Vitamin B3', 'Vitamin B5', 'Vitamin B6', 'Vitamin C',
    'Vitamin D', 'Vitamin E', 'Vitamin K', 'Calcium', 'Copper', 'Iron',
    'Magnesium', 'Manganese', 'Phosphorus', 'Potassium', 'Selenium', 'Zinc'
  ];
  // macronutrients whose weight should not exceed 100g 
  const MAIN_MACROS = ['Fat', 'Carbohydrates', 'Protein', 'Water'];
  
  /**
 * computes the q-th quantile
 * @param {number[]} sortedValues - Ascending-sorted array of numbers
 * @param {number}   q            - Quantile in [0, 1]
 * @returns {number}
 */
  function quantile(sortedValues, q) {
    const pos = (sortedValues.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (base + 1 < sortedValues.length) {
      return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
    }
    return sortedValues[base];
  }
  /**
 * returns the upper bound at the given quantile for a numeric column, ignoring NaN rows.
 * @param {Object[]} data - Full dataset
 * @param {string}   col  - Column name
 * @param {number}   q    - Quantile threshold (default: 0.999)
 * @returns {number}
 */

  function getUpperLimit(data, col, q = 0.999) {
    const values = data
      .map(row => row[col])
      .filter(v => v != null && !isNaN(v))
      .sort((a, b) => a - b);
    return quantile(values, q);
  }
  // outlier removal 
/**
 * removes physically impossible and statistically extreme rows from the dataset.
 * filtering is applied in four successive passes:
 *   1. hard physical constraints (absolute bounds + internal coherence)
 *   2. 99th-percentile cap on gram columns
 *   3. 99th-percentile cap on milligram columns
 *   4. 99th-percentile cap on caloric value
 *
 * @param {Object[]} data - Raw parsed dataset
 * @returns {Object[]}    - Cleaned dataset
 */
  function filterOutliers(data) {
    // 1. hard filtering
    let filtered = data.filter(row => {
      // each nutrient in g cannot exceed 100g
      const gOk = COLS_G.every(col => !(col in row) || (row[col] >= 0 && row[col] <= 100));
  
      // constraints in mg 
      const mgOk = COLS_MG.every(col => !(col in row) || (row[col] >= 0 && row[col] <= 100000));
  
      // sum Fat+Carbs+Protein+Water < 100g
      const macroSum = MAIN_MACROS.reduce((sum, col) => sum + (row[col] || 0), 0);
      const sumOk = macroSum <= 101;
  
      // internal constraint
      const sugarsOk = (row['Sugars'] || 0) <= (row['Carbohydrates'] || 0) + 1; // Sugars ⊆ Carbs
      const satFatOk = (row['Saturated Fats'] || 0) <= (row['Fat'] || 0) + 1;   // SatFat ⊆ Fat
  
      // caloric value
      const kcalOk = !(row['Caloric Value']) || (row['Caloric Value'] >= 0 && row['Caloric Value'] <= 900);
  
      return gOk && mgOk && sumOk && sugarsOk && satFatOk && kcalOk;
    });
  
    // 2. percentile cap on gram columns
    const gLimits = {};
    COLS_G.forEach(col => { gLimits[col] = getUpperLimit(filtered, col, 0.99); });
    filtered = filtered.filter(row =>
      COLS_G.every(col => !(col in row) || row[col] <= gLimits[col])
    );
  
    // 3. Percentile filtering on mg columns
    const mgLimits = {};
    COLS_MG.forEach(col => { mgLimits[col] = getUpperLimit(filtered, col, 0.99); });
    filtered = filtered.filter(row =>
      COLS_MG.every(col => !(col in row) || row[col] <= mgLimits[col])
    );
  
    // 4. percentile for caloric value
    const kcalLimit = getUpperLimit(filtered, 'Caloric Value', 0.99);
    filtered = filtered.filter(row =>
      !(row['Caloric Value']) || row['Caloric Value'] <= kcalLimit
    );
  
    return filtered;
  }
  // data loading 
  /**
 * fetches and parses all CSV files in parallel, merges them into a single
 * dataset, and returns it after outlier removal.
 */
  async function loadData() {
    const promises = csv_files.map(file =>
      new Promise((resolve, reject) => {
        Papa.parse(file, {
          download: true,
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: results => resolve(results.data),
          error: err => reject(err),
        });
      })
    );
    const groups = await Promise.all(promises);
    const allFood = groups.flat();
    return filterOutliers(allFood);
  }