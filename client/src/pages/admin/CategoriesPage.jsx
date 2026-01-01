import { useEffect, useState } from 'react';
import { categoriesAPI } from '../../api/categories';
import { Pencil, Trash2 } from 'lucide-react';
import '../../styles/AdminCategories.scss';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesAPI.getAll();
      setCategories(data);
    } catch {
      setError('Не вдалося завантажити категорії');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await categoriesAPI.update(editingId, { name, description });
      } else {
        await categoriesAPI.create({ name, description });
      }

      setName('');
      setDescription('');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка збереження');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити категорію?')) return;

    try {
      await categoriesAPI.delete(id);
      fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Неможливо видалити категорію'
      );
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="admin-categories">
      <h1>Категорії</h1>

      <form onSubmit={handleSubmit} className="category-form">
        <h3>{editingId ? 'Редагувати категорію' : 'Додати категорію'}</h3>

        <input
          type="text"
          placeholder="Назва категорії"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Опис (необовʼязково)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">
          {editingId ? 'Зберегти' : 'Додати'}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel"
            onClick={() => {
              setEditingId(null);
              setName('');
              setDescription('');
            }}
          >
            Скасувати
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <table className="categories-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Опис</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.description || '-'}</td>
              <td>
                <button className="icon-btn" onClick={() => handleEdit(cat)}>
                  <Pencil size={18} />
                </button>

                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(cat._id)}
                >
                  <Trash2 size={18} />
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesPage;
