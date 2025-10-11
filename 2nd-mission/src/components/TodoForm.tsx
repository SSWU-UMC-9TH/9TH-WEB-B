import React from 'react';

interface TodoFormProps {
  input: string;
  setInput: (v: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function TodoForm({ input, setInput, handleSubmit }: TodoFormProps) {
  return (
    <form onSubmit={handleSubmit} className="todo-container__form">
      <input
        value={input}
        onChange={(e): void => setInput(e.target.value)}
        type="text"
        className="todo-container__input"
        placeholder="할 일 입력"
        required
      />
      <button type="submit" className="todo-container__button">할 일 추가</button>
    </form>
  );
}
