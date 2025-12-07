const { connectDB, Order } = require('../lib/db')
const { auth } = require('../lib/auth')

module.exports = async (req, res) => {
  await connectDB()
  
  if (req.method === 'GET') {
    if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })
    const orders = await Order.find().sort({ createdAt: -1 })
    return res.json(orders)
  }
  
  if (req.method === 'POST') {
    const order = new Order(req.body)
    await order.save()
    return res.json(order)
  }
  
  res.status(405).json({ error: 'Method not allowed' })
}
