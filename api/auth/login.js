const { connectDB, Admin } = require('../lib/db')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, password } = req.body
  
  // Hardcoded admin for quick access
  if (email === 'admin@driply.com' && password === 'admin123') {
    return res.json({ token: process.env.ADMIN_TOKEN || 'admin123' })
  }
  
  // Check database
  try {
    await connectDB()
    const admin = await Admin.findOne({ email, password })
    if (admin) return res.json({ token: process.env.ADMIN_TOKEN || 'admin123' })
  } catch {}
  
  res.status(401).json({ error: 'Invalid credentials' })
}
