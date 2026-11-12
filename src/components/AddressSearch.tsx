import { useEffect, useState } from "react";
import { View, TextInput, Pressable, Text, Platform, type TextStyle } from "react-native";
import { SAMPLE_ADDRESSES } from "@/sampleAddresses";
import { useTokens } from "@/theme/tokens";

const IS_WEB = Platform.OS === "web";

// Web focus ring: a 2px outline in the accent, the same color as the focused border,
// in place of the browser's default ring. Native has no outline; the border alone
// shows focus.
function webFocusOutline(color: string): TextStyle {
  return { outlineStyle: "solid", outlineWidth: 2, outlineColor: color, outlineOffset: 0 };
}
const WEB_NO_OUTLINE: TextStyle = { outlineWidth: 0 };

type AddressSearchProps = {
  onSearch: (address: string) => void;
  loading: boolean;
  // The "Property report" heading. Hidden in the idle state, where IdleHero's
  // headline sits above the search instead.
  showTitle: boolean;
  // Prefills the input (e.g. from /report?address=). Applied after mount, so the
  // static web HTML and the first client render match.
  initialValue?: string;
};

// Address input + search button at the top of the results screen.
export function AddressSearch({ onSearch, loading, showTitle, initialValue }: AddressSearchProps) {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);
  const [focused, setFocused] = useState(false);
  const tokens = useTokens();
  const trimmed = value.trim();

  function submit() {
    if (trimmed.length > 0 && !loading) {
      onSearch(trimmed);
    }
  }

  function pickSample(address: string) {
    if (loading) return;
    setValue(address);
    onSearch(address);
  }

  const disabled = loading || trimmed.length === 0;

  return (
    <View className="gap-3">
      {/* The page's level-1 heading outside the idle state (IdleHero has it there). */}
      {showTitle ? (
        <Text role="heading" aria-level={1} className="font-serif text-2xl text-ink">
          Property report
        </Text>
      ) : null}
      <View className="flex-row items-center gap-2">
        <TextInput
          className={`flex-1 h-10 rounded-[10px] border bg-card px-3 font-sans text-base text-ink ${
            focused ? "border-accent" : "border-rule"
          }`}
          style={IS_WEB ? (focused ? webFocusOutline(tokens.accent) : WEB_NO_OUTLINE) : undefined}
          placeholder="Enter an address"
          placeholderTextColor={tokens.muted}
          value={value}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          // Enter / the keyboard's search key runs the search.
          onSubmitEditing={submit}
          returnKeyType="search"
          // Words on phones; on web, browsers' capitalize/autofill/spellcheck
          // get in the way of typing an address.
          autoCapitalize={IS_WEB ? "none" : "words"}
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
        />
        <Pressable
          onPress={submit}
          disabled={disabled}
          accessibilityRole="button"
          className={`press h-10 items-center justify-center rounded-lg px-4 ${
            disabled ? "bg-rule" : "bg-ink"
          }`}
        >
          <Text
            className={`font-sans-medium font-medium text-sm ${
              disabled ? "text-muted" : "text-paper"
            }`}
          >
            Search
          </Text>
        </Pressable>
      </View>

      {/* Sample addresses: tap to fill the input and search. flex-wrap keeps the
          chips on screen at narrow phone widths. Each chip's tap area is 40px tall;
          the pill inside keeps its compact look. */}
      <View className="flex-row flex-wrap items-center gap-x-2">
        <Text className="font-mono text-xs uppercase tracking-widest text-muted">Try</Text>
        {SAMPLE_ADDRESSES.map((address) => (
          <Pressable
            key={address}
            onPress={() => pickSample(address)}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={`Search ${address}`}
            className="press min-h-[40px] justify-center rounded-full"
          >
            <View className="rounded-full border border-rule bg-card px-3 py-1.5">
              <Text className="font-sans text-xs text-ink">{address}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
