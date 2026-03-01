import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import SharedRecipeDetailDialog from '@/components/community/SharedRecipeDetailDialog';
import SubmitRecipeDialog from '@/components/community/SubmitRecipeDialog';

interface RecipeFilters {
  searchTerm: string;
  mealType: string;
  cuisine: string;
  dietary: string;
}

export default function SharedRecipes() {
  const [filters, setFilters] = useState<RecipeFilters>({ searchTerm: '', mealType: 'all', cuisine: 'all', dietary: 'all' });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: allSharedRecipes = [] } = useQuery({
    queryKey: ['sharedRecipes'],
    queryFn: () => apiFetch('GET', '/api/shared-recipes')
  });

  const filteredRecipes = allSharedRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesMealType = filters.mealType === 'all' || recipe.meal_type === filters.mealType;
    const matchesCuisine = filters.cuisine === 'all' || recipe.cuisine === filters.cuisine;
    const matchesDietary = filters.dietary === 'all' || recipe.tags.includes(filters.dietary);
    return matchesSearch && matchesMealType && matchesCuisine && matchesDietary;
  });

  const interactionMutation = useMutation({
    mutationFn: (data: any) => apiFetch('POST', '/api/user-interactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharedRecipes'] });
    },
  });

  const handleLike = (recipeId: string, authorEmail: string) => {
    interactionMutation.mutate({
      target_id: recipeId,
      target_type: 'shared_recipe',
      interaction_type: 'like',
    });
    toast.success('Liked!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Recipes</h1>
        <Button onClick={() => setSubmitDialogOpen(true)}>
          Submit Recipe
        </Button>
      </div>
      <Input
        placeholder="Search by name..."
        value={filters.searchTerm}
        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      />
      {filteredRecipes.map(recipe => (
        <Card key={recipe.id}> 
          <CardHeader>
            <CardTitle>{recipe.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Badge>{recipe.meal_type}</Badge>
              <Button onClick={() => handleLike(recipe.id, recipe.created_by)}>Like</Button>
              <Button onClick={() => { setSelectedRecipe(recipe); setDetailDialogOpen(true); }}>View Details</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <SharedRecipeDetailDialog recipe={selectedRecipe} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />
        </DialogContent>
      </Dialog>

      <SubmitRecipeDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen} />
    </div>
  );
}