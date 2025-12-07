const mongoose = require('mongoose')

let cached = global.mongoose
if (!cached) cached = global.mongoose = { conn: null, promise: null }

async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then(m => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}

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
  customer: { name: String, address: String, phone1: String, phone2: String },
  subtotal: Number,
  shipping: Number,
  total: Number,
  status: { type: String, default: 'pending' }
}, { timestamps: true })

const AdminSchema = new mongoose.Schema({ email: String, password: String })

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

module.exports = { connectDB, Product, Order, Admin }
