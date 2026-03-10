const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");
const todoFooter = document.getElementById("todo-footer");
const todoCount = document.getElementById("todo-count");
const clearDoneBtn = document.getElementById("clear-done-btn");

// Persist and apply theme preference
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    return;
  }

  addTodoItem(text);
  todoInput.value = "";
  todoInput.focus();
});

clearDoneBtn.addEventListener("click", () => {
  const doneItems = todoList.querySelectorAll(".todo-item.done");
  doneItems.forEach((item) => removeItem(item));
});

function addTodoItem(text) {
  const li = document.createElement("li");
  li.className = "todo-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.setAttribute("aria-label", "Mark as done");

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = text;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "✕";
  deleteButton.setAttribute("aria-label", "Delete todo");

  checkbox.addEventListener("change", () => {
    li.classList.toggle("done", checkbox.checked);
    updateFooter();
  });

  deleteButton.addEventListener("click", () => {
    removeItem(li);
  });

  li.append(checkbox, span, deleteButton);
  todoList.appendChild(li);
  updateFooter();
}

function removeItem(li) {
  li.classList.add("removing");
  li.addEventListener("animationend", () => {
    li.remove();
    updateFooter();
  }, { once: true });
}

function updateFooter() {
  const allItems = todoList.querySelectorAll(".todo-item");
  const total = allItems.length;
  const done = todoList.querySelectorAll(".todo-item.done").length;

  if (total === 0) {
    todoFooter.hidden = true;
    if (!todoList.querySelector(".empty-state")) {
      const empty = document.createElement("li");
      empty.className = "empty-state";
      const icon = document.createElement("span");
      icon.className = "empty-state-icon";
      icon.textContent = "✅";
      empty.append(icon, "No todos yet — add one above!");
      todoList.appendChild(empty);
    }
  } else {
    todoFooter.hidden = false;
    const emptyState = todoList.querySelector(".empty-state");
    if (emptyState) emptyState.remove();
    todoCount.textContent = `${done} of ${total} done`;
  }
}

// Show initial empty state
updateFooter();
