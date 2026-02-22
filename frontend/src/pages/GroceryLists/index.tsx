import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const GroceryLists: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedStandaloneId, setSelectedStandaloneId] = useState<string>('');
  const [listType, setListType] = useState<'meal-plan' | 'standalone'>('meal-plan');
  const [groceryList, setGroceryList] = useState<{ [key: string]: any } | null>(null);
  const [newListName, setNewListName] = useState<string>('');
  const [createListDialogOpen, setCreateListDialogOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data: mealPlans = [] } = useQuery<{ id: string; name: string; grocery_list?: any }[]>({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/mealPlans'),
  });

  const { data: standaloneLists = [] } = useQuery<{ id: string; name: string; items: any }[]>({
    queryKey: ['standaloneLists'],
    queryFn: () => apiFetch('GET', '/api/groceryLists'),
  });

  const createStandaloneListMutation = useMutation({
    mutationFn: (data: any) => apiFetch('POST', '/api/groceryLists', data),
    onSuccess: (newList) => {
      queryClient.invalidateQueries(['standaloneLists']);
      setSelectedStandaloneId(newList.id);
      setListType('standalone');
      toast.success('List created');
      setCreateListDialogOpen(false);
      setNewListName('');
    },
  });

  useEffect(() => {
    if (listType === 'standalone' && selectedStandaloneId) {
      const selectedList = standaloneLists.find(l => l.id === selectedStandaloneId);
      setGroceryList(selectedList ? selectedList.items : {});
    }
    else if (listType === 'meal-plan' && selectedPlanId) {
      const selectedPlan = mealPlans.find(p => p.id === selectedPlanId);
      setGroceryList(selectedPlan?.grocery_list || {});
    }
    else {
      setGroceryList(null);
    }
  }, [selectedPlanId, selectedStandaloneId, listType, mealPlans, standaloneLists]);

  const handleCreateStandaloneList = () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    createStandaloneListMutation.mutate({
      name: newListName,
      items: {},  // Initialize with empty list
total_cost: 0,
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Grocery Lists</h1>
      <Button variant="primary" onClick={() => setCreateListDialogOpen(true)}>Create New List</Button>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Select a List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Render lists from mealPlans and standaloneLists */}
          <ul>
            {standaloneLists.concat(mealPlans).map(item => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.name}</span>
                <Checkbox checked={item.id === selectedStandaloneId} onChange={() => setSelectedStandaloneId(item.id)} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={createListDialogOpen} onOpenChange={setCreateListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Standalone Grocery List</DialogTitle>
          </DialogHeader>
          <Input value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="List Name" />
          <Button onClick={handleCreateStandaloneList}>Create</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroceryLists;