import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// POST /api/orders - Створити замовлення
export const createOrder = async (req, res) => {
  try {
    const { items, guestInfo, comment, totalAmount } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Items are required' });
    }

    const order = await Order.create({
      user: req.user?._id || null,
      guestInfo: req.user ? null : guestInfo,
      items: items.map(item => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      comment
    });

    res.status(201).json(order);

  } catch (err) {
    console.error('CREATE ORDER ERROR:', err);
    res.status(400).json({ error: err.message });
  }
};


// GET /api/orders - Отримати замовлення
export const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const isAdmin = req.user.role === 'admin';

    const filter = { deletedAt: null };

    // Адмін бачить всі, користувач тільки свої
    if (!isAdmin) {
      filter.user = req.user._id;
    }

    // Фільтр по статусу
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('items.product')
      .populate('user', 'email fullName')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id - Отримати замовлення за ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'email fullName');

    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner =
      order.user &&
      order.user._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Доступ заборонено' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};


// PATCH /api/orders/:id/status - Оновити статус (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['new', 'confirmed', 'assembled', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Невалідний статус' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id - Soft delete (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'deleted',
        deletedAt: new Date(),
        deletedBy: req.user._id
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    res.json({ message: 'Замовлення видалено', order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my - Мої замовлення
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      deletedAt: null
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
