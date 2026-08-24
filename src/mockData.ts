import type { PropertyReport } from "./types";

// Local fallback so the full UI renders offline / before the backend exists.
// Values are in the wire format Rentcast actually returns rather than a tidied-up
// form: ISO date-times, four-decimal comp distances, fractional market averages.
// Keep them that way — the point is that this mock exercises src/format.ts the
// same way real data will.
// estimatedValue - listPrice = 625000 - 599000 = 26000 (potentialMargin).
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
    },
    {
      address: "908 Slaughter Ln, Austin, TX 78748",
      beds: 4,
      baths: 3,
      sqft: 2540,
      price: 640000,
      status: "sold",
      distanceMiles: 0.4137,
    },
    {
      address: "3317 Davis Ln, Austin, TX 78745",
      beds: 3,
      baths: 2,
      sqft: 2050,
      price: 565000,
      status: "sold",
      distanceMiles: 0.7218,
    },
    {
      address: "1450 Frate Barker Rd, Austin, TX 78748",
      beds: 4,
      baths: 2.5,
      sqft: 2460,
      price: 619000,
      status: "for_sale",
      distanceMiles: 1.0854,
    },
    {
      address: "722 Ralph Ablanedo Dr, Austin, TX 78748",
      beds: 4,
      baths: 2.5,
      sqft: 2300,
      price: 589000,
      status: "sold",
      distanceMiles: 0.8769,
    },
  ],
  rent: {
    monthlyRent: 3200,
    rentComps: [
      {
        address: "1118 Cedar Bend Dr, Austin, TX 78745",
        beds: 4,
        baths: 2.5,
        sqft: 2390,
        price: 3150,
        status: "for_lease",
        distanceMiles: 0.1893,
      },
      {
        address: "2405 Bilbrook Pl, Austin, TX 78748",
        beds: 4,
        baths: 3,
        sqft: 2520,
        price: 3350,
        status: "for_lease",
        distanceMiles: 0.6104,
      },
    ],
  },
  market: {
    zip: "78745",
    medianPrice: 585000,
    avgDaysOnMarket: 38.42,
  },
};
