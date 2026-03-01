import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
    },
  });
  
  // Seed one record per entity
  await prisma.favoriteMeal.create({ data: { name: 'Pasta', meal_type: 'dinner', calories: '300', protein: 15, carbs: 60, fat: 6, nutrients: 'Carbs, Protein', prepTip: 'Boil pasta', prepTime: '30 minutes', prepSteps: ['Boil water', 'Add pasta'], difficulty: 'Easy', equipment: ['Pot', 'Stirring spoon'], healthBenefit: 'High energy', imageUrl: 'url', cuisine: 'Italian', cooking_time: '30 minutes', tags: ['Italian'], source_type: 'manual', source_meal_plan_id: null, source_meal_plan_name: null, source_recipe_id: null, ingredients: ['Pasta', 'Salt'], grocery_list: {}, estimated_cost: 5.0 }});
  // Repeat for the rest of the models...
  // prisma.feedback.create({ data: {...} });
  // prisma.forumPost.create({ data: {...} });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());