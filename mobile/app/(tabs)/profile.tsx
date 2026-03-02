import React, { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
  View,
  Modal,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import SignInScreen from '@/components/SignInScreen';

const ACCOUNT_TYPES = [
  { value: 'cash', label: '💵 Efectivo' },
  { value: 'bank', label: '🏦 Banco' },
  { value: 'credit_card', label: '💳 Tarjeta de Crédito' },
  { value: 'savings', label: '🐷 Ahorro' },
  { value: 'investment', label: '📈 Inversión' },
] as const;

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // tRPC
  const utils = trpc.useUtils();
  const accounts = trpc.accounts.getAll.useQuery(undefined, { enabled: !!isSignedIn });
  const createAccount = trpc.accounts.create.useMutation({
    onSuccess: () => { utils.accounts.getAll.invalidate(); setShowCreateModal(false); resetCreateForm(); },
    onError: (err) => Alert.alert('Error', err.message),
  });
  const deleteAccount = trpc.accounts.delete.useMutation({
    onSuccess: () => utils.accounts.getAll.invalidate(),
    onError: (err) => Alert.alert('Error', err.message),
  });

  // Name editing
  const [editingName, setEditingName] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [saving, setSaving] = useState(false);

  // Create account modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<string>('cash');
  const [newAccBalance, setNewAccBalance] = useState('0');

  const resetCreateForm = () => {
    setNewAccName('');
    setNewAccType('cash');
    setNewAccBalance('0');
  };

  if (!isSignedIn) {
    return <SignInScreen message="Inicia sesión para ver tu perfil" />;
  }

  const handleSaveName = async () => {
    try {
      setSaving(true);
      await user?.update({ firstName: firstName.trim(), lastName: lastName.trim() });
      setEditingName(false);
      Alert.alert('✅', 'Nombre actualizado.');
    } catch (err: any) {
      Alert.alert('Error', err?.errors?.[0]?.longMessage || 'No se pudo actualizar.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAccount = () => {
    if (!newAccName.trim()) {
      Alert.alert('Error', 'Ingresa un nombre para la cuenta.');
      return;
    }
    createAccount.mutate({
      name: newAccName.trim(),
      type: newAccType as any,
      balance: parseFloat(newAccBalance) || 0,
    });
  };

  const handleDeleteAccount = (id: string, name: string) => {
    Alert.alert('Eliminar cuenta', `¿Eliminar "${name}"? Se borrarán todas sus transacciones.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteAccount.mutate({ id }) },
    ]);
  };

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí, cerrar sesión', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const formatMoney = (amount: number) => `$${amount.toLocaleString('es-CL')}`;
  const accountsList = accounts.data ?? [];

  return (
    <>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: '#f3701e' }]}>
            <Text style={styles.avatarText}>
              {(user?.firstName?.[0] ?? '?').toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{user?.fullName ?? 'Usuario'}</Text>
          <Text style={{ color: '#9a9a9a', fontSize: 14 }}>
            {user?.primaryEmailAddress?.emailAddress ?? ''}
          </Text>
        </View>

        {/* CUENTA section */}
        <Text style={[styles.sectionTitle, { color: '#6b6b6b' }]}>CUENTA</Text>
        <View style={[styles.menuCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Pressable
            onPress={() => {
              setEditingName(!editingName);
              setFirstName(user?.firstName ?? '');
              setLastName(user?.lastName ?? '');
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={[styles.menuLabel, { color: theme.text, flex: 1 }]}>
              {editingName ? 'Cancelar edición' : 'Cambiar nombre'}
            </Text>
            <Text style={{ color: '#9a9a9a', fontSize: 20 }}>{editingName ? '✕' : '›'}</Text>
          </Pressable>

          {editingName && (
            <View style={[styles.editSection, { borderTopColor: theme.border }]}>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Nombre"
                placeholderTextColor="#9a9a9a"
                style={[styles.editInput, { backgroundColor: '#f5f0eb', borderColor: '#e8d8c9', color: theme.text }]}
              />
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Apellido"
                placeholderTextColor="#9a9a9a"
                style={[styles.editInput, { backgroundColor: '#f5f0eb', borderColor: '#e8d8c9', color: theme.text }]}
              />
              <Pressable
                onPress={handleSaveName}
                disabled={saving}
                style={[styles.saveBtn, { backgroundColor: saving ? '#9a9a9a' : '#f3701e' }]}
              >
                {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Guardar</Text>}
              </Pressable>
            </View>
          )}

          <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />

          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>📧</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuLabel, { color: theme.text }]}>Email</Text>
              <Text style={{ color: '#9a9a9a', fontSize: 12, marginTop: 2 }}>
                {user?.primaryEmailAddress?.emailAddress}
              </Text>
            </View>
          </View>

          <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />

          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>📅</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuLabel, { color: theme.text }]}>Miembro desde</Text>
              <Text style={{ color: '#9a9a9a', fontSize: 12, marginTop: 2 }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long' }) : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* BILLETERAS / CUENTAS section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: '#6b6b6b' }]}>BILLETERAS</Text>
          <Pressable onPress={() => setShowCreateModal(true)} style={[styles.addBtn, { backgroundColor: '#f3701e' }]}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>+ Nueva</Text>
          </Pressable>
        </View>

        {accounts.isLoading ? (
          <ActivityIndicator color={theme.tint} style={{ padding: 20 }} />
        ) : accountsList.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🏦</Text>
            <Text style={{ color: '#9a9a9a', fontSize: 14, textAlign: 'center' }}>
              No tienes cuentas creadas aún.
            </Text>
          </View>
        ) : (
          <View style={[styles.menuCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {accountsList.map((acc, i) => {
              const typeLabel = ACCOUNT_TYPES.find((t) => t.value === acc.type)?.label ?? acc.type;
              return (
                <React.Fragment key={acc.id}>
                  {i > 0 && <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />}
                  <View style={styles.accountItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.menuLabel, { color: theme.text }]}>{acc.name}</Text>
                      <Text style={{ color: '#9a9a9a', fontSize: 12, marginTop: 2 }}>{typeLabel}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={{
                        fontSize: 16, fontWeight: 'bold',
                        color: (acc.realBalance ?? 0) >= 0 ? '#4b607f' : '#c95d45',
                      }}>
                        {formatMoney(acc.realBalance ?? 0)}
                      </Text>
                      <Pressable onPress={() => handleDeleteAccount(acc.id, acc.name)}>
                        <Text style={{ color: '#c95d45', fontSize: 12 }}>Eliminar</Text>
                      </Pressable>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}

        {/* APP section */}
        <Text style={[styles.sectionTitle, { color: '#6b6b6b' }]}>APP</Text>
        <View style={[styles.menuCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>💰</Text>
            <Text style={[styles.menuLabel, { color: theme.text, flex: 1 }]}>todaLaPlata</Text>
            <Text style={{ color: '#9a9a9a', fontSize: 13 }}>v1.0.0</Text>
          </View>
          <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>📱</Text>
            <Text style={[styles.menuLabel, { color: theme.text, flex: 1 }]}>Plataforma</Text>
            <Text style={{ color: '#9a9a9a', fontSize: 13 }}>Expo SDK 54</Text>
          </View>
        </View>

        {/* Sign out */}
        <Pressable onPress={handleSignOut} style={[styles.signOutBtn, { borderColor: '#c95d45' }]}>
          <Text style={{ color: '#c95d45', fontSize: 16, fontWeight: '600' }}>🚪 Cerrar sesión</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* CREATE ACCOUNT MODAL */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Nueva billetera</Text>

            <Text style={[styles.label, { color: theme.text }]}>Nombre</Text>
            <TextInput
              value={newAccName}
              onChangeText={setNewAccName}
              placeholder="Ej: Banco Chile, Efectivo..."
              placeholderTextColor="#9a9a9a"
              style={[styles.editInput, { backgroundColor: '#f5f0eb', borderColor: '#e8d8c9', color: theme.text }]}
            />

            <Text style={[styles.label, { color: theme.text }]}>Tipo</Text>
            <View style={styles.chipRow}>
              {ACCOUNT_TYPES.map((t) => (
                <Pressable
                  key={t.value}
                  onPress={() => setNewAccType(t.value)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: newAccType === t.value ? '#1a1a1a' : theme.background,
                      borderColor: newAccType === t.value ? '#1a1a1a' : theme.border,
                    },
                  ]}
                >
                  <Text style={{ color: newAccType === t.value ? '#f5f0eb' : '#6b6b6b', fontSize: 13, fontWeight: '500' }}>
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Balance inicial</Text>
            <TextInput
              value={newAccBalance}
              onChangeText={setNewAccBalance}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9a9a9a"
              style={[styles.editInput, { backgroundColor: '#f5f0eb', borderColor: '#e8d8c9', color: theme.text }]}
            />

            <View style={styles.modalBtnRow}>
              <Pressable
                onPress={() => { setShowCreateModal(false); resetCreateForm(); }}
                style={[styles.modalBtn, { borderColor: theme.border, borderWidth: 1 }]}
              >
                <Text style={{ color: '#6b6b6b', fontWeight: '600' }}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateAccount}
                disabled={createAccount.isPending}
                style={[styles.modalBtn, { backgroundColor: createAccount.isPending ? '#9a9a9a' : '#f3701e' }]}
              >
                {createAccount.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Crear</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  addBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  menuCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  menuIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '500' },
  menuDivider: { height: 1, marginLeft: 52 },
  accountItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  editSection: { borderTopWidth: 1, padding: 16, gap: 10 },
  editInput: { fontSize: 15, borderRadius: 12, borderWidth: 1, padding: 12 },
  saveBtn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  signOutBtn: { paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, alignItems: 'center' },
  emptyCard: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { borderRadius: 20, borderWidth: 1, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
});
