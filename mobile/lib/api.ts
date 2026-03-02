import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Determines the API base URL.
 *
 * Both web and native need to point to the Next.js server on port 3000.
 * - On web: The Expo dev server runs on a DIFFERENT port (8081/8082),
 *   so we cannot use relative paths. We must use the full URL.
 * - On native: We grab the dev machine's LAN IP from Expo constants.
 *
 * tRPC endpoint: /api/trpc
 */
function getBaseUrl(): string {
  // Try to get the dev machine's IP from Expo constants
  const debuggerHost =
    Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(":")[0]; // Extract just the IP, e.g., "192.168.100.5"
    return `http://${host}:3000`;
  }

  // Fallback for web or emulators
  return "http://localhost:3000";
}

export const API_URL = `${getBaseUrl()}/api/trpc`;
