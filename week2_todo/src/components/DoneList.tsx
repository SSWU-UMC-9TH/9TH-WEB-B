import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const DoneList: React.FC = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('DoneList must be used within a TodoProvider');
  }

  const { doneTodos, handleDelete } = context;

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">완료</h2>
      <ul id="done-list" className="render-container__list">
        {doneTodos.map((todo) => (
          <li key={todo.id} className="render-container__item">
            <span className="render-container__item-text">{todo.text}</span>
            <button
              style={{ backgroundColor: 'red' }}
              className="render-container__item-button"
              onClick={() => handleDelete(todo.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoneList;