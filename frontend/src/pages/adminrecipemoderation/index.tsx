import React, { useState } from 'react';
import { base44 } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Clock, Flame, ChefHat } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AdminRecipeModeration() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['allSharedRecipes'],
    queryFn: () => base44.entities.SharedRecipe.list('-created_date'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }) => 
      base44.entities.SharedRecipe.update(id, { status, moderation_notes: notes }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allSharedRecipes'] });
      queryClient.invalidateQueries({ queryKey: ['sharedRecipes'] });
      toast.success(`Recipe ${variables.status}`);
      setSelectedRecipe(null);
      setModerationNotes('');
      
      // Notify recipe author
      const recipe = recipes.find(r => r.id === variables.id);
      if (recipe?.created_by) {
        base44.entities.Notification.create({
          recipient_email: recipe.created_by,
          type: variables.status === 'approved' ? 'recipe_approved' : 'recipe_rejected',
          title: `Recipe ${variables.status === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `Your recipe \