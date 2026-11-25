import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import RestaurantDetails from './pages/RestaurantDetails'
import Cart from './pages/Cart'
import ProtectedRoute from './components/ProtectedRoute'
import MyOrders from './pages/MyOrders'
import Admin from './pages/Admin'
import Payment from './pages/Payment'



function App() {
  return (
    <>
      <Navbar/>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/restaurant/:id" element={<RestaurantDetails/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />



      </Routes>
    </>
  )
}

export default App
