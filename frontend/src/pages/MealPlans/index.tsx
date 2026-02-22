import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import FavoriteMealsPanel from '../components/meals/FavoriteMealsPanel';
import PlanDetailsView from '../components/plans/PlanDetailsView';
import SharePlanDialog from '../components/share/SharePlanDialog';
import { Calendar, Trash2, Eye, Heart, Share2 } from 'lucide-react';

const MealPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [planToShare, setPlanToShare] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data: mealPlans = [], isLoading } = useQuery<{ id: string; name: string; diet_type: string; days: any[]; created_date: string }[]>({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/mealPlans'),
  });

  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => apiFetch('DELETE', `/api/mealPlans/${planId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['mealPlans']);
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meal Plans & Favorites</h1>
      <p className="text-slate-600 mt-1">View your saved meal plans and favorite meals</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mealPlans.map((plan, index) => (
          <Card key={plan.id} className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base mb-2">{plan.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewPlan(plan)}>
                  <Eye className="w-4 h-4 mr-2" /> View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleSharePlan(plan)}>
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => deletePlanMutation.mutate(plan.id)}>
                  <Trash2 className="w-4 h-4 text-rose-600" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlanDetailsView plan={selectedPlan} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
      <SharePlanDialog plan={planToShare} open={shareDialogOpen} onOpenChange={setShareDialogOpen} />
      <FavoriteMealsPanel />
    </div>
  );
};

export default MealPlans;