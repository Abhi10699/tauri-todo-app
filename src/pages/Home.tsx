import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';

import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from "react";


interface INewActivity {
  activityTitle: string;
  activityDescription: string,
  useGenerativeAi: boolean
}

interface INewActivityRs {
  activity_title: string;
  activity_description: string,
  use_gen_ai: boolean
}


export function Home() {

  const [activities, setActivities] = useState<INewActivity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);


  const { register, setValue, handleSubmit, getValues, reset } = useForm<INewActivity>({
    mode: "onChange",
    defaultValues: {
      activityDescription: '',
      activityTitle: '',
      useGenerativeAi: true
    }
  })

  const createActivity = async (formValues: INewActivity) => {
    try {
      const activityRes = await invoke<INewActivityRs>('create_activity', { ...formValues });
      setActivities([...activities, {
        activityDescription: activityRes.activity_description,
        activityTitle: activityRes.activity_title,
        useGenerativeAi: activityRes.use_gen_ai
      }]);
      reset(); // reset form
      setDialogOpen(false);
    }
    catch (err) {
      console.log(err);
    }
  }

  const fetchActivities = async () => {
    const activities = await invoke<Array<INewActivityRs>>('get_activities');

    const activityArr = activities.map(activity => ({
      activityDescription: activity.activity_description,
      activityTitle: activity.activity_title,
      useGenerativeAi: activity.use_gen_ai
    }));

    setActivities(activityArr);
  }

  useEffect(() => {
    fetchActivities();
  }, [])

  return (
    <div className="max-h-screen overflow-x-hidden">
      <Navbar title="Abhi's Todo" dialogTitle="New Activity 🏃‍♂️" handleDialogOpenChange={e => setDialogOpen(e)} dialogOpen={dialogOpen}>
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
        {activities.map((activity, idx) =>
          <Card className="mb-2" key={idx}>
            <CardHeader>
              <CardTitle
                className="cursor-pointer hover:text-green-600 transition-all select-none">
                {activity.activityTitle}
              </CardTitle>
              <CardDescription className="select-none">
                {/* <p>26<sup>th</sup> April 2024</p> */}
                {activity.activityDescription}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}