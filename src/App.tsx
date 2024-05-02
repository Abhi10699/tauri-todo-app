import { useState } from 'react';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { useGemini } from './hooks/useGemini';
import { TodoCard } from './components/todo-card';
import { Navbar } from './components/navbar';

interface TodoItem {
  title: string;
  taskDescription: string;
  subtasks: Array<{
    title: string,
    subtasks: Array<{ title: string, description: string }>
    description: string
  }>
}

function App() {

  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<TodoItem>();
  const { sendChat } = useGemini();


  const generateTodos = async () => {
    const result = await sendChat(`You are a an expert in splitting a task into smaller subtasks. Given you a task,  divide the task into a smaller subtasks. For each subtask provide a title and description and also add smaller non overlapping subtask for that subtask. Structure your responses in a proper JSON format.
    {
      title: string,
      taskDescription: string,
      subtasks: Array<{
        title: string,
        description: string,
      }>
    }
    Develop Todo list for: ${todo}.
    MAKE SURE YOU STRUCTURE YOUR RESPONSE IN A VALID JSON FORMAT AND FOLLOW THE SCHEMA PROVIDED TO YOU.`);
    const jsonResponse = await JSON.parse(result.replace("```json", "").replace('```', '').trim()) as TodoItem;
    setTodos(jsonResponse)
  }


  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar title="Abhi's Todo"/>
      <div className="flex-grow overflow-y-auto flex flex-col gap-3 p-4">
       
      </div>
    </div >
  );
}

export default App;
