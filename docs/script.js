const taskInput = document.querySelector("#taskInput");
const category = document.querySelector("#category");

const addBtn = document.querySelector("#addBtn");
const clearBtn = document.querySelector("#clearBtn");

const taskList = document.querySelector("#taskList");
const themeBtn = document.querySelector("#themeBtn");

let tasks = [];
let editTask = null;

function showTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    taskList.innerHTML += `
      <div class="task-card">

        <h3 style="${
          task.completed ? "text-decoration:line-through;color:#22c55e;" : ""
        }">
          ${task.title}
        </h3>

        <span class="tag">
          ${task.category}
        </span>

        <div class="task-actions">

          <button
            class="editBtn"
            data-id="${index}">
            Edit
          </button>

          <button
            class="doneBtn"
            data-id="${index}">
            ${task.completed ? "Undo" : "Complete"}
          </button>

          <button
            class="deleteBtn"
            data-id="${index}">
            Delete
          </button>

        </div>

      </div>
    `;
  });

  taskList.style.display = tasks.length > 0 ? "block" : "none";
}

addBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  const selectedCategory = category.value;

  if (!title) {
    alert("Enter a task title");
    return;
  }

  if (selectedCategory === "Select Category") {
    alert("Select a category");
    return;
  }

  if (editTask !== null) {
    tasks[editTask].title = title;
    tasks[editTask].category = selectedCategory;

    editTask = null;
    addBtn.textContent = "Add Task";
  } else {
    tasks.push({
      title,
      category: selectedCategory,
      completed: false,
    });
  }

  taskInput.value = "";
  category.selectedIndex = 0;

  showTasks();
});

taskList.addEventListener("click", (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("editBtn")) {
    taskInput.value = tasks[id].title;
    category.value = tasks[id].category;

    editTask = id;

    addBtn.textContent = "Update Task";
  }

  if (e.target.classList.contains("deleteBtn")) {
    tasks.splice(id, 1);
    showTasks();
  }

  if (e.target.classList.contains("doneBtn")) {
    tasks[id].completed = !tasks[id].completed;

    showTasks();
  }
});

clearBtn.addEventListener("click", () => {
  if (!tasks.length) {
    alert("No tasks available");
    return;
  }

  const choice = confirm("Delete all tasks ?");

  if (!choice) return;

  tasks = [];

  showTasks();
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  themeBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀ Light Mode"
    : "🌙 Dark Mode";
});

const grandparent = document.querySelector("#grandparent");

const parent = document.querySelector("#parent");

const child = document.querySelector("#child");


grandparent.addEventListener(
  "click",
  () => console.log("Grandparent Capture"),
  true,
);

parent.addEventListener("click", () => console.log("Parent Capture"), true);

child.addEventListener("click", () => console.log("Child Capture"), true);

// Bubble 

grandparent.addEventListener("click", () => console.log("Grandparent Bubble"));

parent.addEventListener("click", () => console.log("Parent Bubble"));

child.addEventListener("click", () => console.log("Child Bubble"));
