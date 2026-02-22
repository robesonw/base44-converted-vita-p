import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Recipe {
  id: string;
  name: string;
  description: string;
  created_by: string;
  meal_type: string;
}

export default function SharedRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: allSharedRecipes = [] } = useQuery<Recipe[]>('sharedRecipes', () => 
    apiFetch('GET', '/api/sharedRecipes')
  );

  const filteredRecipes = allSharedRecipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Recipes</h1>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          New Recipe
        </Button>
      </div>

      <Input
        placeholder="Search by name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-4 mt-4">
        {filteredRecipes.map(recipe => (
          <Card key={recipe.id} className="border-slate-200">
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <p className="text-sm text-slate-500">by {recipe.created_by}</p>
            </CardHeader>
            <CardContent>{recipe.description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}