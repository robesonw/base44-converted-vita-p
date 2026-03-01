import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface HealthGoalOption {
    value: string;
    label: string;
}

const healthGoals: HealthGoalOption[] = [
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

    useEffect(() => {
        if (user) {
            // Fetch user preferences
            const fetchPreferences = async () => {
                const prefs = await apiFetch('GET', `/api/user-preferences?created_by=${user.email}`);
                if (prefs.length > 0) {
                    const preference = prefs[0];
                    setFormData({
                        ...formData,
                        ...preference
                    });
                }
            };
            fetchPreferences();
        }
    }, [user]);

    const handleSave = async () => {
        try {
            await apiFetch('PUT', `/api/user-preferences/${formData.id}`, formData);
            toast.success('Preferences saved successfully!');
        } catch (error) {
            toast.error('Failed to save preferences.');
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your profile settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label>Age</Label>
                            <Input value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <Select onValueChange={(val) => setFormData({ ...formData, gender: val })} value={formData.gender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleSave}>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    );
}