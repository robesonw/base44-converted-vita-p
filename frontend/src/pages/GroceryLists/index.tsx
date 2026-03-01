import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function GroceryLists() {
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedStandaloneId, setSelectedStandaloneId] = useState('');
  const [listType, setListType] = useState('meal-plan');
  const [groceryList, setGroceryList] = useState(null);
  const [newListName, setNewListName] = useState('');

  const queryClient = useQueryClient();

  const { data: mealPlans = [] } = useQuery({ queryKey: ['mealPlans'], queryFn: () => base44.entities.MealPlan.list('-created_date') });
  const { data: standaloneLists = [] } = useQuery({ queryKey: ['standaloneLists'], queryFn: () => base44.entities.GroceryList.list('-created_date') });

  const createStandaloneListMutation = useMutation({ 
    mutationFn: (data) => base44.entities.GroceryList.create(data),
    onSuccess: (newList) => {
      queryClient.invalidateQueries({ queryKey: ['standaloneLists'] });
      setSelectedStandaloneId(newList.id);
      setListType('standalone');
      toast.success('List created');
    },
  });

  const handleCreateStandaloneList = () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    const emptyList = {
      'Proteins': [],
      'Vegetables': [],
      'Grains': [],
      'Dairy/Alternatives': [],
      'Fruits': [],
      'Other': []
    };

    createStandaloneListMutation.mutate({
      name: newListName,
      items: emptyList,
      total_cost: 0
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Grocery Lists</h1>
      <div className="mb-4">
        <Button onClick={() => setCreateListDialogOpen(true)}>Create List</Button>
      </div>
      <Dialog open={createListDialogOpen} onOpenChange={setCreateListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Standalone Grocery List</DialogTitle>
          </DialogHeader>
          <input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name..."
            className="border p-2"
          />
          <Button onClick={handleCreateStandaloneList}>Create</Button>
        </DialogContent>
      </Dialog>
      <div>
        {standaloneLists.map((list) => (
          <Card key={list.id} className="mb-2">
            <CardHeader>
              <CardTitle>{list.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Render your items here */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}