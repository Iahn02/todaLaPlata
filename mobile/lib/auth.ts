import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Clerk token cache for React Native.
 *
 * On native platforms (iOS/Android), Clerk needs a way to persist auth tokens
 * between app launches. We use expo-secure-store which stores data in the
 * device's secure keychain/keystore (encrypted).
 *
 * On web, Clerk handles storage automatically via cookies/localStorage.
 */
export const tokenCache =
  Platform.OS !== "web"
    ? {
        async getToken(key: string) {
          try {
            return await SecureStore.getItemAsync(key);
          } catch {
            return null;
          }
        },
        async saveToken(key: string, value: string) {
          try {
            await SecureStore.setItemAsync(key, value);
          } catch {
            // SecureStore can fail on some devices (e.g., old Android)
          }
        },
      }
    : undefined;
