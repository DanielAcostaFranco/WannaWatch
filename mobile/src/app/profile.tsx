import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '@/context/app-store';

export default function ProfileScreen() {
  const { preferences, togglePreference, decided, saved } = useAppStore();
  const groups = [['Genres', 'genres', ['Drama', 'Comedy', 'Sci-fi', 'Thriller']], ['Countries', 'countries', ['United States', 'Mexico', 'United Kingdom', 'France']], ['Actors & directors', 'actors', ['Tom Hanks', 'Greta Gerwig', 'Denis Villeneuve']]] as const;
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
      <Text style={styles.name}>Alex&apos;s profile</Text>
      <Text style={styles.subtitle}>Tune your recommendations</Text>
      <Text style={styles.stats}>{decided.length} films discovered · {saved.length} saved</Text><View style={styles.section}><Text style={styles.sectionTitle}>Preferences</Text>{groups.map(([label, type, values]) => <View key={label} style={styles.group}><View style={styles.row}><Text style={styles.rowText}>{label}</Text><Text style={styles.plus}>＋</Text></View><View style={styles.chips}>{values.map(value => <Pressable key={value} onPress={() => togglePreference(type, value)} style={[styles.chip, preferences[type].includes(value) && styles.chipSelected]}><Text style={styles.chipText}>{value}</Text></Pressable>)}</View></View>)}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070506', padding: 24 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#e50914', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 18 },
  subtitle: { color: '#a99fa0', marginTop: 5 },
  stats: { color: '#a99fa0', marginTop: 18, fontSize: 12 },
  section: { marginTop: 42 },
  sectionTitle: { color: '#ffd166', fontSize: 12, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#271619', borderBottomWidth: 1, paddingVertical: 18 },
  rowText: { color: '#f5f1ed', fontSize: 16 },
  plus: { color: '#e50914', fontSize: 24 },
  group: { marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 10 },
  chip: { backgroundColor: '#211416', borderRadius: 16, paddingHorizontal: 11, paddingVertical: 8 },
  chipSelected: { backgroundColor: '#e50914' },
  chipText: { color: '#fff', fontSize: 11 },
});
