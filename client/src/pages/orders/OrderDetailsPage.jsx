import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';
import { ORDER_STATUS } from '../../utils/orderStatus';
import '../../styles/OrderDetailsPage.scss';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await ordersAPI.getById(id);
      setOrder(data);
    };
    load();
  }, [id]);

  if (!order) return <p>Завантаження...</p>;

  return (
    <div className="container order-page">
      {/* ==== INFO ==== */}
      <section className="order-info">
        <h1>Замовлення #{order._id.slice(-6)}</h1>

        <p className={`order-status ${order.status}`}>
          {ORDER_STATUS[order.status]}
        </p>

        <p>
          <b>Дата:</b>{' '}
          {new Date(order.createdAt).toLocaleDateString('uk-UA')}
        </p>

        <p>
          <b>Сума:</b> {order.totalAmount} ₴
        </p>
      </section>

      {/* ==== DELIVERY ==== */}
      {order.guestInfo && (
        <section className="order-delivery">
          <h3>Доставка</h3>
          <p><b>Отримувач:</b> {order.guestInfo.fullName}</p>
          <p><b>Телефон:</b> {order.guestInfo.phone}</p>
          <p><b>Адреса:</b> {order.guestInfo.address}</p>
        </section>
      )}

      {/* ==== ITEMS ==== */}
      <section className="order-items">
        <h3>Товари</h3>

        {order.items.length ? (
          order.items.map(item => (
            <div
              className="order-item"
              key={item.product?._id || item._id}
            >
              <span>{item.name}</span>
              <span>
                {item.quantity} × {item.price} ₴
              </span>
            </div>
          ))
        ) : (
          <p>Товари відсутні</p>
        )}
      </section>

      {/* ==== RECEIPT (PRINT) ==== */}
      <div id="order-receipt">
        <h2>Чек замовлення</h2>

        <p><b>Номер:</b> #{order._id.slice(-6)}</p>
        <p><b>Статус:</b> {ORDER_STATUS[order.status]}</p>
        <p><b>Сума:</b> {order.totalAmount} ₴</p>

        <hr />

        {order.items.map(item => (
          <p key={item._id}>
            {item.name} × {item.quantity} — {item.price} ₴
          </p>
        ))}
      </div>

      {/* ==== ACTIONS ==== */}
      <div className="order-actions">
        <button onClick={() => window.print()}>
          🧾 Завантажити чек
        </button>

        <button onClick={() => navigate('/orders')}>
          ← Назад до замовлень
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
