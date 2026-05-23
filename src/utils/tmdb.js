const TMDB_BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.status_message || `HTTP ${res.status}`)
  }
  return res.json()
}

export const getPopularMovies = (page = 1) =>
  tmdbFetch('/movie/popular', { page })

export const getTrendingMovies = (page = 1) =>
  tmdbFetch('/trending/movie/week', { page })

export const searchMovies = (query, page = 1) =>
  tmdbFetch('/search/movie', { query, page, include_adult: false })

export const getMovieDetails = (id) =>
  tmdbFetch(`/movie/${id}`, { append_to_response: 'credits,videos' })

export const getGenres = () =>
  tmdbFetch('/genre/movie/list')

export const posterUrl = (path, size = 'w500') =>
  path ? `${TMDB_IMG_BASE}/${size}${path}` : null

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${TMDB_IMG_BASE}/${size}${path}` : null
