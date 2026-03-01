import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import ShareProgressDialog from '@/components/progress/ShareProgressDialog';
import FoodDatabaseSearch from '@/components/nutrition/FoodDatabaseSearch';
import MicronutrientTargetSelector from '@/components/nutrition/MicronutrientTargetSelector';
import MicronutrientProgressCard from '@/components/nutrition/MicronutrientProgressCard';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const NutritionTracking: React.FC = () => {
  const { user } = useAuth();

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logMethod, setLogMethod] = useState('manual');
  const [goalForm, setGoalForm] = useState({
    goal_type: 'daily',
    target_calories: 2000,
    target_protein: 150,
    target_carbs: 200,
    target_fat: 65,
    target_micronutrients: {}
  });

  const [logForm, setLogForm] = useState({
    recipe_name: '',
    meal_type: 'lunch',
    log_date: format(new Date(), 'yyyy-MM-dd'),
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servings: 1,
    micronutrients: {},
    food_source: 'manual',
    food_id: null
  });

  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery({
    queryKey: ['nutritionGoals', user?.email],
    queryFn: () => apiFetch('GET', `/api/nutritiongoals?created_by=${user?.email}`),
    enabled: !!user?.email
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['nutritionLogs', user?.email],
    queryFn: () => apiFetch('GET', `/api/nutritionlogs?created_by=${user?.email}`),
    enabled: !!user?.email
  });

  const createGoalMutation = useMutation({
    mutationFn: (data) => apiFetch('POST', '/api/nutritiongoals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionGoals'] });
      toast.success('Goal saved!');
      setGoalDialogOpen(false);
    },
  });

  const createLogMutation = useMutation({
    mutationFn: (data) => apiFetch('POST', '/api/nutritionlogs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionLogs'] });
      toast.success('Meal logged!');
      setLogDialogOpen(false);
      setLogForm({
        recipe_name: '',
        meal_type: 'lunch',
        log_date: format(new Date(), 'yyyy-MM-dd'),
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        servings: 1,
        micronutrients: {},
        food_source: 'manual',
        food_id: null
      });
    },
  });

  const handleSaveGoal = () => {
    createGoalMutation.mutate(goalForm);
  };

  const handleLogFood = () => {
    createLogMutation.mutate(logForm);
  };

  return (
    <div>
      <Button onClick={() => setGoalDialogOpen(true)}>Set Goal</Button>
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Nutrition Goal</DialogTitle>
          </DialogHeader>
          <Label>Target Calories</Label>
          <Input type="number" value={goalForm.target_calories} onChange={(e) => setGoalForm({ ...goalForm, target_calories: +e.target.value })} />
          <Button onClick={handleSaveGoal}>Save Goal</Button>
        </DialogContent>
      </Dialog>

      <Button onClick={() => setLogDialogOpen(true)}>Log Meal</Button>
      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Meal</DialogTitle>
          </DialogHeader>
          <Label>Recipe Name</Label>
          <Input value={logForm.recipe_name} onChange={(e) => setLogForm({ ...logForm, recipe_name: e.target.value })} />
          <Label>Calories</Label>
          <Input type="number" value={logForm.calories} onChange={(e) => setLogForm({ ...logForm, calories: +e.target.value })} />
          <Button onClick={handleLogFood}>Log Meal</Button>
        </DialogContent>
      </Dialog>

      {/* Other components like MicronutrientProgressCard or FoodDatabaseSearch can be placed here */}

      <MicronutrientProgressCard logs={logs} activeGoal={goals.find(g => g.is_active)} />
      <FoodDatabaseSearch onSelectFood={(food) => setLogForm({ ...logForm, ...food })} />
      <MicronutrientTargetSelector targets={goalForm.target_micronutrients} onChange={(newTargets) => setGoalForm({ ...goalForm, target_micronutrients: newTargets })} />
    </div>
  );
};

export default NutritionTracking;
