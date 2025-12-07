const { connectDB, Product } = require('../lib/db')
const { auth } = require('../lib/auth')

module.exports = async (req, res) => {
  await connectDB()
  
  if (req.method === 'GET') {
    const exclude = req.query.exclude
    const query = exclude ? { _id: { $ne: exclude } } : {}
    const products = await Product.find(query).sort({ createdAt: -1 })
    return res.json(products)
  }
  
  if (req.method === 'POST') {
    if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })
    const product = new Product(req.body)
    await product.save()
    return res.json(product)
  }
  
  res.status(405).json({ error: 'Method not allowed' })
}
