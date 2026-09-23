// Product page: reads ?id= from the URL, finds the product in data.js and renders it.
(function () {
  var root = document.getElementById('product-root');
  var crumb = document.getElementById('breadcrumb');
  var id = Number(new URLSearchParams(window.location.search).get('id'));
  var p = products.find(function (x) { return x.id === id; });

  if (!p) {
    root.innerHTML =
      '<div class="not-found"><h2>We couldn\'t find that piece</h2>' +
      '<p><a href="web.html">Back to the collection</a></p></div>';
    return;
  }

  var categoryNames = { rings: 'Rings', necklaces: 'Necklaces', earrings: 'Earrings', bracelets: 'Bracelets' };
  var catName = categoryNames[p.category] || p.category;
  var images = (p.images && p.images.length) ? p.images : [p.image];
  var hasSizes = p.sizes && p.sizes.length > 0;
  var sizeLabel = p.category === 'rings' ? 'Ring size' : 'Size';
  var selectedSize = null;
  var quantity = 1;
  var current = 0;

  document.title = 'AMIRVA Jewelry — ' + p.name;

  crumb.innerHTML =
    '<a href="index.html">Home</a><span class="sep">/</span>' +
    '<a href="web.html">Shop</a><span class="sep">/</span>' +
    '<a href="web.html?category=' + p.category + '">' + catName + '</a><span class="sep">/</span>' +
    '<span>' + p.name + '</span>';

  // ----- Technical details (only rows that exist for this product) -----
  var specs = [
    ['Category', catName.replace(/s$/, '')],
    ['Material', p.material.charAt(0).toUpperCase() + p.material.slice(1)]
  ];
  if (p.karat) specs.push(['Purity', p.karat + 'K gold']);
  else specs.push(['Purity', 'Sterling silver']);
  specs.push(['Weight', p.weight + ' g']);
  if (hasSizes) specs.push([p.category === 'rings' ? 'Available ring sizes' : 'Available sizes', p.sizes.join(', ')]);
  specs.push(['Finish', 'Hand-finished']);
  if (p.material === 'gold') specs.push(['Certification', 'Stamped & certified']);

  var specsHTML = specs.map(function (r) {
    return '<div class="spec-row"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>';
  }).join('');

  // ----- Markup -----
  var arrowL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19"/></svg>';
  var arrowR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19"/></svg>';

  var slidesHTML = images.map(function (src, i) {
    return '<img src="' + src + '" alt="' + p.name + ' — view ' + (i + 1) + '" draggable="false">';
  }).join('');

  var thumbsHTML = images.map(function (src, i) {
    return '<button type="button" class="thumb' + (i === 0 ? ' active' : '') + '" data-index="' + i +
      '" aria-label="Show picture ' + (i + 1) + '"><img src="' + src + '" alt=""></button>';
  }).join('');

  var multi = images.length > 1;

  root.innerHTML =
    '<div class="product-page">' +
      '<div class="gallery">' +
        '<div class="slider" id="slider" aria-roledescription="carousel" aria-label="' + p.name + ' pictures">' +
          '<div class="slider-track" id="slider-track">' + slidesHTML + '</div>' +
          (multi ? '<button type="button" class="slider-arrow prev" id="slide-prev" aria-label="Previous picture">' + arrowL + '</button>' +
                   '<button type="button" class="slider-arrow next" id="slide-next" aria-label="Next picture">' + arrowR + '</button>' +
                   '<div class="slider-count" id="slide-count">1 / ' + images.length + '</div>' : '') +
        '</div>' +
        (multi ? '<div class="thumbs" id="thumbs">' + thumbsHTML + '</div>' : '') +
      '</div>' +

      '<div class="product-info">' +
        '<div class="eyebrow">' + catName + '</div>' +
        '<h1>' + p.name + '</h1>' +
        '<div class="price-row">' +
          '<span class="price-now">' + formatPrice(p.salePrice) + '</span>' +
          '<span class="price-old">' + formatPrice(p.price) + '</span>' +
          '<span class="price-badge">Save ' + p.discount + '%</span>' +
        '</div>' +
        '<p class="product-desc">' + p.description + '</p>' +

        (hasSizes
          ? '<div class="option-group"><div class="option-label">' + sizeLabel + '</div>' +
            '<div class="size-options" id="size-options">' +
            p.sizes.map(function (s) {
              return '<button type="button" class="size-btn" data-size="' + s + '">' + s + '</button>';
            }).join('') +
            '</div><p class="size-error" id="size-error">Please choose a size first.</p></div>'
          : '') +

        '<div class="option-group"><div class="option-label">Quantity</div>' +
          '<div class="qty-box"><button type="button" id="qty-minus" aria-label="Decrease quantity">-</button>' +
          '<span id="qty-value">1</span>' +
          '<button type="button" id="qty-plus" aria-label="Increase quantity">+</button></div></div>' +

        '<div class="buy-row">' +
          '<button type="button" id="add-btn" class="btn-outline">Add to cart</button>' +
          '<button type="button" id="buy-btn">Buy now</button>' +
        '</div>' +

        '<div class="specs"><h2>Technical details</h2>' + specsHTML + '</div>' +
      '</div>' +
    '</div>';

  // ----- Slider -----
  var track = document.getElementById('slider-track');
  var slider = document.getElementById('slider');
  var thumbs = document.querySelectorAll('.thumb');
  var counter = document.getElementById('slide-count');

  function goTo(n) {
    current = (n + images.length) % images.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    thumbs.forEach(function (t, i) { t.classList.toggle('active', i === current); });
    if (counter) counter.textContent = (current + 1) + ' / ' + images.length;
  }

  if (multi) {
    document.getElementById('slide-prev').addEventListener('click', function () { goTo(current - 1); });
    document.getElementById('slide-next').addEventListener('click', function () { goTo(current + 1); });
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () { goTo(Number(t.dataset.index)); });
    });

    // Arrow keys
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Swipe on touch screens
    var startX = null;
    slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
      startX = null;
    });
  }

  // ----- Size + quantity -----
  var sizeBox = document.getElementById('size-options');
  var sizeError = document.getElementById('size-error');

  if (sizeBox) {
    sizeBox.addEventListener('click', function (e) {
      var btn = e.target.closest('.size-btn');
      if (!btn) return;
      selectedSize = btn.dataset.size; // kept as a string so it matches the cart page
      sizeBox.querySelectorAll('.size-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
      sizeError.classList.remove('show');
    });
  }

  var qtyValue = document.getElementById('qty-value');
  document.getElementById('qty-minus').addEventListener('click', function () {
    quantity = Math.max(1, quantity - 1);
    qtyValue.textContent = quantity;
  });
  document.getElementById('qty-plus').addEventListener('click', function () {
    quantity = Math.min(10, quantity + 1);
    qtyValue.textContent = quantity;
  });

  function addCurrent() {
    if (hasSizes && !selectedSize) {
      sizeError.classList.add('show');
      sizeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    addToCart(p.id, quantity, selectedSize);
    return true;
  }

  document.getElementById('add-btn').addEventListener('click', addCurrent);
  document.getElementById('buy-btn').addEventListener('click', function () {
    if (addCurrent()) window.location.href = 'cart.html';
  });

  // ----- Related pieces (same category first, then others) -----
  var related = products.filter(function (x) { return x.id !== p.id && x.category === p.category; });
  if (related.length < 4) {
    products.forEach(function (x) {
      if (x.id !== p.id && related.indexOf(x) === -1 && related.length < 4) related.push(x);
    });
  }
  related = related.slice(0, 4);

  var relatedGrid = document.getElementById('related-grid');
  relatedGrid.innerHTML = related.map(productCardHTML).join('');
  document.getElementById('related-section').hidden = false;

  relatedGrid.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-id]');
    if (!btn) return;
    // Sized items need a size, so send them to their own page instead of adding blind
    var item = products.find(function (x) { return x.id === Number(btn.dataset.id); });
    if (item.sizes && item.sizes.length) {
      window.location.href = 'product.html?id=' + item.id;
      return;
    }
    addToCart(item.id, 1, null);
    if (btn.classList.contains('buy')) window.location.href = 'cart.html';
  });
})();
