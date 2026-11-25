import React from 'react'
import { Link } from 'react-router-dom'

function RestaurantCard({ restaurant }) {

  return (

    <Link to={`/restaurant/${restaurant.id}`} className="card">
        <img src={restaurant.imageUrl} alt={restaurant.name} className="card-img"/>
        <div className="card-body">
            <div className="card-row">
                <h3>{restaurant.name}</h3>
                <span className="rating">{restaurant.rating} ★</span>
            </div>
            <div className="card-row muted">
                <span>{restaurant.cuisine}</span>
                <span>{restaurant.deliveryTime} min</span>
            </div>
        </div>
    </Link>
  )
}

export default RestaurantCard