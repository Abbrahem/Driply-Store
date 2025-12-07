const { connectDB, Product } = require('../../lib/db')
const { auth } = require('../../lib/auth')

module.exports = async (req, res) => {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' })
  if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })
  await connectDB()
  const { id } = req.query
  const product = await Product.findByIdAndUpdate(id, { soldOut: req.body.soldOut }, { new: true })
  res.json(product)
}
