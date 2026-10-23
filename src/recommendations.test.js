import test from 'node:test'
import assert from 'node:assert/strict'
import { diverseRank, isExcluded, movieIdentity, movieTitleKey, sameMovie } from './recommendations.js'

const film = { tmdbId: 42, title: 'Past Lives', year: '2023', genre: 'Romance · Drama' }
const emptyState = () => ({ decidedKeys: [], decided: [], saved: [], ratings: {}, exposures: {} })

test('rated and decided films are never offered again', () => {
  const rated = emptyState()
  rated.ratings[movieIdentity(film)] = 4
  assert.equal(isExcluded(film, rated), true)
  const demoRating = emptyState()
  demoRating.ratings[movieTitleKey(film)] = 5
  assert.equal(isExcluded(film, demoRating), true)

  const decided = emptyState()
  decided.decidedKeys.push(movieIdentity(film))
  assert.equal(isExcluded(film, decided), true)
})

test('a shown film rests for 30 days, including its demo or TMDB twin', () => {
  const now = Date.UTC(2026, 9, 21)
  const state = emptyState()
  state.exposures[movieTitleKey(film)] = now - 29 * 86400000
  assert.equal(isExcluded(film, state, now), true)
  assert.equal(isExcluded({ ...film, tmdbId: undefined }, state, now), true)
  assert.equal(isExcluded(film, state, now + 86400000), false)
})

test('same title and year deduplicate demo and TMDB results', () => {
  assert.equal(sameMovie(film, { title: 'Past Lives', year: '2023' }), true)
  assert.equal(sameMovie(film, { title: 'Past Lives', year: '2024' }), false)
})

test('ranking mixes genres even when one genre scores slightly higher', () => {
  const candidates = [
    { title: 'Drama A', genre: 'Drama', score: 90 },
    { title: 'Drama B', genre: 'Drama', score: 88 },
    { title: 'Comedy A', genre: 'Comedy', score: 82 }
  ]
  assert.deepEqual(diverseRank(candidates, movie => movie.score, [], 2).map(movie => movie.title), ['Drama A', 'Comedy A'])
})
