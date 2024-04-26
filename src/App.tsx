import { useEffect, useState } from "react";
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import "./App.css";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'

function App() {

  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<string[]>([]);

  const handleAddTodo = async () => {
    setTodos(() => [...todos, todo]);
    setTodo(() => '');
  }


  return (
    <div className="flex flex-col h-screen w-screen p-3">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 select-none">
        Streaks!
      </h1>

      <Separator />

      <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-3">
        {[...todos, ...todos].map(todo => (
          <Card>
            <CardHeader>
              <CardTitle>{todo}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                This is a todo item
              </CardDescription>

            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />
      <div className="flex flex-row gap-3 my-3 h-content">
        <Input
          placeholder="Your todo goes here!"
          onChange={e => setTodo(e.target.value)}
        />
        <Button onClick={handleAddTodo}>Add Todo</Button>
      </div>


    </div>
  );
}

export default App;
