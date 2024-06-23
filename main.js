const tasks = [
  { id: 1, text: "Task done", completed: false },
  { id: 2, text: "Task done", completed: true },
  { id: 3, text: "Task done", completed: false },
];

const taskList = document.getElementById("task-list");

function addTask(title) {
  const newTask = {
    id: tasks.length + 1,
    text: title,
    completed: false,
  };
  tasks.push(newTask);
  savesTask()
}

function renderTasks(filter) {
  taskList.innerHTML = "";

  const hasCompletedTasks = tasks.some((task) => task.completed);

  tasks.forEach((task) => {
    if (
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed)
    ) {
      const taskItem = document.createElement("li");
      taskItem.className = "task";
      if (task.completed) {
        taskItem.classList.add("completed");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleTaskStatus(task.id));

      const taskText = document.createElement("span");
      taskText.className = "taskText";
      taskText.textContent = task.text;

      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskText);

      if (filter === "completed") {
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        taskItem.appendChild(deleteButton);
      }

      taskList.appendChild(taskItem);

      const addTaskSection = document.getElementById("add-task-section");
      if (filter === "active" || filter === "all") {
        addTaskSection.classList.remove("display-none");
      } else {
        addTaskSection.classList.add("display-none");
      }
    }
  });

  const clearCompletedButton = document.getElementById("clear-completed");
  if (filter === "completed" && hasCompletedTasks) {
    clearCompletedButton.style.display = "inline-block";
  } else {
    clearCompletedButton.style.display = "none";
  }
}

function toggleTaskStatus(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTasks(getCurrentFilter());
  }
}

function deleteTask(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    savesTask()
    renderTasks(getCurrentFilter());
  }
}

function clearCompleted() {
  tasks.forEach((task, index) => {
    if (task.completed) {
      tasks.splice(index, 1);
      index--;
    }
  });
  renderTasks(getCurrentFilter());
}

function getCurrentFilter() {
  const filterButtons = document.querySelectorAll("#task-filter li");
  for (const button of filterButtons) {
    if (button.classList.contains("active")) {
      return button.textContent.toLowerCase();
    }
  }
  return "all";
}

function filterTasks(filter) {
  const filterButtons = document.querySelectorAll("#task-filter li");
  for (const button of filterButtons) {
    button.classList.remove("active");
  }
  const clickedButton = Array.from(filterButtons).find(
    (button) => button.innerText.toLowerCase() === filter
  );
  clickedButton.classList.add("active");
  renderTasks(filter);
  localStorage.setItem("currentFilter", filter);
}

function addNewTask() {
  const newTaskInput = document.getElementById("new-task-input");
  const newTaskTitle = newTaskInput.value.trim();

  if (newTaskTitle !== "") {
    addTask(newTaskTitle);
    newTaskInput.value = "";
    renderTasks(getCurrentFilter());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const currentFilter = localStorage.getItem("currentFilter") || "all";
  filterTasks(currentFilter);
});

document.addEventListener("DOMContentLoaded", () => {
  renderTasks("all");
});


