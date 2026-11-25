import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getError } from '../api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function Cart() {
  const { cart, addItem, removeItem, clearCart, totalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

    function goToPayment() {
    if (!address.trim()) {
      setError('Please enter a delivery address')
      return
    }
    navigate('/payment', { state: { address } })
  }


  if (cart.items.length === 0) {
    return (
      <div className="container empty">
        <h2>Your cart is empty</h2>
        <p className="muted">Add something delicious!</p>
        <Link to="/" className="btn">Browse restaurants</Link>
      </div>
    )
  }

  const restaurant = { id: cart.restaurantId, name: cart.restaurantName }

  return (
    <div className="container narrow">
      <h2 className="section-title">Cart · {cart.restaurantName}</h2>

      <div className="box">
        {cart.items.map((item) => (
          <div className="cart-item" key={item.id}>
            <span>{item.name}</span>
            <div className="qty-box">
              <button onClick={() => removeItem(item.id)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => addItem(item, restaurant)}>+</button>
            </div>
            <span className="price">₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="bill">
          <div className="bill-total"><span>To pay</span><span>₹{totalPrice}</span></div>
        </div>
      </div>

      <div className="box">
        <h3>Delivery address</h3>
        <textarea
          rows="3"
          placeholder="House no, street, area, city"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {error && <p className="error">{error}</p>}

        {user ? (
        <button className="btn btn-full" onClick={goToPayment}>
          Proceed to Payment
          </button>

        ) : (
          <Link to="/login" className="btn btn-full">Login to place order</Link>
        )}
      </div>
    </div>
  )
}

export default Cart
