import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Clock, Flame, ChefHat } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Recipe {
  id: string;
  name: string;
  author_name: string;
  image_url: string;
  created_date: string;
  description: string;
  status: string;
  meal_type: string;
  cuisine: string;
  difficulty: string;
  calories: number;
}

export default function AdminRecipeModeration() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [moderationNotes, setModerationNotes] = useState<string>('');
  const queryClient = useQueryClient();
  const user = useAuth().user;

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>('allSharedRecipes', () => apiFetch('GET', '/api/recipes'));

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes: string }) => 
      apiFetch('PUT', `/api/recipes/${id}`, { status, moderation_notes: notes }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries('allSharedRecipes');
      toast.success(`Recipe ${variables.status}`);
      setSelectedRecipe(null);
      setModerationNotes('');

      // Notify recipe author
      const recipe = recipes.find(r => r.id === variables.id);
      if (recipe?.created_by) {
        apiFetch('POST', '/api/email/send', {
          recipient_email: recipe.created_by,
          type: variables.status === 'approved' ? 'recipe_approved' : 'recipe_rejected',
          title: `Recipe ${variables.status === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `Your recipe "${recipe.name}" has been ${variables.status}. ${variables.notes || ''}`,
          actor_name: 'Admin Team',
        });
      }
    },
  });

  const handleApprove = (recipe: Recipe) => {
    updateStatusMutation.mutate({
      id: recipe.id,
      status: 'approved',
      notes: moderationNotes
    });
  };

  const handleReject = (recipe: Recipe) => {
    updateStatusMutation.mutate({
      id: recipe.id,
      status: 'rejected',
      notes: moderationNotes
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Access denied. Admin only.</p>
      </div>
    );
  }

  const pendingRecipes = recipes.filter(r => r.status === 'pending');
  const approvedRecipes = recipes.filter(r => r.status === 'approved');
  const rejectedRecipes = recipes.filter(r => r.status === 'rejected');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Recipe Moderation</h1>
        <p className="text-slate-600 mt-1">Review and moderate community-submitted recipes</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-amber-900">{pendingRecipes.length}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">Approved</p>
                <p className="text-3xl font-bold text-emerald-900">{approvedRecipes.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rose-700 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-rose-900">{rejectedRecipes.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-rose-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recipe List */}
      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingRecipes.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRecipes.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRecipes.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {pendingRecipes.length === 0 ? <p>No pending recipes</p> : 
            pendingRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          }
        </TabsContent>
        <TabsContent value="approved">
          {approvedRecipes.length === 0 ? <p>No approved recipes</p> : 
            approvedRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          }
        </TabsContent>
        <TabsContent value="rejected">
          {rejectedRecipes.length === 0 ? <p>No rejected recipes</p> : 
            rejectedRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          }
        </TabsContent>
      </Tabs>

      {/* Dialog for moderation notes */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderation Notes</DialogTitle>
          </DialogHeader>
          <Textarea 
            className="resize-none" 
            value={moderationNotes} 
            onChange={(e) => setModerationNotes(e.target.value)}
            placeholder="Enter your notes..."
          />
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setSelectedRecipe(null)}>Cancel</Button>
            <Button className="ml-2" onClick={() => handleApprove(selectedRecipe!)}>Approve</Button>
            <Button className="ml-2" variant="destructive" onClick={() => handleReject(selectedRecipe!)}>Reject</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
  <Card className="border-slate-200 hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex gap-4">
        {recipe.image_url && <img src={recipe.image_url} alt={recipe.name} className="w-24 h-24 object-cover rounded-lg" />}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-slate-900">{recipe.name}</h3>
              <p className="text-xs text-slate-500">by {recipe.author_name} {"•"} {formatDistanceToNow(new Date(recipe.created_date), { addSuffix: true })}</p>
            </div>
            <Badge className={
              recipe.status === 'pending' ? 'bg-amber-100 text-amber-700' :
              recipe.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
              'bg-rose-100 text-rose-700'
            }>
              {recipe.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{recipe.description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);