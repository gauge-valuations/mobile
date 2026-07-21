import type { PropertyReport } from "./types";

// Local fallback so the full UI renders offline / before the backend exists.
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
    lastSaleDate: "2019-06-14",
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
      distanceMiles: 0.1,
    },
    {
      address: "908 Slaughter Ln, Austin, TX 78748",
      beds: 4,
      baths: 3,
      sqft: 2540,
      price: 640000,
      status: "sold",
      distanceMiles: 0.4,
    },
    {
      address: "3317 Davis Ln, Austin, TX 78745",
      beds: 3,
      baths: 2,
      sqft: 2050,
      price: 565000,
      status: "sold",
      distanceMiles: 0.7,
    },
    {
      address: "1450 Frate Barker Rd, Austin, TX 78748",
      beds: 4,
      baths: 2.5,
      sqft: 2460,
      price: 619000,
      status: "for_sale",
      distanceMiles: 1.1,
    },
    {
      address: "722 Ralph Ablanedo Dr, Austin, TX 78748",
      beds: 4,
      baths: 2.5,
      sqft: 2300,
      price: 3300,
      status: "for_lease",
      distanceMiles: 0.9,
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
        distanceMiles: 0.2,
      },
      {
        address: "2405 Bilbrook Pl, Austin, TX 78748",
        beds: 4,
        baths: 3,
        sqft: 2520,
        price: 3350,
        status: "for_lease",
        distanceMiles: 0.6,
      },
    ],
  },
  market: {
    zip: "78745",
    medianPrice: 585000,
    avgDaysOnMarket: 38,
  },
};
