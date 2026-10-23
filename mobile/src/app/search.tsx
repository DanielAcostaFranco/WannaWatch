import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { demoMovies, useAppStore } from '@/context/app-store';

export default function SearchScreen() {
  const { toggleSaved, saved } = useAppStore();
  const [query, setQuery] = useState('');
  const results = useMemo(() => demoMovies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()) || movie.genre.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.eyebrow}>FIND YOUR NEXT FILM</Text>
      <Text style={styles.title}>Search movies, actors{ '\n' }and directors.</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search by title or person" placeholderTextColor="#8d7d80" style={styles.input} />
      <View style={styles.results}>{(query ? results : demoMovies).map(movie => <View key={movie.title} style={styles.result}><View><Text style={styles.resultTitle}>{movie.title}</Text><Text style={styles.resultMeta}>{movie.year} · {movie.genre}</Text></View><Pressable onPress={() => toggleSaved(movie)} style={styles.save}><Text style={styles.saveText}>{saved.some(item => item.title === movie.title) ? '♥' : '＋'}</Text></Pressable></View>)}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070506', padding: 24 },
  eyebrow: { color: '#e50914', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginTop: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800', lineHeight: 36, marginTop: 12 },
  input: { backgroundColor: '#1a0d0f', color: '#fff', borderRadius: 14, padding: 16, marginTop: 28, fontSize: 15 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  chip: { backgroundColor: '#e50914', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9 },
  chipText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  results: { marginTop: 18 },
  result: { backgroundColor: '#1a0d0f', borderRadius: 14, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  resultMeta: { color: '#a99fa0', marginTop: 5, fontSize: 11 },
  save: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#e50914', alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#fff', fontSize: 20 },
});
