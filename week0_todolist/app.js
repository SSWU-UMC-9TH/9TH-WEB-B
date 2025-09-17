const input = document.querySelector('#text-input');
const todoWrapper = document.querySelector('.tasks-wrapper.todo-wrapper');
const doneWrapper = document.querySelector('.tasks-wrapper.done-wrapper');

input.addEventListener('keydown', (e) => {
    if (e.key==='Enter') {
        addTodo(e);
    }
})

function addTodo(e) {
    const text = e.target.value.trim();
    if (text === '') {
        return;
    }
    console.log('할 일', text);
    const task = document.createElement('div');
    task.classList.toggle('task');
    const taskName = document.createElement('p');
    taskName.classList.toggle('task-name');
    taskName.textContent = text;
    const taskButton = document.createElement('button');
    taskButton.classList.toggle('task-button');
    taskButton.id = 'complete';
    taskButton.textContent = '완료';
    taskButton.addEventListener('click', completeTodo);
    task.appendChild(taskName);
    task.appendChild(taskButton);
    todoWrapper.appendChild(task);
    e.target.value='';
}

function completeTodo(e) {
    const completeButton = e.target;
    const task = completeButton.parentElement;
    completeButton.textContent = '삭제';
    completeButton.id = 'delete';
    completeButton.removeEventListener('click', completeTodo);
    completeButton.addEventListener('click', deleteTodo);
    doneWrapper.appendChild(task);
}

function deleteTodo(event) {
    const deleteButton = event.target;
    const task = deleteButton.parentElement;
    task.remove();
}