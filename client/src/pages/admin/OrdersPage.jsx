import { useEffect, useState } from 'react';
import { ordersAPI } from '../../api/orders';
import { Trash2 } from 'lucide-react';
import '../../styles/AdminOrders.scss';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const { data } = await ordersAPI.getAll();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (id, status) => {
    await ordersAPI.updateStatus(id, status);
    loadOrders();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Видалити замовлення?')) return;
    await ordersAPI.delete(id);
    loadOrders();
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="admin-orders">
      <h1>Замовлення</h1>

      <table>
        <thead>
          <tr>
            <th>Клієнт</th>
            <th>Товари</th>
            <th>Сума</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>
                <p>{order.user?.fullName || order.guestInfo?.fullName || '—'}</p>
                <p>{order.guestInfo?.address || '—'}</p>
              </td>

              <td>
                {order.items?.length > 0 ? (
                  order.items.map(item => (
                    <div key={item._id}>
                      <p>{item.name}</p>
                      <p>{item.quantity} шт.</p>
                    </div>
                  ))
                ) : (
                  <p>Товари відсутні</p>
                )}
              </td>


              <td>{order.totalAmount} грн</td>

              <td>
                <select
                  value={order.status}
                  onChange={(e) => changeStatus(order._id, e.target.value)}
                  disabled={order.status === 'delivered'}
                >
                  <option value="new">Нове</option>
                  <option value="confirmed">Підтверджено</option>
                  <option value="assembled">Зібрано</option>
                  <option value="shipped">Відправлено</option>
                  <option value="delivered">Доставлено</option>
                  <option value="cancelled">Скасовано</option>
                </select>

              </td>

              <td>
                <button onClick={() => deleteOrder(order._id)}>
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

export default OrdersPage;
