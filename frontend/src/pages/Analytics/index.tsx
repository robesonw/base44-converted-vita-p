import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface MealPlan {
  name: string;
  created_date: string;
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  days?: Array<{ [key: string]: { protein?: number; carbs?: number; fat?: number; calories?: string; } }>;  
  cultural_style?: string;
  estimated_cost?: number;
  current_total_cost?: number;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();

  const { data: mealPlans = [] } = useQuery<MealPlan[]>({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/mealPlans'),
  });

  const macroDistribution = React.useMemo(() => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    mealPlans.forEach(plan => {
      if (plan.macros) {
        totalProtein += plan.macros.protein || 0;
        totalCarbs += plan.macros.carbs || 0;
        totalFat += plan.macros.fat || 0;
      } else {
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
      }
    });

    const total = totalProtein + totalCarbs + totalFat;
    return total > 0 ? [
      { name: 'Protein', value: totalProtein, percentage: Math.round((totalProtein / total) * 100) },
      { name: 'Carbs', value: totalCarbs, percentage: Math.round((totalCarbs / total) * 100) },
      { name: 'Fat', value: totalFat, percentage: Math.round((totalFat / total) * 100) }
    ] : [];
  }, [mealPlans]);

  const weeklyData = React.useMemo(() => {
    const weeks: { [key: string]: number } = {};
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    mealPlans.forEach(plan => {
      const planDate = new Date(plan.created_date).getTime();
      const weeksAgo = Math.floor((now - planDate) / weekMs);
      const weekLabel = weeksAgo === 0 ? 'This Week' :
                        weeksAgo === 1 ? 'Last Week' :
                        weeksAgo <= 4 ? `${weeksAgo} Weeks Ago` : 'Earlier';

      if (weeksAgo <= 4) {
        weeks[weekLabel] = (weeks[weekLabel] || 0) + 1;
      }
    });
    const labels = ['4 Weeks Ago', '3 Weeks Ago', '2 Weeks Ago', 'Last Week', 'This Week'];
    return labels.map(label => ({
      week: label,
      plans: weeks[label] || 0
    }));
  }, [mealPlans]);

  const totalMeals = mealPlans.reduce((sum, p) => sum + (p.days?.length || 0) * 4, 0);

  const stats = [
    { title: 'Total Plans Created', value: mealPlans.length, icon: Calendar, color: 'indigo' },
    { title: 'Total Meals', value: totalMeals, icon: Target, color: 'emerald' },
    { title: 'Avg Calories/Day', value: 'N/A', icon: Flame, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
        <p className="text-slate-600 mt-1">Track your nutrition planning progress and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500 flex items-center justify-center`}> 
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {/* Additional charts would be included here */}
    </div>
  );
};

export default Analytics;