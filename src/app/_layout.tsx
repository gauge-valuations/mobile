import "@/global.css";

import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { APP_FONTS } from "@/theme/fonts";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";

const IS_WEB = Platform.OS === "web";

// Keep the splash up until fonts are ready, so text does not render in a system
// font and then jump. A rejection here (splash already hidden) is harmless.
if (!IS_WEB) {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(APP_FONTS);
  // A load failure is not fatal: render anyway and the text falls back to the
  // system font.
  const ready = IS_WEB || fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready && !IS_WEB) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ThemedStatusBar />
      {/* The router's head manager owns <title> once the app runs on web; without this
          it blanks the title from +html.tsx. */}
      <Head>
        <title>Gauge Valuations</title>
      </Head>
      <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// Light status-bar content on the dark theme, dark content on the light theme,
// following the app's theme choice rather than the device setting.
function ThemedStatusBar() {
  const { resolved } = useTheme();
  return <StatusBar style={resolved === "dark" ? "light" : "dark"} />;
}
