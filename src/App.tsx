import { useEffect, useState } from "react";
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'


import "./App.css";

function App() {

  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<string[]>([]);

  const handleAddTodo = async () => {
    setTodos(() => [...todos, todo]);
    setTodo(() => '');
  }


  const saveTodos = async () => {
    console.log("Writing todos to file")
    const todosJson = JSON.stringify({todos: todos}, null, 2);
    await writeTextFile("todos.json", todosJson, {dir: BaseDirectory.AppLocalData});
  }

  useEffect(() => {
    const intervalId = setInterval(saveTodos, 5000);
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="container">
      <h1>Streaks!</h1>
      <div className="todoInput">
        <input
          placeholder="Your todo goes here!"
          onChange={e => setTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>+</button>
      </div>

      {todos.map(todo => <p>{todo}</p>)}
    </div>
  );
}

export default App;
