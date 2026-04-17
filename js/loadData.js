const csv_files = [
    './data/FOOD-DATA-GROUP1.csv',
    './data/FOOD-DATA-GROUP2.csv',
    './data/FOOD-DATA-GROUP3.csv',
    './data/FOOD-DATA-GROUP4.csv',
    './data/FOOD-DATA-GROUP5.csv',
  ];
  
  const COLS_G = [
    'Fat', 'Saturated Fats', 'Monounsaturated Fats', 'Polyunsaturated Fats',
    'Carbohydrates', 'Sugars', 'Protein', 'Dietary Fiber', 'Water'
  ];
  
  const COLS_MG = [
    'Cholesterol', 'Vitamin A', 'Vitamin B1', 'Vitamin B11', 'Vitamin B12',
    'Vitamin B2', 'Vitamin B3', 'Vitamin B5', 'Vitamin B6', 'Vitamin C',
    'Vitamin D', 'Vitamin E', 'Vitamin K', 'Calcium', 'Copper', 'Iron',
    'Magnesium', 'Manganese', 'Phosphorus', 'Potassium', 'Selenium', 'Zinc'
  ];
  
  const MAIN_MACROS = ['Fat', 'Carbohydrates', 'Protein', 'Water'];
  
  function quantile(sortedValues, q) {
    const pos = (sortedValues.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (base + 1 < sortedValues.length) {
      return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
    }
    return sortedValues[base];
  }
  
  function getUpperLimit(data, col, q = 0.999) {
    const values = data
      .map(row => row[col])
      .filter(v => v != null && !isNaN(v))
      .sort((a, b) => a - b);
    return quantile(values, q);
  }
  
  function filterOutliers(data) {
    // 1. Hard filtering — contraintes physiques strictes
    let filtered = data.filter(row => {
      // Chaque nutriment en g ne peut pas dépasser 100g (pour 100g d'aliment)
      const gOk = COLS_G.every(col => !(col in row) || (row[col] >= 0 && row[col] <= 100));
  
      // Contraintes mg
      const mgOk = COLS_MG.every(col => !(col in row) || (row[col] >= 0 && row[col] <= 100000));
  
      // La somme Fat+Carbs+Protein+Water ne dépasse pas ~100g
      const macroSum = MAIN_MACROS.reduce((sum, col) => sum + (row[col] || 0), 0);
      const sumOk = macroSum <= 101;
  
      // Contraintes de cohérence interne
      const sugarsOk = (row['Sugars'] || 0) <= (row['Carbohydrates'] || 0) + 1; // Sugars ⊆ Carbs
      const satFatOk = (row['Saturated Fats'] || 0) <= (row['Fat'] || 0) + 1;   // SatFat ⊆ Fat
  
      // Caloric Value : max raisonnable ~900 kcal/100g (huile pure)
      const kcalOk = !(row['Caloric Value']) || (row['Caloric Value'] >= 0 && row['Caloric Value'] <= 900);
  
      return gOk && mgOk && sumOk && sugarsOk && satFatOk && kcalOk;
    });
  
    // 2. Percentile filtering pour g columns (99e percentile sur données déjà nettoyées)
    const gLimits = {};
    COLS_G.forEach(col => { gLimits[col] = getUpperLimit(filtered, col, 0.99); });
    filtered = filtered.filter(row =>
      COLS_G.every(col => !(col in row) || row[col] <= gLimits[col])
    );
  
    // 3. Percentile filtering pour mg columns
    const mgLimits = {};
    COLS_MG.forEach(col => { mgLimits[col] = getUpperLimit(filtered, col, 0.99); });
    filtered = filtered.filter(row =>
      COLS_MG.every(col => !(col in row) || row[col] <= mgLimits[col])
    );
  
    // 4. Percentile filtering pour Caloric Value
    const kcalLimit = getUpperLimit(filtered, 'Caloric Value', 0.99);
    filtered = filtered.filter(row =>
      !(row['Caloric Value']) || row['Caloric Value'] <= kcalLimit
    );
  
    return filtered;
  }
  
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