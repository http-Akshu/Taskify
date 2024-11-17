// Firebase configuration
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
const db = firebase.firestore();

// Load tasks for the main dashboard
async function loadTasks(uid) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the list

    try {
        const snapshot = await db.collection("tasks")
            .where("uid", "==", uid)
            .where("completed", "==", false)
            .orderBy("timestamp")
            .get();

        if (snapshot.empty) {
            taskList.innerHTML = "<li>No tasks found. Start by adding a task above!</li>";
            return;
        }

        snapshot.forEach((doc) => {
            const taskData = doc.data();
            const taskId = doc.id;

            const li = document.createElement("li");
            li.className = "task-item";
            li.innerHTML = `
                <span class="task-text">${taskData.task}</span>
                <div class="task-actions">
                    <button onclick="markAsCompleted('${taskId}')">Mark as Completed</button>
                    <button onclick="deleteTask('${taskId}')">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
        alert("Failed to load tasks.");
    }
}

// Add a new task
document.getElementById("add-task-button").addEventListener("click", async () => {
    const taskInput = document.getElementById("task-input").value.trim();
    const user = auth.currentUser;

    if (!taskInput) {
        alert("Task cannot be empty!");
        return;
    }

    try {
        await db.collection("tasks").add({
            uid: user.uid,
            task: taskInput,
            completed: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById("task-input").value = ""; // Clear input
        loadTasks(user.uid);
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task.");
    }
});

// Mark a task as completed
async function markAsCompleted(taskId) {
    const user = auth.currentUser;

    try {
        await db.collection("tasks").doc(taskId).update({
            completed: true
        });
        alert("Task marked as completed!");
        loadTasks(user.uid);
    } catch (error) {
        console.error("Error marking task as completed:", error);
        alert("Failed to mark task as completed.");
    }
}

// Delete a task
async function deleteTask(taskId) {
    const user = auth.currentUser;

    try {
        await db.collection("tasks").doc(taskId).delete();
        alert("Task deleted successfully!");
        loadTasks(user.uid);
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
    }
}

// Load completed tasks
document.getElementById("completed-tasks-button").addEventListener("click", async () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the list

    try {
        const snapshot = await db.collection("tasks")
            .where("uid", "==", auth.currentUser.uid)
            .where("completed", "==", true)
            .orderBy("timestamp")
            .get();

        if (snapshot.empty) {
            taskList.innerHTML = "<li>No completed tasks found.</li>";
            return;
        }

        snapshot.forEach((doc) => {
            const taskData = doc.data();
            const taskId = doc.id;

            const li = document.createElement("li");
            li.className = "task-item";
            li.innerHTML = `
                <span class="task-text completed">${taskData.task}</span>
                <div class="task-actions">
                    <button onclick="deleteTask('${taskId}')">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading completed tasks:", error);
        alert("Failed to load completed tasks.");
    }
});

// Log out the user
document.getElementById("logout-button").addEventListener("click", () => {
    auth.signOut().then(() => {
        window.location = "index.html";
    });
});

// Authenticate and initialize dashboard
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("user-greeting").textContent = `Hello, ${user.displayName || user.email} :)`;
        loadTasks(user.uid);
    } else {
        window.location = "index.html";
    }
});
