import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'

const categories = [
  { name: 'Jacket', slug: 'jacket', image: '/jacket.jpg' },
  { name: 'Pants', slug: 'pants', image: '/pants.jpg' },
  { name: 'Hoodies', slug: 'hoodies', image: '/hoodie.jpg' },
  { name: 'Crow-Nek', slug: 'crow-nek', image: '/crow.jpg' },
]

function Home() {
  const [latestProduct, setLatestProduct] = useState(null)

  useEffect(() => {
    axios.get('/api/products/latest').then(res => {
      setLatestProduct(res.data)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-end justify-center pb-24 bg-gray-900 mt-16">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/home.jpg" 
            alt="Hero" 
            className="w-full h-full object-cover object-center"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-300 mb-4">DRIPLY STORE</h1>
          <p className="text-xl md:text-2xl text-white mb-12">Premium Streetwear Collection</p>
          <Link 
            to="/products" 
            className="inline-block bg-white/20 backdrop-blur-sm text-white border border-white/30 px-10 py-3 text-lg font-medium rounded-lg hover:bg-white/30 transition-all"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link key={cat.slug} to={`/category/${cat.slug}`} className="group">
              <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-100">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-center text-lg font-semibold text-gray-900">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Product */}
      {latestProduct && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">New Arrival</h2>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-[4/5] bg-gray-100">
                  <img 
                    src={latestProduct.images?.[0]} 
                    alt={latestProduct.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{latestProduct.name}</h3>
                  <p className="text-3xl font-bold text-black mb-6">{latestProduct.price} EGP</p>
                  
                  {latestProduct.description && (
                    <p className="text-gray-600 mb-6">{latestProduct.description}</p>
                  )}
                  
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Available Sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {latestProduct.sizes?.map(s => (
                        <span key={s} className="px-3 py-1 border border-gray-300 rounded text-sm font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Available Colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {latestProduct.colors?.map(c => (
                        <span key={c} className="px-3 py-1 border border-gray-300 rounded text-sm font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/product/${latestProduct._id}`}
                    className="inline-block text-center bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  )
}

export default Home
