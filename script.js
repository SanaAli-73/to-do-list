// Load tasks on page load
window.onload = () => {
    loadTasks();
};

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    const categoryInput = document.getElementById("categoryInput");
    const priorityInput = document.getElementById("priorityInput");

    const category = categoryInput.value;
    const priority = priorityInput.value;


    if (taskText === "") return;

    const task = {
        text: taskText,
        dueDate: dueDate || null,
        category: category || null,
        priority: priority || null,
        completed: false
    };


    saveTask(task);
    renderTask(task);

    taskInput.value = "";
    dueDateInput.value = "";
}

function renderTask(task, index) {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    // Task Text
    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.text;
    if (task.dueDate) taskSpan.textContent += ` (Due: ${task.dueDate})`;
    if (task.category) taskSpan.textContent += ` [${task.category}]`;
    if (task.priority) taskSpan.textContent += ` - ${task.priority} Priority`;
    taskSpan.classList.add("task-text");

    if (task.priority) {
        taskSpan.classList.add(`priority-${task.priority.toLowerCase()}`);
    }

    taskSpan.style.flex = "1";
    taskSpan.onclick = () => {
        task.completed = !task.completed;
        const tasks = getTasks();
        tasks[index] = task;
        setTasks(tasks);
        loadTasks();
    };

    // Buttons
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "delete-btn blue";
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.className = "delete-btn red";
    deleteBtn.onclick = () => deleteTask(index);

    // Wrap buttons in a container for layout
    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "0.5rem";
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    li.appendChild(taskSpan);
    li.appendChild(btnContainer);

    document.getElementById("taskList").appendChild(li);
} 

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    setTasks(tasks);
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function setTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
    const tasks = getTasks();
    document.getElementById("taskList").innerHTML = "";
    tasks.forEach((task, index) => renderTask(task, index));
}

function updateTaskList() {
    const tasks = [];
    const items = document.querySelectorAll("#taskList li");
    items.forEach((li) => {
        const span = li.querySelector("span");
        const text = span.textContent.split(" (Due: ")[0];
        const due = span.textContent.includes("Due: ")
            ? span.textContent.split(" (Due: ")[1].replace(")", "")
            : null;
        const completed = li.classList.contains("completed");

        tasks.push({
            text,
            dueDate: due,
            completed
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById("taskList").innerHTML = "";
    tasks.forEach((task, i) => renderTask(task, i));
}

function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    setTasks(tasks);
    loadTasks();
}

function editTask(index) {
    const tasks = getTasks();
    const task = tasks[index];

    // Prompt user for updated values
    const newText = prompt("Edit task text:", task.text);
    if (newText === null) return; // Cancelled

    const newDueDate = prompt("Edit due date (YYYY-MM-DD):", task.dueDate || "");
    const newCategory = prompt("Edit category:", task.category || "");
    const newPriority = prompt("Edit priority (High/Medium/Low):", task.priority || "");

    // Update task object
    task.text = newText.trim() || task.text;
    task.dueDate = newDueDate || null;
    task.category = newCategory || null;
    task.priority = newPriority || null;

    // Save and reload
    tasks[index] = task;
    setTasks(tasks);
    loadTasks();
}

function getTaskIndex(li) {
    const items = Array.from(document.querySelectorAll("#taskList li"));
    return items.indexOf(li);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}