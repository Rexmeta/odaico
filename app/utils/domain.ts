import type { Domain, DomainFilters, DomainSort } from '../types/domain';

export function filterDomains(domains: Domain[], filters: DomainFilters): Domain[] {
  return domains.filter((domain) => {
    const matchesSearch = domain.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      domain.keywords.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesNiche = !filters.niche || domain.niche === filters.niche;
    const matchesBranding = !filters.brandingPotential || domain.brandingPotential === filters.brandingPotential;

    return matchesSearch && matchesNiche && matchesBranding;
  });
}

export function sortDomains(domains: Domain[], sort: DomainSort): Domain[] {
  return [...domains].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort.order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}

export function parseCSVToDomains(csvContent: string): Domain[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map((value) => value.trim());
    return {
      id: index + 1,
      name: values[headers.indexOf('Domain Name')] || '',
      length: parseInt(values[headers.indexOf('Length')] || '0'),
      extension: values[headers.indexOf('Extension')] || '',
      keywords: values[headers.indexOf('Keyword(s)')] || '',
      niche: values[headers.indexOf('Niche/Industry')] || '',
      estimatedValue: parseInt(values[headers.indexOf('Est. Value ($)')] || '0'),
      searchVolume: parseInt(values[headers.indexOf('Search Volume')] || '0'),
      brandingPotential: values[headers.indexOf('Branding Potential')] || '',
      status: values[headers.indexOf('Status')] || '',
      notes: values[headers.indexOf('Notes')] || '',
    };
  });
}

export function domainsToCSV(domains: Domain[]): string {
  const headers = [
    'Domain Name',
    'Length',
    'Extension',
    'Keyword(s)',
    'Niche/Industry',
    'Est. Value ($)',
    'Search Volume',
    'Branding Potential',
    'Status',
    'Notes',
  ];

  const rows = domains.map((domain) => [
    domain.name,
    domain.length.toString(),
    domain.extension,
    domain.keywords,
    domain.niche,
    domain.estimatedValue.toString(),
    domain.searchVolume.toString(),
    domain.brandingPotential,
    domain.status,
    domain.notes,
  ]);

  return [headers, ...rows].map((row) => row.join(',')).join('\n');
} 