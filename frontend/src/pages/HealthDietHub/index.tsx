import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Loader2, Heart, Users, Calendar, ShoppingCart, Save, Flame, Salad, DollarSign, AlertTriangle, RefreshCw, Utensils } from 'lucide-react';
import { toast } from 'sonner';

const healthGoals = [
  { value: 'liver_health', label: 'Liver Health', icon: Heart, color: 'rose' },
  { value: 'weight_loss', label: 'Weight Loss', icon: Flame, color: 'orange' },
  { value: 'blood_sugar_control', label: 'Blood Sugar Control', icon: Salad, color: 'emerald' },
  { value: 'muscle_gain', label: 'Muscle Gain', icon: Flame, color: 'blue' },
  { value: 'heart_health', label: 'Heart Health', icon: Heart, color: 'red' },
  { value: 'kidney_health', label: 'Kidney Health', icon: Heart, color: 'teal' },
  { value: 'digestive_health', label: 'Digestive Health', icon: Salad, color: 'green' },
  { value: 'energy_boost', label: 'Energy Boost', icon: Sparkles, color: 'yellow' },
  { value: 'immune_support', label: 'Immune Support', icon: Sparkles, color: 'indigo' },
  { value: 'anti_inflammatory', label: 'Anti-Inflammatory', icon: Heart, color: 'pink' },
  { value: 'bone_health', label: 'Bone Health', icon: Salad, color: 'amber' },
  { value: 'general_wellness', label: 'General Wellness', icon: Sparkles, color: 'purple' },
];

const culturalStylesList = [
  { value: 'mediterranean', label: 'Mediterranean', emoji: '🍽️' },
  { value: 'asian', label: 'Asian', emoji: '🥡' },
  { value: 'indian', label: 'Indian', emoji: '🍛' },
  { value: 'latin_american', label: 'Latin American', emoji: '🌮' },
  { value: 'african', label: 'African', emoji: '🌍' },
  { value: 'middle_eastern', label: 'Middle Eastern', emoji: '🍲' },
  { value: 'european', label: 'European', emoji: '🍕' },
  { value: 'fusion', label: 'Fusion', emoji: '🍽️' },
];

const lifeStages = [
  { value: 'general', label: 'General Adult' },
  { value: 'children', label: 'Children (Nutrient-Dense)' },
  { value: 'pregnancy', label: 'Pregnancy (Folate/Iron Focus)' },
  { value: 'seniors', label: 'Seniors (Easy Prep, Bone Health)' },
];

const groceryCategories = ['Proteins', 'Vegetables', 'Fruits', 'Grains', 'Dairy/Alternatives', 'Other'];

const commonAllergens = [
  { value: 'nuts', label: 'Nuts' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'soy', label: 'Soy' },
  { value: 'fish', label: 'Fish' },
  { value: 'sesame', label: 'Sesame' },
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
];

export default function HealthDietHub() {
  const [healthGoal, setHealthGoal] = useState('liver_health');
  const [foodsLiked, setFoodsLiked] = useState('');
  const [foodsAvoided, setFoodsAvoided] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [duration, setDuration] = useState('week');
  const [numPeople, setNumPeople] = useState(1);
  const [weeklyBudget, setWeeklyBudget] = useState(100);
  const [maxBudget, setMaxBudget] = useState(500);
  const [allergens, setAllergens] = useState([]);
  const [cuisinePreferences, setCuisinePreferences] = useState([]);
  const [cookingTime, setCookingTime] = useState('any');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [culturalStyles, setCulturalStyles] = useState([]);
  const [customCulturalStyle, setCustomCulturalStyle] = useState('');
  const [customCuisineInput, setCustomCuisineInput] = useState('');
  const [lifeStage, setLifeStage] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [planName, setPlanName] = useState('');
  const [isFetchingPrices, setIsFetchingPrices] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [regeneratingImage, setRegeneratingImage] = useState(null);

  const queryClient = useQueryClient();

  const fetchGroceryPrices = async (plan) => {
    if (!plan?.days) return;
    
    setIsFetchingPrices(true);
    
    const items = new Set();
    plan.days.forEach(day => {
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
        if (day[meal]?.name) {
          const words = day[meal].name.toLowerCase().split(/[\\s,&]+/);
          words.forEach(word => {
            if (word.length > 3 && !['with', 'and', 'the'].includes(word)) {
              items.add(word);
            }
          });
        }
      });
    });

    const itemsList = Array.from(items).join(', ');
    
    try {
      const priceData = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current average grocery prices in USD for these items (scaled for ${numPeople} people): ${itemsList}`
      });
      // handle priceData response
    } catch (error) {
      console.error('Error fetching grocery prices:', error);
      toast.error('Error fetching grocery prices');
    } finally {
      setIsFetchingPrices(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Health Diet Hub</h1>
      {/* Other page content using Tailwind CSS classes for styling */}
      <Card>
        <CardHeader>
          <CardTitle>Create Your Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <Label htmlFor="healthGoal">Health Goal</Label>
            <Select onValueChange={value => setHealthGoal(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                {healthGoals.map(goal => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Other form elements */}
            <Button type="submit">Generate Plan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}