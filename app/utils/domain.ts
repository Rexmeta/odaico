import type { Domain, DomainFilterState, DomainSort } from '../types/domain';

export function filterDomains(domains: Domain[], filters: DomainFilterState): Domain[] {
  return domains.filter((domain) => {
    const matchesSearch = !filters.searchTerm || 
      domain.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
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
      return sort.order === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  });
}

export function parseCSVToDomains(csvContent: string): Domain[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const nameIndex = headers.findIndex(h => h === '도메인');
  const lengthIndex = headers.findIndex(h => h === '길이');
  const extensionIndex = headers.findIndex(h => h === '확장자');
  const keywordsIndex = headers.findIndex(h => h === '키워드');
  const nicheIndex = headers.findIndex(h => h === '연관 비즈니스');
  const valueIndex = headers.findIndex(h => h === '예상 가치($)');
  const volumeIndex = headers.findIndex(h => h === '검색량');
  const brandingIndex = headers.findIndex(h => h === '브랜딩 잠재력');
  const statusIndex = headers.findIndex(h => h === '상태');
  const notesIndex = headers.findIndex(h => h === '메모');

  return lines.slice(1)
    .filter(line => line.trim())
    .map((line, index) => {
      const values = line.split(',').map(value => value.trim());
      
      const searchVolume = values[volumeIndex]?.replace(/[^0-9]/g, '') || '0';
      const estimatedValue = values[valueIndex]?.replace(/[^0-9]/g, '') || '0';

      return {
        id: index + 1,
        name: values[nameIndex] || '',
        length: parseInt(values[lengthIndex] || '0'),
        extension: values[extensionIndex] || '',
        keywords: values[keywordsIndex] || '',
        niche: values[nicheIndex] || '',
        estimatedValue: parseInt(estimatedValue),
        searchVolume: parseInt(searchVolume),
        brandingPotential: values[brandingIndex] || '',
        status: values[statusIndex] || '',
        notes: values[notesIndex] || '',
      };
    });
}

export function domainsToCSV(domains: Domain[]): string {
  const headers = [
    '도메인',
    '길이',
    '확장자',
    '키워드',
    '연관 비즈니스',
    '예상 가치($)',
    '검색량',
    '브랜딩 잠재력',
    '상태',
    '메모'
  ];

  const rows = domains.map(domain => [
    domain.name,
    domain.length.toString(),
    domain.extension,
    domain.keywords,
    domain.niche,
    domain.estimatedValue.toString(),
    domain.searchVolume.toString(),
    domain.brandingPotential,
    domain.status,
    domain.notes
  ]);

  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
} 