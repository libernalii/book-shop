import Category from '../models/Category.js';
import Product from '../models/Product.js';

// GET /api/categories - Отримати всі категорії
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id - Отримати категорію за ID
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Категорію не знайдено' });
    }
    
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// POST /api/categories - Створити категорію (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/categories/:id - Оновити категорію (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Категорію не знайдено' });
    }
    
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id - Видалити категорію (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    
    // Перевірити чи є товари в цій категорії
    const productsCount = await Product.countDocuments({ category: categoryId });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        error: 'Неможливо видалити категорію з товарами',
        productsCount,
        message: 'Спочатку перемістіть товари в іншу категорію'
      });
    }
    
    const category = await Category.findByIdAndDelete(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: 'Категорію не знайдено' });
    }
    
    res.json({ message: 'Категорію успішно видалено', category });
  } catch (error) {
    next(error);
  }
};
