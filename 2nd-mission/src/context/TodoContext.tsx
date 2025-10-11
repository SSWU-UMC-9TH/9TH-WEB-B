import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import type { TTodo } from '../types/todo.ts';

interface ITodoContext {
  todos: TTodo[];
  doneTodos: TTodo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
}

const TodoContext = createContext<ITodoContext | null>(null);

export function TodoProvider({ children }: PropsWithChildren) {
  const [todos, setTodos] = useState<TTodo[]>([{ id: 1, text: '맛있다.' }]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([{ id: 2, text: '오타니' }]);

  const addTodo = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: t }]);
  };

  const completeTodo = (todo: TTodo) => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setDoneTodos((prev) => [...prev, todo]);
  };

  const deleteTodo = (todo: TTodo) => {
    setDoneTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <TodoContext.Provider value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodoContext must be used within TodoProvider');
  return ctx;
}
