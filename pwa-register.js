
// Apenas instala o cache do aplicativo; os manuscritos continuam no armazenamento local.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {scope:'./'})
      .catch(err => console.warn('Instalação offline indisponível:', err));
  });
}

