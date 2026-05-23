import MovieCard from './MovieCard'

export default function MovieGrid({ movies, onOpenDetail, loading, emptyMessage }) {
  if (!loading && movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
          {emptyMessage || 'No movies found'}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Try a different search query
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie, i) => (
        <div
          key={`${movie.id}-${i}`}
          className="animate-fade-in"
          style={{ animationDelay: `${(i % 12) * 30}ms`, animationFillMode: 'both' }}>
          <MovieCard movie={movie} onOpenDetail={onOpenDetail} />
        </div>
      ))}
      {loading && Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={`sk-${i}`} />
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
      <div className="aspect-[2/3]" style={{ background: 'var(--bg-alt)' }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded-full w-3/4" style={{ background: 'var(--bg-alt)' }} />
        <div className="h-3 rounded-full w-1/2" style={{ background: 'var(--bg-alt)' }} />
      </div>
    </div>
  )
}
