import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../api/orders';
import '../styles/CheckoutPage.scss';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    paymentMethod: 'card',
    cardNumber: '',
    cardDate: '',
    cardCvv: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Ваш кошик порожній</h2>
        <p>Додайте товари, щоб оформити замовлення</p>
      </div>
    );
  }

  /* ===== TOTAL ===== */
  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.product || item;
    const price = product.finalPrice || product.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.fullName || !form.phone || !form.address) {
      return 'Заповніть усі контактні дані';
    }

    if (!/^\+?\d{10,15}$/.test(form.phone)) {
      return 'Некоректний номер телефону';
    }

    if (form.paymentMethod === 'card') {
      if (!form.cardNumber || !form.cardDate || !form.cardCvv) {
        return 'Заповніть дані картки';
      }
    }

    return '';
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const payload = {
        items: cartItems.map(item => {
          const product = item.product || item;

          return {
            product: product._id,      
            name: product.name,        
            quantity: item.quantity,
            price: product.finalPrice || product.price
          };
        }),
        totalAmount,
        comment: ''
      };

      if (!user) {
        payload.guestInfo = {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address
        };
      }

      console.log('ORDER PAYLOAD', payload);

      const { data } = await ordersAPI.create(payload);

      clearCart();
      navigate(`/orders/${data._id}`);

    } catch (err) {
      console.error(err.response?.data || err);
      setError('Не вдалося оформити замовлення');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">Оформлення замовлення</h1>

      <div className="checkout-grid">

        {/* ===== FORM ===== */}
        <div className="checkout-form">
          <div className="form-section">
            <h3>Контактні дані</h3>

            <input
              name="fullName"
              placeholder="ПІБ"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="+380..."
              value={form.phone}
              onChange={handleChange}
            />

            <textarea
              name="address"
              placeholder="Адреса доставки"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-section">
            <h3>Оплата</h3>

            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="card">Карткою</option>
              <option value="cash">При отриманні</option>
            </select>

            {form.paymentMethod === 'card' && (
              <>
                <input
                  name="cardNumber"
                  placeholder="Номер картки"
                  value={form.cardNumber}
                  onChange={handleChange}
                />
                <input
                  name="cardDate"
                  placeholder="MM/YY"
                  value={form.cardDate}
                  onChange={handleChange}
                />
                <input
                  name="cardCvv"
                  placeholder="CVV"
                  value={form.cardCvv}
                  onChange={handleChange}
                />
              </>
            )}
          </div>

          {error && <p className="error">{error}</p>}

          <button
            className="checkout-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Оформлення...' : 'Підтвердити замовлення'}
          </button>
        </div>

        {/* ===== SUMMARY / ЧЕК ===== */}
        <div className="checkout-summary">
          <h3 className="summary-title">Ваше замовлення</h3>

          {cartItems.map(item => {
            const product = item.product || item;
            const price = product.finalPrice || product.price;

            return (
              <div className="summary-item" key={product._id}>
                <span>{product.name} × {item.quantity}</span>
                <span>{price * item.quantity} ₴</span>
              </div>
            );
          })}

          <div className="summary-total">
            <span>Разом:</span>
            <span>{subtotal} ₴</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
