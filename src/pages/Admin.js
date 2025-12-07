import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { FiLogOut, FiX } from 'react-icons/fi'

const CATEGORIES = ['jacket', 'pants', 'hoodies', 'crow-nek']
const SIZES_CLOTHES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SIZES_PANTS = ['30', '32', '34', '36', '38', '40']
const COLORS = ['BLACK', 'WHITE', 'BLUE', 'RED', 'BEIGE', 'PINK', 'GRAY']

function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('add')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', price: '', description: '', category: 'jacket', sizes: [], colors: [], images: [] })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }
    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/orders', { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })
      ])
      setProducts(prodRes.data)
      setOrders(ordRes.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const getSizes = () => form.category === 'pants' ? SIZES_PANTS : SIZES_CLOTHES

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    Promise.all(files.map(file => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(file)
    }))).then(images => {
      setForm({ ...form, images: [...form.images, ...images] })
      Swal.fire({ icon: 'success', title: 'Images uploaded!', timer: 1000, showConfirmButton: false })
    })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || form.sizes.length === 0 || form.colors.length === 0 || form.images.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Please fill all fields', timer: 1500, showConfirmButton: false })
      return
    }
    try {
      const token = localStorage.getItem('admin_token')
      if (editId) {
        await axios.put(`/api/products/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } })
        Swal.fire({ icon: 'success', title: 'Product updated!', timer: 1000, showConfirmButton: false })
      } else {
        await axios.post('/api/products', form, { headers: { Authorization: `Bearer ${token}` } })
        Swal.fire({ icon: 'success', title: 'Product added!', timer: 1000, showConfirmButton: false })
      }
      setForm({ name: '', price: '', description: '', category: 'jacket', sizes: [], colors: [], images: [] })
      setEditId(null)
      fetchData()
    } catch {
      Swal.fire({ icon: 'error', title: 'Failed to save product', timer: 1500, showConfirmButton: false })
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete product?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#000' })
    if (result.isConfirmed) {
      await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })
      fetchData()
    }
  }

  const handleSoldOut = async (id, soldOut) => {
    await axios.patch(`/api/products/${id}/soldout`, { soldOut: !soldOut }, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })
    fetchData()
  }

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, description: product.description || '', category: product.category, sizes: product.sizes, colors: product.colors, images: product.images })
    setEditId(product._id)
    setTab('add')
  }

  const handleOrderStatus = async (id, status) => {
    await axios.patch(`/api/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })
    fetchData()
  }

  const handleDeleteOrder = async (id) => {
    const result = await Swal.fire({ title: 'Delete order?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#000' })
    if (result.isConfirmed) {
      await axios.delete(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })
      fetchData()
    }
  }

  const toggleSize = (s) => setForm({ ...form, sizes: form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s] })
  const toggleColor = (c) => setForm({ ...form, colors: form.colors.includes(c) ? form.colors.filter(x => x !== c) : [...form.colors, c] })

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            <button 
              onClick={() => setTab('add')} 
              className={`px-6 py-4 font-medium whitespace-nowrap ${tab === 'add' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {editId ? 'Edit Product' : 'Add New Product'}
            </button>
            <button 
              onClick={() => setTab('manage')} 
              className={`px-6 py-4 font-medium whitespace-nowrap ${tab === 'manage' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manage Products ({products.length})
            </button>
            <button 
              onClick={() => setTab('orders')} 
              className={`px-6 py-4 font-medium whitespace-nowrap ${tab === 'orders' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'add' && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">{editId ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Product Name" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input 
                type="number" 
                placeholder="Price (EGP)" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <textarea 
                placeholder="Description" 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-24"
              />
              <select 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value, sizes: []})} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {getSizes().map(s => (
                    <button 
                      key={s} 
                      onClick={() => toggleSize(s)} 
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${form.sizes.includes(s) ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-300 hover:border-black'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button 
                      key={c} 
                      onClick={() => toggleColor(c)} 
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${form.colors.includes(c) ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-300 hover:border-black'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button 
                        onClick={() => setForm({...form, images: form.images.filter((_, j) => j !== i)})} 
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={handleSubmit} 
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                {editId ? 'Update Product' : 'Add Product'}
              </button>
              
              {editId && (
                <button 
                  onClick={() => { setEditId(null); setForm({ name: '', price: '', description: '', category: 'jacket', sizes: [], colors: [], images: [] }) }} 
                  className="w-full border border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        )}

        {tab === 'manage' && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400 font-medium">No products yet</p>
                <p className="text-gray-500 mt-2">Add your first product to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p._id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="aspect-[4/5] bg-gray-100 relative">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                      {p.soldOut && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">SOLD OUT</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                      <p className="text-gray-600 font-semibold mb-4">{p.price} EGP</p>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => handleDelete(p._id)} 
                          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => handleEdit(p)} 
                          className="px-3 py-2 bg-gray-200 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-300"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleSoldOut(p._id, p.soldOut)} 
                          className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900"
                        >
                          {p.soldOut ? 'Available' : 'Sold Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'orders' && (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-4">{new Date(order.createdAt).toLocaleString()}</p>
                
                <div className="space-y-3 mb-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 pb-3 border-b last:border-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <div className="text-sm text-gray-600 space-y-1 mt-1">
                          <p><span className="font-medium">Color:</span> {item.color}</p>
                          <p><span className="font-medium">Size:</span> {item.size}</p>
                          <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                        </div>
                        <p className="font-bold mt-2">{item.price * item.quantity} EGP</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <p><span className="font-semibold">Name:</span> {order.customer?.name}</p>
                    <p><span className="font-semibold">Phone 1:</span> {order.customer?.phone1}</p>
                    <p><span className="font-semibold">Address:</span> {order.customer?.address}</p>
                    <p><span className="font-semibold">Phone 2:</span> {order.customer?.phone2 || '-'}</p>
                  </div>
                  <p className="font-bold text-lg mt-3">Total: {order.total} EGP</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    value={order.status || 'pending'} 
                    onChange={e => handleOrderStatus(order._id, e.target.value)} 
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    onClick={() => handleDeleteOrder(order._id)} 
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500">No orders yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
