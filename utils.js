
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

// Shared product card (used by the home page and the shop page)
function productCardHTML(p) {
  return '' +
    '<div class="image">' +
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
