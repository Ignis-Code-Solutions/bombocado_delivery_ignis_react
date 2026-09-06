import {
  Navigate,
  Outlet,
} from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

function AdminRoute() {
  const { usuario } = useAuth()

  const isAdmin =
    usuario?.tipo?.toUpperCase() === 'ADMIN'

  if (!isAdmin) {
    return (
      <Navigate
        to="/produtos"
        replace
      />
    )
  }

  return <Outlet />
}

export default AdminRoute