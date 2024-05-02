import { useState } from 'react';
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig } from '@google/generative-ai';

import "./App.css";
import { Checkbox } from '@radix-ui/react-checkbox';
import { Separator } from './components/ui/separator';


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

  const [modalOpen, setModalOpen] = useState(false);


  const generateTodos = async () => {
    const genAI = new GoogleGenerativeAI("AIzaSyA1UPh9wtgjg0dSoERv-0rYI6CW3klNC28");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      systemInstruction: "You are a an expert in splitting a task into smaller subtasks. Given you a task,  divide the task into a smaller subtasks. For each subtask provide a title and description and also add smaller subtask for that subtask. Structure your responses in a proper JSON format.\n\n{\n  title: string,\n  taskDescription: string,\n  subtasks: Array<{\n    title: string,\n    description: string,\n  }>\n}"
    });

    const generationConfig: GenerationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,

    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings
    });

    const result = await chat.sendMessage(`You are a an expert in splitting a task into smaller subtasks. Given you a task,  divide the task into a smaller subtasks. For each subtask provide a title and description and also add smaller non overlapping subtask for that subtask. Structure your responses in a proper JSON format.
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
    const response = result.response;
    console.log(response.text())
    const jsonResponse = await JSON.parse(response.text().replace("```json", "").replace('```', '').trim()) as TodoItem;
    console.log(jsonResponse);
    setTodos(jsonResponse)
  }


  return (
    <div className="flex flex-col h-screen w-screen">
      <nav className='w-screen p-4 flex flex-row justify-between'>
        <div className='flex flex-col gap-2 ml-3'>
          <h1 className="text-lg font-semibold">
            {todos?.title}
          </h1>
          <p className='text-sm opacity-70'>{todos?.taskDescription}</p>
        </div>


        <Dialog>
          <DialogTrigger>
            <Plus color='white' />
          </DialogTrigger>
          <DialogContent className='w-5/6'>
            <DialogHeader className='gap-2'>
              <DialogTitle>
                Create an Item
              </DialogTitle>
              <DialogDescription className='flex gap-3'>
                <Input placeholder='Todo Item' onChange={e => setTodo(e.target.value)} />
                <Button onClick={generateTodos}>Add Todo</Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </nav>

      <div className="flex-grow overflow-y-auto flex flex-col gap-3 p-4">
        {todos?.subtasks.map(todo => (
          <Card>
            <CardHeader>
              <CardTitle>{todo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p>{todo.description}</p>
                {todo.subtasks.map(st =>
                (
                  <div className="flex flex-col my-2 gap-2">
                    <div className='flex justify-center gap-3'>
                      <input type='checkbox' id={`todo-${st.title}`} />
                      <label htmlFor={`todo-${st.title}`}>
                        {st.description.trim()}
                      </label>
                    </div>
                  </div>
                )
                )}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* 
      <Separator />
      <div className="flex flex-row gap-3 my-3 h-content">
        <Input
          placeholder="Your todo goes here!"
          onChange={e => setTodo(e.target.value)}
        />
        <Button onClick={handleAddTodo}>Add Todo</Button>
      </div> */}


    </div >
  );
}

export default App;
