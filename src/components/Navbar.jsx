import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Film, Heart, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useFavorites } from '../context/FavoritesContext'

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const { favorites } = useFavorites()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])

  const navLinks = [
    { to: '/', label: 'Discover' },
    { to: '/trending', label: 'Trending' },
    { to: '/favorites', label: 'Favorites', badge: favorites.length },
  ]

  return (
    <nav
      className="fixed top-0 inset-x-0 z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? dark ? 'rgba(16,14,11,0.95)' : 'rgba(254,250,240,0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--divider)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: 'var(--primary)' }}>
              <Film size={16} color="#1a1200" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
              Cine<span style={{ color: 'var(--primary)' }}>Stream</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                    background: active ? 'var(--primary-light)' : 'transparent',
                  }}>
                  {link.label}
                  {link.badge > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full text-xs flex items-center justify-center px-1 font-bold"
                      style={{ background: 'var(--primary)', color: '#1a1200' }}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'var(--bg-alt)', color: 'var(--text-muted)' }}
              title={dark ? 'Light mode' : 'Dark mode'}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              to="/favorites"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--primary)', color: '#1a1200' }}>
              <Heart size={14} fill="currentColor" />
              {favorites.length > 0 && <span>{favorites.length}</span>}
            </Link>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg-alt)', color: 'var(--text)' }}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-1"
          style={{
            borderColor: 'var(--divider)',
            background: dark ? 'rgba(16,14,11,0.98)' : 'rgba(254,250,240,0.98)',
            backdropFilter: 'blur(12px)',
          }}>
          {navLinks.map(link => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  color: active ? 'var(--primary)' : 'var(--text)',
                  background: active ? 'var(--primary-light)' : 'transparent',
                }}>
                {link.label}
                {link.badge > 0 && (
                  <span className="min-w-[20px] h-5 rounded-full text-xs flex items-center justify-center px-1.5 font-bold"
                    style={{ background: 'var(--primary)', color: '#1a1200' }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
