import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function SharedMealPlans() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { data: sharedPlans = [] } = useQuery({
    queryKey: ['sharedMealPlans'],
    queryFn: () => apiFetch('GET', '/api/sharedMealPlans'),
  });

  const handleLike = async (planId) => {
    await apiFetch('POST', `/api/sharedMealPlans/${planId}/like`);
    toast.success('Liked the plan!');
    queryClient.invalidateQueries(['sharedMealPlans']);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Shared Meal Plans</h1>
      <div className="space-y-4">
        {sharedPlans.map(plan => (
          <Card key={plan.id} className="border-slate-200">
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <p className="text-sm text-slate-500">by {plan.author_name}</p>
            </CardHeader>
            <CardContent>
              <Textarea value={plan.description} readOnly />
              <Button onClick={() => handleLike(plan.id)}>Like</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}