import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Calendar, ChefHat, ShoppingCart } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type Guide = {
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
};

type Category = {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  guides: Guide[];
};

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
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
          steps: [...], // detailed steps here
          tips: [...], // relevant tips here
        },
        {
          title: 'Taking the Interactive Tour',
          description: 'Learn the platform with our guided tour',
          steps: [...], // detailed steps here
          action: {  
            label: 'Restart Tour',  
            onClick: () => {  
              localStorage.removeItem('vitaplate_tour_completed');  
              window.location.href = '/Dashboard';  
            },  
          },
        },
      ],
    },
    {
      id: 'meal_planning',
      title: 'Meal Planning',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-500',
      guides: [...], // complete guides for meal planning
    },
    {
      id: 'recipes',
      title: 'Recipes & AI Generation',
      icon: ChefHat,
      color: 'from-orange-500 to-red-500',
      guides: [...], // complete guides for recipes
    },
    {
      id: 'grocery',
      title: 'Grocery Lists',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      guides: [...], // complete guides for grocery lists
    },
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800">
      <Input 
        placeholder="Search..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        className="mb-4"
      />
      <Tabs>
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} >{category.title}</TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Accordion type="single" collapsible>
              {category.guides.map((guide, idx) => (
                <AccordionItem key={idx} value={`guide-${idx}`}>   
                  <AccordionTrigger>{guide.title}</AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardHeader>
                        <CardTitle>{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ol>
                          {guide.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                        {guide.tips && <Badge>{guide.tips.join(', ')}</Badge>} 
                        {guide.action && <Button onClick={guide.action.onClick}>{guide.action.label}</Button>}
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default HelpCenter;