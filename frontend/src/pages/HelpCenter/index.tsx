import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ChefHat, ShoppingCart } from 'lucide-react';

interface Guide {
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType;
  color: string;
  guides: Guide[];
}

const categories: Category[] = [
  {
    id: 'getting_started',
    title: 'Getting Started',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    guides: [
      {
        title: 'Setting Up Your Profile',
        description: 'Complete your profile to get personalized recommendations',
        steps: [
          'Click on "My Profile" in the sidebar',
          'Fill in your personal information (age, gender, height, weight)',
          'Select your primary health goal (e.g., Liver Health, Weight Loss)',
          'Add any allergens you need to avoid',
          'Set your dietary restrictions and food preferences',
          'Choose your cooking skill level and available time',
          'Save your preferences - these will be used for all meal plan generations!'
        ],
        tips: [
          'Be specific about allergens - the AI will strictly avoid them',
          'Update your preferences as your goals change',
          'The more details you provide, the better your recommendations'
        ]
      },
      {
        title: 'Taking the Interactive Tour',
        description: 'Learn the platform with our guided tour',
        steps: [
          'The tour starts automatically for new users',
          'Follow the highlighted tooltips to learn about each feature',
          'You can skip the tour anytime by clicking "Skip Tour"',
          'To restart the tour, click the button below:'
        ],
        action: {
          label: 'Restart Tour',
          onClick: () => {
            localStorage.removeItem('vitaplate_tour_completed');
            window.location.href = '/Dashboard';
          }
        }
      }
    ]
  },
  {
    id: 'meal_planning',
    title: 'Meal Planning',
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
    guides: [
      {
        title: 'Generating Your First Meal Plan',
        description: 'Create a personalized meal plan in minutes',
        steps: [
          'Go to "Health Diet Hub" from the sidebar',
          'Your profile preferences will auto-populate (if you set them)',
          'Select your health goal and cultural cuisine style',
          'Choose plan duration (1 day, 3 days, or 7 days)',
          'Set number of people and budget',
          'Add any specific foods you like or want to avoid',
          'Click "Generate Meal Plan" and wait ~30 seconds',
          'Review your plan with complete recipes and nutrition info',
          'Save the plan to access it later from "Meal Plans"'
        ],
        tips: [
          'Use cultural styles for authentic cuisine experiences',
          'Budget estimates are real-time from grocery stores',
          'Generated images may take a moment - you can regenerate them'
        ]
      }
    ]
  },
  {
    id: 'recipes',
    title: 'Recipes & AI Generation',
    icon: ChefHat,
    color: 'from-orange-500 to-red-500',
    guides: [
      {
        title: 'Using the AI Recipe Generator',
        description: 'Create custom recipes with AI',
        steps: [
          'Go to "AI Recipe Generator" from the sidebar',
          'Enter available ingredients you want to use',
          'Select cuisine type, dietary preferences, and meal type',
          'Choose difficulty level and cooking time',
          'Add any health focus or special requirements',
          'Click "Generate Recipe" and wait for AI to create it',
          'Review the recipe with steps, nutrition, and equipment needed',
          'Click "Generate Image" to visualize the dish',
          'Save to favorites or share with the community'
        ],
        tips: [
          'Be creative with ingredient combinations',
          'AI adapts recipes to your allergens automatically',
          'Generated recipes include grocery lists with prices'
        ]
      }
    ]
  },
  {
    id: 'grocery',
    title: 'Grocery Lists',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-500',
    guides: [
      {
        title: 'Understanding Grocery Lists',
        description: 'Automatically generated shopping lists',
        steps: [
          'Every meal plan generates a grocery list automatically',
          'Items are categorized (Proteins, Vegetables, Grains, etc.)',
          'Prices are fetched from major US grocery stores in real-time',
          'Click any price to edit it manually',
          'Check off items as you shop',
          'Total cost updates as you modify quantities'
        ]
      }
    ]
  }
];

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Help Center</h1>
      <Input
        type="text"
        placeholder="Search guides..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-5"
      />

      {categories.map((category) => (
        <Card key={category.id} className={`mb-4 bg-gradient-to-br ${category.color}`}> 
          <CardHeader>
            <CardTitle>{category.title}</CardTitle>
            <CardDescription>{category.guides.length} guides available</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion>
              {category.guides.map((guide, index) => (
                <AccordionItem key={index}>
                  <AccordionTrigger>{guide.title}</AccordionTrigger>
                  <AccordionContent>
                    <p>{guide.description}</p>
                    <ul>
                      {guide.steps.map((step, i) => (<li key={i}>{step}</li>))}
                    </ul>
                    {guide.tips && <div className="tips">
                      <strong>Tips:</strong>
                      <ul>
                        {guide.tips.map((tip, j) => (<li key={j}>{tip}</li>))}
                      </ul>
                    </div>}
                    {guide.action && <Button onClick={guide.action.onClick}>{guide.action.label}</Button>}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HelpCenter;