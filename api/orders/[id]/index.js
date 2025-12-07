const { connectDB, Order } = require('../../lib/db')
const { auth } = require('../../lib/auth')

module.exports = async (req, res) => {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })
  if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })
  await connectDB()
  const { id } = req.query
  await Order.findByIdAndDelete(id)
  res.json({ success: true })
}
