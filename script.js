const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const themeToggle = document.querySelector('#theme-toggle');
const taskStats = document.querySelector('#task-stats');
const progressBar = document.querySelector('#progress-bar');
const filterButtons = document.querySelectorAll('.filter-btn');

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
const FILTER_KEY = 'filter';
let currentFilter = localStorage.getItem(FILTER_KEY) || 'all';

function createTodoItem(text) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    done: false,
  };
}

function updateStats() {
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const active = total - done;

  if (total === 0) {
    taskStats.textContent = 'No tasks yet';
    progressBar.style.width = '0%';
  } else if (done === total) {
    taskStats.textContent = 'All tasks complete! 🎉';
    progressBar.style.width = '100%';
  } else {
    taskStats.textContent = `${active} task${active !== 1 ? 's' : ''} remaining`;
    progressBar.style.width = `${(done / total) * 100}%`;
  }
}

function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter((t) => !t.done);
  if (currentFilter === 'done') return todos.filter((t) => t.done);
  return todos;
}

function removeTodoItemElement(li, id) {
  li.classList.add('todo-item--exiting');
  li.addEventListener('animationend', () => {
    const todoIndex = todos.findIndex((item) => item.id === id);
    if (todoIndex >= 0) {
      todos.splice(todoIndex, 1);
    }
    renderTodos();
  }, { once: true });
}

function renderTodos() {
  todoList.innerHTML = '';
  updateStats();

  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    const li = document.createElement('li');
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    const isFiltered = currentFilter !== 'all' && todos.length > 0;
    emptyState.innerHTML = `
      <span class="empty-state-icon">${isFiltered ? '🔍' : '✅'}</span>
      <span class="empty-state-text">${isFiltered ? 'No tasks here' : 'All clear!'}</span>
      <p class="empty-state-sub">${isFiltered ? 'Try a different filter.' : 'Add a task above to get started.'}</p>
    `;
    li.appendChild(emptyState);
    todoList.appendChild(li);
    return;
  }

  filtered.forEach((todo) => {
    const listItem = document.createElement('li');
    listItem.className = `todo-item${todo.done ? ' todo-item--done' : ''}`;

    const checkButton = document.createElement('button');
    checkButton.type = 'button';
    checkButton.className = 'todo-check';
    checkButton.setAttribute('aria-label', todo.done ? 'Mark as active' : 'Mark as done');
    checkButton.textContent = todo.done ? '✓' : '';
    checkButton.addEventListener('click', () => {
      todo.done = !todo.done;
      renderTodos();
    });

    const text = document.createElement('span');
    text.className = 'todo-item-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'todo-delete';
    deleteButton.setAttribute('aria-label', `Delete "${todo.text}"`);
    deleteButton.textContent = '✕';
    deleteButton.addEventListener('click', () => {
      removeTodoItemElement(listItem, todo.id);
    });

    listItem.append(checkButton, text, deleteButton);
    todoList.appendChild(listItem);
  });
}

filterButtons.forEach((btn) => {
  if (btn.dataset.filter === currentFilter) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    localStorage.setItem(FILTER_KEY, currentFilter);
    renderTodos();
  });
});

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
