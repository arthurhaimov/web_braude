const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

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

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const identifier = document.getElementById("userInput").value.trim();
    const password = document.getElementById("passInput").value;
    const passwordHash = await hashPassword(password);
    const users = getUsers();

    const user = users.find((item) =>
        item.username.toLowerCase() === identifier.toLowerCase()
        || item.email.toLowerCase() === identifier.toLowerCase()
    );

    if (!user || user.passwordHash !== passwordHash) {
        alert("Invalid username/email or password.");
        return;
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        username: user.username,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role
    }));

    if (user.role === "admin") {
        window.location.href = "userManagement.html";
    } else {
        alert(`Welcome, ${user.username}!`);
    }
});
