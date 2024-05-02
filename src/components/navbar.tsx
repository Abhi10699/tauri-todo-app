import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";

type NavbarProps = {
  title: string;
  description?: String;
  primaryAction?: Function;
}


export function Navbar(props: NavbarProps) {
  return (
    <nav className='w-screen p-4 flex flex-row justify-between'>
      <div className='flex flex-col gap-2 ml-3'>
        <h1 className="text-lg font-semibold select-none">
          {props.title}
        </h1>
        {props.description && <p className='text-sm opacity-70'>{props.description}</p>}
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
              {/* Todo: this can be changed  */}
              {/* <Input placeholder='Todo Item' onChange={e => setTodo(e.target.value)} />
              <Button onClick={generateTodos}>Add Todo</Button> */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </nav>
  )
}