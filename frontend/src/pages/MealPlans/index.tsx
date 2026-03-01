import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Trash2, Eye, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import PlanDetailsView from '../components/plans/PlanDetailsView';
import FavoriteMealsPanel from '../components/meals/FavoriteMealsPanel';
import SharePlanDialog from '../components/share/SharePlanDialog';

export default function MealPlans() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [planToShare, setPlanToShare] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data: mealPlans = [], isLoading } = useQuery('mealPlans', () => apiFetch('GET', '/api/meal-plans')); 

  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => apiFetch('DELETE', '/api/meal-plans/' + planId),
    onSuccess: () => {
      queryClient.invalidateQueries('mealPlans');
      toast.success('Meal plan deleted');
    },
  });

  const handleViewPlan = (plan: any) => {
    setSelectedPlan(plan);
    setViewDialogOpen(true);
  };

  const handleSharePlan = (plan: any) => {
    setPlanToShare(plan);
    setShareDialogOpen(true);
  };

  useEffect(() => {
    window.openMealPlanById = (planId: string) => {
      const plan = mealPlans.find((p: any) => p.id === planId);
      if (plan) {
        handleViewPlan(plan);
      } else {
        toast.error('Meal plan not found');
      }
    };
    return () => {
      delete window.openMealPlanById;
    };
  }, [mealPlans]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Meal Plans & Favorites</h1>
        <p className="text-slate-600 mt-1">View your saved meal plans and favorite meals</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {mealPlans.length === 0 ? (
            <Card className="border-slate-200 border-dashed">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Meal Plans Yet</h3>
                <p className="text-slate-600">Create your first meal plan in the Health Diet Hub</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealPlans.map((plan, index) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base mb-2">{plan.name}</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary">{plan.diet_type}</Badge>
                            <Badge variant="outline" className="text-xs">{plan.days.length || 0} days</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-slate-500 mb-4">Created {new Date(plan.created_date).toLocaleDateString()}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewPlan(plan)}>View</Button>
                        <Button variant="outline" size="sm" onClick={() => handleSharePlan(plan)}>Share</Button>
                        <Button variant="outline" size="sm" onClick={() => deletePlanMutation.mutate(plan.id)}>Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
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