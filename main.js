const grid = document.getElementById('grid');
const search = document.getElementById('search');

let debounceTimer;

function renderGrid(filter = '') {
  grid.innerHTML = '';
  terms
    .filter(entry => entry.term.toLowerCase().includes(filter.toLowerCase()))
    .forEach((entry) => {
      const blob = document.createElement('div');
      blob.className = 'blob';
      blob.setAttribute('tabindex', '0'); // keyboard focus
      blob.innerHTML = `<div class="term">${entry.term}</div><div class="definition">${entry.definitions[0]}</div>`;
      
      let defIndex = 0;
      let interval = null;

      function startCycle() {
        if (interval) return;
        interval = setInterval(() => {
          defIndex = (defIndex + 1) % entry.definitions.length;
          blob.querySelector('.definition').textContent = entry.definitions[defIndex];
        }, 1000);
      }

      function stopCycle() {
        clearInterval(interval);
        interval = null;
        defIndex = 0;
        blob.querySelector('.definition').textContent = entry.definitions[0];
      }

      // Click to activate blob (foreground)
      blob.addEventListener('click', () => {
        document.querySelectorAll('.blob').forEach(b => b.classList.remove('active'));
        blob.classList.add('active');
        blob.focus();
      });

      // Mouse events for cycling definitions
      blob.addEventListener('mousedown', startCycle);
      blob.addEventListener('mouseup', stopCycle);
      blob.addEventListener('mouseleave', stopCycle);

      // Touch events for mobile
      blob.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startCycle();
      }, { passive: false });
      blob.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopCycle();
      });

      // Keyboard support: Enter key activates blob
      blob.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          document.querySelectorAll('.blob').forEach(b => b.classList.remove('active'));
          blob.classList.add('active');
        }
      });

      grid.appendChild(blob);
    });
}

renderGrid();

search.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    renderGrid(search.value);
  }, 250);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.blob')) {
    document.querySelectorAll('.blob').forEach(b => b.classList.remove('active'));
  }
});
