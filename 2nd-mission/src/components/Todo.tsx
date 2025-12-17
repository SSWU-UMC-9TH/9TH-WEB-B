import TodoForm from './TodoForm.tsx';
import TodoList from './Todolist.tsx';
import type { TTodo } from '../types/todo.ts';

type Props = {
  input: string;
  setInput: (v: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  todos: TTodo[];
  doneTodos: TTodo[];
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
};

export default function Todo({
  input, setInput, handleSubmit,
  todos, doneTodos, completeTodo, deleteTodo,
}: Props) {
  return (
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>

      {/* ✅ 이 컴포넌트는 props를 "전달만" 한다 → drilling 발생 지점 */}
      <TodoForm input={input} setInput={setInput} handleSubmit={handleSubmit} />

      <div className="render-container">
        <TodoList
          title="할 일"
          todos={todos}
          buttonLabel="완료"
          buttonColor="#28a745"
          onClick={completeTodo}
        />
        <TodoList
          title="완료"
          todos={doneTodos}
          buttonLabel="삭제"
          buttonColor="#dc3545"
          onClick={deleteTodo}
        />
      </div>
    </div>
  );
}
