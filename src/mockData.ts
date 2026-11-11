import type { PropertyReport } from "./types";

// Local fallback, used only when no backend base URL is configured, so the full
// UI renders for local work without a backend.
// Values are in the wire format Rentcast actually returns rather than a tidied-up
// form: ISO date-times, four-decimal comp distances, fractional market averages.
// Keep them that way — the point is that this mock exercises src/format.ts the
// same way real data will.
// estimatedValue - listPrice = 625000 - 599000 = 26000 (potentialMargin).
// pricePerSqft 259 x 2410 sqft = 624,190 (~estimatedValue); range 602,000 < 625,000 < 648,000.
// Each comp's pricePerSqft = round(price / sqft); rent comps keep cents (monthly rate).
// rentPerSqft 1.33 x 2410 = 3,205 (~monthlyRent); range 3,000 < 3,200 < 3,400.
export const MOCK_DATA: PropertyReport = {
  property: {
    address: "1204 Cedar Bend Dr, Austin, TX 78745",
    beds: 4,
    baths: 2.5,
    sqft: 2410,
    yearBuilt: 2008,
    lotSizeSqft: 7020,
    lastSalePrice: 512000,
    lastSaleDate: "2019-06-14T00:00:00.000Z",
  },
  valuation: {
    estimatedValue: 625000,
    listPrice: 599000,
    potentialMargin: 26000,
    pricePerSqft: 259,
    valueRangeLow: 602000,
    valueRangeHigh: 648000,
  },
  comps: [
    {
      address: "1210 Cedar Bend Dr, Austin, TX 78745",
      beds: 4,
      baths: 2.5,
      sqft: 2380,
      price: 612000,
      status: "for_sale",
      distanceMiles: 0.0412,
      pricePerSqft: 257,
    },
    {
      address: "908 Slaughter Ln, Austin, TX 78748",
      beds: 4,
      baths: 3,
      sqft: 2540,
      price: 640000,
      status: "sold",
      distanceMiles: 0.4137,
      pricePerSqft: 252,
    },
    {
      address: "3317 Davis Ln, Austin, TX 78745",
      beds: 3,
      baths: 2,
      sqft: 2050,
      price: 565000,
      status: "sold",
      distanceMiles: 0.7218,
      pricePerSqft: 276,
    },
    {
      address: "1450 Frate Barker Rd, Austin, TX 78748",
      beds: 4,
      baths: 2.5,
      sqft: 2460,
      price: 619000,
      status: "for_sale",
      distanceMiles: 1.0854,
      pricePerSqft: 252,
    },
    {
      address: "722 Ralph Ablanedo Dr, Austin, TX 78748",
      beds: 4,
      baths: 2.5,
      sqft: 2300,
      price: 589000,
      status: "sold",
      distanceMiles: 0.8769,
      pricePerSqft: 256,
    },
    {
      // Off market: an inactive listing, not a confirmed sale. Price is the last asking price.
      address: "1502 Cedar Bend Dr, Austin, TX 78745",
      beds: 4,
      baths: 2.5,
      sqft: 2350,
      price: 605000,
      status: "off_market",
      distanceMiles: 0.2981,
      pricePerSqft: 257,
    },
  ],
  rent: {
    monthlyRent: 3200,
    rentPerSqft: 1.33,
    rentRangeLow: 3000,
    rentRangeHigh: 3400,
    rentComps: [
      {
        address: "1118 Cedar Bend Dr, Austin, TX 78745",
        beds: 4,
        baths: 2.5,
        sqft: 2390,
        price: 3150,
        status: "for_lease",
        distanceMiles: 0.1893,
        pricePerSqft: 1.32,
      },
      {
        address: "2405 Bilbrook Pl, Austin, TX 78748",
        beds: 4,
        baths: 3,
        sqft: 2520,
        price: 3350,
        status: "for_lease",
        distanceMiles: 0.6104,
        pricePerSqft: 1.33,
      },
    ],
  },
  market: {
    zip: "78745",
    medianPrice: 585000,
    avgDaysOnMarket: 38.42,
  },
};

// Same home, but not for sale: no listPrice and no potentialMargin, so the
// Valuation card shows its "No current list price" note instead.
// To see it on screen, temporarily change `return MOCK_DATA;` in src/api.ts to
// `return MOCK_DATA_UNLISTED;` (and import it). Revert before committing.
export const MOCK_DATA_UNLISTED: PropertyReport = {
  ...MOCK_DATA,
  valuation: {
    estimatedValue: MOCK_DATA.valuation.estimatedValue,
    pricePerSqft: MOCK_DATA.valuation.pricePerSqft,
    valueRangeLow: MOCK_DATA.valuation.valueRangeLow,
    valueRangeHigh: MOCK_DATA.valuation.valueRangeHigh,
  },
};
