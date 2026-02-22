import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export default function GroceryLists() {
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedStandaloneId, setSelectedStandaloneId] = useState('');
  const [listType, setListType] = useState('meal-plan'); // 'meal-plan' or 'standalone'
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [groceryList, setGroceryList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [createListDialogOpen, setCreateListDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/mealplans'),
  });

  const { data: standaloneLists = [] } = useQuery({
    queryKey: ['standaloneLists'],
    queryFn: () => apiFetch('GET', '/api/grocerylists'),
  });

  const createStandaloneListMutation = useMutation({
    mutationFn: (data) => apiFetch('POST', '/api/grocerylists', data),
    onSuccess: (newList) => {
      queryClient.invalidateQueries({ queryKey: ['standaloneLists'] });
      setSelectedStandaloneId(newList.id);
      setListType('standalone');
      toast.success('List created');
      setCreateListDialogOpen(false);
      setNewListName('');
    },
  });

  const handleCreateStandaloneList = () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    const emptyList = { 'Proteins': [], 'Vegetables': [], 'Grains': [], 'Dairy/Alternatives': [], 'Fruits': [], 'Other': [] };

    createStandaloneListMutation.mutate({ name: newListName, items: emptyList, total_cost: 0 });
  };

  useEffect(() => {
    if (listType === 'standalone' && selectedStandaloneId) {
      const list = standaloneLists.find(l => l.id === selectedStandaloneId);
      setGroceryList(list ? list.items : {});
    } else if (listType === 'meal-plan' && selectedPlanId) {
      const plan = mealPlans.find(p => p.id === selectedPlanId);
      setGroceryList(plan ? plan.grocery_list : null);
    } else {
      setGroceryList(null);
    }
    setCheckedItems(new Set());
  }, [selectedPlanId, selectedStandaloneId, listType, mealPlans, standaloneLists]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Grocery Lists</h1>
      {/* Controls for selecting meal plans and standalone lists */}
      <Select onValueChange={setListType} value={listType} className="mb-4">
        <SelectTrigger>
          <SelectValue placeholder="Select List Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="meal-plan">Meal Plan</SelectItem>
          <SelectItem value="standalone">Standalone List</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={() => setCreateListDialogOpen(true)}>Create New List</Button>

      <Dialog open={createListDialogOpen} onOpenChange={setCreateListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Standalone Grocery List</DialogTitle>
          </DialogHeader>
          <Label>Name</Label>
          <Input value={newListName} onChange={(e) => setNewListName(e.target.value)} />
          <Button onClick={handleCreateStandaloneList}>Create</Button>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">{/* Render Grocery Lists here based on selected type */}
        {groceryList && Object.entries(groceryList).map(([category, items]) => (
          <Card key={category} className="border-slate-200">
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <Checkbox
                    checked={checkedItems.has(item.name)}
                    onCheckedChange={() => {
                      const newCheckedItems = new Set(checkedItems);
                      if (newCheckedItems.has(item.name)) {
                        newCheckedItems.delete(item.name);
                      } else {
                        newCheckedItems.add(item.name);
                      }
                      setCheckedItems(newCheckedItems);
                    }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}