import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { PropsWithChildren } from "react";

type NavbarProps = {
  title: string;
  description?: String;
  primaryAction?: Function;
  dialogTitle?: string;
  dialogOpen?: boolean;

  handleDialogOpenChange?: (state: boolean) => void
}


export function Navbar(props: PropsWithChildren<NavbarProps>) {
  return (
    <nav className='w-screen p-4 flex flex-row justify-between'>
      <div className='flex flex-col gap-2 ml-3'>
        <h1 className="text-lg font-semibold select-none">
          {props.title}
        </h1>
        {props.description && <p className='text-sm opacity-70'>{props.description}</p>}
      </div>
      <Dialog onOpenChange={props.handleDialogOpenChange} open={props.dialogOpen}>
        <DialogTrigger>
          <Plus className="light:fill-black" />
        </DialogTrigger>
        <DialogContent className='w-5/6'>
          <DialogHeader className='gap-2'>
            <DialogTitle className="text-left">
              {props.dialogTitle}
            </DialogTitle>
            <DialogDescription className='flex flex-col gap-3'>
              {props.children}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </nav>
  )
}