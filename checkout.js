/* ===========================================================
   checkout.js — AMIRVA Jewelry
   Renders the order summary and validates the payment form.
   Uses the real cart.js API: getCart(), getSubtotal(),
   checkDiscountCode(), getTotal(), clearCart().
   =========================================================== */

/* Discount carried over from the cart page (if any). The cart page
   stores the code it applied under this key so checkout can honor
   the same discount without asking the user to re-enter it. If your
   cart-page.js uses a different key, update DISCOUNT_STORAGE_KEY. */
const DISCOUNT_STORAGE_KEY = "amirva_applied_discount";

function getAppliedDiscountPercent() {
    const code = localStorage.getItem(DISCOUNT_STORAGE_KEY);
    if (!code) return 0;
    const percent = checkDiscountCode(code);
    return percent || 0;
}

function renderOrderSummary() {
    const cart = getCart();
    const lineItemsEl = document.getElementById("checkout-line-items");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const discountRow = document.getElementById("checkout-discount-row");
    const discountEl = document.getElementById("checkout-discount");
    const totalEl = document.getElementById("checkout-total");

    if (!cart.length) {
        lineItemsEl.innerHTML = "<p class='section-hint'>Your cart is empty.</p>";
        subtotalEl.textContent = "0 EGY";
        totalEl.textContent = "0 EGY";
        discountRow.style.display = "none";
        return { subtotal: 0, total: 0, discountPercent: 0 };
    }

    let html = "";
    cart.forEach(function (item) {
        const lineTotal = item.unitPrice * item.quantity;
        html += "<div class='checkout-line'>" +
            "<span>" + item.name +
            (item.size ? " <span class='qty'>(" + item.size + ")</span>" : "") +
            " <span class='qty'>×" + item.quantity + "</span></span>" +
            "<span>" + lineTotal + " EGY</span>" +
            "</div>";
    });
    lineItemsEl.innerHTML = html;

    const subtotal = getSubtotal();
    const discountPercent = getAppliedDiscountPercent();
    const total = getTotal(discountPercent);

    subtotalEl.textContent = subtotal + " EGY";

    if (discountPercent > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = "-" + (subtotal - total).toFixed(2) + " EGY (" + discountPercent + "%)";
    } else {
        discountRow.style.display = "none";
    }

    totalEl.textContent = total.toFixed(2) + " EGY";

    return { subtotal, total, discountPercent };
}

/* ---------- payment field validators ---------- */

function isValidCardNumber(value) {
    const digits = value.replace(/\s+/g, "");
    return /^\d{16}$/.test(digits);
}

function isValidExpiry(value) {
    const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
    if (!match) return false;
    const month = Number(match[1]);
    const year = Number("20" + match[2]);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
}

function isValidCVV(value) {
    return /^\d{3,4}$/.test(value.trim());
}

function formatCardNumber(value) {
    return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
    let digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
        digits = digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
}

/* ---------- wire everything up ---------- */

function getSelectedPaymentMethod() {
    const checked = document.querySelector('input[name="payment-method"]:checked');
    return checked ? checked.value : "online";
}

function updatePaymentMethodUI() {
    const isOnline = getSelectedPaymentMethod() === "online";
    const cardFields = document.getElementById("card-fields");
    const placeOrderBtn = document.getElementById("place-order-btn");

    cardFields.style.display = isOnline ? "block" : "none";
    placeOrderBtn.textContent = isOnline ? "Pay & Place Order" : "Place Order (Cash on Delivery)";

    if (!isOnline) {
        // Clear any card validation errors since these fields no longer apply
        ["card-name", "card-number", "card-expiry", "card-cvv"].forEach(function (id) {
            const input = document.getElementById(id);
            const error = document.getElementById(id + "-error");
            setFieldError(input, error, "");
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Guard: must be logged in to check out. If not, send to login and
    // remember to come straight back to checkout once they sign in.
    if (typeof getCurrentUser === "function" && !getCurrentUser()) {
        sessionStorage.setItem("amirva_redirect_after_login", "checkout.html");
        window.location.href = "login.html";
        return;
    }

    let orderTotals = renderOrderSummary();

    document.querySelectorAll('input[name="payment-method"]').forEach(function (radio) {
        radio.addEventListener("change", updatePaymentMethodUI);
    });
    updatePaymentMethodUI();

    const cardNumberInput = document.getElementById("card-number");
    const expiryInput = document.getElementById("card-expiry");

    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", function () {
            cardNumberInput.value = formatCardNumber(cardNumberInput.value);
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener("input", function () {
            expiryInput.value = formatExpiry(expiryInput.value);
        });
    }

    const form = document.getElementById("checkout-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const paymentMethod = getSelectedPaymentMethod();
        const isOnline = paymentMethod === "online";

        const fields = [
            { input: document.getElementById("full-name"), error: document.getElementById("full-name-error"), validate: v => v.trim().length >= 2, message: "Please enter your full name." },
            { input: document.getElementById("address"), error: document.getElementById("address-error"), validate: v => v.trim().length >= 5, message: "Please enter a valid address." },
            { input: document.getElementById("city"), error: document.getElementById("city-error"), validate: v => v.trim().length >= 2, message: "Please enter your city." },
            { input: document.getElementById("postal-code"), error: document.getElementById("postal-code-error"), validate: v => /^\d{4,6}$/.test(v.trim()), message: "Please enter a valid postal code." }
        ];

        // Card fields only need to be valid when paying online
        if (isOnline) {
            fields.push(
                { input: document.getElementById("card-name"), error: document.getElementById("card-name-error"), validate: v => v.trim().length >= 2, message: "Please enter the name on the card." },
                { input: document.getElementById("card-number"), error: document.getElementById("card-number-error"), validate: v => isValidCardNumber(v), message: "Card number must be 16 digits." },
                { input: document.getElementById("card-expiry"), error: document.getElementById("card-expiry-error"), validate: v => isValidExpiry(v), message: "Enter a valid, non-expired MM/YY date." },
                { input: document.getElementById("card-cvv"), error: document.getElementById("card-cvv-error"), validate: v => isValidCVV(v), message: "CVV must be 3 or 4 digits." }
            );
        }

        let allValid = true;
        fields.forEach(function (f) {
            const valid = f.validate(f.input.value);
            setFieldError(f.input, f.error, valid ? "" : f.message);
            if (!valid) allValid = false;
        });

        if (!allValid) return;

        const cart = getCart();
        if (!cart.length) {
            alert("Your cart is empty — add something before checking out.");
            return;
        }

        // Re-read totals right before placing the order (in case the cart
        // or discount changed since the page loaded).
        orderTotals = renderOrderSummary();

        const order = {
            id: "AMV-" + Date.now().toString().slice(-8),
            date: new Date().toISOString(),
            name: document.getElementById("full-name").value.trim(),
            address: document.getElementById("address").value.trim(),
            city: document.getElementById("city").value.trim(),
            postalCode: document.getElementById("postal-code").value.trim(),
            paymentMethod: paymentMethod,
            cardLast4: isOnline ? document.getElementById("card-number").value.replace(/\D/g, "").slice(-4) : null,
            items: cart,
            subtotal: orderTotals.subtotal,
            discountPercent: orderTotals.discountPercent,
            total: orderTotals.total
        };

        localStorage.setItem("amirva_last_order", JSON.stringify(order));

        // Clear the cart (and any carried-over discount) now the order is placed
        clearCart();
        localStorage.removeItem(DISCOUNT_STORAGE_KEY);

        window.location.href = "order-confirmation.html";
    });
});
