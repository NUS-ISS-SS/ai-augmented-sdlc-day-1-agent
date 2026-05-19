const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');

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