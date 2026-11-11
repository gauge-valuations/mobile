import "@/global.css";

import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {/* The router's head manager owns <title> once the app runs on web; without this
          it blanks the title from +html.tsx. */}
      <Head>
        <title>Gauge Valuations</title>
      </Head>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
