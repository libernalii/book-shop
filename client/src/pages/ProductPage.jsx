import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
import '../styles/ProductPage.scss';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, toggleCartOpen } = useCart();
  const { toggleWishlist, isInWishlist, toggleWishlistOpen } = useWishlist();
  const [heartAnimation, setHeartAnimation] = useState(false);


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await productsAPI.getById(id);
        setProduct(data);
      } catch (err) {
        console.error('Помилка завантаження книги:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="product-page container">Завантаження...</div>;
  if (!product) return <div className="product-page container">Книга не знайдена</div>;

  const inCart = cartItems.some(
    item => item._id === product._id || item.product?._id === product._id
  );


  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
    toggleCartOpen(true);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    toggleWishlist(product);
    toggleWishlistOpen(true);

    setHeartAnimation(true);
    setTimeout(() => setHeartAnimation(false), 300);
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
              className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''} ${heartAnimation ? 'beat' : ''}`}
              onClick={handleToggleWishlist}
            >
              <Heart size={20} />
            </button>


            <button
              className={`cart-btn ${inCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} /> {inCart ? 'У кошику' : 'Додати в кошик'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductPage;
