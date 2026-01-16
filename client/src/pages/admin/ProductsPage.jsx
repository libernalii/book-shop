import { useEffect, useState } from 'react';
import { productsAPI } from '../../api/products';
import { categoriesAPI } from '../../api/categories';
import '../../styles/AdminProducts.scss';

const emptyProduct = {
  name: '',
  author: '',
  description: '',
  price: '',
  discount: 0,
  stock: 0,
  image: '',
  category: ''
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [{ data: productsData }, { data: categoriesData }] =
      await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        categoriesAPI.getAll()
      ]);

    setProducts(productsData.products);
    setCategories(categoriesData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount),
      stock: Number(form.stock),
    };

    if (editingId) {
      await productsAPI.update(editingId, payload);
    } else {
      await productsAPI.create(payload);
    }

    setForm(emptyProduct);
    setEditingId(null);
    loadData();
  };


  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      ...product,
      category: product.category?._id
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Видалити товар?')) return;
    await productsAPI.delete(id);
    loadData();
  };

  return (
    <div className="admin-page">
      <h1>Товари</h1>

      {/* FORM */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Назва" value={form.name} onChange={handleChange} required />
        <input name="author" placeholder="Автор" value={form.author} onChange={handleChange} required />
        <input name="image" placeholder="URL зображення" value={form.image} onChange={handleChange} required />

        <textarea
          name="description"
          placeholder="Опис"
          value={form.description}
          onChange={handleChange}
          required
        />

        <div className="row">
          <input name="price" type="number" placeholder="Ціна" value={form.price} onChange={handleChange} />
          <input name="discount" type="number" placeholder="Знижка %" value={form.discount} onChange={handleChange} />
          <input name="stock" type="number" placeholder="Кількість" value={form.stock} onChange={handleChange} />
        </div>

        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Оберіть категорію</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <button className="btn">
          {editingId ? 'Зберегти зміни' : 'Додати товар'}
        </button>
      </form>

      {/* LIST */}
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Автор</th>
              <th>Ціна</th>
              <th>Знижка</th>
              <th>Категорія</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.author}</td>
                <td>{p.price} грн</td>
                <td>{p.discount}%</td>
                <td>{p.category?.name}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>✏️</button>
                  <button onClick={() => handleDelete(p._id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsPage;
