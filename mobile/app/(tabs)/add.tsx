import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useAuth } from '@clerk/clerk-expo';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import SignInScreen from '@/components/SignInScreen';

export default function AddScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { isSignedIn } = useAuth();

  const utils = trpc.useUtils();
  const lookups = trpc.lookups.getEssentialData.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  const createMutation = trpc.transactions.create.useMutation({
    onSuccess: () => {
      utils.transactions.getAll.invalidate();
      utils.accounts.getAll.invalidate();
      utils.lookups.getEssentialData.invalidate();
      Alert.alert('✅ Listo', 'Transacción registrada exitosamente.');
      resetForm();
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedCategoryId(null);
  };

  if (!isSignedIn) {
    return <SignInScreen message="Inicia sesión para registrar gastos e ingresos" />;
  }

  if (lookups.isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
        <Text style={{ marginTop: 12, color: '#9a9a9a' }}>Cargando datos...</Text>
      </View>
    );
  }

  // Show error if lookups failed
  if (lookups.error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>⚠️</Text>
        <Text style={{ color: '#c95d45', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
          Error al cargar datos
        </Text>
        <Text style={{ color: '#9a9a9a', fontSize: 13, textAlign: 'center', marginTop: 8, paddingHorizontal: 32 }}>
          {lookups.error.message}
        </Text>
        <TouchableOpacity
          onPress={() => lookups.refetch()}
          style={{ marginTop: 20, backgroundColor: '#f3701e', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const accounts = lookups.data?.accounts ?? [];
  const categories = lookups.data?.categories ?? [];
  const filteredCategories = categories.filter((c) => c.type === type);
  const accountId = selectedAccountId ?? accounts[0]?.id;

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido.');
      return;
    }
    if (!accountId) {
      Alert.alert('Error', 'No hay cuentas disponibles. Crea una en la pestaña de Perfil.');
      return;
    }

    createMutation.mutate({
      amount: numAmount,
      type,
      description: description.trim() || undefined,
      accountId,
      categoryId: selectedCategoryId ?? undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => { setType('expense'); setSelectedCategoryId(null); }}
            activeOpacity={0.7}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: type === 'expense' ? '#c95d45' : theme.card,
                borderColor: type === 'expense' ? '#c95d45' : theme.border,
              },
            ]}
          >
            <Text style={{ color: type === 'expense' ? '#fff' : '#6b6b6b', fontSize: 16, fontWeight: '700' }}>
              Gasto
            </Text>
          </TouchableOpacity>

          <View style={{ width: 12 }} />

          <TouchableOpacity
            onPress={() => { setType('income'); setSelectedCategoryId(null); }}
            activeOpacity={0.7}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: type === 'income' ? '#4b607f' : theme.card,
                borderColor: type === 'income' ? '#4b607f' : theme.border,
              },
            ]}
          >
            <Text style={{ color: type === 'income' ? '#fff' : '#6b6b6b', fontSize: 16, fontWeight: '700' }}>
              Ingreso
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <Text style={[styles.label, { color: theme.text }]}>Monto</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          placeholderTextColor="#9a9a9a"
          keyboardType="numeric"
          style={[styles.amountInput, { backgroundColor: '#f5f0eb', borderColor: '#e8d8c9', color: theme.text }]}
        />

        {/* Description */}
        <Text style={[styles.label, { color: theme.text }]}>Descripción</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Ej: Almuerzo, Uber, Sueldo..."
          placeholderTextColor="#9a9a9a"
          style={[styles.input, { backgroundColor: '#f5f0eb', borderColor: '#e8d8c9', color: theme.text }]}
        />

        {/* Account selector */}
        <Text style={[styles.label, { color: theme.text }]}>Cuenta</Text>
        {accounts.length === 0 ? (
          <Text style={{ color: '#c95d45', fontSize: 13 }}>
            ⚠️ No tienes cuentas. Crea una desde Perfil → Billeteras.
          </Text>
        ) : (
          <View style={styles.chipRow}>
            {accounts.map((acc) => {
              const isActive = accountId === acc.id;
              return (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => setSelectedAccountId(acc.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? '#1a1a1a' : theme.card,
                      borderColor: isActive ? '#1a1a1a' : theme.border,
                    },
                  ]}
                >
                  <Text style={{ color: isActive ? '#f5f0eb' : '#6b6b6b', fontSize: 14, fontWeight: '500' }}>
                    {acc.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Category selector */}
        <Text style={[styles.label, { color: theme.text }]}>Categoría</Text>
        {filteredCategories.length === 0 ? (
          <Text style={{ color: '#9a9a9a', fontSize: 13 }}>
            No hay categorías de {type === 'expense' ? 'gasto' : 'ingreso'}.
          </Text>
        ) : (
          <View style={styles.chipRow}>
            {filteredCategories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategoryId(isActive ? null : cat.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? cat.color : theme.card,
                      borderColor: isActive ? cat.color : theme.border,
                    },
                  ]}
                >
                  <Text style={{ color: isActive ? '#fff' : '#6b6b6b', fontSize: 14, fontWeight: '500' }}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={createMutation.isPending}
          activeOpacity={0.8}
          style={[styles.submitBtn, { backgroundColor: createMutation.isPending ? '#9a9a9a' : '#f3701e' }]}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              Registrar {type === 'expense' ? 'Gasto' : 'Ingreso'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    textAlign: 'center',
  },
  input: {
    fontSize: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: 32,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
