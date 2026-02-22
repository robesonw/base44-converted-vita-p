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

export default function AIRecipeGenerator() {
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
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
        
        try {
          const priceData = await invokeAI({
            prompt: `For these ingredients: ${ingredientNames.join(', ')}. Provide current average grocery prices in USD per typical package/unit from major US grocery stores. Categorize them into: Proteins, Vegetables, Fruits, Grains, Dairy/Alternatives, Spices/Condiments, Other.`,
            add_context_from_internet: true,
          });
          
          if (priceData?.categories) {
            groceryList = priceData.categories;
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
      
      // Save to FavoriteMeal with all details
      await apiFetch('POST', '/api/favoriteMeals', {
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
        groceryList,
        totalCost
      });

      toast.success('Recipe saved successfully!');
    } catch (error) {
      toast.error('Failed to save recipe');
      console.error(error);
    } finally {
      if (saveButton) saveButton.disabled = false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recipe Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Name</Label>
        <Input value={form.recipeName} onChange={e => setForm({ ...form, recipeName: e.target.value })} />
        <Separator />
        <Label>Meal Type</Label>
        <Select onValueChange={val => setForm({ ...form, mealType: val })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Meal Type" />
          </SelectTrigger>
          <SelectContent>{mealTypes.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Separator />
        <Label>Cuisine Type</Label>
        <Select onValueChange={val => setForm({ ...form, cuisine: val })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Cuisine" />
          </SelectTrigger>
          <SelectContent>{cuisineTypes.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Separator />
        <Label>Dietary Preference</Label>
        <Select onValueChange={val => setForm({ ...form, dietary: val })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Dietary Preference" />
          </SelectTrigger>
          <SelectContent>{dietaryPreferences.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Separator />
        <Label>Ingredients</Label>
        <Textarea value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} />
        <Separator />
        <Button onClick={handleGenerate} disabled={generating}>{generating ? 'Generating...' : 'Generate Recipe'}</Button>
        {generatedRecipe && (
          <div>
            <h2>Generated Recipe:</h2>
            {/* Display generated recipe here */}
            <Button onClick={saveRecipe} data-save-recipe>Save Recipe</Button>
            <Button onClick={generateRecipeImage} disabled={savingImage}>{savingImage ? 'Saving Image...' : 'Generate Image'}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}