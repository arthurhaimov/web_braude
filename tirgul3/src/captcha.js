import "./style.css";
import "./users.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");
  const arithmeticChallengeSpan = document.getElementById("arithmetic-challenge");
  const arithmeticAnswerInput = document.getElementById("captcha-answer");
  const refreshArithmeticCaptchaButton = document.getElementById("refresh-captcha");
  const arithmeticError = document.getElementById("arithmetic-error");
  const captchaAttemptsError = document.getElementById("captcha-attempts-error");

  let arithmeticNum1;
  let arithmeticNum2;
  let arithmeticExpectedAnswer;
  let incorrectAttempts = 0;
  const maxIncorrectAttempts = 3;

  function generateArithmeticCaptcha() {
    arithmeticNum1 = Math.floor(Math.random() * 10) + 1;
    arithmeticNum2 = Math.floor(Math.random() * 10) + 1;
    const operation = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];

    if (operation === "+") {
      arithmeticExpectedAnswer = arithmeticNum1 + arithmeticNum2;
    } else if (operation === "-") {
      arithmeticExpectedAnswer = arithmeticNum1 - arithmeticNum2;
    } else if (operation === "*") {
      arithmeticExpectedAnswer = arithmeticNum1 * arithmeticNum2;
    } else {
      const product = arithmeticNum1 * arithmeticNum2;
      arithmeticNum1 = product;
      arithmeticExpectedAnswer = arithmeticNum1 / arithmeticNum2;
    }

    arithmeticChallengeSpan.textContent =
      `${arithmeticNum1} ${operation} ${arithmeticNum2} = ?`;
    arithmeticAnswerInput.value = "";
    arithmeticError.classList.add("hidden");
  }

  generateArithmeticCaptcha();
  refreshArithmeticCaptchaButton.addEventListener("click", generateArithmeticCaptcha);

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (incorrectAttempts >= maxIncorrectAttempts) {
      captchaAttemptsError.classList.remove("hidden");
      return;
    }

    const username = document.getElementById("userInput").value.trim();
    const email = document.getElementById("mailInput").value.trim();
    const password = document.getElementById("passInput").value;
    const confirmPassword = document.getElementById("confirmInput").value;
    const dob = document.getElementById("dateInput").value;
    registerMessage.textContent = "";

    if (password !== confirmPassword) {
      registerMessage.textContent = "Passwords do not match.";
      registerMessage.classList.remove("text-green-500");
      registerMessage.classList.add("text-red-500");
      return;
    }

    const userAnswer = Number(arithmeticAnswerInput.value);
    if (Number.isFinite(userAnswer) && userAnswer === arithmeticExpectedAnswer) {
      try {
        if (window.find(username) || window.find(email)) {
          registerMessage.textContent = "Username or email already exists.";
          registerMessage.classList.remove("text-green-500");
          registerMessage.classList.add("text-red-500");
          return;
        }

        const isAdmin = window.getUserCount() === 0;
        window.add(username, email, password, dob, isAdmin);
        registerMessage.textContent = "Registration successful!";
        registerMessage.classList.remove("text-red-500");
        registerMessage.classList.add("text-green-500");
        incorrectAttempts = 0;
        generateArithmeticCaptcha();
      } catch (error) {
        registerMessage.textContent = "An error occurred during registration.";
        registerMessage.classList.remove("text-green-500");
        registerMessage.classList.add("text-red-500");
      }
    } else {
      incorrectAttempts += 1;
      arithmeticError.classList.remove("hidden");
    }
  });
});
