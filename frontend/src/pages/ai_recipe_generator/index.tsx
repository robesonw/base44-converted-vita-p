import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { invokeAI } from '@/lib/ai';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

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

type Recipe = {
  name: string;
  description: string;
  ingredients: Array<{ item: string; quantity: string; }>; 
  instructions: string[];
  nutrition: { calories: number; protein: number; carbs: number; fat: number; };
  prepTime: string;
  cookTime: string;
  tips: string;
  healthBenefits: string;
  imageUrl?: string;
};

export default function AIRecipeGenerator() {
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const queryClient = useQueryClient();

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
    const saveButton = document.querySelector('[data-save-recipe]');
    if (saveButton) saveButton.disabled = true;
    try {
      const ingredientNames = generatedRecipe.ingredients?.map(ing => `${ing.quantity} ${ing.item}`) || [];
      let groceryList = {};
      let totalCost = 0;

      if (ingredientNames.length > 0) {
        toast.loading('Estimating grocery costs...');
        const priceData = await invokeAI({
          prompt: `For these ingredients: ${ingredientNames.join(', ')}. Provide current average grocery prices in USD per typical package/unit from major US grocery stores. Categorize them into: Proteins, Vegetables, Fruits, Grains, Dairy/Alternatives, Spices/Condiments, Other.`,
          add_context_from_internet: true
        });

        if (priceData?.categories) {
          groceryList = priceData.categories;
          Object.values(groceryList).forEach(items => {
            items.forEach(item => {
              totalCost += (item.price || 0) * (item.quantity || 1);
            });
          });
        }
      }
      const cuisineName = form.cuisine === 'Other' ? form.customCuisine : form.cuisine;
      await apiFetch('POST', '/api/favorite-meals', {
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
      });
      toast.success('Recipe saved!');
    } catch (error) {
      toast.error('Failed to save recipe');
      console.error(error);
    } finally {
      if (saveButton) saveButton.disabled = false;
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Recipe Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="recipeName">Recipe Name</Label>
          <Input id="recipeName" value={form.recipeName} onChange={(e) => setForm({ ...form, recipeName: e.target.value })} />

          <Label htmlFor="mealType">Meal Type</Label>
          <Select onValueChange={(val) => setForm({ ...form, mealType: val })} >
            <SelectTrigger>
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
            </SelectContent>
          </Select>

          <Label htmlFor="cuisine">Cuisine</Label>
          <Select onValueChange={(val) => setForm({ ...form, cuisine: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Select cuisine type" />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
            </SelectContent>
          </Select>

          <Label htmlFor="dietary">Dietary Preference</Label>
          <Select onValueChange={(val) => setForm({ ...form, dietary: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Select dietary preference" />
            </SelectTrigger>
            <SelectContent>
              {dietaryPreferences.map((pref) => (<SelectItem key={pref} value={pref}>{pref}</SelectItem>))}
            </SelectContent>
          </Select>

          <Label htmlFor="difficulty">Difficulty</Label>
          <Select onValueChange={(val) => setForm({ ...form, difficulty: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              {difficultyLevels.map((level) => (<SelectItem key={level} value={level}>{level}</SelectItem>))}
            </SelectContent>
          </Select>

          <Label htmlFor="ingredients">Ingredients</Label>
          <Textarea id="ingredients" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />

          <Label htmlFor="servings">Servings</Label>
          <Input type="number" id="servings" value={form.servings} onChange={(e) => setForm({ ...form, servings: +e.target.value })} />

          <Label htmlFor="cookTime">Cook Time (minutes)</Label>
          <Input type="number" id="cookTime" value={form.cookTime} onChange={(e) => setForm({ ...form, cookTime: +e.target.value })} />

          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea id="additionalNotes" value={form.additionalNotes} onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })} />

          <Button onClick={handleGenerate} disabled={generating}>{generating ? 'Generating...' : 'Generate Recipe'}</Button>
          <Button onClick={generateRecipeImage} disabled={!generatedRecipe || savingImage}>{savingImage ? 'Generating Image...' : 'Generate Recipe Image'}</Button>
          <Button data-save-recipe onClick={saveRecipe} disabled={!generatedRecipe}>Save Recipe</Button>
        </CardContent>
      </Card>
      {generatedRecipe && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Generated Recipe</h2>
          <Card>
            <CardContent>
              <h3 className="font-bold text-xl">{generatedRecipe.name}</h3>
              <div>{generatedRecipe.description}</div>
              <Separator />
              <h4 className="font-semibold">Ingredients:</h4>
              <ul className="list-inside list-disc">
                {generatedRecipe.ingredients.map((ingredient, index) => (<li key={index}>{ingredient.quantity} {ingredient.item}</li>))}
              </ul>
              <h4 className="font-semibold">Instructions:</h4>
              <ol className="list-inside list-decimal">
                {generatedRecipe.instructions.map((instruction, index) => (<li key={index}>{instruction}</li>))}
              </ol>
              <p className="font-semibold">Nutrition (per serving):</p>
              <p>Calories: {generatedRecipe.nutrition.calories}</p>
              <p>Protein: {generatedRecipe.nutrition.protein}</p>
              <p>Carbs: {generatedRecipe.nutrition.carbs}</p>
              <p>Fat: {generatedRecipe.nutrition.fat}</p>
              {generatedRecipe.imageUrl && <img src={generatedRecipe.imageUrl} alt={`Image of ${generatedRecipe.name}`} />}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}