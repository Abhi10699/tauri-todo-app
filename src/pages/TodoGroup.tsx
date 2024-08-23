import { Navbar } from "@/components/navbar";
import { TodoCard } from "@/components/todo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from 'react-router-dom';

import { invoke } from "@tauri-apps/api";



interface ITodoGroupNavState {
  isNew: boolean,
  navTitle: string,
  navDesc: string
}

export function TodoGroup() {

  const [groupItems, setGroupItems] = useState<any[]>([]);
  const { groupId } = useParams();
  const { state } = useLocation();


  const { register, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      itemTitle: '',
      itemDescription: ''
    }
  })


  const addItem = async (itemInfo: any) => {
    // TODO: need refactoring
    if(!groupId) {
      return
    }
    setGroupItems([...groupItems, {
      title: itemInfo.itemTitle,
      description: itemInfo.itemDescription
    }])

    // push data to the backend

    const backendResponse = await invoke('add_group_item', {
      groupId: parseInt(groupId),
      itemTitle: itemInfo.itemTitle,
      itemDescription: itemInfo.itemDescription,
    });


    console.log(backendResponse);
    reset();
  }


  const getGroupItems = async () => {
    if (!groupId) {
      return;
    }
    const items = await (await invoke<any[]>('get_group_items', { groupId: parseInt(groupId) })).map(item => ({
      title: item.item_title,
      description: item.item_description,
      id: item.id,
      groupId: item.group_id,
      done: item.done
    }));

    console.log(items);
    setGroupItems(items);
  }

  useEffect(() => {
    getGroupItems();

    return () => {
      // cleanup goes here
    }
  }, []);

  return (
    <>
      <Navbar title={state.navTitle || 'Title'} dialogTitle="Add Item" description={state.navDesc || 'Description'}>
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