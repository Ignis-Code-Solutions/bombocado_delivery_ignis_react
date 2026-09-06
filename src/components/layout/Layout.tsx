import { Outlet } from 'react-router-dom'
import Footer from '../footer/Footer'
import Navbar from '../navbar/Navbar'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}

export default Layout