const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

export async function moodToMovieTitle(moodQuery) {
  if (!API_KEY) throw new Error('OpenRouter API key not configured in .env')

  const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'CineStream',
    },
    body: JSON.stringify({
      model: '~openai/gpt-latest',
      max_tokens: 60,
      messages: [
        {
          role: 'system',
          content:
            "You are a movie recommendation expert. Given the user's mood or feeling, respond with ONLY a single well-known movie title — nothing else. No explanation, no quotes, no punctuation. Just the movie title.",
        },
        {
          role: 'user',
          content: moodQuery,
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenRouter error ${response.status}`)
  }

  const data = await response.json()
  const title = data.choices?.[0]?.message?.content?.trim()
  if (!title) throw new Error('No title returned from AI')
  return title
}
