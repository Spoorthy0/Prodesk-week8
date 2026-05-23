import { useState } from 'react'
import { Heart, Trash2 } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import MovieCard from '../components/MovieCard'
import MovieModal from '../components/MovieModal'
import { Link } from 'react-router-dom'

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites()
  const [selectedMovie, setSelectedMovie] = useState(null)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="text-center px-4 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Heart size={11} fill="currentColor" />
          Your Collection
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--text)' }}>
          My{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Favorites</span>
        </h1>
        <p className="text-base" style={{ color: 'var(--text-muted)' }}>
          {favorites.length > 0
            ? `${favorites.length} movie${favorites.length !== 1 ? 's' : ''} in your collection`
            : 'Your saved movies will appear here'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'var(--primary-light)' }}>
              <Heart size={36} style={{ color: 'var(--primary)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
              No favorites yet
            </h2>
            <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Browse movies and tap the heart icon to save your favorites here.
            </p>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ background: 'var(--primary)', color: '#1a1200' }}>
              Discover Movies
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  if (window.confirm(`Remove all ${favorites.length} favorites?`)) {
                    favorites.forEach(m => toggleFavorite(m))
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ background: 'var(--bg-alt)', color: '#ef4444' }}>
                <Trash2 size={13} /> Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favorites.map((movie, i) => (
                <div key={movie.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                  <MovieCard movie={movie} onOpenDetail={setSelectedMovie} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  )
}
