import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface MealPlan {
  id: string;
  title: string;
  description: string;
  diet_type: string;
  plan_data: object;
  author_name: string;
}

export default function SharedMealPlans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareForm, setShareForm] = useState({ title: '', description: '', tags: '' });
  const queryClient = useQueryClient();

  const { data: sharedPlans = [] } = useQuery<MealPlan[]>('sharedMealPlans', () => 
    apiFetch('GET', '/api/sharedMealPlans')
  );

  const sharePlanMutation = useMutation({
    mutationFn: (data) => apiFetch('POST', '/api/sharedMealPlans', data),
    onSuccess: () => {
      queryClient.invalidateQueries('sharedMealPlans');
      toast.success('Meal plan shared!');
      setShareDialogOpen(false);
      setShareForm({ title: '', description: '', tags: '' });
    },
  });

  const handleShare = () => {
    if (!shareForm.title) {
      toast.error('Please enter a title');
      return;
    }

    sharePlanMutation.mutate({
      ...shareForm,
      plan_data: {}, // Add actual plan data here
diet_type: 'general',
      author_name: 'Anonymous',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Shared Meal Plans</h1>
        <Button onClick={() => setShareDialogOpen(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Submit Meal Plan
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="relative">
        <Input
          placeholder="Search meal plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Meal Plans List */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        {sharedPlans.filter(plan => plan.title.toLowerCase().includes(searchTerm.toLowerCase())).map(plan => (
          <Card key={plan.id} className="border-slate-200">
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge>{plan.diet_type}</Badge>
                <span className="text-sm text-slate-500">by {plan.author_name}</span>
              </div>
            </CardHeader>
            <CardContent>{plan.description}</CardContent>
          </Card>
        ))}
      </div>

      {/* Share Plan Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share a Meal Plan</DialogTitle>
          </DialogHeader>
          <Label>
            Title
            <Input value={shareForm.title} onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })} />
          </Label>
          <Label>
            Description
            <Textarea value={shareForm.description} onChange={(e) => setShareForm({ ...shareForm, description: e.target.value })} />
          </Label>
          <Select value={shareForm.diet_type} onValueChange={(val) => setShareForm({ ...shareForm, diet_type: val })}>
            <SelectTrigger><SelectValue placeholder="Select a diet type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
              <SelectItem value="pescatarian">Pescatarian</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleShare} className="mt-4">Share</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}