import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';
import BookCard from '../components/BookCard';
import { useFilter } from '../context/FilterContext';
import '../styles/CatalogPage.scss';

function CatalogPage() {
  const { searchTerm, selectedCategory, setSelectedCategory, sortBy, setSortBy } = useFilter();
  const [page, setPage] = useState(1);
  const limit = 12;

  // Категорії
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll().then(res => res.data),
  });

  // Товари
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, sortBy, page],
    queryFn: () =>
      productsAPI
        .getAll({
          search: searchTerm, // глобальний пошук з хедера
          category: selectedCategory,
          sort: sortBy,
          page,
          limit,
        })
        .then(res => res.data),
    keepPreviousData: true,
  });

  const products = productsData?.products || [];
  const totalPages = productsData?.totalPages || 1;

  return (
    <div className="catalog-page container">
      <h1>Каталог книг</h1>

      {/* Фільтри (без поля пошуку) */}
      <div className="filters">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Всі категорії</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Сортування</option>
          <option value="price_asc">Ціна: Зростання</option>
          <option value="price_desc">Ціна: Зменшення</option>
          <option value="title_asc">Назва: A-Z</option>
          <option value="title_desc">Назва: Z-A</option>
        </select>
      </div>

      {/* Список книг */}
      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <div className="books-grid">
          {products.length > 0 ? (
            products.map((book) => <BookCard key={book._id} book={book} />)
          ) : (
            <p>Немає книг за вашим запитом.</p>
          )}
        </div>
      )}

      {/* Пагінація */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Попередня
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Наступна
        </button>
      </div>
    </div>
  );
}

export default CatalogPage;
