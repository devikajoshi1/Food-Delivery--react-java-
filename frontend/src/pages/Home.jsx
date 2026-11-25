import { useEffect, useState } from 'react'
import api from '../api'
import categories from '../categories'
import RestaurantCard from '../components/RestaurantCard'

function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null) // the clicked food category
  const [loading, setLoading] = useState(true)

  // Reload the list whenever the search text or selected food changes
  useEffect(() => {
    setLoading(true)
    const params = selected ? { dish: selected.dish } : { search }
    api.get('/restaurants', { params })
      .then((res) => setRestaurants(res.data))
      .finally(() => setLoading(false))
  }, [search, selected])

  function handleSearch(e) {
    setSearch(e.target.value)
    setSelected(null)
  }

  function selectCategory(category) {
    setSearch('')
    // Clicking the same food again removes the filter
    setSelected(selected && selected.name === category.name ? null : category)
  }

  return (
    <div>
      <section className="hero">
        <h1>foodie</h1>
        <p>Discover the best food & drinks near you</p>
        <input
          className="search"
          placeholder="Search for restaurant or cuisine..."
          value={search}
          onChange={handleSearch}
        />
      </section>

      <div className="container">
        <h2 className="section-title">What's on your mind?</h2>
        <div className="categories">
          {categories.map((c) => (
            <button
              key={c.name}
              className={selected && selected.name === c.name ? 'category active' : 'category'}
              onClick={() => selectCategory(c)}
            >
              <img src={c.image} alt={c.name} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        <div className="list-header">
          <h2 className="section-title">
            {selected ? `Restaurants serving ${selected.name}` : 'Restaurants near you'}
          </h2>
          {selected && (
            <button className="btn btn-outline" onClick={() => setSelected(null)}>Clear ✕</button>
          )}
        </div>

        {loading && <p className="muted">Loading...</p>}
        {!loading && restaurants.length === 0 && <p className="muted">No restaurants found.</p>}

        <div className="grid">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
