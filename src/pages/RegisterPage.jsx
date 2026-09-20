import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot, Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(isEn ? 'Passwords do not match' : 'Password tidak cocok')
      return
    }

    if (password.length < 6) {
      setError(isEn ? 'Password must be at least 6 characters' : 'Password minimal 6 karakter')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  const handleGoogle = async () => {
    setError('')
    await signInWithGoogle()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/50">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="bg-gradient-to-br from-primary-400 to-primary-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-primary-500/30">
                <Bot size={40} />
              </div>
            </Link>
            <h1 className="text-3xl font-fredoka font-bold text-gray-900 mb-2">{isEn ? 'Create Account' : 'Buat Akun'}</h1>
            <p className="text-gray-500 font-outfit text-sm">{isEn ? 'Sign up to start learning with Robo Mind' : 'Daftar untuk mulai belajar bersama Robo Mind'}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-outfit text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-outfit font-bold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isEn ? 'name@email.com' : 'nama@email.com'}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 font-outfit focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-outfit font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEn ? 'At least 6 characters' : 'Minimal 6 karakter'}
                  required
                  minLength={6}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-11 font-outfit focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-outfit font-bold text-gray-700 mb-1.5">{isEn ? 'Confirm Password' : 'Konfirmasi Password'}</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={isEn ? 'Repeat password' : 'Ulangi password'}
                  required
                  minLength={6}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 font-outfit focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-outfit font-bold shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {isEn ? 'Sign Up' : 'Daftar'}
            </button>
          </form>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 font-outfit text-xs uppercase font-bold tracking-wider">{isEn ? 'or' : 'atau'}</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border-2 border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 hover:shadow-md transition-all font-outfit font-bold text-gray-700"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {isEn ? 'Sign up with Google' : 'Daftar dengan Google'}
          </button>

          <p className="text-center text-sm text-gray-500 font-outfit mt-6">
            {isEn ? 'Already have an account?' : 'Sudah punya akun?'}{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:underline">{isEn ? 'Sign In' : 'Masuk'}</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 font-outfit mt-6">
          {isEn ? 'By signing up, you agree to our' : 'Dengan mendaftar, Anda menyetujui'}{' '}
          <a href="#" className="text-primary-600 hover:underline">{isEn ? 'Terms of Service' : 'Syarat Ketentuan'}</a> {isEn ? 'and' : 'dan'}{' '}
          <a href="#" className="text-primary-600 hover:underline">{isEn ? 'Privacy Policy' : 'Kebijakan Privasi'}</a> {isEn ? '.' : 'kami.'}
        </p>
      </motion.div>
    </div>
  )
}

export default RegisterPage
