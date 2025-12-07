import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      Swal.fire({ icon: 'warning', title: 'Please fill all fields', timer: 1500, showConfirmButton: false })
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('admin_token', res.data.token)
      navigate('/admin')
    } catch {
      Swal.fire({ icon: 'error', title: 'Invalid credentials', timer: 1500, showConfirmButton: false })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-black text-center mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-black"
          />
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded font-medium disabled:opacity-50">
            {loading ? 'Loading...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
