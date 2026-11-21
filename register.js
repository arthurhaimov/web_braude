const USERS_KEY = "users";

async function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
        const bytes = new TextEncoder().encode(password);
        const digest = await window.crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(digest))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    return `fallback:${password}`;
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const dateOfBirth = document.getElementById("dob").value;
    const confirmInput = document.getElementById("confirmPassword");

    if (password !== confirmPassword) {
        confirmInput.setCustomValidity("Passwords do not match");
        confirmInput.reportValidity();
        return;
    }

    confirmInput.setCustomValidity("");
    const users = getUsers();
    const usernameExists = users.some(
        (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    const emailExists = users.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (usernameExists) {
        alert("A user with this username already exists.");
        return;
    }

    if (emailExists) {
        alert("A user with this email already exists.");
        return;
    }

    users.push({
        username,
        email,
        passwordHash: await hashPassword(password),
        dateOfBirth,
        role: users.length === 0 ? "admin" : "user"
    });

    saveUsers(users);
    alert(`Registration successful. Your role is ${users.at(-1).role}.`);
    window.location.href = "login.html";
});
