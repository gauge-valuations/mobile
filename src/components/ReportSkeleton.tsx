import type { ReactNode } from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { SkeletonBlock } from "./SkeletonBlock";

// Each bar sits in a box the height of the text line it stands in for, so the
// skeleton cards are as tall as the real ones.
function Line({ height, children }: { height: string; children: ReactNode }) {
  return <View className={`justify-center ${height}`}>{children}</View>;
}

// Card-label placeholder: the mono 11px label's 16px line.
function LabelBar({ width }: { width: string }) {
  return (
    <Line height="h-4">
      <SkeletonBlock className={`h-3 rounded ${width}`} />
    </Line>
  );
}

function FactsSkeleton() {
  return (
    <Card>
      <LabelBar width="w-28" />
      {/* Address: serif 24px on a 30px line. */}
      <Line height="h-[30px]">
        <SkeletonBlock className="h-[26px] w-56 max-w-full rounded-md" />
      </Line>
      <View className="flex-row flex-wrap -mb-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} className="w-1/2 gap-1 pb-4 pr-3">
            <Line height="h-4">
              <SkeletonBlock className="h-2.5 w-14 rounded" />
            </Line>
            <Line height="h-6">
              <SkeletonBlock className="h-5 w-20 rounded" />
            </Line>
          </View>
        ))}
      </View>
    </Card>
  );
}

function ValuationSkeleton() {
  return (
    <Card>
      <LabelBar width="w-32" />
      <View className="gap-1">
        {/* The value's line: 53px (48px serif), 70px from md (64px serif). */}
        <Line height="h-[53px] md:h-[70px]">
          <SkeletonBlock className="h-[46px] md:h-[60px] w-52 md:w-72 max-w-full rounded-lg" />
        </Line>
        <Line height="h-5">
          <SkeletonBlock className="h-4 w-24 rounded" />
        </Line>
      </View>
      {/* Range bar: 14px marker row with the 6px track, then the end labels. */}
      <View className="gap-1.5">
        <View className="h-3.5 justify-center">
          <SkeletonBlock className="h-1.5 w-full rounded-full" />
        </View>
        <View className="h-4 flex-row items-center justify-between">
          <SkeletonBlock className="h-3 w-12 rounded" />
          <SkeletonBlock className="h-3 w-12 rounded" />
        </View>
        {/* Legend row. */}
        <View className="h-4 flex-row items-center gap-4 mt-0.5">
          <SkeletonBlock className="h-3 w-16 rounded" />
          <SkeletonBlock className="h-3 w-16 rounded" />
        </View>
      </View>
      {/* List price row and margin pill. */}
      <View className="gap-3">
        <View className="h-5 flex-row items-center justify-between">
          <SkeletonBlock className="h-3.5 w-16 rounded" />
          <SkeletonBlock className="h-3.5 w-20 rounded" />
        </View>
        <SkeletonBlock className="h-8 w-64 max-w-full rounded-full" />
      </View>
    </Card>
  );
}

function CompsSkeleton() {
  return (
    <Card>
      <LabelBar width="w-36" />
      <View>
        {[0, 1, 2, 3, 4].map((i) => (
          // 73px: the measured height of a real comp row.
          <View key={i} className="h-[73px] flex-row items-center justify-between gap-3">
            <View className="flex-1 gap-2">
              <SkeletonBlock className="h-3.5 w-48 max-w-full rounded" />
              <SkeletonBlock className="h-3 w-32 max-w-full rounded" />
            </View>
            <SkeletonBlock className="h-3.5 w-[70px] rounded" />
          </View>
        ))}
        {/* Room for the "Show all" row most reports have. */}
        <View className="h-10 justify-center">
          <SkeletonBlock className="h-3.5 w-20 rounded" />
        </View>
      </View>
    </Card>
  );
}

// Placeholder for the report while it loads, laid out like the first three cards
// (facts, valuation, comps) so the page does not jump when the report arrives.
// Screen readers get one "Loading report" progress indicator instead of the blocks.
export function ReportSkeleton() {
  return (
    <View
      role="progressbar"
      aria-label="Loading report"
      aria-busy
      accessibilityLiveRegion="polite"
      className="gap-4"
    >
      <FactsSkeleton />
      <ValuationSkeleton />
      <CompsSkeleton />
    </View>
  );
}
