import React, { useState } from 'react';
import { base44 } from '@/lib/api';
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
import PlanDetailsView from '../components/plans/PlanDetailsView';
import SharedPlanDetailDialog from '../components/community/SharedPlanDetailDialog';
import createPageUrl from '@/utils/createPageUrl';

export default function SharedMealPlans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPlanForShare, setSelectedPlanForShare] = useState(null);
  const [shareForm, setShareForm] = useState({ title: '', description: '', tags: '' });
  const [viewingPlan, setViewingPlan] = useState(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: '' });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState(null);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: sharedPlans = [] } = useQuery({
    queryKey: ['sharedMealPlans'],
    queryFn: () => base44.entities.SharedMealPlan.list('-created_date'),
  });

  const { data: myPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => base44.entities.MealPlan.list('-created_date'),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => base44.entities.Review.list(),
  });

  const { data: following = [] } = useQuery({
    queryKey: ['following', user?.email],
    queryFn: () => base44.entities.UserFollow.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const sharePlanMutation = useMutation({
    mutationFn: (data) => base44.entities.SharedMealPlan.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharedMealPlans'] });
      toast.success('Meal plan shared with the community!');
      setShareDialogOpen(false);
      setShareForm({ title: '', description: '', tags: '' });
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: (data) => base44.entities.Review.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review added!');
      setRatingDialogOpen(false);
      setRatingForm({ rating: 5, comment: '' });
    },
  });

  const followMutation = useMutation({
    mutationFn: (data) => base44.entities.UserFollow.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast.success(`Following ${variables.following_user_name}`);
        
      // Create notification
      base44.entities.Notification.create({
        recipient_email: variables.following_user_email,
        type: 'new_follower',
        title: 'New Follower',
        message: `${user?.name || 'Someone'} started following you`,
        actor_name: user?.name || 'Anonymous',
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (followId) => base44.entities.UserFollow.delete(followId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast.success('Unfollowed');
    },
  });

  const interactionMutation = useMutation({
    mutationFn: (data) => base44.entities.UserInteraction.create(data),
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
      author_name: user?.name || 'Anonymous',
    });
  };

  const handleLike = (plan) => {
    interactionMutation.mutate({
      target_id: plan.id,
      target_type: 'shared_plan',
      interaction_type: 'like',
    });
    
    // Create notification for author
    if (plan.created_by && plan.created_by !== user?.email) {
      base44.entities.Notification.create({
        recipient_email: plan.created_by,
        type: 'plan_like',
        title: 'Meal Plan Liked',
        message: `${user?.name || 'Someone'} liked your meal plan "${plan.title}"`,
        actor_name: user?.name || 'Anonymous',
      });
    }
    
    toast.success('Liked!');
  };

  const isFollowing = (userEmail) => {
    return following.some(f => f.following_user_email === userEmail);
  };

  const handleFollow = (plan) => {
    if (!plan.created_by) return;
    
    const existingFollow = following.find(f => f.following_user_email === plan.created_by);
    
    if (existingFollow) {
      unfollowMutation.mutate(existingFollow.id);
    } else {
      followMutation.mutate({
        following_user_email: plan.created_by,
        following_user_name: plan.author_name,
      });
    }
  };

  return (
    <div>
      {/* UI Components Here */}
    </div>
  );
}