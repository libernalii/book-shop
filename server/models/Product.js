import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Назва товару є обов\'язковою'],
      trim: true,
      minlength: [3, 'Назва має бути не менше 3 символів'],
      maxlength: [200, 'Назва має бути не більше 200 символів']
    },

    author: {
      type: String,
      required: [true, 'Автор є обов\'язковим'],
      trim: true,
      maxlength: [100, 'Імʼя автора занадто довге']
    },

    description: {
      type: String,
      required: [true, 'Опис товару є обов\'язковим'],
      trim: true,
      minlength: [10, 'Опис має бути не менше 10 символів'],
      maxlength: [2000, 'Опис має бути не більше 2000 символів']
    },

    price: {
      type: Number,
      required: [true, 'Ціна є обов\'язковою'],
      min: [0, 'Ціна не може бути від\'ємною']
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Знижка не може бути від\'ємною'],
      max: [100, 'Знижка не може перевищувати 100%']
    },

    stock: {
      type: Number,
      required: [true, 'Кількість на складі є обов\'язковою'],
      min: [0, 'Кількість не може бути від\'ємною'],
      default: 0
    },

    image: {
      type: String,
      required: [true, 'Головне зображення є обов\'язковим'],
      trim: true
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: 'Максимум 5 додаткових зображень'
      }
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Категорія є обов\'язковою']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Віртуальна фінальна ціна
ProductSchema.virtual('finalPrice').get(function () {
  return this.discount > 0
    ? Math.round(this.price * (1 - this.discount / 100))
    : this.price;
});

// Чи є в наявності
ProductSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Пошук
ProductSchema.index({ name: 'text', description: 'text', author: 'text' });

export default mongoose.model('Product', ProductSchema);
