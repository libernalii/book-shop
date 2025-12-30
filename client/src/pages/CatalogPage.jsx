// src/pages/CatalogPage.jsx
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';
import BookCard from '../components/BookCard';
import { useFilter } from '../context/FilterContext';
import '../styles/CatalogPage.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CatalogPage() {
  const {
    searchTerm,
    category,
    setCategory,
    sortBy,
    setSortBy,
    page,
    setPage,
    resetPage,
  } = useFilter();

  const [sortedProducts, setSortedProducts] = useState([]);
  const limit = 12;

  // Отримуємо категорії
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll().then(res => res.data),
  });

  // Отримуємо товари
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', searchTerm, category, page],
    queryFn: () =>
      productsAPI.getAll({
        search: searchTerm,
        category,
        page,
        limit,
      }).then(res => res.data),
    keepPreviousData: true,
  });

  const products = productsData?.products || [];
  const totalPages = productsData?.totalPages || Math.ceil((productsData?.total || 0) / limit);

  // Сортування на фронті
  useEffect(() => {
    let sorted = [...products];
    if (sortBy === 'price') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === '-price') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === '-title') sorted.sort((a, b) => b.title.localeCompare(a.title));

    setSortedProducts(sorted);
  }, [products, sortBy]);

  return (
    <div className="catalog-page container page">
      <h1>Каталог книг</h1>

      {/* Фільтри */}
      <div className="filters">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            resetPage();
          }}
        >
          <option value="">Всі категорії</option>
          {categories?.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            resetPage();
          }}
        >
          <option value="">Сортування</option>
          <option value="price">Ціна ↑</option>
          <option value="-price">Ціна ↓</option>
          <option value="title">Назва A–Z</option>
          <option value="-title">Назва Z–A</option>
        </select>
      </div>

      {/* Товари */}
      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <div className="books-grid">
          {sortedProducts.length > 0 ? (
            sortedProducts.map(book => (
              <Link key={book._id} to={`/products/${book._id}`}>
                <BookCard book={book} />
              </Link>
            ))
          ) : (
            <p>Нічого не знайдено</p>
          )}
        </div>
      )}

      {/* Пагінація */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Попередня
        </button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Наступна
        </button>
      </div>
    </div>
  );
}

export default CatalogPage;
