/* ===========================================================
   auth.js — AMIRVA Jewelry
   Shared login / sign up / session logic.
   Users are stored in localStorage under "amirva_users".
   The logged-in user is stored under "amirva_current_user".
   =========================================================== */

const USERS_KEY = "amirva_users";
const SESSION_KEY = "amirva_current_user";

/* ---------- storage helpers ---------- */

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
    return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function setCurrentUser(user) {
    // never keep the password in the session record
    const { password, ...safeUser } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
        return null;
    }
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
}

/* ---------- validation helpers ---------- */

function isValidEmail(email) {
    // simple, practical email check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPassword(password) {
    // at least 8 chars, at least one letter and one number
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

function isValidName(name) {
    return name.trim().length >= 2;
}

/* ---------- field error UI helper ---------- */

function setFieldError(inputEl, errorEl, message) {
    if (message) {
        inputEl.classList.add("input-error");
        errorEl.textContent = message;
        errorEl.style.display = "block";
        return false;
    } else {
        inputEl.classList.remove("input-error");
        errorEl.textContent = "";
        errorEl.style.display = "none";
        return true;
    }
}

/* ---------- nav auth-state (optional, used on every page) ---------- */

function reflectAuthStateInNav() {
    const accountLink = document.querySelector(".icon-btn[aria-label='Account']");
    if (!accountLink) return;

    const user = getCurrentUser();

    if (user) {
        accountLink.href = "account.html";
        accountLink.title = "Signed in as " + user.name;
        accountLink.onclick = null;
    } else {
        accountLink.href = "login.html";
        accountLink.removeAttribute("title");
        accountLink.onclick = function () {
            // remember where to send the user once they log in
            sessionStorage.setItem("amirva_redirect_after_login", "account.html");
        };
    }
}

document.addEventListener("DOMContentLoaded", reflectAuthStateInNav);
