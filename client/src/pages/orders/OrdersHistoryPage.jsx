import { useEffect, useState } from 'react';
import { ordersAPI } from '../../api/orders';
import { ORDER_STATUS } from '../../utils/orderStatus';
import { Link } from 'react-router-dom';

import "../../styles/Orders.scss"

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await ordersAPI.getMy();
      setOrders(data);
      setLoading(false);
    };
    load();
  }, []);


  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="container">
      <h1>Мої замовлення</h1>

      {orders.length === 0 ? (
        <p>У вас ще немає замовлень</p>
      ) : (
        orders.map(order => (
          <div className="order-card" key={order._id}>
            <div>
              <b>Замовлення:</b> #{order._id.slice(-6)}
            </div>

            <div className={`status ${order.status}`}>
              {ORDER_STATUS[order.status]}
            </div>

            <div>
              <b>Сума:</b> {order.totalAmount} ₴
            </div>

            <p>
              <b>Дата:</b>{' '}
              {new Date(order.createdAt).toLocaleDateString('uk-UA')}
            </p>


            <Link to={`/orders/${order._id}`}>
              Переглянути →
            </Link>
          </div>

        ))
      )}
    </div>
  );
};

export default OrdersHistoryPage;
