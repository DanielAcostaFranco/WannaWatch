const normalizedTitle = movie => (movie.title || '').trim().toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

export const movieIdentity = movie => movie.tmdbId ? `tmdb:${movie.tmdbId}` : `title:${normalizedTitle(movie)}:${movie.year || ''}`

export const movieTitleKey = movie => `title:${normalizedTitle(movie)}:${movie.year || ''}`

export const sameMovie = (a, b) => Boolean(a && b) && (a.tmdbId && b.tmdbId && a.tmdbId === b.tmdbId || normalizedTitle(a) === normalizedTitle(b) && String(a.year || '') === String(b.year || ''))

export function isExcluded(movie, state, now = Date.now()) {
  const key = movieIdentity(movie)
  const title = normalizedTitle(movie)
  if (movie.adult || state.decidedKeys?.includes(key) || state.decidedKeys?.includes(`title:${title}`)) return true
  if (state.decided?.some(value => normalizedTitle({ title: value }) === title)) return true
  if (state.saved?.some(value => normalizedTitle({ title: value }) === title)) return true
  if (state.ratings?.[key] || state.ratings?.[movieTitleKey(movie)] || state.ratings?.[`title:${title}`]) return true
  const exposure = state.exposures?.[key] || state.exposures?.[movieTitleKey(movie)]
  return Boolean(exposure && now - exposure < 30 * 24 * 60 * 60 * 1000)
}

export function diverseRank(candidates, score, history = [], limit = candidates.length) {
  const selected = []
  const remaining = [...candidates]
  while (remaining.length && selected.length < limit) {
    let bestIndex = 0
    let bestScore = -Infinity
    remaining.forEach((movie, index) => {
      const genre = (movie.genre || '').split(' · ')[0]
      const recent = [...history.slice(-4), ...selected].filter(item => (item.genre || '').split(' · ')[0] === genre).length
      const value = score(movie) - recent * 15
      if (value > bestScore) { bestScore = value; bestIndex = index }
    })
    selected.push(remaining.splice(bestIndex, 1)[0])
  }
  return selected
}
