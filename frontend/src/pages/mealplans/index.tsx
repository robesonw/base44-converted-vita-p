import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Trash2, Eye, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import PlanDetailsView from '@/components/plans/PlanDetailsView';
import FavoriteMealsPanel from '@/components/meals/FavoriteMealsPanel';
import SharePlanDialog from '@/components/share/SharePlanDialog';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function MealPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [planToShare, setPlanToShare] = useState(null);

  const queryClient = useQueryClient();

  const { data: mealPlans = [], isLoading } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/mealplans'),
  });

  const deletePlanMutation = useMutation({
    mutationFn: (planId) => apiFetch('DELETE', `/api/mealplans/${planId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      toast.success('Meal plan deleted');
    },
  });

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setViewDialogOpen(true);
  };

  const handleSharePlan = (plan) => {
    setPlanToShare(plan);
    setShareDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Meal Plans & Favorites</h1>
      <p className="text-slate-600 mt-1">View your saved meal plans and favorite meals</p>
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="plans"> {/* Display Meal Plans */} 
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealPlans.map((plan) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-slate-200 hover:shadow-lg"> 
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-2">{plan.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => handleViewPlan(plan)}>View</Button>
                    <Button onClick={() => handleSharePlan(plan)}><Share2 /></Button>
                    <Button onClick={() => deletePlanMutation.mutate(plan.id)} disabled={deletePlanMutation.isPending}><Trash2 /></Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <FavoriteMealsPanel />
        </TabsContent>
      </Tabs>

      <PlanDetailsView plan={selectedPlan} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
      <SharePlanDialog plan={planToShare} open={shareDialogOpen} onOpenChange={setShareDialogOpen} />
    </div>
  );
}