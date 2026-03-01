import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function MealPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const queryClient = useQueryClient();

  const { data: mealPlans = [], isLoading } = useQuery({ queryKey: ['mealPlans'], queryFn: () => base44.entities.MealPlan.list('-created_date') });

  const deletePlanMutation = useMutation({ 
    mutationFn: (planId) => base44.entities.MealPlan.delete(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      toast.success('Meal plan deleted');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Meal Plans</h1>
      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="plans">
          {mealPlans.length === 0 ? (
            <Card className="border-dashed">
              <CardContent>No Meal Plans Yet</CardContent>
            </Card>
          ) : (
            mealPlans.map(plan => (
              <Card key={plan.id} className="mb-2">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => console.log(plan)}>View</Button>
                  <Button onClick={() => deletePlanMutation.mutate(plan.id)}>Delete</Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}