import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-brew-yellow-light">
      {/* Coffee Spill Illustration */}
      <div className="relative mb-8 animate-fade-up">
        <div className="text-8xl md:text-9xl">☕</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-brew-yellow/30 rounded-full blur-sm" />
        <div className="absolute bottom-0 right-0 text-3xl rotate-12 animate-float" style={{ animationDelay: '1s' }}>💧</div>
      </div>

      <h1 className="font-inter font-bold text-3xl md:text-4xl text-brew-text mb-3 animate-fade-up delay-100">
        Oops — this brew doesn't exist
      </h1>
      <p className="font-inter text-brew-muted mb-8 max-w-md animate-fade-up delay-200">
        The page you're looking for has been spilled, moved, or never existed.
        Let's get you back to safety.
      </p>

      <div className="flex gap-4 animate-fade-up delay-300">
        <Link to="/">
          <Button variant="primary" className="px-8">
            Back to home
          </Button>
        </Link>
        <Link to="/explore">
          <Button variant="secondary" className="px-8">
            Explore creators
          </Button>
        </Link>
      </div>
    </div>
  )
}
