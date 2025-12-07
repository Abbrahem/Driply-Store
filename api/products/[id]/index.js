const { connectDB, Product } = require('../../lib/db')
const { auth } = require('../../lib/auth')

module.exports = async (req, res) => {
  await connectDB()
  const { id } = req.query
  
  if (req.method === 'GET') {
    const product = await Product.findById(id)
    return res.json(product)
  }
  
  if (req.method === 'PUT') {
    if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
    return res.json(product)
  }
  
  if (req.method === 'DELETE') {
    if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })
    await Product.findByIdAndDelete(id)
    return res.json({ success: true })
  }
  
  res.status(405).json({ error: 'Method not allowed' })
}
