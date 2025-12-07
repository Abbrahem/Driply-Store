import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Category from './pages/Category'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'

function App() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('driply_cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem('driply_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, size, color, quantity = 1) => {
    const existingIndex = cart.findIndex(
      item => item._id === product._id && item.selectedSize === size && item.selectedColor === color
    )
    if (existingIndex > -1) {
      const newCart = [...cart]
      newCart[existingIndex].quantity += quantity
      setCart(newCart)
    } else {
      setCart([...cart, { ...product, selectedSize: size, selectedColor: color, quantity }])
    }
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const updateQuantity = (index, quantity) => {
    const newCart = [...cart]
    newCart[index].quantity = quantity
    setCart(newCart)
  }

  const clearCart = () => setCart([])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products cart={cart} addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetails cart={cart} addToCart={addToCart} />} />
        <Route path="/category/:name" element={<Category cart={cart} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
