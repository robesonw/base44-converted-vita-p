import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { invokeAI } from '@/lib/ai';
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

// Define types for the component
interface GroceryPrice { name: string; price: number; unit: string; }
interface Plan { days: Array<{ breakfast?: { name: string }; lunch?: { name: string }; dinner?: { name: string }; snacks?: { name: string }}>; }

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
  { value: 'asian', label: 'Asian', emoji: '🍜' },
  { value: 'indian', label: 'Indian', emoji: '🍛' },
  { value: 'latin_american', label: 'Latin American', emoji: '🌮' },
  { value: 'african', label: 'African', emoji: '🍢' },
  { value: 'middle_eastern', label: 'Middle Eastern', emoji: '🥙' },
  { value: 'european', label: 'European', emoji: '🥗' },
  { value: 'fusion', label: 'Fusion', emoji: '🍣' },
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
  const [healthGoal, setHealthGoal] = useState<string>('liver_health');
  const [foodsLiked, setFoodsLiked] = useState<string>('');
  const [foodsAvoided, setFoodsAvoided] = useState<string>('');
  const [customRequirements, setCustomRequirements] = useState<string>('');
  const [duration, setDuration] = useState<string>('week');
  const [numPeople, setNumPeople] = useState<number>(1);
  const [weeklyBudget, setWeeklyBudget] = useState<number>(100);
  const [maxBudget, setMaxBudget] = useState<number>(500);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState<string>('any');
  const [skillLevel, setSkillLevel] = useState<string>('intermediate');
  const [culturalStyles, setCulturalStyles] = useState<string[]>([]);
  const [customCulturalStyle, setCustomCulturalStyle] = useState<string>('');
  const [customCuisineInput, setCustomCuisineInput] = useState<string>('');
  const [lifeStage, setLifeStage] = useState<string>('general');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<object | null>(null);
  const [generatingImages, setGeneratingImages] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<Set<any>>(new Set());
  const [planName, setPlanName] = useState<string>('');
  const [isFetchingPrices, setIsFetchingPrices] = useState<boolean>(false);
  const [editingPrice, setEditingPrice] = useState<any>(null);
  const [regeneratingImage, setRegeneratingImage] = useState<any>(null);

  const fetchGroceryPrices = async (plan: Plan) => {
    if (!plan?.days) return;
    setIsFetchingPrices(true);
    const items = new Set<string>();
    plan.days.forEach(day => {
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
        if (day[meal]?.name) {
          const words = day[meal].name.toLowerCase().split(/\s|,|&+/);
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
      const priceData = await invokeAI({
        prompt: `Get current average grocery prices in USD for these items (scaled for ${numPeople} people for a week): ${itemsList}.`,
        add_context_from_internet: true
      });

      if (priceData?.items) {
        const priceMap: Record<string, GroceryPrice> = {};
        priceData.items.forEach((item: GroceryPrice) => {
          const itemName = item.name.toLowerCase();
          priceMap[itemName] = item;
          itemName.split(/\s|,/).forEach(word => {
            if (word.length > 3) {
              priceMap[word] = item;
            }
          });
        });
        setGeneratedPlan(prev => ({ ...prev, grocery_prices: priceMap }));
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      toast.error('Could not fetch current prices');
    } finally {
      setIsFetchingPrices(false);
    }
  };

  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Health Diet Hub</h1>
      <div className="mt-4">
        <Label htmlFor="healthGoal">Select Health Goal</Label>
        <Select onChange={(e) => setHealthGoal(e.target.value)} value={healthGoal}>
          {healthGoals.map(goal => (
            <SelectItem key={goal.value} value={goal.value}>
              <span>{goal.icon && <goal.icon />} {goal.label}</span>
            </SelectItem>
          ))}
        </Select>
      </div>
      {/* Additional fields and components go here */}
    </div>
  );
}