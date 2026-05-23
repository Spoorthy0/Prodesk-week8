import { useState, useCallback, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import MovieGrid from '../components/MovieGrid'
import MovieModal from '../components/MovieModal'
import { getTrendingMovies } from '../utils/tmdb'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

export default function Trending() {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [error, setError] = useState('')

  const fetchMovies = useCallback(async (p, reset = false) => {
    setLoading(true)
    setError('')
    try {
      const data = await getTrendingMovies(p)
      setTotalPages(data.total_pages || 1)
      setMovies(prev => reset ? data.results : [...prev, ...data.results])
    } catch (e) {
      setError(e.message || 'Failed to load movies.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMovies(1, true) }, [fetchMovies])

  const loadMore = useCallback(() => {
    if (loading || page >= totalPages) return
    const next = page + 1
    setPage(next)
    fetchMovies(next)
  }, [loading, page, totalPages, fetchMovies])

  const hasMore = page < totalPages
  const sentinelRef = useInfiniteScroll(loadMore, loading, hasMore)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="text-center px-4 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <TrendingUp size={11} /> This Week
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--text)' }}>
          Trending{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Now</span>
        </h1>
        <p className="text-base" style={{ color: 'var(--text-muted)' }}>
          The most-watched movies this week
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-sm px-4 py-3 rounded-xl inline-block"
              style={{ background: '#fee2e2', color: '#991b1b' }}>{error}</p>
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} onOpenDetail={setSelectedMovie} loading={loading && movies.length === 0} />
            {hasMore && (
              <div ref={sentinelRef} className="h-16 flex items-center justify-center mt-8">
                {loading && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Loading more...
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  )
}
