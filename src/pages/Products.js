import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import axios from 'axios'

function Products({ cart, addToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setLoading(true)
    axios.get('/api/products').then(res => {
      setProducts(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.category === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cart.length} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">All Products</h1>
        
        <div className="grid md:grid-cols-[2fr_1fr] gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
          >
            <option value="all">All Categories</option>
            <option value="jacket">Jacket</option>
            <option value="pants">Pants</option>
            <option value="hoodies">Hoodies</option>
            <option value="crow-nek">Crow-Nek</option>
          </select>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} addToCart={addToCart} />
              ))}
            </div>
            
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500">No products found</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Products
