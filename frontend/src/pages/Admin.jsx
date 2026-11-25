import { useEffect, useState } from 'react'
import api, { getError } from '../api'

const STATUSES = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

const emptyRestaurant = { name: '', cuisine: '', address: '', rating: 4, deliveryTime: 30, imageUrl: '' }
const emptyItem = { name: '', description: '', price: '', veg: true }

function Admin() {
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [restaurantForm, setRestaurantForm] = useState(emptyRestaurant)
  const [selectedId, setSelectedId] = useState('')
  const [menu, setMenu] = useState([])
  const [itemForm, setItemForm] = useState(emptyItem)
  const [message, setMessage] = useState('')

  function loadOrders() {
    api.get('/admin/orders').then((res) => setOrders(res.data))
  }

  function loadRestaurants() {
    api.get('/restaurants').then((res) => setRestaurants(res.data))
  }

  function loadMenu(id) {
    api.get(`/restaurants/${id}/menu`).then((res) => setMenu(res.data))
  }

  useEffect(() => {
    loadOrders()
    loadRestaurants()
  }, [])

  async function changeStatus(orderId, status) {
    await api.put(`/admin/orders/${orderId}/status`, null, { params: { status } })
    loadOrders()
  }

  async function addRestaurant(e) {
    e.preventDefault()
    try {
      await api.post('/admin/restaurants', restaurantForm)
      setRestaurantForm(emptyRestaurant)
      setMessage('Restaurant added!')
      loadRestaurants()
    } catch (err) {
      setMessage(getError(err))
    }
  }

  async function deleteRestaurant(id) {
    if (!window.confirm('Delete this restaurant and its menu?')) return
    await api.delete(`/admin/restaurants/${id}`)
    if (String(id) === selectedId) {
      setSelectedId('')
      setMenu([])
    }
    loadRestaurants()
  }

  function selectRestaurant(id) {
    setSelectedId(id)
    if (id) loadMenu(id)
    else setMenu([])
  }

  async function addItem(e) {
    e.preventDefault()
    try {
      await api.post(`/admin/restaurants/${selectedId}/menu`, itemForm)
      setItemForm(emptyItem)
      loadMenu(selectedId)
    } catch (err) {
      setMessage(getError(err))
    }
  }

  async function deleteItem(id) {
    await api.delete(`/admin/menu/${id}`)
    loadMenu(selectedId)
  }

  return (
    <div className="container">
      <h2 className="section-title">Admin Dashboard</h2>

      <div className="tabs">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Orders</button>
        <button className={tab === 'restaurants' ? 'active' : ''} onClick={() => setTab('restaurants')}>Restaurants</button>
        <button className={tab === 'menu' ? 'active' : ''} onClick={() => setTab('menu')}>Menu Items</button>
      </div>

      {message && <p className="success" onClick={() => setMessage('')}>{message}</p>}

      {tab === 'orders' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>

            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customerName}<br /><span className="muted small">{o.address}</span></td>
                  <td>{o.restaurantName}</td>
                  <td className="small">{o.items.map((i) => `${i.quantity}× ${i.itemName}`).join(', ')}</td>
                  <td>₹{o.totalAmount}</td>
                  <td className="small">{o.paymentMethod ? `${o.paymentMethod} · ${o.paymentStatus}` : '—'}</td>

                  <td>
                    
                    <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="muted">No orders yet.</p>}
        </div>
      )}

      {tab === 'restaurants' && (
        <div className="admin-grid">
          <form className="box form" onSubmit={addRestaurant}>
            <h3>Add Restaurant</h3>
            <input placeholder="Name" required value={restaurantForm.name}
              onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })} />
            <input placeholder="Cuisine (e.g. Chinese, Pizza)" required value={restaurantForm.cuisine}
              onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })} />
            <input placeholder="Address" value={restaurantForm.address}
              onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })} />
            <input type="number" step="0.1" min="0" max="5" placeholder="Rating" value={restaurantForm.rating}
              onChange={(e) => setRestaurantForm({ ...restaurantForm, rating: e.target.value })} />
            <input type="number" min="1" placeholder="Delivery time (min)" value={restaurantForm.deliveryTime}
              onChange={(e) => setRestaurantForm({ ...restaurantForm, deliveryTime: e.target.value })} />
            <input placeholder="Image URL" value={restaurantForm.imageUrl}
              onChange={(e) => setRestaurantForm({ ...restaurantForm, imageUrl: e.target.value })} />
            <button className="btn btn-full" type="submit">Add Restaurant</button>
          </form>

          <div className="box">
            <h3>All Restaurants</h3>
            {restaurants.map((r) => (
              <div className="list-row" key={r.id}>
                <span>{r.name} <span className="muted small">· {r.cuisine}</span></span>
                <button className="btn-link danger" onClick={() => deleteRestaurant(r.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'menu' && (
        <div className="admin-grid">
          <form className="box form" onSubmit={addItem}>
            <h3>Add Menu Item</h3>
            <select value={selectedId} onChange={(e) => selectRestaurant(e.target.value)} required>
              <option value="">-- Select restaurant --</option>
              {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input placeholder="Item name" required value={itemForm.name}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
            <input placeholder="Description" value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
            <input type="number" min="1" placeholder="Price" required value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} />
            <label className="checkbox">
              <input type="checkbox" checked={itemForm.veg}
                onChange={(e) => setItemForm({ ...itemForm, veg: e.target.checked })} />
              Vegetarian
            </label>
            <button className="btn btn-full" type="submit" disabled={!selectedId}>Add Item</button>
          </form>

          <div className="box">
            <h3>Menu</h3>
            {!selectedId && <p className="muted">Select a restaurant to see its menu.</p>}
            {menu.map((m) => (
              <div className="list-row" key={m.id}>
                <span>
                  <span className={m.veg ? 'veg-dot veg' : 'veg-dot nonveg'}></span> {m.name}
                  <span className="muted small"> · ₹{m.price}</span>
                </span>
                <button className="btn-link danger" onClick={() => deleteItem(m.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
