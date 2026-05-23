import { useState, useRef } from 'react'
import { Search, Sparkles, X, Loader2 } from 'lucide-react'
import { moodToMovieTitle } from '../utils/ai'

export default function SearchBar({ value, onChange, onMoodResult, placeholder }) {
  const [mood, setMood] = useState('')
  const [moodLoading, setMoodLoading] = useState(false)
  const [moodError, setMoodError] = useState('')
  const [showMood, setShowMood] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const inputRef = useRef(null)

  const handleMoodSubmit = async (e) => {
    e.preventDefault()
    if (!mood.trim()) return
    setMoodLoading(true)
    setMoodError('')
    setAiSuggestion('')
    try {
      const title = await moodToMovieTitle(mood.trim())
      setAiSuggestion(title)
      onMoodResult(title)
      setMood('')
    } catch (err) {
      setMoodError(err.message || 'AI error. Try again.')
    } finally {
      setMoodLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Main search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Search movies...'}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl text-sm outline-none transition-all"
          style={{
            background: 'var(--input-bg)',
            border: '1.5px solid var(--card-border)',
            color: 'var(--text)',
            boxShadow: 'var(--shadow-sm)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
        />
        {value && (
          <button
            onClick={() => { onChange(''); setAiSuggestion('') }}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* AI Mood Matcher toggle */}
      <div>
        <button
          onClick={() => setShowMood(s => !s)}
          className="flex items-center gap-2 text-xs font-semibold transition-all hover:opacity-80"
          style={{ color: 'var(--primary)' }}>
          <Sparkles size={13} />
          AI Mood Matcher
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-normal"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            {showMood ? 'hide' : 'try it'}
          </span>
        </button>

        {showMood && (
          <form onSubmit={handleMoodSubmit} className="mt-2 relative">
            <Sparkles
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--primary)' }}
            />
            <input
              type="text"
              value={mood}
              onChange={e => setMood(e.target.value)}
              placeholder="e.g. I feel sad but want something uplifting..."
              className="w-full pl-10 pr-28 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--primary-light)',
                border: '1.5px solid var(--primary)',
                color: 'var(--text)',
              }}
              disabled={moodLoading}
            />
            <button
              type="submit"
              disabled={moodLoading || !mood.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              style={{ background: 'var(--primary)', color: '#1a1200' }}>
              {moodLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {moodLoading ? 'Thinking...' : 'Find'}
            </button>
          </form>
        )}

        {aiSuggestion && !moodLoading && (
          <p className="text-xs mt-1.5 flex items-center gap-1.5"
            style={{ color: 'var(--text-muted)' }}>
            <Sparkles size={11} style={{ color: 'var(--primary)' }} />
            AI suggested: <strong style={{ color: 'var(--primary)' }}>"{aiSuggestion}"</strong>
          </p>
        )}
        {moodError && (
          <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{moodError}</p>
        )}
      </div>
    </div>
  )
}
