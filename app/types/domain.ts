export interface Domain {
  id: number;
  name: string;
  length: number;
  extension: string;
  niche: string;
  estimatedValue: number;
  searchVolume: number;
  brandingPotential: string;
  notes: string;
}

export type SortField = 'name' | 'length' | 'extension' | 'estimatedValue';
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