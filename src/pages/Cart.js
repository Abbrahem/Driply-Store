import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiTrash2 } from 'react-icons/fi'

const SHIPPING = 120

function Cart({ cart, removeFromCart, updateQuantity }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + (cart.length > 0 ? SHIPPING : 0)

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cart.length} />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <h1 className="text-2xl font-bold text-black mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link to="/products" className="text-black underline">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                  <img src={item.images?.[0]} alt={item.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium text-black">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.selectedColor} / {item.selectedSize}</p>
                    <p className="font-bold text-black">{item.price} EGP</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))} className="w-8 h-8 border rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-8 h-8 border rounded">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="text-red-500"><FiTrash2 /></button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>{subtotal} EGP</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{SHIPPING} EGP</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{total} EGP</span></div>
            </div>

            <Link to="/checkout" className="block w-full bg-black text-white text-center py-4 rounded font-medium mt-6">
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Cart
