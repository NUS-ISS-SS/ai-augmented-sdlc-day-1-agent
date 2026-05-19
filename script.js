const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const themeToggle = document.querySelector('#theme-toggle');

// Theme management
const THEME_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === DARK ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  applyTheme(saved ?? preferred);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === DARK ? LIGHT : DARK;
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

initTheme();

const todos = [];

function createTodoItem(text) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
  };
}

function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No todos yet. Add one above.';

    const wrapper = document.createElement('li');
    wrapper.appendChild(emptyState);
    todoList.appendChild(wrapper);
    return;
  }

  todos.forEach((todo) => {
    const listItem = document.createElement('li');
    listItem.className = 'todo-item';

    const text = document.createElement('span');
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      const todoIndex = todos.findIndex((item) => item.id === todo.id);

      if (todoIndex >= 0) {
        todos.splice(todoIndex, 1);
        renderTodos();
      }
    });

    listItem.append(text, deleteButton);
    todoList.appendChild(listItem);
  });
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    todoInput.focus();
    return;
  }

  todos.push(createTodoItem(text));
  todoInput.value = '';
  todoInput.focus();
  renderTodos();
});

renderTodos();