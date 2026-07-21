// Shared data contract with the backend. The backend returns exactly this shape.
// Extend these types — never fork them. See CLAUDE.md.

export type Property = {
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lotSizeSqft: number;
  lastSalePrice?: number;
  lastSaleDate?: string;
};

export type Valuation = {
  estimatedValue: number;
  listPrice?: number;
  potentialMargin?: number; // estimatedValue - listPrice, only when listPrice exists
};

export type Comp = {
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  status: "for_sale" | "sold" | "for_lease";
  distanceMiles: number;
};

export type RentEstimate = {
  monthlyRent: number;
  rentComps: Comp[];
};

export type MarketSnapshot = {
  zip: string;
  medianPrice: number;
  avgDaysOnMarket: number;
};

export type PropertyReport = {
  property: Property;
  valuation: Valuation;
  comps: Comp[];
  rent: RentEstimate;
  market: MarketSnapshot;
};
