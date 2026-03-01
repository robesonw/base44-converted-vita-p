import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import PlanDetailsView from '@/components/plans/PlanDetailsView';
import SharedPlanDetailDialog from '@/components/community/SharedPlanDetailDialog';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ShareForm {
  title: string;
  description: string;
  tags: string;
}

export default function SharedMealPlans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPlanForShare, setSelectedPlanForShare] = useState<any>(null);
  const [shareForm, setShareForm] = useState<ShareForm>({ title: '', description: '', tags: '' });
  const [viewingPlan, setViewingPlan] = useState<any>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [ratingForm, setRatingForm] = useState<{ rating: number; comment: string }>({ rating: 5, comment: '' });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<any>(null);

  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { data: sharedPlans = [] } = useQuery({
    queryKey: ['sharedMealPlans'],
    queryFn: () => apiFetch('GET', '/api/shared-meal-plans')
  });

  const sharePlanMutation = useMutation({
    mutationFn: (data: any) => apiFetch('POST', '/api/shared-meal-plans', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharedMealPlans'] });
      toast.success('Meal plan shared with the community!');
      setShareDialogOpen(false);
      setShareForm({ title: '', description: '', tags: '' });
    },
  });

  const interactionMutation = useMutation({
    mutationFn: (data: any) => apiFetch('POST', '/api/user-interactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharedMealPlans'] });
    },
  });

  const handleShare = () => {
    if (!selectedPlanForShare || !shareForm.title) {
      toast.error('Please fill in required fields');
      return;
    }

    sharePlanMutation.mutate({
      original_plan_id: selectedPlanForShare.id,
      title: shareForm.title,
      description: shareForm.description,
      plan_data: selectedPlanForShare,
      diet_type: selectedPlanForShare.diet_type,
      cultural_style: selectedPlanForShare.cultural_style,
      tags: shareForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      author_name: user.full_name || 'Anonymous',
    });
  };

  const filteredPlans = sharedPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || plan.diet_type === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Shared Meal Plans</h1>
        <Button onClick={() => setShareDialogOpen(true)}>Share Plan</Button>
      </div>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredPlans.map(plan => (
        <Card key={plan.id}> 
          <CardHeader>
            <CardTitle>{plan.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Other UI elements for the plan */}
            <Button onClick={() => setViewingPlan(plan)}>View Details</Button>
          </CardContent>
        </Card>
      ))}

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Share Meal Plan</DialogTitle>
          </DialogHeader>
          <Label>Title</Label>
          <Input value={shareForm.title} onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })} />
          <Label>Description</Label>
          <Textarea value={shareForm.description} onChange={(e) => setShareForm({ ...shareForm, description: e.target.value })} />
          <Label>Tags</Label>
          <Textarea value={shareForm.tags} onChange={(e) => setShareForm({ ...shareForm, tags: e.target.value })} />
          <Button onClick={handleShare}>Share</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}