import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'
import { useCart } from '../context/CartContext'

function RestaurantDetails() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const { addItem, removeItem, getQuantity, totalItems, totalPrice, cart } = useCart()

  useEffect(() => {
    api.get(`/restaurants/${id}`).then((res) => setRestaurant(res.data))
    api.get(`/restaurants/${id}/menu`).then((res) => setMenu(res.data))
  }, [id])

  if (!restaurant) return <p className="container muted">Loading...</p>

  return (
    <div className="container">
      <div className="restaurant-header">
        <img src={restaurant.imageUrl} alt={restaurant.name} />
        <div>
          <h1>{restaurant.name}</h1>
          <p className="muted">{restaurant.cuisine}</p>
          <p className="muted">{restaurant.address}</p>
          <div className="info-row">
            <span className="rating">{restaurant.rating} ★</span>
            <span>{restaurant.deliveryTime} min delivery</span>
          </div>
        </div>
      </div>

      <h2 className="section-title">Menu</h2>
      {menu.length === 0 && <p className="muted">No items yet.</p>}

      <div className="menu-list">
        {menu.map((item) => {
          const qty = cart.restaurantId === restaurant.id ? getQuantity(item.id) : 0
          return (
            <div className="menu-item" key={item.id}>
              <div>
                <span className={item.veg ? 'veg-dot veg' : 'veg-dot nonveg'}></span>
                <h3>{item.name}</h3>
                <p className="price">₹{item.price}</p>
                <p className="muted">{item.description}</p>
              </div>

              {qty === 0 ? (
                <button className="btn btn-outline" onClick={() => addItem(item, restaurant)}>ADD</button>
              ) : (
                <div className="qty-box">
                  <button onClick={() => removeItem(item.id)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => addItem(item, restaurant)}>+</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalItems > 0 && (
        <Link to="/cart" className="cart-bar">
          <span>{totalItems} item(s) | ₹{totalPrice}</span>
          <span>View Cart →</span>
        </Link>
      )}
    </div>
  )
}

export default RestaurantDetails
