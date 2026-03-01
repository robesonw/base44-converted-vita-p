import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LabResults from './pages/LabResults';
import HealthDietHub from './pages/HealthDietHub';
import AIRecipeGenerator from './pages/AIRecipeGenerator';
import MealPlans from './pages/MealPlans';
import NutritionTracking from './pages/NutritionTracking';
import GroceryLists from './pages/GroceryLists';
import Community from './pages/Community';
import ProgressFeed from './pages/ProgressFeed';
import SharedRecipes from './pages/SharedRecipes';
import Analytics from './pages/Analytics';
import HelpCenter from './pages/HelpCenter';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/lab-results" element={<LabResults />} />
        <Route path="/health-diet-hub" element={<HealthDietHub />} />
        <Route path="/ai-recipe-generator" element={<AIRecipeGenerator />} />
        <Route path="/meal-plans" element={<MealPlans />} />
        <Route path="/nutrition-tracking" element={<NutritionTracking />} />
        <Route path="/grocery-lists" element={<GroceryLists />} />
        <Route path="/community" element={<Community />} />
        <Route path="/progress-feed" element={<ProgressFeed />} />
        <Route path="/shared-recipes" element={<SharedRecipes />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;