import type { FontSource } from "expo-font";
import { Newsreader_400Regular } from "@expo-google-fonts/newsreader/400Regular";
import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { GeistMono_400Regular } from "@expo-google-fonts/geist-mono/400Regular";
import { GeistMono_500Medium } from "@expo-google-fonts/geist-mono/500Medium";

// Native fonts, loaded by useFonts in src/app/_layout.tsx. The keys are the family
// names that tailwind.config.js puts first in font-serif / font-sans / font-mono.
export const APP_FONTS: Record<string, FontSource> = {
  Newsreader_400Regular,
  Geist_400Regular,
  Geist_500Medium,
  GeistMono_400Regular,
  GeistMono_500Medium,
};
