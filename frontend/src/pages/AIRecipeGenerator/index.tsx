import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { invokeAI } from '@/lib/ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const cuisineTypes = [
  'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Mediterranean',
  'French', 'American', 'Korean', 'Vietnamese', 'Middle Eastern', 'Greek', 'Spanish', 'Other'
];

const dietaryPreferences = [
  'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 
  'Paleo', 'Low-Carb', 'High-Protein', 'Pescatarian', 'Halal', 'Kosher'
];

const difficultyLevels = ['Easy', 'Medium', 'Hard'];

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

interface Recipe {
  name: string;
  description: string;
  ingredients: Array<{ item: string; quantity: string; }>;  
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  prepTime: string;
  cookTime: string;
  tips: string;
  healthBenefits: string;
  imageUrl?: string;
}

export default function AIRecipeGenerator() {
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [savingImage, setSavingImage] = useState<boolean>(false);
  const [form, setForm] = useState({
    recipeName: '',
    mealType: 'Dinner',
    cuisine: 'Italian',
    customCuisine: '',
    dietary: 'None',
    difficulty: 'Medium',
    ingredients: '',
    servings: 4,
    cookTime: 30,
    additionalNotes: ''
  });

  const handleGenerate = async () => {
    if (!form.ingredients.trim()) {
      toast.error('Please enter some available ingredients');
      return;
    }

    setGenerating(true);
    try {
      const cuisineName = form.cuisine === 'Other' ? form.customCuisine : form.cuisine;
      const prompt = `Generate a detailed ${form.difficulty.toLowerCase()} difficulty ${cuisineName} ${form.mealType.toLowerCase()} recipe.\n\n${form.recipeName ? `Recipe Name: ${form.recipeName}` : 'Create a creative recipe name'}\nDietary Preference: ${form.dietary}\nAvailable Ingredients: ${form.ingredients}\nServings: ${form.servings}\nTarget Cook Time: ~${form.cookTime} minutes\n${form.additionalNotes ? `Additional Notes: ${form.additionalNotes}` : ''}\n\nProvide:\n1. Recipe name${form.recipeName ? ' (use the provided name or a slight variation if needed for accuracy)' : ''}\n2. Complete ingredient list with quantities\n3. Step-by-step instructions\n4. Nutritional information per serving (calories, protein, carbs, fat)\n5. Prep time and cook time\n6. Chef's tips or variations\n7. Health benefits`;

      const recipe = await invokeAI({ prompt });

      setGeneratedRecipe({
        ...recipe,
        cuisine: form.cuisine,
        mealType: form.mealType,
        dietary: form.dietary,
        servings: form.servings
      });
      toast.success('Recipe generated!');
    } catch (error) {
      toast.error('Failed to generate recipe');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const generateRecipeImage = async () => {
    if (!generatedRecipe) return;

    setSavingImage(true);
    try {
      const result = await invokeAI({
        prompt: `Professional food photography of ${generatedRecipe.name}, ${form.cuisine} cuisine, appetizing presentation, natural lighting, high quality, restaurant style plating`
      });
      if (result?.url) {
        setGeneratedRecipe({ ...generatedRecipe, imageUrl: result.url });
        toast.success('Image generated!');
      }
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setSavingImage(false);
    }
  };

  const saveRecipe = async () => {
    if (!generatedRecipe) return;

    try {
      const ingredientNames = generatedRecipe.ingredients.map(ing => `${ing.quantity} ${ing.item}`);
      let groceryList = {};
      let totalCost = 0;

      if (ingredientNames.length > 0) {
        toast.loading('Estimating grocery costs...');
        try {
          const priceData = await invokeAI({
            prompt: `For these ingredients: ${ingredientNames.join(', ')}. Provide current average grocery prices in USD per typical package/unit from major US grocery stores. Categorize them into: Proteins, Vegetables, Fruits, Grains, Dairy/Alternatives, Spices/Condiments, Other.`,
          });

          if (priceData?.categories) {
            groceryList = priceData.categories;
            // Calculate total
            Object.values(groceryList).forEach(items => {
              items.forEach(item => {
                totalCost += (item.price || 0) * (item.quantity || 1);
              });
            });
          }
        } catch (error) {
          console.error('Failed to fetch prices:', error);
        }
      }

      const cuisineName = form.cuisine === 'Other' ? form.customCuisine : form.cuisine;
      await apiFetch('POST', '/api/x', {
        name: generatedRecipe.name,
        meal_type: form.mealType.toLowerCase(),
        calories: `${generatedRecipe.nutrition?.calories || 0} kcal`,
        protein: generatedRecipe.nutrition?.protein || 0,
        carbs: generatedRecipe.nutrition?.carbs || 0,
        fat: generatedRecipe.nutrition?.fat || 0,
        nutrients: generatedRecipe.healthBenefits,
        prepTip: generatedRecipe.tips,
        prepTime: generatedRecipe.prepTime,
        prepSteps: generatedRecipe.instructions || [],
        difficulty: form.difficulty,
        equipment: [],
        healthBenefit: generatedRecipe.healthBenefits,
        imageUrl: generatedRecipe.imageUrl || ''
      });
      toast.success('Recipe saved!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save recipe');
    }
  };  

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recipe Generator</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form fields for user input */}
        <Input type="text" placeholder="Recipe Name" onChange={(e) => setForm({ ...form, recipeName: e.target.value })} />
        <Select onChange={(value) => setForm({ ...form, mealType: value })} value={form.mealType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {mealTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
          </SelectContent>
        </Select>
        // Other form fields...
        <Button onClick={handleGenerate} disabled={generating}>{generating ? <Loader2 /> : 'Generate Recipe'}</Button>
        <AnimatePresence>
          {generatedRecipe && (
            <motion.div>
              <h2>Generated Recipe:</h2>
              <p>{generatedRecipe.description}</p>
              <Button onClick={generateRecipeImage} disabled={savingImage}>{savingImage ? <Loader2 /> : 'Generate Image'}</Button>
              <Button onClick={saveRecipe}>Save Recipe</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}