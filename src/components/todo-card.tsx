import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";

type TodoCardProps = {
  title: string;
  description: string;
}
export function TodoCard(props: TodoCardProps) {
  return (
    <Card className="flex flex-row items-center">
      <div className="flex-1">
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row">
          <CardDescription className="flex-1">
            <p>{props.description}</p>
          </CardDescription>
        </CardContent>
      </div>
      <Checkbox className="mx-10 w-5 h-5 rounded-lg" id="chkBox" />
    </Card>
  )
}