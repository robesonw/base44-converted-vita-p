import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
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

interface User {
  role: string;
}

interface Recipe {
  id: string;
  name: string;
  image_url?: string;
  description: string;
  created_date: string;
  status: string;
  author_name: string;
  meal_type?: string;
  cuisine?: string;
  difficulty?: string;
  calories?: number;
}

export default function AdminRecipeModeration() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [moderationNotes, setModerationNotes] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: () => Promise.resolve({ role: 'admin' }),
  });

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ['allSharedRecipes'],
    queryFn: () => apiFetch('GET', '/api/shared-recipes'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }) => 
      apiFetch('PUT', `/api/shared-recipes/${id}`, { status, moderation_notes: notes }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allSharedRecipes'] });
      toast.success(`Recipe ${variables.status} successfully`);
      setSelectedRecipe(null);
      setModerationNotes('');

      // Notify recipe author
      const recipe = recipes.find(r => r.id === variables.id);
      if (recipe?.created_by) {
        apiFetch('POST', '/api/notifications', {
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

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-slate-900">{recipe.name}</h3>
                <p className="text-xs text-slate-500">
                  by {recipe.author_name} • {formatDistanceToNow(new Date(recipe.created_date), { addSuffix: true })}
                </p>
              </div>
              <Badge
                className={
                  recipe.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  recipe.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-rose-100 text-rose-700'
                }
              >
                {recipe.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{recipe.description}</p>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant="outline" className="capitalize text-xs">
                {recipe.meal_type}
              </Badge>
              {recipe.cuisine && <Badge variant="secondary" className="text-xs">{recipe.cuisine}</Badge>}
              {recipe.difficulty && (
                <Badge variant="outline" className="text-xs">
                  <ChefHat className="w-3 h-3 mr-1" />
                  {recipe.difficulty}
                </Badge>
              )}
              {recipe.calories && (
                <Badge variant="outline" className="text-xs">
                  <Flame className="w-3 h-3 mr-1 text-orange-500" />
                  {recipe.calories}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Review
              </Button>
              {recipe.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setTimeout(() => handleApprove(recipe), 100);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSelectedRecipe(recipe)}
                    variant="destructive"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      <Tabs value={selectedRecipe ? 'details' : 'all'}>  
        <TabsList>
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          {selectedRecipe && <TabsTrigger value="details">Recipe Details</TabsTrigger>}
        </TabsList>
        <TabsContent value="all">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </TabsContent>
        <TabsContent value="details">
          <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedRecipe?.name}</DialogTitle>
              </DialogHeader>
              <p>{selectedRecipe?.description}</p>
              <Textarea
                placeholder="Moderation notes..."
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
              />
              <Button onClick={() => handleApprove(selectedRecipe)}>Approve</Button>
              <Button onClick={() => handleReject(selectedRecipe)}>Reject</Button>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}