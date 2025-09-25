import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const TodoForm: React.FC = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('TodoForm must be used within a TodoProvider');
  }

  const { input, handleInputChange, handleSubmit } = context;

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        type="text"
        id="todo-input"
        className="todo-container__input"
        placeholder="할 일 입력"
        value={input}
        onChange={handleInputChange}
        required
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;