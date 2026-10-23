import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Movie = { title: string; year: string; genre: string; image: string; description: string };
export type Action = 'want' | 'pass' | 'seen-like' | 'seen-dislike';
export const demoMovies: Movie[] = [
  { title: 'The Green Knight', year: '2021', genre: 'Fantasy · Drama', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85', description: 'A fearless quest through a land of myth, temptation, and strange beauty.' },
  { title: 'Past Lives', year: '2023', genre: 'Romance · Drama', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85', description: 'Two childhood friends reunite for one week in New York.' },
  { title: 'Arrival', year: '2016', genre: 'Sci-fi · Drama', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=85', description: 'A linguist works to communicate with visitors from beyond the stars.' },
];
type Preferences = { genres: string[]; countries: string[]; actors: string[]; directors: string[] };
type AppStore = { saved: Movie[]; decided: { movie: Movie; action: Action }[]; preferences: Preferences; togglePreference: (type: keyof Preferences, value: string) => void; toggleSaved: (movie: Movie) => void; removeSaved: (title: string) => void; recordAction: (movie: Movie, action: Action) => void; movieForTonight: (current: Movie) => Movie };
const StoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Movie[]>([]);
  const [decided, setDecided] = useState<{ movie: Movie; action: Action }[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({ genres: ['Drama'], countries: [], actors: [], directors: [] });
  const value = useMemo<AppStore>(() => ({
    saved,
    decided,
    preferences,
    togglePreference: (type, value) => setPreferences(current => ({ ...current, [type]: current[type].includes(value) ? current[type].filter(item => item !== value) : [...current[type], value] })),
    toggleSaved: movie => setSaved(current => current.some(item => item.title === movie.title) ? current.filter(item => item.title !== movie.title) : [...current, movie]),
    removeSaved: title => setSaved(current => current.filter(item => item.title !== title)),
    recordAction: (movie, action) => setDecided(current => [...current.filter(item => item.movie.title !== movie.title), { movie, action }]),
    movieForTonight: current => demoMovies.filter(movie => movie.title !== current.title && !decided.some(item => item.movie.title === movie.title))[Math.floor(Math.random() * Math.max(1, demoMovies.filter(movie => movie.title !== current.title).length))] || current,
  }), [saved, decided, preferences]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useAppStore() { const value = useContext(StoreContext); if (!value) throw new Error('useAppStore must be used inside AppStoreProvider'); return value; }
