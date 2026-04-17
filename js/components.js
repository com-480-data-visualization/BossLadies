// components.js
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }
  
  function injectLayout() {
    const header = document.createElement('header');
    header.innerHTML = `
      <nav>
        <a href="index.html" class="logo">Build Your Meal</a>
        <ul>
          <li><a href="index.html">What's On My Plate</a></li>
          <li><a href="tdee.html">TDEE Calculator</a></li>
          <li><a href="fooddb.html">Nutrition Database</a></li>
          <li><a href="explore.html">Explore Food Information</a></li>
        </ul>
      </nav>
    `;
    document.body.prepend(header);
  
    const footer = document.createElement('footer');
    footer.innerHTML = `<p>&copy; 2026 Build Your Meal</p>`;
    document.body.append(footer);
  
    setActiveNav();
  }
  
  // ← remplace injectLayout() par ça :
  document.addEventListener('DOMContentLoaded', injectLayout);