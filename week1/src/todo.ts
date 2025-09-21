interface Todo {
    id: number;
    text: string;
}

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo: Todo) => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo: Todo) => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

const getTodoText = (): string => {
    return todoInput.value.trim();
};

const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTasks();
};

const completeTodo = (todo: Todo): void => {
    todos = todos.filter((t: Todo) => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};

const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t: Todo) => t.id !== todo.id);
    renderTasks();
};

const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');
    
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = 'red';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = 'green';
    }

    button.addEventListener('click', () => {
        if (isDone) {
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;
};

todoForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
renderTasks();