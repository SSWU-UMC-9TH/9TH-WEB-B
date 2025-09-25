import React, { createContext, useState, ReactNode, FormEvent } from 'react';
import { Todo } from '../types/todo';

interface TodoContextProps {
  todos: Todo[];
  doneTodos: Todo[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleComplete: (id: number) => void;
  handleDelete: (id: number) => void;
}

export const TodoContext = createContext<TodoContextProps | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTodos, setDoneTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const text = input.trim();
    if (text) {
      const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInput('');
    }
  };

  const handleComplete = (id: number): void => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    const completedTodo = todos.find((todo) => todo.id === id);
    if (completedTodo) {
      setDoneTodos([...doneTodos, { ...completedTodo, completed: true }]);
    }
    setTodos(updatedTodos);
  };

  const handleDelete = (id: number): void => {
    setDoneTodos(doneTodos.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        doneTodos,
        input,
        handleInputChange,
        handleSubmit,
        handleComplete,
        handleDelete,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};