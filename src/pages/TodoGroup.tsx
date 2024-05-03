import { TodoCard } from "@/components/todo-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";


type TodoGroupProps = {
  todos: {
    title: string;
    taskDescription: string;
    subtasks: Array<{
      title: string,
      subtasks: Array<{ title: string, description: string }>
      description: string
    }>
  }
}

export function TodoGroup(props: TodoGroupProps) {

  const generateTodos = () => { }
  const setTodo = (value: string) => { }


  return (
    <div className="flex-grow overflow-y-auto flex flex-col gap-3 p-4">
      {props.todos.subtasks.map(todo => <TodoCard
        subtasks={todo.subtasks}
        description={todo.description}
        title={todo.title}
      />)}
    </div>
  )
}