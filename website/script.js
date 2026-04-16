// script.js — point de départ

// Exemple : marquer le lien actif dans la nav selon la page courante
document.querySelectorAll('nav a').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });