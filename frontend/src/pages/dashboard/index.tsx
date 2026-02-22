import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import QuickStartChecklist from '@/components/onboarding/QuickStartChecklist';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Target, Flame, TrendingUp, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/mealPlans'),
  });

  const { data: sharedPlans = [] } = useQuery({
    queryKey: ['sharedPlans'],
    queryFn: () => apiFetch('GET', '/api/sharedMealPlans'),
  });

  const { data: labResults = [] } = useQuery({
    queryKey: ['labResults'],
    queryFn: () => apiFetch('GET', '/api/labResults'),
  });

  const totalMeals = mealPlans.reduce((sum, p) => {
    return sum + (p.days?.length || 0) * 4; // breakfast, lunch, dinner, snacks
  }, 0);

  const avgCalories = React.useMemo(() => {
    if (mealPlans.length === 0) return 0;
    let totalCals = 0;
    let dayCount = 0;
    mealPlans.forEach(plan => {
      plan.days?.forEach(day => {
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
          const meal = day[mealType];
          if (meal?.calories) {
            const match = meal.calories.match(/(\d+)/);
            if (match) {
              totalCals += parseInt(match[1]);
              dayCount++;
            }
          }
        });
      });
    });
    return dayCount > 0 ? Math.round(totalCals / (totalMeals || 1)) : 0;
  }, [mealPlans]);

  const stats = {
    activePlans: mealPlans.length,
    totalMeals,
    avgCalories,
    communityShares: sharedPlans.length,
  };

  return (
    <div className="space-y-6">
      <OnboardingTour />
      <QuickStartChecklist />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user.full_name.split(' ')[0] || 'there'}! 👋
        </h1>
        <Button asChild variant="outline">
          <Link to={createPageUrl('Index')}>🏠 Home Page</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div key="activePlans" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Plans</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activePlans}</p>
                <p className="text-xs text-slate-500">meal plans</p>
              </div>
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div key="totalMeals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-slate-600">Meals Planned</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalMeals}</p>
                <p className="text-xs text-slate-500">total meals</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div key="avgCalories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Calories/Day</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.avgCalories > 0 ? `${stats.avgCalories}` : 'N/A'}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.avgCalories > 0 ? 'kcal per day' : 'Create plans to track'}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div key="communityShares" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-slate-600">Community Shares</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.communityShares}</p>
                <p className="text-xs text-slate-500">shared recently</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Today's Nutrition Goals</CardTitle>
              <CardDescription>Track your daily intake targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Calories</span>
                  <span className="text-sm font-semibold text-slate-900">1,250 / 2,000 kcal</span>
                </div>
                <Progress value={62.5} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
