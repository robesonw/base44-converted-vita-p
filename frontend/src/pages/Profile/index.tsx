import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  { value: 'general_wellness', label: 'General Wellness' },
];

export default function Profile() {
  const { user } = useAuth();
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
    meal_timing: 'standard',
  });

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ['userPreferences', user?.email],
    queryFn: () => apiFetch('GET', `/api/userPreferences?created_by=${user.email}`),
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (preferences) {
      setFormData((prevData) => ({
        ...prevData,
        ...preferences,
      }));
    }
  }, [preferences]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('PUT', `/api/userPreferences/${preferences.id}`, formData);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Error saving preferences.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading preferences.</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Input value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
            </div>
          </div>
          {/* Add more input fields as necessary */}
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
