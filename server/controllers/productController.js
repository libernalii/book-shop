import Product from '../models/Product.js';

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;

    const filter = {};

    if (category) filter.category = category;

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products (admin)
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      price: Number(req.body.price),
      discount: Number(req.body.discount || 0),
      stock: Number(req.body.stock)
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('CREATE PRODUCT ERROR:', err);
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: Number(req.body.price),
        discount: Number(req.body.discount || 0),
        stock: Number(req.body.stock)
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Товар видалено' });
  } catch (err) {
    next(err);
  }
};
