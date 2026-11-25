import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
      const { totalItems } = useCart()
    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <Link to="/" className="logo">foodie</Link>

            <div className="nav-links">
                {user && user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
                {user && <Link to="/orders">Orders</Link>}
                <Link to="/cart" className="cart-link">
                    Cart {totalItems > 0 && <span className="badge">{totalItems}</span>}
                </Link>
                {user ? (
                    <>
                        <span className="hello">Hi, {user.name}</span>
                        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn">Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;