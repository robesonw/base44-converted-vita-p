import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils/createPageUrl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">â¨ AI-Powered Health & Nutrition Platform</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to VitaPlate
              <br />
              <span className="text-yellow-200">Your Smart Nutrition Hub</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-white/90 shadow-xl text-lg px-8 py-6">
                <Link to={createPageUrl('HealthDietHub')}>Get Started Free<ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md text-white border-2 border-white hover:bg-white hover:text-indigo-600 text-lg px-8 py-6">
                <Link to={createPageUrl('Dashboard')}>View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make healthy eating simple and sustainable
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: 'AI Recipe Generator', description: 'Create custom recipes instantly with AI' },
              { icon: TrendingUp, title: 'Nutrition Tracking', description: 'Monitor your daily nutrition intake' },
              { icon: Calendar, title: 'Smart Meal Plans', description: 'Personalized 7-day meal plans' }
            ].map((feature, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-4">
                <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
