import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

const emptyCart = { restaurantId: null, restaurantName: '', items: [] }

// Read the saved cart, but ignore it if it is missing or in the wrong format
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('cart'))
    if (saved && Array.isArray(saved.items)) return saved
  } catch (e) {
    // bad JSON: fall through to an empty cart
  }
  return emptyCart
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addItem(item, restaurant) {
    
    if (cart.restaurantId && cart.restaurantId !== restaurant.id) {
      const ok = window.confirm(`Your cart has items from ${cart.restaurantName}. Clear it and add this item?`)
      if (!ok) return
      setCart({ restaurantId: restaurant.id, restaurantName: restaurant.name, items: [{ ...item, quantity: 1 }] })
      return
    }

    const existing = cart.items.find((i) => i.id === item.id)
    const items = existing
      ? cart.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...cart.items, { ...item, quantity: 1 }]

    setCart({ restaurantId: restaurant.id, restaurantName: restaurant.name, items })
  }

  function removeItem(itemId) {
    const items = cart.items
      .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0)

    setCart(items.length ? { ...cart, items } : emptyCart)
  }

  function getQuantity(itemId) {
    const found = cart.items.find((i) => i.id === itemId)
    return found ? found.quantity : 0
  }

  function clearCart() {
    setCart(emptyCart)
  }

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, getQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
