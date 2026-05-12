import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      const data = await res.json()
      if (!res.ok) return setLoginError(data.message)
      login(data)
      navigate('/')
    } catch {
      setLoginError('Error al conectar con el servidor')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegisterError('')
    setRegisterSuccess('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      })
      const data = await res.json()
      if (!res.ok) return setRegisterError(data.message)
      setRegisterSuccess('Account created! You can now log in.')
      setRegisterForm({ name: '', email: '', password: '' })
    } catch {
      setRegisterError('Error al conectar con el servidor')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">

      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-10">
        🏠 &gt; <span className="text-gray-500">SHOP</span> &gt; <span className="text-gray-500">MY ACCOUNT</span>
      </p>

      <div className="grid grid-cols-2 gap-16">

        {/* ── LOGIN ── */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Login</h2>

          {loginError && (
            <p className="text-red-500 text-sm mb-4">{loginError}</p>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">
                Username or email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>
              <span className="text-sm font-bold text-gray-700 cursor-pointer hover:text-blue-600">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-700 transition"
            >
              LOGIN
            </button>
          </form>
        </div>

        {/* ── REGISTER ── */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Register</h2>

          {registerError && (
            <p className="text-red-500 text-sm mb-4">{registerError}</p>
          )}
          {registerSuccess && (
            <p className="text-green-600 text-sm mb-4">{registerSuccess}</p>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Your personal data will be used to support your experience throughout this website,
              to manage access to your account, and for other purposes described in our{' '}
              <span className="text-blue-600 cursor-pointer hover:underline">privacy policy</span>.
            </p>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-700 transition"
            >
              REGISTER
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Login