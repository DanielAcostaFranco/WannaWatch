import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '@/context/app-store';

export default function WatchlistScreen() {
  const { saved, removeSaved } = useAppStore();
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
      <Text style={styles.title}>Watchlist</Text>
      {saved.length ? saved.map(movie => <View key={movie.title} style={styles.movie}><Text style={styles.movieTitle}>{movie.title}</Text><Text style={styles.movieMeta}>{movie.year} · {movie.genre}</Text><Text style={styles.remove} onPress={() => removeSaved(movie.title)}>×</Text></View>) : <View style={styles.empty}><Text style={styles.icon}>＋</Text><Text style={styles.emptyTitle}>Save something for later</Text><Text style={styles.emptyCopy}>Tap the plus on any movie to build your watchlist.</Text></View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070506', padding: 24 },
  eyebrow: { color: '#e50914', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginTop: 20 },
  title: { color: '#fff', fontSize: 38, fontWeight: '800', marginTop: 10 },
  empty: { alignItems: 'center', marginTop: 120, paddingHorizontal: 28 },
  icon: { color: '#ffd166', fontSize: 48 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 18 },
  emptyCopy: { color: '#a99fa0', textAlign: 'center', lineHeight: 21, marginTop: 8 },
  movie: { backgroundColor: '#1a0d0f', borderRadius: 14, padding: 16, marginTop: 12, position: 'relative' },
  movieTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  movieMeta: { color: '#a99fa0', marginTop: 6, fontSize: 12 },
  remove: { position: 'absolute', right: 16, top: 13, color: '#ff5b66', fontSize: 24 },
});
