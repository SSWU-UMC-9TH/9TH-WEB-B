import './App.css';
import { useState, type FormEvent } from 'react';
import type { TTodo } from './types/todo.ts';
import Todo from './components/Todo.tsx';


export default function App() {
  const [todos, setTodos] = useState<TTodo[]>([{ id: 1, text: '맛있다.' }]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([{ id: 2, text: '오타니' }]);
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text }]);
    setInput('');
  };

  const completeTodo = (todo: TTodo) => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setDoneTodos((prev) => [...prev, todo]);
  };

  const deleteTodo = (todo: TTodo) => {
    setDoneTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <div className="app">
      <Todo
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        todos={todos}
        doneTodos={doneTodos}
        completeTodo={completeTodo}
        deleteTodo={deleteTodo}
        
      />
    </div>
    
  );
}
