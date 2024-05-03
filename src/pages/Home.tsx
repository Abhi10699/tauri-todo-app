import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';

import { invoke } from '@tauri-apps/api';


interface INewActivityForm {
  activityTitle: string;
  activityDescription: string,
  useGenerativeAi: boolean
}

export function Home() {

  const { register, setValue, handleSubmit, getValues } = useForm<INewActivityForm>({
    mode: "onChange",
    defaultValues: {
      activityDescription: '',
      activityTitle: '',
      useGenerativeAi: true
    }
  })

  const createActivity = async (formValues: INewActivityForm) => {
    console.log(formValues);
    // make rust api call here 🤩🤩
    const resp = await invoke('create_activity', {...formValues});
  }

  return (
    <div>
      <Navbar title="Abhi's Todo" dialogTitle="New Activity 🏃‍♂️">
        <Input
          placeholder='Activity Title'
          {...register('activityTitle')} />
        <Textarea
          placeholder="Briefly Describe your activity, what will you be doing?"
          rows={10}
          {...register('activityDescription')} />
        <div
          className="flex flex-row items-center justify-between">
          <label htmlFor="use-ai">Use AI to generate todo's for your activity</label>
          <Switch
            defaultChecked={getValues('useGenerativeAi')}
            id="use-ai"
            onCheckedChange={e => setValue('useGenerativeAi', e)} />
        </div>
        {/* TODO: Add Error handler */}
        <Button className="rounded-lg" onClick={handleSubmit(createActivity)}>Create ✨</Button>
      </Navbar>
      <div className="p-3">
        <Card>
          <CardHeader>
            <CardTitle
              className="cursor-pointer hover:text-green-600 transition-all">
              Making a sandwhich 🥪
            </CardTitle>
            <CardDescription>
              {/* <p>26<sup>th</sup> April 2024</p> */}
              You have 10 incomplete tasks out of 20 tasks
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}