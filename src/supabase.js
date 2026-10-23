import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(url && anonKey && !url.includes('your-project'))
export const supabase = isSupabaseConfigured ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null

export async function getCurrentUser() {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function syncProfile(profile) {
  const user = await getCurrentUser()
  if (!user) return
  await supabase.from('profiles').upsert({ user_id: user.id, ...profile }, { onConflict: 'user_id' })
}

export async function recordInteraction({ tmdbId, action }) {
  const user = await getCurrentUser()
  if (!user || !tmdbId) return
  await supabase.from('user_interactions').upsert({ user_id: user.id, movie_id: tmdbId, action }, { onConflict: 'user_id,movie_id' })
}

export async function upsertMovie(movie) {
  if (!supabase || !movie?.tmdbId) return
  await supabase.from('movies').upsert({
    tmdb_id: movie.tmdbId,
    title: movie.title,
    overview: movie.blurb || '',
    poster_path: movie.image || null,
    release_date: movie.year ? `${movie.year}-01-01` : null,
    vote_average: movie.vote_average || (movie.match || 0) / 10,
    genres: movie.genre ? movie.genre.split(' · ') : [],
    providers: movie.providers || [],
  }, { onConflict: 'tmdb_id' })
}

export async function addToWatchlist(tmdbId) {
  const user = await getCurrentUser()
  if (!user || !tmdbId) return
  await supabase.from('watchlist').upsert({ user_id: user.id, movie_id: tmdbId }, { onConflict: 'user_id,movie_id' })
}

export async function removeFromWatchlist(tmdbId) {
  const user = await getCurrentUser()
  if (!user || !tmdbId) return
  await supabase.from('watchlist').delete().eq('user_id', user.id).eq('movie_id', tmdbId)
}
