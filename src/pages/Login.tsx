import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FiInstagram, FiAlertCircle } from "react-icons/fi"
import { motion } from "framer-motion"

import { useAuth } from "@/contexts/AuthContext"
import { Loader } from "@/components/common/Loader"

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleInstagramLogin = async () => {
    setIsLoading(true)
    setApiError("")
    try {
      const user = await login()
      
      const destination = location.state?.from?.pathname || (user.role === "brand" ? "/brand/dashboard" : "/influencer/dashboard")
      navigate(destination, { replace: true })
    } catch (error) {
      console.error(error)
      setApiError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pulse-theme min-h-screen bg-pulse-bg text-pulse-text font-body relative overflow-hidden flex flex-col">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 bg-pulse-bg/80 backdrop-blur-xl border-b border-pulse-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pulse-text flex items-center justify-center">
              <span className="text-pulse-white text-sm font-bold font-heading">P</span>
            </div>
            <span className="font-heading font-bold text-pulse-text text-base hidden sm:inline">
              Creator Pulse
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/onboarding"
              className="text-sm font-heading font-bold text-pulse-white bg-pulse-text px-5 py-2 rounded-full hover:bg-pulse-text/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 w-full">
        {/* Decorative elements similar to PulseLanding */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pulse-lime/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pulse-pink/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pulse-purple/5 rounded-full blur-[150px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[400px] relative z-10"
        >
          <div className="rounded-3xl border border-pulse-border bg-pulse-card p-8 sm:p-10 shadow-pulse-card transition-all">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-pulse-text flex items-center justify-center shadow-lg">
                  <span className="text-pulse-white text-2xl font-bold font-heading">P</span>
                </div>
              </div>
              <h1 className="font-heading text-3xl font-bold text-pulse-text mb-2 tracking-tight">Welcome back</h1>
              <p className="text-base text-pulse-muted">Sign in to your Creator Pulse account</p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-500">{apiError}</p>
              </div>
            )}

            <button
              onClick={handleInstagramLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center h-14 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white rounded-full font-heading font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader size="sm" className="p-0 text-white" />
              ) : (
                <>
                  <FiInstagram className="mr-2 h-5 w-5" /> Continue with Instagram
                </>
              )}
            </button>

            <div className="mt-8 pt-6 border-t border-pulse-border text-center">
              <p className="text-sm text-pulse-muted">
                Don't have an account?{" "}
                <Link to="/onboarding" className="font-semibold text-pulse-text hover:text-pulse-lime transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
