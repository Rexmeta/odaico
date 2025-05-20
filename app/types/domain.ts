export interface Domain {
  id: string;
  name: string;
  extension: string;
  niche: string;
  estimatedValue: number;
  searchVolume: number;
  brandingPotential: string;
  notes: string;
}

export interface FilterOptions {
  extension: string;
  niche: string;
  minValue: string;
  maxValue: string;
  minSearchVolume: string;
  brandingPotential: string;
}

export type BrandingPotential = "낮음" | "중간" | "높음";

export type SortField = 'name' | 'extension' | 'estimatedValue';
export type SortOrder = 'asc' | 'desc';

export interface DomainSort {
  field: SortField;
  order: SortOrder;
}

export interface DomainFilterState {
  searchTerm: string;
  niche: string;
  brandingPotential: string;
} 