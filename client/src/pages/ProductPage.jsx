// src/pages/ProductPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsAPI } from '../api/products';
import '../styles/ProductPage.scss';

function ProductPage() {
  const { id } = useParams();
  const { addToCart, cartItems, toggleCartOpen } = useCart();
  const { toggleWishlist, isInWishlist, toggleWishlistOpen } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await productsAPI.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Помилка завантаження книги:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <div className="product-page container">Завантаження...</div>;
  if (!product) return <div className="product-page container">Книга не знайдена</div>;

  const inCart = cartItems.some(item => item.id === product._id);

  const handleAddToCart = () => {
    addToCart(product);
    toggleCartOpen(true);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toggleWishlistOpen(true);
  };

  return (
    <div className="product-page container">
      <div className="product-details">
        <img src={product.image} alt={product.title} className="product-image" />
        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="author">Автор: {product.author}</p>
          <p className="category">Категорія: {product.category?.name || 'Невідомо'}</p>
          <p className="price">{product.price} ₴</p>
          <p className="description">{product.description}</p>

          <div className="actions">
            <button
              className={`cart-btn ${inCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
            >
              {inCart ? 'У кошику' : 'Додати в кошик'}
            </button>

            <button
              className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
              onClick={handleToggleWishlist}
            >
              {isInWishlist(product._id) ? 'У вішлісті' : 'Додати у вішліст'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
