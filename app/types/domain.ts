export interface Domain {
  id: number;
  name: string;
  extension: string;
  niche: string;
  estimatedValue: number;
  searchVolume: number;
  brandingPotential: string;
  notes: string;
}

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