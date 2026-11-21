import "./style.css";
import "./users.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const usernameOrEmail = document.getElementById("userInput").value;
  const password = document.getElementById("passInput").value;
  const user = find(usernameOrEmail);

  if (user && user.password === password) {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: user.username,
        email: user.email,
        dob: user.dob,
        isAdmin: user.isAdmin
      })
    );
    loginMessage.textContent = "Login successful!";
    loginMessage.classList.remove("text-red-500");
    loginMessage.classList.add("text-green-500");

    if (user.isAdmin) {
      window.location.href = "/src/userManagement.html";
    }
  } else {
    loginMessage.textContent = "Invalid username/email or password.";
    loginMessage.classList.remove("text-green-500");
    loginMessage.classList.add("text-red-500");
  }
});
