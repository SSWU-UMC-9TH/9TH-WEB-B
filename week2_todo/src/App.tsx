import React from 'react';
import { TodoProvider } from './context/TodoContext';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import DoneList from './components/DoneList';

const App = (): React.ReactElement => {
  return (
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">UMC TODO</h1>
        <TodoForm />
        <div className="render-container">
          <TodoList />
          <DoneList />
        </div>
      </div>
    </TodoProvider>
  );
};

export default App;
