import { useState } from 'react'
import { Heart, Star, Calendar, Eye } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import { posterUrl } from '../utils/tmdb'

const FALLBACK = 'https://placehold.co/300x450/1c1a16/d4af37?text=No+Poster'

export default function MovieCard({ movie, onOpenDetail }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [heartAnim, setHeartAnim] = useState(false)

  const fav = isFavorite(movie.id)
  const poster = imgError ? FALLBACK : (posterUrl(movie.poster_path) || FALLBACK)
  const year = movie.release_date?.split('-')[0]
  const rating = movie.vote_average?.toFixed(1)

  const handleFav = (e) => {
    e.stopPropagation()
    setHeartAnim(true)
    toggleFavorite(movie)
    setTimeout(() => setHeartAnim(false), 600)
  }

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onClick={() => onOpenDetail(movie)}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>

      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 animate-pulse"
            style={{ background: 'var(--bg-alt)' }} />
        )}
        <img
          src={poster}
          alt={movie.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true) }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }}>
          <div className="p-3 w-full">
            <button
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
              style={{ background: 'var(--primary)', color: '#1a1200' }}
              onClick={(e) => { e.stopPropagation(); onOpenDetail(movie) }}>
              <Eye size={14} /> View Details
            </button>
          </div>
        </div>

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(0,0,0,0.75)', color: 'var(--primary)', backdropFilter: 'blur(4px)' }}>
            <Star size={10} fill="currentColor" />
            {rating}
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFav}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
          style={{
            background: fav ? 'rgba(239,68,68,0.9)' : 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            transform: heartAnim ? 'scale(1.3)' : undefined,
          }}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}>
          <Heart
            size={14}
            fill={fav ? 'white' : 'none'}
            color={fav ? 'white' : 'white'}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2"
          style={{ color: 'var(--text)' }}>
          {movie.title}
        </h3>
        <div className="flex items-center gap-3 mt-auto">
          {year && (
            <span className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--text-muted)' }}>
              <Calendar size={10} />
              {year}
            </span>
          )}
          {movie.vote_count > 0 && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {movie.vote_count.toLocaleString()} votes
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {movie.genre_ids?.slice(0, 2).map(id => (
            <GenreChip key={id} id={id} />
          ))}
        </div>
      </div>
    </div>
  )
}

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
}

function GenreChip({ id }) {
  const name = GENRE_MAP[id]
  if (!name) return null
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)' }}>
      {name}
    </span>
  )
}
