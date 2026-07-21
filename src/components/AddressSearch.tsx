import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";

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
    </View>
  );
}
