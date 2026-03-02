import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface SignInScreenProps {
  message?: string;
}

export default function SignInScreen({ message }: SignInScreenProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignIn = async () => {
    if (!signInLoaded) return;
    try {
      setLoading(true);
      setError('');
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === 'complete' && setSignInActive) {
        await setSignInActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!signUpLoaded) return;
    try {
      setLoading(true);
      setError('');
      const result = await signUp.create({
        emailAddress: email,
        password,
      });
      if (result.status === 'complete' && setSignUpActive) {
        await setSignUpActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  // Dev login: fetch ticket from backend, sign in with it
  const handleDevLogin = async () => {
    if (!signInLoaded) return;
    try {
      setDevLoading(true);
      setError('');

      // Call the backend to get a sign-in token
      const res = await fetch(
        `${getApiBase()}/api/trpc/auth.devSignInToken?batch=1&input=${encodeURIComponent(JSON.stringify({ "0": { json: null, meta: { values: ["undefined"], v: 1 } } }))}`
      );
      const json = await res.json();
      const token = json?.[0]?.result?.data?.json?.token;

      if (!token) {
        throw new Error('No se pudo obtener el token de dev login.');
      }

      // Use the ticket to sign in
      const result = await signIn.create({
        strategy: 'ticket',
        ticket: token,
      });

      if (result.status === 'complete' && setSignInActive) {
        await setSignInActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError(err?.message || err?.errors?.[0]?.longMessage || 'Error en dev login.');
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={styles.logo}>💰</Text>
        <Text style={[styles.appName, { color: theme.text }]}>todaLaPlata</Text>
        <Text style={[styles.subtitle, { color: '#9a9a9a' }]}>
          {message || 'Inicia sesión para acceder a tus finanzas'}
        </Text>

        {/* Dev login button */}
        <TouchableOpacity
          onPress={handleDevLogin}
          disabled={devLoading}
          activeOpacity={0.8}
          style={[styles.devBtn, { borderColor: '#4b607f' }]}
        >
          {devLoading ? (
            <ActivityIndicator color="#4b607f" />
          ) : (
            <Text style={{ color: '#4b607f', fontSize: 15, fontWeight: '600' }}>
              🔑 Entrar como iahn (dev)
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={{ color: '#9a9a9a', fontSize: 13 }}>o</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        {/* Email/Password */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#9a9a9a"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, { backgroundColor: '#f5f0eb', borderColor: '#e8d8c9', color: theme.text }]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          placeholderTextColor="#9a9a9a"
          secureTextEntry
          style={[styles.input, { backgroundColor: '#f5f0eb', borderColor: '#e8d8c9', color: theme.text }]}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Submit */}
        <TouchableOpacity
          onPress={mode === 'signin' ? handleEmailSignIn : handleEmailSignUp}
          disabled={loading || !email || !password}
          activeOpacity={0.8}
          style={[
            styles.submitBtn,
            { backgroundColor: loading || !email || !password ? '#9a9a9a' : '#f3701e' },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {mode === 'signin' ? 'Iniciar Sesión' : 'Registrarse'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Toggle mode */}
        <TouchableOpacity
          onPress={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, { color: '#f3701e' }]}>
            {mode === 'signin' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Helper to get the API base URL (same logic as lib/api.ts)
function getApiBase(): string {
  try {
    const Constants = require('expo-constants').default;
    const debuggerHost =
      Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;
    if (debuggerHost) {
      const host = debuggerHost.split(':')[0];
      return `http://${host}:3000`;
    }
  } catch {}
  return 'http://localhost:3000';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    fontSize: 56,
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  devBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 12,
  },
  input: {
    width: '100%',
    fontSize: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  errorText: {
    color: '#c95d45',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  submitBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
