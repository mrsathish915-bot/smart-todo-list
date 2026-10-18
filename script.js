
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("smartTodoTasks")) || [];

function saveTasks() {
    localStorage.setItem("smartTodoTasks", JSON.stringify(tasks));
}

function updateSummary() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", () => {
            const updatedText = prompt("Edit your task:", task.text);

            if (updatedText !== null && updatedText.trim() !== "") {
                task.text = updatedText.trim();
                saveTasks();
                renderTasks();
            } else if (updatedText !== null) {
                alert("Task cannot be empty!");
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            const confirmed = confirm("Delete this task?");

            if (confirmed) {
                tasks = tasks.filter(item => item.id !== task.id);
                saveTasks();
                renderTasks();
            }
        });

        li.append(checkbox, taskText, editBtn, deleteBtn);
        taskList.appendChild(li);
    });

    updateSummary();
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        taskInput.focus();
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();
