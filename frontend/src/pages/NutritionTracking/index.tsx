import React, { useState, useMemo } from 'react';
import { base44 } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import ShareProgressDialog from '../components/progress/ShareProgressDialog';
import FoodDatabaseSearch from '../components/nutrition/FoodDatabaseSearch';
import MicronutrientTargetSelector from '../components/nutrition/MicronutrientTargetSelector';
import MicronutrientProgressCard from '../components/nutrition/MicronutrientProgressCard';

export default function NutritionTracking() {
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['nutritionGoals', user?.email],
    queryFn: () => base44.entities.NutritionGoal.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['nutritionLogs', user?.email],
    queryFn: () => base44.entities.NutritionLog.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const createGoalMutation = useMutation({
    mutationFn: (data) => base44.entities.NutritionGoal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionGoals'] });
      toast.success('Goal saved!');
      setGoalDialogOpen(false);
    },
  });

  const handleSaveGoal = () => {
    // Call createGoalMutation here
  };

  return (
    <div>
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Nutrition Goal</DialogTitle>
          </DialogHeader>
          <Label>Goal Type</Label>
          <Select onValueChange={(value) => { /* handle selection */ }}>
            <SelectTrigger><SelectValue placeholder="Select a goal type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSaveGoal}>Save Goal</Button>
        </DialogContent>
      </Dialog>

      <Button onClick={() => setGoalDialogOpen(true)}>Set Goal</Button>

      <Card>
        <CardHeader>
          <CardTitle>Nutrition Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <MicronutrientProgressCard logs={logs} activeGoal={goals.find(goal => goal.is_active)} />
        </CardContent>
      </Card>
    </div>
  );
}
