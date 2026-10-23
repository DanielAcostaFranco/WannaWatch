# WannaWatch

A dark, cinematic MVP prototype for personalized movie discovery.

## Run locally

```bash
npm install
npm run dev
```

The prototype currently uses local state in `localStorage` so the onboarding flow, swipes, and watchlist work without a backend. TMDB/Supabase endpoints can be connected behind the data functions in `src/main.js` as the next implementation step.

## TMDB

Copy `.env.example` to `.env.local`, add your TMDB v3 API key, and restart the dev server:

```bash
cp .env.example .env.local
npm run dev
```

If you have a TMDB Read Access Token, add it as `VITE_TMDB_READ_ACCESS_TOKEN`; the app will prioritize it over `VITE_TMDB_API_KEY` and send it as a Bearer token.

The current frontend fetches TMDB discovery results and ranks them using unseen filtering, genre affinity learned from ratings, vote score, and popularity. For production, move the TMDB request into a server route so the key is never exposed to the browser.

## Personalization model

WannaWatch now includes a lightweight online logistic-ranking model in the frontend. It learns from calibration swipes, watchlist actions, and explicit ratings, then combines the learned prediction with the existing TMDB/genre score. The model uses movie genres, TMDB rating, popularity, and release recency as features. Its weights are stored inside the existing `wannawatch-state` local storage record, so it works without a backend and has a cold-start fallback while the user has little data.

This is an intentionally small first ML model. When there are enough authenticated users, the next production step is to copy these events to Supabase, train a shared model on the server, and return ranked recommendations from an API.

## Supabase

Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor, then add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`. The app will keep working with local storage until those values are configured, then sync profiles, swipes, and watchlist entries for authenticated users.

For newer Supabase projects, use `VITE_SUPABASE_PUBLISHABLE_KEY` instead of the legacy anon key.
