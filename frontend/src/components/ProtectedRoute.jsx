import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Shows the page only if logged in (and admin, if adminOnly is set)
function ProtectedRoute({ children, adminOnly }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />

  return children
}

export default ProtectedRoute
