import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import Swal from 'sweetalert2'
import axios from 'axios'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

function ProductDetails({ cart, addToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState(0)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showDesc, setShowDesc] = useState(false)
  const [showSize, setShowSize] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/products/${id}`).then(res => {
      setProduct(res.data)
      setSize(res.data.sizes?.[0] || '')
      setColor(res.data.colors?.[0] || '')
      setMainImage(0)
      return axios.get(`/api/products?exclude=${id}`)
    }).then(res => {
      setRelated(res.data.slice(0, 4))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (product.soldOut) {
      Swal.fire({ icon: 'error', title: 'Product is sold out', timer: 1500, showConfirmButton: false })
      return
    }
    if (!size || !color) {
      Swal.fire({ icon: 'warning', title: 'Please select size and color', timer: 1500, showConfirmButton: false })
      return
    }
    addToCart(product, size, color, quantity)
    Swal.fire({ icon: 'success', title: 'Added to cart!', timer: 1500, showConfirmButton: false })
  }

  const handleCheckout = () => {
    if (product.soldOut) {
      Swal.fire({ icon: 'error', title: 'Product is sold out', timer: 1500, showConfirmButton: false })
      return
    }
    if (!size || !color) {
      Swal.fire({ icon: 'warning', title: 'Please select size and color', timer: 1500, showConfirmButton: false })
      return
    }
    addToCart(product, size, color, quantity)
    navigate('/cart')
  }

  if (loading) return <Loading />
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cart.length} />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src={product.images?.[mainImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images?.map((img, i) => (
              <button key={i} onClick={() => setMainImage(i)} className={`w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 ${mainImage === i ? 'border-black' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-black mb-2">{product.name}</h1>
        <p className="text-xl text-gray-600 font-bold mb-6">{product.price} EGP</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {product.colors?.map(c => (
              <button key={c} onClick={() => setColor(c)} className={`px-4 py-2 border rounded ${color === c ? 'bg-black text-white' : 'bg-white text-black'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes?.map(s => (
              <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 border rounded ${size === s ? 'bg-black text-white' : 'bg-white text-black'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border rounded flex items-center justify-center">-</button>
            <span className="font-medium">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border rounded flex items-center justify-center">+</button>
          </div>
        </div>

        <button onClick={handleAddToCart} className="w-full bg-black text-white py-4 rounded font-medium mb-3">Add to Cart</button>
        <button onClick={handleCheckout} className="w-full bg-white text-black border border-black py-4 rounded font-medium mb-6">Proceed to Checkout</button>

        <button onClick={() => setShowDesc(!showDesc)} className="w-full flex items-center justify-between py-4 border-t">
          <span className="font-medium">Description</span>
          {showDesc ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {showDesc && <p className="text-gray-600 pb-4">{product.description || 'No description available'}</p>}

        <button onClick={() => setShowSize(!showSize)} className="w-full flex items-center justify-between py-4 border-t">
          <span className="font-medium">Size Chart</span>
          {showSize ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {showSize && (
          <div className="pb-4">
            <img src="/SIZE-CHART.png" alt="Size Chart" className="w-full rounded" />
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-black mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4">
              {related.map(p => <ProductCard key={p._id} product={p} addToCart={addToCart} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default ProductDetails
