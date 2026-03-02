import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  View,
  Animated,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import SignInScreen from '@/components/SignInScreen';
import QuickAddWidget from '@/components/QuickAddWidget';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { isSignedIn } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (isSignedIn) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]).start();
    }
  }, [isSignedIn]);
  const { user } = useUser();

  const accounts = trpc.accounts.getAll.useQuery(undefined, {
    enabled: !!isSignedIn,
  });
  const transactions = trpc.transactions.getAll.useQuery(undefined, {
    enabled: !!isSignedIn,
  });
  const lookups = trpc.lookups.getEssentialData.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([accounts.refetch(), transactions.refetch(), lookups.refetch()]);
    setRefreshing(false);
  };

  if (!isSignedIn) {
    return <SignInScreen message="Inicia sesión para ver tu resumen financiero" />;
  }

  if (accounts.isLoading || transactions.isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
        <Text style={[styles.subtitle, { marginTop: 16 }]}>Cargando datos...</Text>
      </View>
    );
  }

  const accountsList = accounts.data ?? [];
  const txList = transactions.data ?? [];
  const categoriesList = lookups.data?.categories ?? [];

  const totalBalance = accountsList.reduce(
    (sum, acc) => sum + (acc.realBalance ?? 0),
    0
  );

  const now = new Date();
  const monthTx = txList.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthIncome = monthTx
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthExpense = monthTx
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const recentTx = txList.slice(0, 5);

  const formatMoney = (amount: number) =>
    `$${amount.toLocaleString('es-CL')}`;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
      }
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <Text style={[styles.greeting, { color: theme.text }]}>
        👋 Hola, {user?.firstName ?? 'Usuario'}
      </Text>

      {/* Quick-add widget (4.6) */}
      <QuickAddWidget accounts={accountsList} categories={categoriesList} />

      <View style={[styles.balanceCard, { backgroundColor: '#1a1a1a' }]}>
        <Text style={[styles.balanceLabel, { color: '#9a9a9a' }]}>Balance Total</Text>
        <Text style={[styles.balanceAmount, { color: '#f5f0eb' }]}>
          {formatMoney(totalBalance)}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={styles.summaryIcon}>📈</Text>
          <Text style={[styles.summaryLabel, { color: '#6b6b6b' }]}>Ingresos</Text>
          <Text style={[styles.summaryAmount, { color: '#4b607f' }]}>
            {formatMoney(monthIncome)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={styles.summaryIcon}>📉</Text>
          <Text style={[styles.summaryLabel, { color: '#6b6b6b' }]}>Gastos</Text>
          <Text style={[styles.summaryAmount, { color: '#c95d45' }]}>
            {formatMoney(monthExpense)}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Cuentas</Text>
      {accountsList.map((acc) => (
        <View
          key={acc.id}
          style={[styles.accountRow, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.accountName, { color: theme.text }]}>{acc.name}</Text>
            <Text style={[styles.accountType, { color: '#6b6b6b' }]}>{acc.type}</Text>
          </View>
          <Text
            style={[
              styles.accountBalance,
              { color: (acc.realBalance ?? 0) >= 0 ? '#4b607f' : '#c95d45' },
            ]}
          >
            {formatMoney(acc.realBalance ?? 0)}
          </Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Últimas transacciones</Text>
      {recentTx.length === 0 && (
        <Text style={[styles.emptyText, { color: '#9a9a9a' }]}>
          No hay transacciones todavía.
        </Text>
      )}
      {recentTx.map((tx) => (
        <View
          key={tx.id}
          style={[styles.txRow, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.txDesc, { color: theme.text }]}>
              {tx.description || 'Sin descripción'}
            </Text>
            <Text style={[styles.txDate, { color: '#9a9a9a' }]}>
              {new Date(tx.date).toLocaleDateString('es-CL')}
            </Text>
          </View>
          <Text
            style={[
              styles.txAmount,
              { color: tx.type === 'income' ? '#4b607f' : '#c95d45' },
            ]}
          >
            {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
          </Text>
        </View>
      ))}

      <View style={{ height: 32 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  subtitle: { fontSize: 15, textAlign: 'center', opacity: 0.6, marginTop: 8 },
  greeting: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  balanceCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  balanceLabel: { fontSize: 14, marginBottom: 4 },
  balanceAmount: { fontSize: 36, fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  summaryCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 16, alignItems: 'center' },
  summaryIcon: { fontSize: 24, marginBottom: 4 },
  summaryLabel: { fontSize: 13, marginBottom: 2 },
  summaryAmount: { fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  accountRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 10 },
  accountName: { fontSize: 15, fontWeight: '600' },
  accountType: { fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  accountBalance: { fontSize: 17, fontWeight: 'bold' },
  txRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8 },
  txDesc: { fontSize: 14, fontWeight: '500' },
  txDate: { fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', paddingVertical: 20, fontSize: 14 },
});
