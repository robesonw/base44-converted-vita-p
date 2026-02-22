import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SharedRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: recipes = [] } = useQuery({
    queryKey: ['sharedRecipes'],
    queryFn: () => apiFetch('GET', '/api/sharedRecipes'),
  });

  const handleLike = async (recipeId) => {
    await apiFetch('POST', `/api/sharedRecipes/${recipeId}/like`);
    toast.success('Liked the recipe!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Shared Recipes</h1>
      <div className="space-y-4">
        {recipes.map(recipe => (
          <Card key={recipe.id} className="border-slate-200">
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <p className="text-sm text-slate-500">by {recipe.author_name}</p>
            </CardHeader>
            <CardContent>
              <p>{recipe.description}</p>
              <Button onClick={() => handleLike(recipe.id)}>Like</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}