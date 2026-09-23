
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
