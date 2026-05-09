import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message)
      login(data)
      navigate('/')
    } catch (err) {
      setError('Error al conectar con el servidor')
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Login</h1>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-4 py-2 text-sm outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-4 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </div>
  )
}

export default Login