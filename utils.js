
function formatPrice(number) {
  return Number(number).toLocaleString("en-US") + " EGY";
}

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2000);
}

function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);

  cartCountEl.textContent = totalItems;
}

document.addEventListener("DOMContentLoaded", updateCartCount);

// Shared product card (used by the home page, the shop page and "related pieces")
// Clicking anywhere on the card (except its buttons) opens the product page.
function productCardHTML(p) {
  return '' +
    '<div class="image" data-product="' + p.id + '" tabindex="0" role="link" aria-label="View ' + p.name + '">' +
    '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
    '<h2>' + p.name + '</h2>' +
    '<h3>price <del>' + formatPrice(p.price) + '</del></h3>' +
    '<h1 class="salse">' + formatPrice(p.salePrice) + '</h1>' +
    '<mark>discount ' + p.discount + '%</mark>' +
    '<div class="card-actions">' +
    '<button type="button" class="sub cart" data-id="' + p.id + '">Add to cart</button>' +
    '<button type="button" class="buy" data-id="' + p.id + '">Buy</button>' +
    '</div>' +
    '</div>';
}

// One global handler so every page that shows product cards gets the click-through
function openProductFromCard(e) {
  if (e.target.closest('button, a')) return;
  var card = e.target.closest('.image[data-product]');
  if (card) window.location.href = 'product.html?id=' + card.dataset.product;
}

document.addEventListener('click', openProductFromCard);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.target.matches('.image[data-product]')) openProductFromCard(e);
});
