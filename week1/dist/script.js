"use strict";
// DOM 요소 (strict 모드 안전 가드 포함)
const todoInput = document.getElementById('todo-input');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
if (!todoInput || !todoForm || !todoList || !doneList) {
    alert('ID 확인: todo-form, todo-input, todo-list, done-list (중복/오타 금지)');
    throw new Error('Required elements not found');
}
let todos = [];
let doneTasks = [];
// li 생성 (할 일/완료 공용)
function createTodoElement(todo, isDone) {
    const li = document.createElement('li');
    li.className = 'render-container__item';
    const p = document.createElement('p');
    p.className = 'render-container__item-text';
    p.textContent = todo.text;
    const btn = document.createElement('button');
    btn.className = 'render-container__item-button';
    btn.textContent = isDone ? '삭제' : '완료';
    btn.onclick = () => {
        if (isDone) {
            // 완료 → 삭제
            doneTasks = doneTasks.filter(t => t.id !== todo.id);
        }
        else {
            // 할 일 → 완료로 이동
            todos = todos.filter(t => t.id !== todo.id);
            doneTasks.push(todo);
        }
        render();
    };
    li.append(p, btn);
    return li;
}
// 렌더
function render() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach(t => todoList.appendChild(createTodoElement(t, false)));
    doneTasks.forEach(t => doneList.appendChild(createTodoElement(t, true)));
}
// 입력/추가
function getTodoText() {
    return todoInput.value.trim();
}
function addTodo(text) {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    render();
}
// 폼 이벤트
todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // 페이지 리로드 방지
    const text = getTodoText();
    if (!text)
        return;
    addTodo(text);
});
// 초기 렌더
render();
