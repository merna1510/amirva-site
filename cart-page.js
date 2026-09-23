let appliedDiscount = 0;

function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-items");

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p><a href="web.html">Back to products</a></p>
            </div>
        `;
        document.getElementById("cart-summary").style.display = "none";
        return;
    }

    document.getElementById("cart-summary").style.display = "block";

    container.innerHTML = cart.map(function (item, index) {
        return `
            <div class="cart-item" data-id="${item.id}" data-size="${item.size || ""}">
                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    ${item.size ? `<p>Size: ${item.size}</p>` : ""}
                    <p>${formatPrice(item.unitPrice)} each</p>

                    <label class="gift-option">
                        <input type="checkbox" class="gift-checkbox" ${item.gift ? "checked" : ""}>
                        Wrap as a gift
                    </label>
                    <textarea class="gift-message ${item.gift ? "show" : ""}" placeholder="Gift message">${item.giftMessage || ""}</textarea>
                </div>

                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button type="button" class="qty-minus">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" class="qty-plus">+</button>
                    </div>
                    <button type="button" class="remove-btn">Remove</button>
                </div>
            </div>
        `;
    }).join("");

    attachCartItemEvents();
    renderTotals();
}

function attachCartItemEvents() {
    document.querySelectorAll(".cart-item").forEach(function (row) {
        const id = Number(row.dataset.id);
        const size = row.dataset.size || null;

        row.querySelector(".qty-minus").addEventListener("click", function () {
            const cart = getCart();
            const item = cart.find(function (i) { return i.id === id && i.size === size; });
            updateQuantity(id, size, item.quantity - 1);
            renderCart();
        });

        row.querySelector(".qty-plus").addEventListener("click", function () {
            const cart = getCart();
            const item = cart.find(function (i) { return i.id === id && i.size === size; });
            updateQuantity(id, size, item.quantity + 1);
            renderCart();
        });

        row.querySelector(".remove-btn").addEventListener("click", function () {
            removeFromCart(id, size);
            showToast("Removed from cart");
            renderCart();
        });

        const giftCheckbox = row.querySelector(".gift-checkbox");
        const giftMessageBox = row.querySelector(".gift-message");

        giftCheckbox.addEventListener("change", function () {
            giftMessageBox.classList.toggle("show", giftCheckbox.checked);
            setGiftOption(id, size, giftCheckbox.checked, giftMessageBox.value);
        });

        giftMessageBox.addEventListener("input", function () {
            setGiftOption(id, size, giftCheckbox.checked, giftMessageBox.value);
        });
    });
}

function renderTotals() {
    const subtotal = getSubtotal();
    document.getElementById("subtotal-value").textContent = formatPrice(subtotal);

    if (appliedDiscount > 0) {
        const discountAmount = (subtotal * appliedDiscount) / 100;
        document.getElementById("discount-row").style.display = "flex";
        document.getElementById("discount-value").textContent = "- " + formatPrice(discountAmount);
    } else {
        document.getElementById("discount-row").style.display = "none";
    }

    document.getElementById("total-value").textContent = formatPrice(getTotal(appliedDiscount));
}

document.getElementById("apply-discount-btn").addEventListener("click", function () {
    const code = document.getElementById("discount-input").value;
    const percent = checkDiscountCode(code);
    const errorEl = document.getElementById("discount-error");

    if (percent === null) {
        errorEl.classList.add("show");
        appliedDiscount = 0;
    } else {
        errorEl.classList.remove("show");
        appliedDiscount = percent;
        showToast(percent + "% discount applied");
    }

    renderTotals();
});

document.getElementById("checkout-btn").addEventListener("click", function () {
    if (getCart().length === 0) return;
    window.location.href = "checkout.html";
});

renderCart();