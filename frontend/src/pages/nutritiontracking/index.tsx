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
import { useAuth } from '@/contexts/AuthContext';
import FoodDatabaseSearch from '@/components/nutrition/FoodDatabaseSearch';
import MicronutrientTargetSelector from '@/components/nutrition/MicronutrientTargetSelector';
import MicronutrientProgressCard from '@/components/nutrition/MicronutrientProgressCard';
import ShareProgressDialog from '@/components/progress/ShareProgressDialog';
import { apiFetch } from '@/lib/api';

interface Goal {
    id?: string;
    goal_type: string;
    target_calories: number;
    target_protein: number;
    target_carbs: number;
    target_fat: number;
    target_micronutrients?: { [key: string]: any };
    is_active: boolean;
}

interface Log {
    log_date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servings?: number;
    micronutrients?: { [key: string]: { value: number; unit: string } };
}

const NutritionTracking: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [goalDialogOpen, setGoalDialogOpen] = useState(false);
    const [logDialogOpen, setLogDialogOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [goalForm, setGoalForm] = useState<Goal>({
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

    const { data: goals = [] } = useQuery({
        queryKey: ['nutritionGoals', user?.email],
        queryFn: () => apiFetch('GET', `/api/nutritiongoals?created_by=${user?.email}`),
        enabled: !!user?.email,
    });

    const createGoalMutation = useMutation({
        mutationFn: (data: Goal) => apiFetch('POST', '/api/nutritiongoals', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nutritionGoals'] });
            toast.success('Goal saved!');
            setGoalDialogOpen(false);
            setEditingGoal(null);
        },
    });

    const updateGoalMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Goal; }) => apiFetch('PUT', `/api/nutritiongoals/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nutritionGoals'] });
            toast.success('Goal updated!');
            setGoalDialogOpen(false);
            setEditingGoal(null);
        },
    });

    const { data: logs = [] } = useQuery({
        queryKey: ['nutritionLogs', user?.email],
        queryFn: () => apiFetch('GET', `/api/nutritionlogs?created_by=${user?.email}`),
        enabled: !!user?.email,
    });

    const handleSaveGoal = () => {
        if (editingGoal) {
            updateGoalMutation.mutate({ id: editingGoal.id!, data: goalForm });
        } else {
            // Deactivate other active goals of same type
            const otherGoals = goals.filter(g => g.goal_type === goalForm.goal_type && g.is_active);
            otherGoals.forEach(g => {
                apiFetch('PUT', `/api/nutritiongoals/${g.id}`, { is_active: false });
            });
            createGoalMutation.mutate({ ...goalForm, is_active: true });
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Nutrition Tracking</h1>
            <Button onClick={() => setGoalDialogOpen(true)}>Add Goal</Button>
            <Card>
                <CardHeader>
                    <CardTitle>Your Goals</CardTitle>
                </CardHeader>
                <CardContent>
                    {goals.map(goal => (
                        <div key={goal.id} className="p-2 border-b">
                            <div>{goal.goal_type}: {goal.target_calories} Calories</div>
                            <Button onClick={() => { setEditingGoal(goal); setGoalDialogOpen(true); }}>Edit</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
                    </DialogHeader>
                    <Label className="block mb-2">Calories</Label>
                    <Input type="number" value={goalForm.target_calories} onChange={e => setGoalForm({ ...goalForm, target_calories: parseInt(e.target.value) })} />
                    <Button onClick={handleSaveGoal}>Save</Button>
                </DialogContent>
            </Dialog>

            <FoodDatabaseSearch onSelectFood={(food) => {/* Handle food selection here */}} />
            <MicronutrientProgressCard logs={logs} activeGoal={goals.find(g => g.is_active) || undefined} />
            <ShareProgressDialog open={logDialogOpen} onOpenChange={setLogDialogOpen} logs={logs} />
        </div>
    );
};

export default NutritionTracking;