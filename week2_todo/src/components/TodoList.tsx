import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const TodoList: React.FC = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('TodoList must be used within a TodoProvider');
  }

  const { todos, handleComplete } = context;

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">할 일</h2>
      <ul id="todo-list" className="render-container__list">
        {todos.map((todo) => (
          <li key={todo.id} className="render-container__item">
            <span className="render-container__item-text">{todo.text}</span>
            <button
              style={{ backgroundColor: 'green' }}
              className="render-container__item-button"
              onClick={() => handleComplete(todo.id)}
            >
              완료
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;