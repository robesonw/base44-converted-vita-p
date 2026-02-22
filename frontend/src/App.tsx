import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/lab-results" element={<ProtectedRoute><Layout><LabResults /></Layout></ProtectedRoute>} />
      <Route path="/health-diet-hub" element={<ProtectedRoute><Layout><HealthDietHub /></Layout></ProtectedRoute>} />
      <Route path="/ai-recipe-generator" element={<ProtectedRoute><Layout><AIRecipeGenerator /></Layout></ProtectedRoute>} />
      <Route path="/meal-plans" element={<ProtectedRoute><Layout><MealPlans /></Layout></ProtectedRoute>} />
      <Route path="/nutrition-tracking" element={<ProtectedRoute><Layout><NutritionTracking /></Layout></ProtectedRoute>} />
      <Route path="/grocery-lists" element={<ProtectedRoute><Layout><GroceryLists /></Layout></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Layout><Community /></Layout></ProtectedRoute>} />
      <Route path="/progress-feed" element={<ProtectedRoute><Layout><ProgressFeed /></Layout></ProtectedRoute>} />
      <Route path="/shared-recipes" element={<ProtectedRoute><Layout><SharedRecipes /></Layout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
      <Route path="/help-center" element={<ProtectedRoute><Layout><HelpCenter /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
    </Routes>
  );
}