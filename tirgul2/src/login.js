import "./style.css";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const usernameOrEmail = document.getElementById("userInput").value;
  const password = document.getElementById("passInput").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (item) => item.username === usernameOrEmail || item.email === usernameOrEmail
  );

  if (user && user.password === password) {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: user.username,
        email: user.email,
        dob: user.dob,
        role: user.role
      })
    );
    loginMessage.textContent = "Login successful!";
    loginMessage.classList.remove("text-red-500");
    loginMessage.classList.add("text-green-500");

    if (user.role === "admin") {
      window.location.href = "/src/userManagement.html";
    }
  } else {
    loginMessage.textContent = "Invalid username/email or password.";
    loginMessage.classList.remove("text-green-500");
    loginMessage.classList.add("text-red-500");
  }
});
