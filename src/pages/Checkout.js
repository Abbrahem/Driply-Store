import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Swal from 'sweetalert2'
import axios from 'axios'

const SHIPPING = 120

function Checkout({ cart, clearCart }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', address: '', phone1: '', phone2: '' })
  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + SHIPPING

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.address || !form.phone1) {
      Swal.fire({ icon: 'warning', title: 'Please fill all required fields', timer: 1500, showConfirmButton: false })
      return
    }
    if (form.phone2 && form.phone1 === form.phone2) {
      Swal.fire({ icon: 'warning', title: 'Phone numbers must be different', timer: 1500, showConfirmButton: false })
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/orders', {
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          image: item.images?.[0],
          price: item.price,
          size: item.selectedSize,
          color: item.selectedColor,
          quantity: item.quantity
        })),
        customer: form,
        subtotal,
        shipping: SHIPPING,
        total
      })
      clearCart()
      Swal.fire({ 
        icon: 'success', 
        title: 'Thank you for your order!', 
        html: 'Your order has been placed successfully.<br>We will ship it within 3-5 business days.<br>We will contact you via WhatsApp soon.',
        confirmButtonColor: '#000',
        confirmButtonText: 'OK'
      })
      setTimeout(() => navigate('/'), 3000)
    } catch {
      Swal.fire({ icon: 'error', title: 'Failed to place order', timer: 1500, showConfirmButton: false })
    }
    setLoading(false)
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar cartCount={cart.length} />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 w-full">
        <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              {cart.map((item, i) => (
                <div key={i} className="flex gap-4 mb-4 pb-4 border-b last:border-0">
                  <img src={item.images?.[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.selectedColor} / {item.selectedSize} × {item.quantity}</p>
                  </div>
                  <p className="font-bold">{item.price * item.quantity} EGP</p>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2 mt-4">
                <div className="flex justify-between"><span>Subtotal</span><span>{subtotal} EGP</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{SHIPPING} EGP</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{total} EGP</span></div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
                <input 
                  type="text" 
                  placeholder="Enter your full address" 
                  value={form.address} 
                  onChange={e => setForm({...form, address: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number 1 *</label>
                <input 
                  type="tel" 
                  placeholder="01XXXXXXXXX" 
                  value={form.phone1} 
                  onChange={e => setForm({...form, phone1: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number 2 (Optional)</label>
                <input 
                  type="tel" 
                  placeholder="01XXXXXXXXX" 
                  value={form.phone2} 
                  onChange={e => setForm({...form, phone2: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'PLACE ORDER'}
              </button>
            </form>

            {/* Delivery Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Delivery Information</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Delivery within 3-5 business days</li>
                <li>✓ Premium quality guaranteed</li>
                <li>✓ Shipping available to all governorates</li>
                <li>✓ Payment via Instapay or Vodafone Cash</li>
                <li>✓ Contact us via WhatsApp for any inquiries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Checkout
