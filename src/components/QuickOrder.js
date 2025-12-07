import { useState } from 'react'
import Swal from 'sweetalert2'
import { FiX } from 'react-icons/fi'

function QuickOrder({ product, onClose, addToCart }) {
  const [size, setSize] = useState(product.sizes?.[0] || '')
  const [color, setColor] = useState(product.colors?.[0] || '')

  const handleAdd = () => {
    if (!size || !color) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Please select size and color', 
        timer: 1500, 
        showConfirmButton: false 
      })
      return
    }
    addToCart(product, size, color, 1)
    Swal.fire({ 
      icon: 'success', 
      title: 'Added to cart!', 
      timer: 1500, 
      showConfirmButton: false 
    })
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Add</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-4 mb-6 pb-6 border-b">
          <img 
            src={product.images?.[0]} 
            alt={product.name} 
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-xl font-bold text-black">{product.price} EGP</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Size</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes?.map(s => (
              <button 
                key={s} 
                onClick={() => setSize(s)} 
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                  size === s 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-900 border-gray-300 hover:border-black'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Color</label>
          <div className="flex flex-wrap gap-2">
            {product.colors?.map(c => (
              <button 
                key={c} 
                onClick={() => setColor(c)} 
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                  color === c 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-900 border-gray-300 hover:border-black'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-[2fr_1fr] gap-3">
          <button 
            onClick={handleAdd} 
            className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
          <button 
            onClick={onClose} 
            className="bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickOrder
