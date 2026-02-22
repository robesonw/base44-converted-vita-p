import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface NutritionGoal {
  id: string;
  goal_type: string;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
}

export default function NutritionTracking() {
  const { user } = useAuth();
  const [goalDialogOpen, setGoalDialogOpen] = useState<boolean>(false);
  const [logDialogOpen, setLogDialogOpen] = useState<boolean>(false);
  const [goalType, setGoalType] = useState<string>('daily');
  const [targetCalories, setTargetCalories] = useState<number>(2000);
  const [targetProtein, setTargetProtein] = useState<number>(150);
  const [targetCarbs, setTargetCarbs] = useState<number>(200);
  const [targetFat, setTargetFat] = useState<number>(65);

  const queryClient = useQueryClient();

  const { data: goals = [] }: { data: NutritionGoal[] } = useQuery({
    queryKey: ['nutritionGoals', user?.email],
    queryFn: () => apiFetch('GET', `/api/nutritionGoals?created_by=${user?.email}`),
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: NutritionGoal) => apiFetch('POST', '/api/nutritionGoals', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['nutritionGoals']);
      toast.success('Goal saved!');
      setGoalDialogOpen(false);
    },
  });

  const handleSaveGoal = () => {
    createGoalMutation.mutate({
      goal_type: goalType,
      target_calories: targetCalories,
      target_protein: targetProtein,
      target_carbs: targetCarbs,
      target_fat: targetFat,
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Nutrition Tracking</h2>
      <Button onClick={() => setGoalDialogOpen(true)}>Add Goal</Button>
      {goalDialogOpen && (
        <motion.div className="fixed inset-0 flex items-center justify-center z-50">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Add Nutrition Goal</CardTitle>
              <Button onClick={() => setGoalDialogOpen(false)}>Close</Button>
            </CardHeader>
            <CardContent>
              <Label htmlFor="goalType">Goal Type</Label>
              <Select onChange={(e) => setGoalType(e.target.value)} value={goalType}>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </Select>
              <Label htmlFor="targetCalories">Target Calories</Label>
              <Input type="number" value={targetCalories} onChange={(e) => setTargetCalories(Number(e.target.value))} />
              <Label htmlFor="targetProtein">Target Protein (g)</Label>
              <Input type="number" value={targetProtein} onChange={(e) => setTargetProtein(Number(e.target.value))} />
              <Button onClick={handleSaveGoal}>Save Goal</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
      {/* Other UI elements for logs, charts, etc. go here */}
    </div>
  );
}