const { connectDB, Product } = require('../../lib/db')

module.exports = async (req, res) => {
  await connectDB()
  const { name } = req.query
  const products = await Product.find({ category: name }).sort({ createdAt: -1 })
  res.json(products)
}
