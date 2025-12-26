import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const seedUsers = [
  {
    email: 'admin@shop.com',
    password: 'admin123',
    fullName: 'Адміністратор',
    phone: '+380501234567',
    address: 'Київ, вул. Хрещатик, 1',
    role: 'admin'
  },
  {
    email: 'customer@shop.com',
    password: 'customer123',
    fullName: 'Іван Петренко',
    phone: '+380507654321',
    address: 'Львів, вул. Свободи, 10',
    role: 'customer'
  }
];

const seedCategories = [
  { name: 'Фентезі', description: 'Магічні світи та пригоди' },
  { name: 'Роман', description: 'Історії про кохання та життя' },
  { name: 'Детектив', description: 'Злочини та розслідування' },
  { name: 'Саморозвиток', description: 'Психологія та мотивація' }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Очищення бази даних...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Створення користувачів...');
    const users = await User.create(seedUsers);
    console.log(`Створено ${users.length} користувачів`);

    console.log('Створення категорій...');
    const categories = await Category.create(seedCategories);
    console.log(`Створено ${categories.length} категорій`);

    // Продукти по 5 на кожну категорію
    const seedProducts = [
      // Фентезі
      {
        name: 'Гаррі Поттер і філософський камінь — Дж. К. Ролінґ',
        description: 'Перша книга легендарної серії про хлопчика, який дізнається, що він чарівник.',
        price: 399,
        discount: 10,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
        category: categories[0]._id
      },
      {
        name: 'Володар перснів: Хранителі персня — Дж. Р. Р. Толкін',
        description: 'Епічна подорож Середзем’ям задля знищення Персня Всевладдя.',
        price: 499,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        category: categories[0]._id
      },

      // Роман
      {
        name: 'Гордість і упередження — Джейн Остін',
        description: 'Класичний роман про кохання, гордість і соціальні упередження.',
        price: 299,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400',
        category: categories[1]._id
      },

      // Детектив
      {
        name: 'Вбивство у Східному експресі — Аґата Крісті',
        description: 'Знамените розслідування Еркюля Пуаро у розкішному поїзді.',
        price: 349,
        discount: 5,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
        category: categories[2]._id
      },

      // Саморозвиток
      {
        name: 'Атомні звички — Джеймс Клір',
        description: 'Практичний гід про те, як маленькі звички змінюють життя.',
        price: 379,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
        category: categories[3]._id
      }
    ];

    console.log('Створення товарів...');
    const products = await Product.create(seedProducts);
    console.log(`Створено ${products.length} товарів`);

    console.log(`
      SEED УСПІШНО ЗАВЕРШЕНО!                           
      Користувачі:                                      
      admin@shop.com / admin123 (admin)                
      customer@shop.com / customer123 (customer)       
                                                       
      Категорії: ${categories.length}                                     
      Товари: ${products.length}                                        
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка seed:', error);
    process.exit(1);
  }
};

seedData();
