// js/charts.js
async function init() {
    const data = await loadData();
    renderPolarChart(data, "Apple", "Banana"); // two foods to compare
  }
  
  function renderPolarChart(data, food1Name, food2Name) {
    const food1 = data.find(d => d.food === food1Name);
    const food2 = data.find(d => d.food === food2Name);
    const nutrients = ['Protein', 'Carbohydrates', 'Fat', 'Dietary Fiber', 'Sugars', 'Caloric Value'];
  
    new Chart(document.getElementById('polarChart'), {
      type: 'polarArea',
      data: {
        labels: nutrients,
        datasets: [
          {
            label: food1Name,
            data: nutrients.map(n => food1[n]),
            backgroundColor: ['#f87171aa', '#fb923caa', '#facc15aa', '#4ade80aa', '#60a5faaa', '#c084fcaa'],
          },
          {
            label: food2Name,
            data: nutrients.map(n => food2[n]),
            backgroundColor: ['#ef444466', '#f9731666', '#eab30866', '#22c55e66', '#3b82f666', '#a855f766'],
          }
        ]
      }
    });
  }
  
  init();