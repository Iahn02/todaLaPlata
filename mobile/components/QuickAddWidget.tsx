import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Keyboard,
  Platform,
  View,
} from 'react-native';
import { Text } from '@/components/Themed';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import * as Haptics from 'expo-haptics';

interface QuickAddWidgetProps {
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: string; color: string }>;
}

export default function QuickAddWidget({ accounts, categories }: QuickAddWidgetProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const utils = trpc.useUtils();
  const createMutation = trpc.transactions.create.useMutation({
    onSuccess: () => {
      utils.transactions.getAll.invalidate();
      utils.accounts.getAll.invalidate();
      utils.lookups.getEssentialData.invalidate();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAmount('');
      setDescription('');
      setSelectedCategoryId(null);
      setExpanded(false);
      Keyboard.dismiss();
    },
    onError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const [expanded, setExpanded] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const expandAnim = useRef(new Animated.Value(0)).current;
  const amountInputRef = useRef<TextInput>(null);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const defaultAccountId = accounts[0]?.id;

  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: expanded ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();

    if (expanded) {
      setTimeout(() => amountInputRef.current?.focus(), 300);
    }
  }, [expanded]);

  const containerHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 320],
  });

  const contentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    if (!defaultAccountId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createMutation.mutate({
      amount: numAmount,
      type: 'expense',
      description: description.trim() || undefined,
      accountId: defaultAccountId,
      categoryId: selectedCategoryId ?? undefined,
    });
  };

  if (!defaultAccountId || accounts.length === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#ffffff',
          borderColor: theme.border,
          height: containerHeight,
        },
      ]}
    >
      {/* Collapsed: tap to expand */}
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.quickIcon, { backgroundColor: '#f3701e' }]}>
            <Text style={styles.quickIconText}>⚡</Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {expanded ? 'Gasto rápido' : 'Agregar gasto rápido'}
          </Text>
        </View>
        <Text style={{ color: '#9a9a9a', fontSize: 20 }}>
          {expanded ? '✕' : '+'}
        </Text>
      </TouchableOpacity>

      {/* Expanded content */}
      <Animated.View style={[styles.body, { opacity: contentOpacity }]}>
        {/* Amount input */}
        <View style={styles.amountRow}>
          <Text style={[styles.currencySign, { color: theme.text }]}>$</Text>
          <TextInput
            ref={amountInputRef}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="#9a9a9a"
            keyboardType="numeric"
            style={[
              styles.amountInput,
              {
                backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f0eb',
                borderColor: colorScheme === 'dark' ? '#3d3d3d' : '#e8d8c9',
                color: theme.text,
              },
            ]}
          />
        </View>

        {/* Description */}
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="¿En qué gastaste?"
          placeholderTextColor="#9a9a9a"
          style={[
            styles.descInput,
            {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f0eb',
              borderColor: colorScheme === 'dark' ? '#3d3d3d' : '#e8d8c9',
              color: theme.text,
            },
          ]}
        />

        {/* Category chips */}
        <View style={styles.chipRow}>
          {expenseCategories.slice(0, 6).map((cat) => {
            const isActive = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategoryId(isActive ? null : cat.id);
                }}
                activeOpacity={0.7}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive ? cat.color : (colorScheme === 'dark' ? '#1a1a1a' : '#f5f0eb'),
                    borderColor: isActive ? cat.color : theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isActive ? '#fff' : '#6b6b6b',
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={createMutation.isPending || !amount}
          activeOpacity={0.8}
          style={[
            styles.submitBtn,
            {
              backgroundColor:
                createMutation.isPending || !amount ? '#9a9a9a' : '#f3701e',
            },
          ]}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitText}>Registrar ⚡</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencySign: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  descInput: {
    fontSize: 14,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  submitBtn: {
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
