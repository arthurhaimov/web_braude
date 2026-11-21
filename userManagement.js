const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "login.html";
} else {
    document.getElementById("welcomeMessage").textContent =
        `Welcome, ${currentUser.username}`;

    const tableBody = document.getElementById("usersTable");

    users.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border border-gray-300 p-3">${escapeHtml(user.username)}</td>
            <td class="border border-gray-300 p-3">${escapeHtml(user.email)}</td>
            <td class="border border-gray-300 p-3">${escapeHtml(user.dateOfBirth)}</td>
            <td class="border border-gray-300 p-3">${escapeHtml(user.role)}</td>
        `;
        tableBody.appendChild(row);
    });
}

document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "login.html";
});

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}
