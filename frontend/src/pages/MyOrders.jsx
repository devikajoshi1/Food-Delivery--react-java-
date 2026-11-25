import { useEffect, useState } from 'react'
import api from '../api'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const PAY_NAMES = { COD: 'Cash on Delivery', UPI: 'UPI', CARD: 'Card' }


  useEffect(() => {
    api.get('/orders/my').then((res) => setOrders(res.data))
  }, [])

  return (
    <div className="container narrow">
      <h2 className="section-title">My Orders</h2>
      {orders.length === 0 && <p className="muted">You have not placed any orders yet.</p>}

      {orders.map((order) => (
        <div className="box order" key={order.id}>
          <div className="order-head">
            <div>
              <h3>{order.restaurantName}</h3>
              <p className="muted small">Order #{order.id} · {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className={`status status-${order.status}`}>{order.status.replaceAll('_', ' ')}</span>
          </div>
          {order.items.map((item) => (
            <p key={item.id} className="small">{item.quantity} × {item.itemName}</p>
          ))}
          <p className="order-total">Total: ₹{order.totalAmount}</p>
                    {order.paymentMethod && (
            <p className="muted small">
              Payment: {PAY_NAMES[order.paymentMethod]} · {order.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Pay on delivery'}
            </p>
          )}

        </div>
      ))}
    </div>
  )
}

export default MyOrders
