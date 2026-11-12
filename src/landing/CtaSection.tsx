import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { AddressSearch } from "@/components/AddressSearch";
import { useTokens } from "@/theme/tokens";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { BandSection } from "./Section";
import { SearchIcon } from "./icons";

// Final call to action: the same address search and sample chips as the report page.
// A search opens /report?address=..., which runs the lookup there.
export function CtaSection() {
  const tokens = useTokens();
  const router = useRouter();
  return (
    <BandSection band="paper-deep">
      <RevealGroup className="gap-10 lg:flex-row lg:items-end lg:gap-10">
        <View className="gap-5 lg:flex-1">
          <Reveal trigger="scroll" from="y6" index={0}>
            <SearchIcon color={tokens.accent} />
          </Reveal>
          <Reveal trigger="scroll" from="y24" index={1}>
          <Text
            role="heading"
            aria-level={2}
            className="font-serif text-ink text-[48px] leading-[50px] tracking-[-0.96px] lg:text-[72px] lg:leading-[74px] lg:tracking-[-1.44px]"
          >
            Look up a home.
          </Text>
          </Reveal>
        </View>
        <Reveal trigger="scroll" from="y16" index={2} className="lg:flex-1">
          <AddressSearch
            showTitle={false}
            loading={false}
            onSearch={(address) => router.push({ pathname: "/report", params: { address } })}
          />
        </Reveal>
      </RevealGroup>
    </BandSection>
  );
}
