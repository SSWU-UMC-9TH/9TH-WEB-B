// src/components/Todo.tsx
import { useState, type FormEvent } from 'react';

type TTodo = { id: string; text: string };

export default function Todo() {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newTodo: TTodo = { id: crypto.randomUUID(), text };
    setTodos((prev): TTodo[] => [...prev, newTodo]);
    setInput('');
  };

  const completeTodo = (todo: TTodo): void => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setDoneTodos((prev): TTodo[] => [...prev, todo]);
  };

  const removeDoneTodo = (todo: TTodo): void => {
    setDoneTodos((prev): TTodo[] => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <div className="todo-container">
      <div className="todo-container__header">
        <h1>HANEUL TODO</h1>
      </div>

      <form onSubmit={handleSubmit} className="todo-container__form">
        <input
          value={input}
          onChange={(e): void => setInput(e.target.value)}
          type="text"
          className="todo-container__input"
          placeholder="할 일 입력"
          required
        />
        <button
          type="submit"
          className="todo-container__button"
          disabled={!input.trim()}
        >
          할 일 추가
        </button>
      </form>

      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item--text">{todo.text}</span>
                <button
                  type="button"
                  onClick={() => completeTodo(todo)}
                  className="render-container__item-button render-container__item-button--complete"
                  aria-label="할 일 완료"
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul className="render-container__list">
            {doneTodos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item--text">{todo.text}</span>
                <button
                  type="button"
                  onClick={() => removeDoneTodo(todo)}
                  className="render-container__item-button render-container__item-button--delete"
                  aria-label="완료 항목 삭제"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
