import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';

import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


interface INewActivity {
  activityTitle: string;
  activityDescription: string,
  useGenerativeAi: boolean,
  id: number
}

interface INewActivityRs {
  group_title: string;
  group_description: string,
  use_gen_ai: boolean,
  id: number
}


export function Home() {

  const [activities, setActivities] = useState<INewActivity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

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
      const activityRes = await invoke<INewActivityRs>('create_group', { ...formValues });
      setActivities([...activities, {
        activityDescription: activityRes.group_title,
        activityTitle: activityRes.group_description,
        useGenerativeAi: activityRes.use_gen_ai,
        id: activityRes.id
      }]);
      reset(); // reset form
      setDialogOpen(false);
    }
    catch (err) {
      console.log(err);
    }
  }

  const fetchActivities = async () => {
    const activities = await invoke<Array<INewActivityRs>>('get_groups');
    const activityArr = activities.map(activity => ({
      activityDescription: activity.group_description,
      activityTitle: activity.group_title,
      useGenerativeAi: false, // TODO: this needs to be changed
      id: activity.id
    }));

    console.log(activityArr);

    setActivities(activityArr);
  }

  useEffect(() => {
    fetchActivities();
  }, [])

  return (
    <div className="max-h-screen overflow-x-hidden">
      <Navbar
        title="Abhi's Todo"
        dialogTitle="New Activity 🏃‍♂️"
        handleDialogOpenChange={e => setDialogOpen(e)}
        dialogOpen={dialogOpen}
      >
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
        <Button className="rounded-lg" onClick={handleSubmit(createActivity)}>Create ✨</Button>
      </Navbar>
      <div className="p-3">
        {activities.map((activity) =>
          <Card className="mb-2" key={activity.id}>
            <CardHeader>
              <CardTitle
                className="cursor-pointer hover:text-green-600 transition-all select-none"
                onClick={e => navigate(`/${activity.id}`, {
                  state: {
                    isNew: false,
                    navTitle: activity.activityTitle,
                    navDesc: activity.activityDescription
                  }
                })}>
                {activity.activityTitle}
              </CardTitle>
              <CardDescription className="select-none">
                {activity.activityDescription || "Activity description not available"}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}