import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface MacroDistribution {
    name: string;
    value: number;
    percentage: number;
}

interface MealPlan {
    id: string;
    name: string;
    macros?: { protein?: number; carbs?: number; fat?: number };
    days?: Array<{ breakfast?: { protein?: number; carbs?: number; fat?: number; calories?: string }; lunch?: { protein?: number; carbs?: number; fat?: number; calories?: string }; dinner?: { protein?: number; carbs?: number; fat?: number; calories?: string }; snacks?: { protein?: number; carbs?: number; fat?: number; calories?: string } }>; 
    cultural_style?: string;
    created_date: string;
    estimated_cost?: number;
    current_total_cost?: number;
}

export default function Analytics() {
  const { data: mealPlans = [] } = useQuery<MealPlan[]>({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/mealPlans'),
  });

  const macroDistribution = React.useMemo<MacroDistribution[]>(() => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    mealPlans.forEach(plan => {
      totalProtein += plan.macros?.protein || 0;
      totalCarbs += plan.macros?.carbs || 0;
      totalFat += plan.macros?.fat || 0;
      plan.days?.forEach(day => {
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
          const meal = day[mealType];
          if (meal) {
            totalProtein += meal.protein || 0;
            totalCarbs += meal.carbs || 0;
            totalFat += meal.fat || 0;
          }
        });
      });
    });
    const total = totalProtein + totalCarbs + totalFat;
    return total > 0 ? [
      { name: 'Protein', value: totalProtein, percentage: Math.round((totalProtein / total) * 100) },
      { name: 'Carbs', value: totalCarbs, percentage: Math.round((totalCarbs / total) * 100) },
      { name: 'Fat', value: totalFat, percentage: Math.round((totalFat / total) * 100) }
    ] : [];
  }, [mealPlans]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
        <p className="text-slate-600 mt-1">Track your nutrition planning progress and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Add your stats representation here, similar to the original code */}
      </div>
    </div>
  );
}