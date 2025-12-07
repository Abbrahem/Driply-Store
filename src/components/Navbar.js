import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'

function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.jpg" 
              alt="Driply Logo" 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-white font-bold text-lg">D</span>
            </div>
          </Link>

          {/* Brand Name - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              <h1 className="text-2xl font-bold text-black tracking-tight">DRIPLY</h1>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            <Link to="/cart" className="relative p-2">
              <FiShoppingCart className="w-6 h-6 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              {menuOpen ? <FiX className="w-6 h-6 text-black" /> : <FiMenu className="w-6 h-6 text-black" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg">All Products</Link>
            <Link to="/category/jacket" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Jackets</Link>
            <Link to="/category/pants" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Pants</Link>
            <Link to="/category/hoodies" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Hoodies</Link>
            <Link to="/category/crow-nek" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Crow-Nek</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
