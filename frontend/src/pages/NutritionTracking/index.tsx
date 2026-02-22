import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function NutritionTracking() {
  const { user } = useAuth();
  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(150);

  const queryClient = useQueryClient();

  const createNutritionGoal = useMutation({
    mutationFn: (data) => apiFetch('POST', '/api/nutritionGoals', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['nutritionGoals']);
      toast.success('Nutrition goal saved!');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNutritionGoal.mutateAsync({
      created_by: user.email,
      target_calories: targetCalories,
      target_protein: targetProtein,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Target Calories</Label>
        <Input type="number" value={targetCalories} onChange={(e) => setTargetCalories(Number(e.target.value))} />

        <Label>Target Protein</Label>
        <Input type="number" value={targetProtein} onChange={(e) => setTargetProtein(Number(e.target.value))} />

        <Button onClick={handleSubmit}>Save Goal</Button>
      </CardContent>
    </Card>
  );
}