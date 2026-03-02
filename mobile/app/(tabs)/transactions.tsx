import React from 'react';
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  View,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useAuth } from '@clerk/clerk-expo';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import SignInScreen from '@/components/SignInScreen';

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { isSignedIn } = useAuth();

  const transactions = trpc.transactions.getAll.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  const [refreshing, setRefreshing] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'income' | 'expense'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await transactions.refetch();
    setRefreshing(false);
  };

  if (!isSignedIn) {
    return <SignInScreen message="Inicia sesión para ver tus transacciones" />;
  }

  if (transactions.isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  const txList = transactions.data ?? [];
  const filtered = filter === 'all' ? txList : txList.filter((tx) => tx.type === filter);

  const formatMoney = (amount: number) => `$${amount.toLocaleString('es-CL')}`;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
      }
    >
      {/* Filter pills */}
      <View style={styles.filterRow}>
        {(['all', 'income', 'expense'] as const).map((f) => {
          const isActive = filter === f;
          const label = f === 'all' ? 'Todos' : f === 'income' ? 'Ingresos' : 'Gastos';
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterPill,
                {
                  backgroundColor: isActive ? '#1a1a1a' : theme.card,
                  borderColor: isActive ? '#1a1a1a' : theme.border,
                },
              ]}
            >
              <Text style={{ color: isActive ? '#f5f0eb' : '#6b6b6b', fontSize: 14, fontWeight: '600' }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ color: '#9a9a9a', fontSize: 13, marginBottom: 12 }}>
        {filtered.length} transaccion{filtered.length !== 1 ? 'es' : ''}
      </Text>

      {filtered.length === 0 && (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
          <Text style={{ color: '#9a9a9a', fontSize: 14, textAlign: 'center' }}>
            No hay transacciones{filter !== 'all' ? ` de tipo "${filter === 'income' ? 'ingreso' : 'gasto'}"` : ''}.
          </Text>
        </View>
      )}

      {filtered.map((tx) => (
        <View
          key={tx.id}
          style={[styles.txCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={styles.txLeft}>
            <View style={[styles.txDot, { backgroundColor: tx.type === 'income' ? '#4b607f' : '#c95d45' }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.txDesc, { color: theme.text }]}>
                {tx.description || 'Sin descripción'}
              </Text>
              <Text style={{ color: '#9a9a9a', fontSize: 12, marginTop: 2 }}>
                {tx.category?.name ?? 'Sin categoría'} · {new Date(tx.date).toLocaleDateString('es-CL')}
              </Text>
            </View>
          </View>
          <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#4b607f' : '#c95d45' }]}>
            {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
          </Text>
        </View>
      ))}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  filterPill: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  txCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  txLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  txDot: { width: 10, height: 10, borderRadius: 5 },
  txDesc: { fontSize: 15, fontWeight: '500' },
  txAmount: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  emptyCard: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center' },
});
