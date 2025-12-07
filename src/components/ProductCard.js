import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import { useState } from 'react'
import QuickOrder from './QuickOrder'

function ProductCard({ product, addToCart }) {
  const [showQuick, setShowQuick] = useState(false)

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative">
        {product.soldOut && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded-md z-10">
            SOLD OUT
          </div>
        )}
        
        {!product.soldOut && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setShowQuick(true)
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white text-black rounded-full flex items-center justify-center z-10 hover:scale-110 transition-transform shadow-lg border border-gray-200"
          >
            <FiShoppingBag className="w-5 h-5" />
          </button>
        )}
        
        <Link to={`/product/${product._id}`} className="block group">
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
            <img 
              src={product.images?.[0]} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-lg font-bold text-black">{product.price} EGP</p>
          </div>
        </Link>
      </div>

      {showQuick && <QuickOrder product={product} onClose={() => setShowQuick(false)} addToCart={addToCart} />}
    </>
  )
}

export default ProductCard
