import { useState, useCallback, useEffect } from 'react'
import { Film } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'
import MovieModal from '../components/MovieModal'
import { getPopularMovies, searchMovies } from '../utils/tmdb'
import { useDebounce } from '../hooks/useDebounce'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

export default function Home() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [error, setError] = useState('')

  const debouncedQuery = useDebounce(query, 500)

  const fetchMovies = useCallback(async (p, q, reset = false) => {
    setLoading(true)
    setError('')
    try {
      const data = q ? await searchMovies(q, p) : await getPopularMovies(p)
      setTotalPages(data.total_pages || 1)
      setMovies(prev => reset ? data.results : [...prev, ...data.results])
    } catch (e) {
      setError(e.message || 'Failed to load movies.')
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [])

  // Reset on query change
  useEffect(() => {
    setPage(1)
    setMovies([])
    setInitialLoad(true)
    fetchMovies(1, debouncedQuery, true)
  }, [debouncedQuery, fetchMovies])

  const loadMore = useCallback(() => {
    if (loading || page >= totalPages) return
    const next = page + 1
    setPage(next)
    fetchMovies(next, debouncedQuery)
  }, [loading, page, totalPages, debouncedQuery, fetchMovies])

  const hasMore = page < totalPages
  const sentinelRef = useInfiniteScroll(loadMore, loading, hasMore)

  const handleMoodResult = (title) => setQuery(title)

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <div className="text-center px-4 py-12 sm:py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Film size={11} />
          {debouncedQuery ? 'Search Results' : 'Popular Movies'}
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          style={{ color: 'var(--text)' }}>
          Discover{' '}
          <span style={{
            background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Cinema
          </span>
        </h1>
        <p className="text-base sm:text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Explore thousands of movies. Search by title or let AI match your mood.
        </p>
        <div className="px-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            onMoodResult={handleMoodResult}
            placeholder="Search movies, directors, genres..."
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="text-center py-12">
            <p className="text-sm px-4 py-3 rounded-xl inline-block"
              style={{ background: '#fee2e2', color: '#991b1b' }}>
              {error}
            </p>
          </div>
        )}

        {!error && (
          <>
            {/* Result count */}
            {!initialLoad && movies.length > 0 && debouncedQuery && (
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Showing results for{' '}
                <strong style={{ color: 'var(--text)' }}>"{debouncedQuery}"</strong>
              </p>
            )}

            <MovieGrid
              movies={movies}
              onOpenDetail={setSelectedMovie}
              loading={initialLoad}
              emptyMessage={debouncedQuery ? `No results for "${debouncedQuery}"` : 'No movies found'}
            />

            {/* Infinite scroll sentinel */}
            {!initialLoad && hasMore && (
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

            {!hasMore && movies.length > 0 && !loading && (
              <p className="text-center text-sm py-8" style={{ color: 'var(--text-muted)' }}>
                You've reached the end — {movies.length} movies loaded
              </p>
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
