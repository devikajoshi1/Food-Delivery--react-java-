import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import api, { getError } from '../api'
import { useCart } from '../context/CartContext'

const METHODS = [
  { id: 'UPI', icon: '📱', title: 'UPI', note: 'Google Pay, PhonePe, Paytm' },
  { id: 'CARD', icon: '💳', title: 'Credit / Debit Card', note: 'Visa, Mastercard, RuPay' },
  { id: 'COD', icon: '💵', title: 'Cash on Delivery', note: 'Pay when your food arrives' },
]

function Payment() {
  const { cart, clearCart, totalPrice } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const address = location.state?.address

  const [method, setMethod] = useState('UPI')
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)


  if (paid) return <p className="container muted">
             Payment successful! Opening your orders...
         </p>

  
  if (cart.items.length === 0 || !address) return <Navigate to="/cart" />

  function handleCardChange(e) {
    setCard({ ...card, [e.target.name]: e.target.value })
  }

  function chooseMethod(id) {
    setMethod(id)
    setError('')
  }

  function checkDetails() {
    if (method === 'UPI' && !/^[\w.-]+@[a-zA-Z]+$/.test(upiId)) {
      return 'Enter a valid UPI ID, like name@okaxis'
    }
    if (method === 'CARD') {
      if (!/^\d{16}$/.test(card.number.replaceAll(' ', ''))) return 'Card number must be 16 digits'
      if (!card.name.trim()) return 'Enter the name on the card'
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return 'Expiry must look like 08/28'
      if (!/^\d{3}$/.test(card.cvv)) return 'CVV must be 3 digits'
    }
    return ''
  }

  async function handlePay() {
    const problem = checkDetails()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setPaying(true)
    try {
      await api.post('/orders', {
        restaurantId: cart.restaurantId,
        address,
        paymentMethod: method,
        items: cart.items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
      })
      setPaid(true)
      clearCart()
      navigate('/orders')

    } catch (err) {
      setError(getError(err))
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="container narrow">
      <h2 className="section-title">Payment</h2>

      <div className="box">
        <div className="bill">
          <div className="bill-total"><span>To pay</span><span>₹{totalPrice}</span></div>
        </div>
        <p className="muted small">{cart.restaurantName} · Deliver to: {address}</p>
      </div>

      <div className="box">
        <h3>Choose payment method</h3>
        <div className="pay-options">
          {METHODS.map((m) => (
            <button
              key={m.id}
              className={method === m.id ? 'pay-option active' : 'pay-option'}
              onClick={() => chooseMethod(m.id)}
            >
              <span className="pay-icon">{m.icon}</span>
              <span className="pay-text">
                <strong>{m.title}</strong>
                <span className="muted small">{m.note}</span>
              </span>
            </button>
          ))}
        </div>

        {method === 'UPI' && (
          <div className="pay-form">
            <input placeholder="UPI ID (e.g. devika@okaxis)" value={upiId}
              onChange={(e) => setUpiId(e.target.value)} />
          </div>
        )}

        {method === 'CARD' && (
          <div className="pay-form">
            <input name="number" placeholder="Card number" maxLength="19" value={card.number} onChange={handleCardChange} />
            <input name="name" placeholder="Name on card" value={card.name} onChange={handleCardChange} />
            <div className="row-2">
              <input name="expiry" placeholder="MM/YY" maxLength="5" value={card.expiry} onChange={handleCardChange} />
              <input name="cvv" type="password" placeholder="CVV" maxLength="3" value={card.cvv} onChange={handleCardChange} />
            </div>
          </div>
        )}

        {method === 'COD' && (
          <p className="muted pay-form">Please keep ₹{totalPrice} ready when your food arrives.</p>
        )}

        {error && <p className="error">{error}</p>}

        <button className="btn btn-full" onClick={handlePay} disabled={paying}>
          {paying ? 'Processing...' : method === 'COD' ? 'Place Order' : `Pay ₹${totalPrice}`}
        </button>
        <p className="muted small">🔒 Practice payment: no real money is charged.</p>
      </div>
    </div>
  )
}

export default Payment
