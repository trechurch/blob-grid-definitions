const grid = document.getElementById('grid');
const search = document.getElementById('search');

function renderGrid(filter = '') {
  grid.innerHTML = '';
  terms.filter(entry => entry.term.toLowerCase().includes(filter.toLowerCase())).forEach((entry) => {
    const blob = document.createElement('div');
    blob.className = 'blob';
    blob.innerHTML = `<div class="term">${entry.term}</div><div class="definition">${entry.definitions[0]}</div>`;
    let defIndex = 0;
    let interval = null;

    blob.addEventListener('click', (e) => {
      document.querySelectorAll('.blob').forEach(b => b.classList.remove('active'));
      blob.classList.add('active');
    });

    blob.addEventListener('mousedown', () => {
      interval = setInterval(() => {
        defIndex = (defIndex + 1) % entry.definitions.length;
        blob.querySelector('.definition').textContent = entry.definitions[defIndex];
      }, 1000);
    });

    blob.addEventListener('mouseup', () => {
      clearInterval(interval);
      defIndex = 0;
      blob.querySelector('.definition').textContent = entry.definitions[0];
    });

    grid.appendChild(blob);
  });
}

renderGrid();

search.addEventListener('input', () => {
  renderGrid(search.value);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.blob')) {
    document.querySelectorAll('.blob').forEach(b => b.classList.remove('active'));
  }
});
