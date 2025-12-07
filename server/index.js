const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/driply', {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('MongoDB Connected!')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

connectDB()

// Models
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  sizes: [String],
  colors: [String],
  images: [String],
  soldOut: { type: Boolean, default: false }
}, { timestamps: true })

const OrderSchema = new mongoose.Schema({
  items: [{
    productId: String,
    name: String,
    image: String,
    price: Number,
    size: String,
    color: String,
    quantity: Number
  }],
  customer: {
    name: String,
    address: String,
    phone1: String,
    phone2: String
  },
  subtotal: Number,
  shipping: Number,
  total: Number,
  status: { type: String, default: 'pending' }
}, { timestamps: true })

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String
})

const Product = mongoose.model('Product', ProductSchema)
const Order = mongoose.model('Order', OrderSchema)
const Admin = mongoose.model('Admin', AdminSchema)

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token === process.env.ADMIN_TOKEN || token === 'admin123') next()
  else res.status(401).json({ error: 'Unauthorized' })
}

// Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Hardcoded admin
    if (email === 'admin@driply.com' && password === 'admin123') {
      return res.json({ token: process.env.ADMIN_TOKEN || 'admin123' })
    }
    
    const admin = await Admin.findOne({ email, password })
    if (admin) res.json({ token: process.env.ADMIN_TOKEN || 'admin123' })
    else res.status(401).json({ error: 'Invalid credentials' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const exclude = req.query.exclude
    const query = exclude ? { _id: { $ne: exclude } } : {}
    const products = await Product.find(query).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/products/latest', async (req, res) => {
  try {
    const product = await Product.findOne().sort({ createdAt: -1 })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/products/category/:name', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.name }).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/products', auth, async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/products/:id/soldout', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { soldOut: req.body.soldOut }, { new: true })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/orders/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/orders/:id', auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
