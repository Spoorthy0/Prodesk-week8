import { useEffect, useState } from 'react'
import { X, Star, Calendar, Clock, Heart, ExternalLink, Play } from 'lucide-react'
import { getMovieDetails, posterUrl, backdropUrl } from '../utils/tmdb'
import { useFavorites } from '../context/FavoritesContext'

export default function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toggleFavorite, isFavorite } = useFavorites()
  const fav = isFavorite(movie.id)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    getMovieDetails(movie.id)
      .then(setDetails)
      .catch(() => setDetails(null))
      .finally(() => setLoading(false))
    return () => { document.body.style.overflow = '' }
  }, [movie.id])

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const d = details || movie
  const backdrop = backdropUrl(d.backdrop_path)
  const poster = posterUrl(d.poster_path, 'w342')
  const year = d.release_date?.split('-')[0]
  const rating = d.vote_average?.toFixed(1)
  const trailer = details?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const cast = details?.credits?.cast?.slice(0, 6)
  const runtime = details?.runtime

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 transition-opacity"
        style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)' }} />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-2xl lg:max-w-3xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)' }}
        onClick={e => e.stopPropagation()}>

        {/* Backdrop image */}
        <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
          {backdrop && (
            <img src={backdrop} alt="" loading="lazy"
              className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), var(--card))' }} />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
            style={{ background: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto scrollbar-thin flex-1">
          <div className="p-5 sm:p-6 -mt-16 relative">
            <div className="flex gap-4">
              {/* Poster */}
              <div className="shrink-0 w-24 sm:w-32 rounded-xl overflow-hidden shadow-xl"
                style={{ border: '2px solid var(--primary)' }}>
                <img src={poster || 'https://placehold.co/128x192/1c1a16/d4af37?text=N/A'}
                  alt={d.title} loading="lazy"
                  className="w-full h-full object-cover" />
              </div>

              {/* Title & meta */}
              <div className="flex-1 pt-16">
                <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-2"
                  style={{ color: 'var(--text)' }}>
                  {d.title}
                </h2>
                <div className="flex flex-wrap gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {rating && (
                    <span className="flex items-center gap-1 font-semibold"
                      style={{ color: 'var(--primary)' }}>
                      <Star size={13} fill="currentColor" /> {rating}
                    </span>
                  )}
                  {year && (
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {year}
                    </span>
                  )}
                  {runtime && (
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {Math.floor(runtime / 60)}h {runtime % 60}m
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Genres */}
            {details?.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {details.genres.map(g => (
                  <span key={g.id} className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)' }}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {d.overview && (
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)' }}>Overview</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                  {d.overview}
                </p>
              </div>
            )}

            {/* Cast */}
            {cast?.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}>Cast</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {cast.map(actor => (
                    <div key={actor.id} className="shrink-0 text-center w-16">
                      <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-1.5"
                        style={{ border: '2px solid var(--card-border)' }}>
                        <img
                          src={actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : `https://placehold.co/48x48/2e2a20/d4af37?text=${actor.name[0]}`}
                          alt={actor.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[10px] font-medium leading-tight line-clamp-2"
                        style={{ color: 'var(--text)' }}>{actor.name}</p>
                      <p className="text-[10px] line-clamp-1 mt-0.5"
                        style={{ color: 'var(--text-muted)' }}>{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 mt-4 text-sm"
                style={{ color: 'var(--text-muted)' }}>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Loading details...
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => toggleFavorite(movie)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: fav ? '#ef4444' : 'var(--primary-light)',
                  color: fav ? 'white' : 'var(--primary)',
                  border: `1px solid ${fav ? '#ef4444' : 'var(--primary)'}`,
                }}>
                <Heart size={15} fill={fav ? 'white' : 'none'} />
                {fav ? 'Remove Favorite' : 'Add to Favorites'}
              </button>
              {trailer && (
                <a
                  href={`https://youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: 'var(--primary)', color: '#1a1200' }}>
                  <Play size={15} fill="currentColor" />
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
