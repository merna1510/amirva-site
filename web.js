// Shop page: products come from data.js, so the grid, search, sorting and cart all use one source
(function () {
  var grid = document.getElementById('product-grid');
  var search = document.getElementById('search');
  var title = document.getElementById('shop-title');
  var showAll = document.getElementById('show-all');
  var noResults = document.getElementById('no-results');
  var sortButtons = document.querySelectorAll('.sort-btn');

  var params = new URLSearchParams(window.location.search);
  var category = (params.get('category') || '').toLowerCase();
  var sortMode = 'best';
  var categoryNames = { rings: 'Rings', necklaces: 'Necklaces', earrings: 'Earrings', bracelets: 'Bracelets' };

  search.value = params.get('q') || '';
  if (categoryNames[category]) {
    title.textContent = categoryNames[category];
    document.title = 'AMIRVA Jewelry — ' + categoryNames[category];
    showAll.hidden = false;
  } else {
    category = '';
  }

  function render() {
    var q = search.value.trim().toLowerCase();

    var list = products.filter(function (p) {
      return (!category || p.category === category) &&
             (!q || p.name.toLowerCase().includes(q));
    });

    if (sortMode === 'price') {
      list.sort(function (a, b) { return a.salePrice - b.salePrice; });
    } else if (sortMode === 'alphabetic') {
      list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } // 'best' keeps the order from data.js

    grid.innerHTML = list.map(productCardHTML).join('');
    noResults.hidden = list.length > 0;
  }

  sortButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sortMode = btn.dataset.sort;
      sortButtons.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn);
      });
      render();
    });
  });

  search.addEventListener('input', render);

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-id]');
    if (!btn) return;
    addToCart(Number(btn.dataset.id), 1, null);
    if (btn.classList.contains('buy')) window.location.href = 'cart.html';
  });

  render();
})();
