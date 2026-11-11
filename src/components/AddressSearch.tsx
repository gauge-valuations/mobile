import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { SAMPLE_ADDRESSES } from "@/sampleAddresses";

type AddressSearchProps = {
  onSearch: (address: string) => void;
  loading: boolean;
};

// Address input + search button at the top of the results screen.
export function AddressSearch({ onSearch, loading }: AddressSearchProps) {
  const [value, setValue] = useState("");
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

  return (
    <View className="gap-2">
      <Text className="text-2xl font-bold text-neutral-900 dark:text-white">Property report</Text>
      <View className="flex-row gap-2">
        <TextInput
          className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-base text-neutral-900 dark:text-white"
          placeholder="Enter an address"
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={setValue}
          onSubmitEditing={submit}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Pressable
          onPress={submit}
          disabled={loading || trimmed.length === 0}
          className={`items-center justify-center rounded-xl px-5 ${
            loading || trimmed.length === 0 ? "bg-neutral-300 dark:bg-neutral-700" : "bg-blue-600"
          }`}
        >
          <Text className="text-base font-semibold text-white">Search</Text>
        </Pressable>
      </View>

      {/* Sample addresses: tap to fill the input and search. flex-wrap keeps the
          chips on screen at narrow phone widths. */}
      <View className="flex-row flex-wrap items-center gap-2">
        <Text className="text-xs text-neutral-500 dark:text-neutral-400">Try:</Text>
        {SAMPLE_ADDRESSES.map((address) => (
          <Pressable
            key={address}
            onPress={() => pickSample(address)}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={`Search ${address}`}
            className="rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1"
          >
            <Text className="text-xs text-neutral-600 dark:text-neutral-400">{address}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
