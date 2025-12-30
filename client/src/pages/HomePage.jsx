import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../api/products';
import BookCard from '../components/BookCard';
import '../styles/HomePage.scss';

function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => productsAPI.getAll().then(res => res.data), // res.data - це об’єкт від бекенду
  });

  const books = data?.data || []; // дістаємо масив книг з поля "data"

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Сталася помилка</p>;

  return (
    <div className="home-page container page">
      <h1>Новинки</h1>
      <div className="books-grid">
        {books.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  );
}

export default HomePage;
