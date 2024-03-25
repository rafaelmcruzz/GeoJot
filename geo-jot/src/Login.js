const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
document.addEventListener("DOMContentLoaded", function() {
    const signInForm = document.querySelector(".sign-in-form");
  
    signInForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the default form submission behavior
  
      // Get the values of username and password input fields
      const username = signInForm.querySelector('input[type="text"]').value;
      const password = signInForm.querySelector('input[type="password"]').value;
  
      // Create an object containing data to send to the backend
      const formData = {
        username: username,
        password: password
      };
  
      // Send a POST request to the backend to verify user identity
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          // If the response status code is 200, user identity is verified
          return response.json();
        } else {
          // If the response status code is not 200, display an error message
          throw new Error("Failed to sign in. Please check your credentials.");
        }
      })
      .then(data => {
        // Handle successful response, e.g., redirect to user's profile page
        window.location.href = "/profile";
      })
      .catch(error => {
        // Handle error, e.g., display error message to the user
        console.error("Error:", error.message);
      });
    });
  });
  document.addEventListener("DOMContentLoaded", function() {
    const signUpForm = document.querySelector(".sign-up-form");
  
    signUpForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the default form submission behavior
  
      // Get the values of username, email, and password input fields
      const username = signUpForm.querySelector('input[name="username"]').value;
      const email = signUpForm.querySelector('input[name="email"]').value;
      const password = signUpForm.querySelector('input[name="password"]').value;
  
      // Create an object containing data to send to the backend
      const formData = {
        username: username,
        email: email,
        password: password
      };
  
      // Send a POST request to the backend to register the user
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          // If the response status code is 200, user registration is successful
          return response.json();
        } else {
          // If the response status code is not 200, display an error message
          throw new Error("Failed to sign up. Please try again.");
        }
      })
      .then(data => {
        // Handle successful response, e.g., redirect to a success page
        window.location.href = "/success";
      })
      .catch(error => {
        // Handle error, e.g., display error message to the user
        console.error("Error:", error.message);
      });
    });
  });
  
  