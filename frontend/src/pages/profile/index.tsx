import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const healthGoals = [
  { value: 'liver_health', label: 'Liver Health' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'blood_sugar_control', label: 'Blood Sugar Control' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'heart_health', label: 'Heart Health' },
  { value: 'kidney_health', label: 'Kidney Health' },
  { value: 'digestive_health', label: 'Digestive Health' },
  { value: 'energy_boost', label: 'Energy Boost' },
  { value: 'immune_support', label: 'Immune Support' },
  { value: 'anti_inflammatory', label: 'Anti-Inflammatory' },
  { value: 'bone_health', label: 'Bone Health' },
  { value: 'general_wellness', label: 'General Wellness' }
];

const allergenOptions = [
  { value: 'nuts', label: 'Nuts' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'soy', label: 'Soy' },
  { value: 'fish', label: 'Fish' },
  { value: 'sesame', label: 'Sesame' }
];

const cuisineOptions = [
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'asian', label: 'Asian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'italian', label: 'Italian' },
  { value: 'american', label: 'American' },
  { value: 'indian', label: 'Indian' },
  { value: 'middle_eastern', label: 'Middle Eastern' },
  { value: 'greek', label: 'Greek' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'thai', label: 'Thai' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'african', label: 'African' },
  { value: 'vietnamese', label: 'Vietnamese' }
];

const lifeStageOptions = [
  { value: 'general', label: 'General Adult' },
  { value: 'children', label: 'Children (Nutrient-Dense)' },
  { value: 'pregnancy', label: 'Pregnancy (Folate/Iron Focus)' },
  { value: 'seniors', label: 'Seniors (Easy Prep, Bone Health)' }
];

const mealTimingOptions = [
  { value: 'early_bird', label: 'Early Bird (Breakfast 6-7am)' },
  { value: 'standard', label: 'Standard (Breakfast 7-9am)' },
  { value: 'late_riser', label: 'Late Riser (Breakfast 9-11am)' },
  { value: 'intermittent_fasting', label: 'Intermittent Fasting' }
];

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    health_goal: '',
    dietary_restrictions: '',
    foods_liked: '',
    foods_avoided: '',
    allergens: [],
    cuisine_preferences: [],
    cooking_time: 'any',
    skill_level: 'intermediate',
    num_people: 1,
    weekly_budget: 100,
    life_stage: 'general',
    meal_timing: 'standard'
  });

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['userPreferences', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      return await apiFetch('GET', `/api/userPreferences?created_by=${user.email}`);
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (preferences) {
      setFormData(p => ({ ...p, ...preferences }));
    }
  }, [preferences]);

  const handleSubmit = async () => {
    try {
      await apiFetch('PUT', `/api/userPreferences/${preferences.id}`, formData);
      toast.success('Profile updated successfully.');
      queryClient.invalidateQueries(['userPreferences']);
    } catch (error) {
      toast.error('Error updating profile.');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Edit your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Label>Age</Label>
            <Input value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            <Label>Gender</Label>
            <Select onValueChange={val => setFormData({ ...formData, gender: val })} >
              <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
              <SelectContent>{['Male', 'Female', 'Other'].map((gender) => <SelectItem key={gender} value={gender}>{gender}</SelectItem>)}</SelectContent>
            </Select>
            <Label>Height</Label>
            <Input value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
            <Label>Weight</Label>
            <Input value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
