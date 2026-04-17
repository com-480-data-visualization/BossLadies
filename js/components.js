// components.js

/**
 * highlights the nav link matching the current page by toggling the active class.
 * falls back to 'index.html' if no filename is found in the path
 */
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }
  /**
 * dynamically injects the shared header and footer into the page, then marks the current page as active in the nav.
 * called on DOMContentLoaded so the <body> is ready before manipulation
 */
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
    // build and append the footer
    const footer = document.createElement('footer');
    footer.innerHTML = `<p>&copy; 2026 Build Your Meal</p>`;
    document.body.append(footer);
  
    setActiveNav();
  }
  
  // wait for the DOM to be fully parsed before injecting layout, so document.body is guaranteed to exist
  document.addEventListener('DOMContentLoaded', injectLayout);