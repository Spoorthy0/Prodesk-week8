import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('cinestream-favorites')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cinestream-favorites', JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (movie) => {
    setFavorites(prev => {
      if (prev.find(m => m.id === movie.id)) return prev
      return [movie, ...prev]
    })
  }

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(m => m.id !== id))
  }

  const isFavorite = (id) => favorites.some(m => m.id === id)

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) removeFavorite(movie.id)
    else addFavorite(movie)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
