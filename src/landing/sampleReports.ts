import type { CompRowData } from "@/components/CompRow";

// A snapshot of the two sample reports, read off the live site on November 11, 2026.
// The landing page shows these numbers; it never calls the backend. They will drift
// from the live reports over time, so refresh them by reading the live site again.
// Market medians are stored as the report shows them (compact); the full value is not
// on the page.
export const SNAPSHOT_DATE = "Nov 11, 2026";

export type SampleReport = {
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lotSizeSqft: number;
  lastSale: string;
  estimatedValue: number;
  pricePerSqft: number;
  valueRangeLow: number;
  valueRangeHigh: number;
  // Absent when the home has no current list price (then there is no margin either).
  listPrice?: number;
  potentialMargin?: number;
  lowConfidence: boolean;
  // The N in "Show all N".
  compsShown: number;
  // The first rows of the comparable-homes list.
  comps: CompRowData[];
  rent: {
    monthly: number;
    perSqftMonthly: number;
    rangeLow: number;
    rangeHigh: number;
    compsShown: number;
    comps: CompRowData[];
  };
  market: {
    medianPrice: string;
    daysOnMarket: string;
    zip: string;
  };
};

export const PRENTICE: SampleReport = {
  address: "3901 Prentice Ln, Austin, TX 78746",
  beds: 4,
  baths: 4,
  sqft: 3820,
  yearBuilt: 1982,
  lotSizeSqft: 34317,
  lastSale: "Mar 1992",
  estimatedValue: 2680604,
  pricePerSqft: 702,
  valueRangeLow: 2502183,
  valueRangeHigh: 2836868,
  listPrice: 2195000,
  potentialMargin: 485604,
  lowConfidence: false,
  compsShown: 15,
  comps: [
    { address: "4306 Bennedict Ln", beds: 4, baths: 4, distanceMiles: 0.4, status: "for_sale", price: 2200000, pricePerSqft: 705 },
    { address: "2004 Rue De St Tropez", beds: 4, baths: 4.5, distanceMiles: 0.2, status: "off_market", price: 3095000, pricePerSqft: 769 },
    { address: "3712 Meredith St", beds: 4, baths: 4, distanceMiles: 0.6, status: "off_market", price: 2395000, pricePerSqft: 702 },
    { address: "4800 Mantle Dr", beds: 4, baths: 3.5, distanceMiles: 1.1, status: "for_sale", price: 2549000, pricePerSqft: 714 },
    { address: "3418 Mount Bonnell Cir", beds: 4, baths: 4, distanceMiles: 1.2, status: "for_sale", price: 4800000, pricePerSqft: 1125 },
  ],
  rent: {
    monthly: 10837,
    perSqftMonthly: 2.84,
    rangeLow: 9037,
    rangeHigh: 16447,
    compsShown: 15,
    comps: [
      { address: "1501 Rockmoor Ave", beds: 4, baths: 4.5, distanceMiles: 0.9, status: "for_lease", price: 18900, pricePerSqft: 5.12 },
      { address: "1504 Twilight Ridge Dr", beds: 4, baths: 3.5, distanceMiles: 1.4, status: "for_lease", price: 9500, pricePerSqft: 2.54 },
      { address: "2007 Rue De St Tropez", beds: 4, baths: 4.5, distanceMiles: 0.2, status: "for_lease", price: 7000, pricePerSqft: 2.28 },
    ],
  },
  market: { medianPrice: "$2M", daysOnMarket: "91", zip: "78746" },
};

export const MEREDITH: SampleReport = {
  address: "3712 Meredith St, Austin, TX 78703",
  beds: 4,
  baths: 4,
  sqft: 3413,
  yearBuilt: 2007,
  lotSizeSqft: 6499,
  lastSale: "Jul 2015",
  estimatedValue: 2405061,
  pricePerSqft: 705,
  valueRangeLow: 1970638,
  valueRangeHigh: 2658626,
  // No current list price, so no potential margin.
  lowConfidence: false,
  compsShown: 15,
  comps: [
    { address: "3901 Prentice Ln", beds: 4, baths: 4, distanceMiles: 0.6, status: "for_sale", price: 2195000, pricePerSqft: 575 },
    { address: "3601 Cherry Ln", beds: 4, baths: 3.5, distanceMiles: 0.2, status: "for_sale", price: 3125000, pricePerSqft: 1125 },
    { address: "4306 Bennedict Ln", beds: 4, baths: 4, distanceMiles: 0.9, status: "for_sale", price: 2200000, pricePerSqft: 705 },
    { address: "1900 Matthews Dr", beds: 4, baths: 3.5, distanceMiles: 0.1, status: "off_market", price: 2599000, pricePerSqft: 902 },
    { address: "2510 W 35th St", beds: 4, baths: 4.5, distanceMiles: 1.3, status: "for_sale", price: 2250000, pricePerSqft: 655 },
  ],
  rent: {
    monthly: 8670,
    perSqftMonthly: 2.54,
    rangeLow: 7777,
    rangeHigh: 9312,
    compsShown: 15,
    comps: [
      { address: "2007 Rue De St Tropez", beds: 4, baths: 4.5, distanceMiles: 0.5, status: "for_lease", price: 7000, pricePerSqft: 2.28 },
      { address: "2625 Mccullough St", beds: 4, baths: 4, distanceMiles: 0.9, status: "for_lease", price: 11000, pricePerSqft: 3.02 },
      { address: "3407 Windsor Rd", beds: 4, baths: 3.5, distanceMiles: 0.5, status: "for_lease", price: 12500, pricePerSqft: 4.78 },
    ],
  },
  market: { medianPrice: "$1.3M", daysOnMarket: "100", zip: "78703" },
};

export const SAMPLE_REPORTS = [PRENTICE, MEREDITH] as const;
