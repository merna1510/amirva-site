
const DISCOUNT_CODES = {
  WELCOME10: 10,
  GOLD20: 20
};

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, quantity, size) {
  quantity = quantity || 1;
  const product = products.find(function (p) {
    return p.id === productId;
  });

  if (!product) return;

  const cart = getCart();
  const existing = cart.find(function (item) {
    return item.id === productId && item.size === size;
  });

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.salePrice,
      quantity: quantity,
      size: size || null,
      gift: false,
      giftMessage: ""
    });
  }

  saveCart(cart);
  showToast(product.name + "  added");
}

function removeFromCart(productId, size) {
  let cart = getCart();
  cart = cart.filter(function (item) {
    return !(item.id === productId && item.size === size);
  });
  saveCart(cart);
}

function updateQuantity(productId, size, newQuantity) {
  const cart = getCart();
  const item = cart.find(function (i) {
    return i.id === productId && i.size === size;
  });

  if (!item) return;

  if (newQuantity < 1) {
    removeFromCart(productId, size);
    return;
  }

  item.quantity = newQuantity;
  saveCart(cart);
}

function setGiftOption(productId, size, isGift, message) {
  const cart = getCart();
  const item = cart.find(function (i) {
    return i.id === productId && i.size === size;
  });

  if (!item) return;

  item.gift = isGift;
  item.giftMessage = message || "";
  saveCart(cart);
}

function getSubtotal() {
  const cart = getCart();
  return cart.reduce(function (sum, item) {
    return sum + item.unitPrice * item.quantity;
  }, 0);
}

function checkDiscountCode(code) {
  const clean = (code || "").trim().toUpperCase();
  return DISCOUNT_CODES.hasOwnProperty(clean) ? DISCOUNT_CODES[clean] : null;
}

function getTotal(discountPercent) {
  const subtotal = getSubtotal();
  const discountAmount = discountPercent ? (subtotal * discountPercent) / 100 : 0;
  return subtotal - discountAmount;
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
}
