// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD105EHzlo6TKWVHSJaKC00Y4kWEzXXej8",
    authDomain: "taskify-bce17.firebaseapp.com",
    projectId: "taskify-bce17",
    storageBucket: "taskify-bce17.firebasestorage.app",
    messagingSenderId: "41873261783",
    appId: "1:41873261783:web:73086d575bedc21903dc92",
    measurementId: "G-KGV1B6YHRX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Toggle between Login and Signup forms
document.getElementById("show-signup").addEventListener("click", () => {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", () => {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
});

// Signup Functionality
document.getElementById("signup-button").addEventListener("click", async () => {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!name || !email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await user.updateProfile({ displayName: name });
        alert("Signup successful! You can now log in.");
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    } catch (error) {
        console.error("Signup Error:", error);
        alert("Error signing up: " + error.message);
    }
});

// Login Functionality
document.getElementById("login-button").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect to the dashboard
    } catch (error) {
        console.error("Login Error:", error);
        alert("Error logging in: " + error.message);
    }
});
