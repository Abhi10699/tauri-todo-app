import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type TodoCardProps = {
  title: string;
  description: string;
  subtasks: Array<{
    title: string;
    description: string;
  }>
}
export function TodoCard(props: TodoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p>{props.description}</p>
          {props.subtasks.map(st =>
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
  )
}