import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Plus, Check, Copy, Printer, Download, DollarSign, Loader2, Share2, Mail, MessageSquare, List, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function GroceryLists() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedStandaloneId, setSelectedStandaloneId] = useState<string>('');
  const [listType, setListType] = useState<'meal-plan' | 'standalone'>('meal-plan');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [groceryList, setGroceryList] = useState<Record<string, Array<{ name: string; quantity: number; price: number | null; }>> | null>(null);
  const [newListName, setNewListName] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: mealPlans = [] } = useQuery('mealPlans', () => apiFetch('GET', '/api/meal-plans'));
  const { data: standaloneLists = [] } = useQuery('standaloneLists', () => apiFetch('GET', '/api/grocery-lists'));

  const updatePlanMutation = useMutation({
    mutationFn: (data: any) => apiFetch('PUT', '/api/meal-plans/' + selectedPlanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries('mealPlans');
      toast.success('Grocery list updated');
    },
  });

  const createStandaloneListMutation = useMutation({
    mutationFn: (data: any) => apiFetch('POST', '/api/grocery-lists', data),
    onSuccess: (newList: any) => {
      queryClient.invalidateQueries('standaloneLists');
      setSelectedStandaloneId(newList.id);
      setListType('standalone');
      toast.success('List created');
    },
  });

  const updateStandaloneListMutation = useMutation({
    mutationFn: (data: any) => apiFetch('PUT', '/api/grocery-lists/' + selectedStandaloneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries('standaloneLists');
      toast.success('List updated');
    },
  });

  const deleteStandaloneListMutation = useMutation({
    mutationFn: (id: string) => apiFetch('DELETE', '/api/grocery-lists/' + id),
    onSuccess: () => {
      queryClient.invalidateQueries('standaloneLists');
      toast.success('List deleted');
      setSelectedStandaloneId('');
      setGroceryList(null);
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

  useEffect(() => {
    if (listType === 'standalone') {
      const selectedList = standaloneLists.find((l: any) => l.id === selectedStandaloneId);
      if (selectedList) {
        setGroceryList(selectedList.items || {});
      }
    } else {
      const selectedPlan = mealPlans.find((p: any) => p.id === selectedPlanId);
      if (selectedPlan?.grocery_list) {
        setGroceryList(selectedPlan.grocery_list);
      }
    }
    setCheckedItems(new Set());
  }, [selectedPlanId, selectedStandaloneId, listType, mealPlans, standaloneLists]);

  return (
    <div className="grocery-lists">
      <Button onClick={() => setOpen(true)}>Create Standalone List</Button>
      <Dialog open={createListDialogOpen} onOpenChange={setCreateListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Standalone List</DialogTitle>
          </DialogHeader>
          <Input placeholder="List Name" onChange={(e) => setNewListName(e.target.value)} />
          <Button onClick={handleCreateStandaloneList}>Create</Button>
        </DialogContent>
      </Dialog>
      <div>
        {groceryList && Object.entries(groceryList).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              {items.map((item, idx) => (
                <Checkbox key={idx} onCheckedChange={() => toggleItem(item.name)}>{item.name}</Checkbox>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}