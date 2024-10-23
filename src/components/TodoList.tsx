import { Todo } from "@/types";
import { TodoItem } from "./TodoItem";

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
