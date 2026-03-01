import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface MealPlan {
  name: string;
  created_date: string;
  estimated_cost?: number;
  current_total_cost?: number;
  macros?: { protein: number; carbs: number; fat: number; };
  cultural_style?: string;
  days?: Array<{ breakfast?: { protein: number; calories: string; }; lunch?: {}; dinner?: {}; snacks?: {}; }>
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { data: mealPlans = [] } = useQuery<MealPlan[]>(['mealPlans'], async () => {
    return await apiFetch('GET', `/api/mealPlans`);
  });

  // Calculate macronutrient distribution...

  const stats = [
    { title: 'Total Plans Created', value: mealPlans.length, icon: Calendar, color: 'indigo' },
    { title: 'Total Meals', value: totalMeals, icon: Target, color: 'emerald' },
    { title: 'Avg Calories/Day', value: avgCalories > 0 ? avgCalories.toLocaleString() : 'N/A', icon: Flame, color: 'orange' },
    { title: 'Days Planned', value: totalDaysPlanned, icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
        <p className="text-slate-600 mt-1">Track your nutrition planning progress and trends</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${colorClasses[stat.color]} flex items-center justify-center`}>  
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;