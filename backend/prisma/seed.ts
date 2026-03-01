import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin_password', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.favoriteMeal.create({
    data: { name: 'Example Meal', meal_type: 'lunch', calories: '500', protein: 30, carbs: 50, fat: 20, prepTip: 'Prepare in advance', imageUrl: 'http://example.com/meal.jpg' }
  });

  await prisma.feedback.create({
    data: { user_name: 'John Doe', user_email: 'johndoe@example.com', page: 'Home', feedback_type: 'general', message: 'Great app!' }
  });

  await prisma.forumPost.create({
    data: { title: 'Healthy Recipes', content: 'Let’s share healthy recipes!', category: 'recipes' }
  });

  await prisma.groceryList.create({
    data: { name: 'Weekly Groceries', total_cost: 50, items: {} }
  });

  // Continue seeding other entities following the same structure...
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
