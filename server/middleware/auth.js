import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Middleware для перевірки авторизації
 */
export const protect = async (req, res, next) => {
  try {
    // Отримуємо токен з headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Немає токену авторизації' });
    }

    const token = authHeader.split(' ')[1];

    // Верифікуємо токен
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Невалідний токен' });
    }

    // Знаходимо користувача
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return res.status(401).json({ error: 'Користувача не знайдено' });
    }

    // Додаємо користувача до req
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Помилка авторизації' });
  }
};

/**
 * Middleware для перевірки ролі Admin
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Доступ заборонено. Тільки для адміністраторів' });
  }
};

/**
 * Middleware для перевірки ролі Customer або Admin
 */
export const customerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Доступ заборонено' });
  }
};
