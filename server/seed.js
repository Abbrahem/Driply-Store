const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://driply_admin:Driply123!@cluster0.fmsf8fl.mongodb.net/driply?retryWrites=true&w=majority&appName=Cluster0'

const AdminSchema = new mongoose.Schema({ email: String, password: String })
const Admin = mongoose.model('Admin', AdminSchema)

async function seed() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected!')
    
    await Admin.deleteMany({})
    await Admin.create({ email: 'admin@driply.com', password: 'admin123' })
    console.log('Admin created: admin@driply.com / admin123')
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await mongoose.disconnect()
    process.exit()
  }
}

seed()
