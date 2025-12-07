const { connectDB, Product } = require('../lib/db')

module.exports = async (req, res) => {
  await connectDB()
  const product = await Product.findOne().sort({ createdAt: -1 })
  res.json(product)
}
