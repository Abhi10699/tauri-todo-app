import { Navbar } from "@/components/navbar";
import { TodoCard } from "@/components/todo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from 'react-router-dom';


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

export function TodoGroup() {

  const [groupItems, setGroupItems] = useState<any[]>([]);
  const { state } = useLocation();
  const { groupId } = useParams();


  console.log(state, groupId);

  const { register, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      itemTitle: '',
      itemDescription: ''
    }
  })


  const addItem = (itemInfo: any) => {
    setGroupItems([...groupItems, {
      title: itemInfo.itemTitle,
      description: itemInfo.itemDescription
    }])

    reset();
  }


  return (
    <>
      <Navbar title="Title will go here" dialogTitle="Add Item">
        <Input placeholder='Activity Title' {...register('itemTitle')} />
        <Textarea placeholder="Briefly Describe your activity, what will you be doing?"
          rows={10}
          {...register('itemDescription')}></Textarea>
        <Button onClick={handleSubmit(addItem)}>Add</Button>
      </Navbar>
      {
        groupItems.length == 0 ? (
          <div className="text-gray-400 w-scree h-screen flex items-center justify-center">
            <p>Click <b className="font-extrabold text-2xl">+</b> to start adding items in your todo list.</p>
          </div>

        ) : (
          <div className="flex-grow overflow-y-auto flex flex-col gap-3 p-4">
            {groupItems.map(todo => <TodoCard
              title={todo.title}
              description={todo.description}
            />)}
          </div>
        )
      }
    </>
  )
}