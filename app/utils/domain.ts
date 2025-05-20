import { Domain, BrandingPotential } from '../types/domain';

export async function loadDomains(): Promise<Domain[]> {
  try {
    const response = await fetch('/domains.csv');
    const csvText = await response.text();
    return parseCSVToDomains(csvText);
  } catch (error) {
    console.error('Error loading domains:', error);
    return [];
  }
}

export function parseCSVToDomains(csvText: string): Domain[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const nameIndex = headers.findIndex(h => h === '도메인');
  const extensionIndex = headers.findIndex(h => h === '확장자');
  const nicheIndex = headers.findIndex(h => h === '키워드');
  const valueIndex = headers.findIndex(h => h === '예상 가치($)');
  const searchVolumeIndex = headers.findIndex(h => h === '검색량');
  const brandingPotentialIndex = headers.findIndex(h => h === '브랜딩 잠재력');
  const notesIndex = headers.findIndex(h => h === '메모');

  return lines.slice(1)
    .filter(line => line.trim())
    .map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      
      // 검색량에서 '/월' 제거하고 숫자만 추출
      const searchVolumeStr = values[searchVolumeIndex]?.replace('/월', '').trim() || '0';
      const searchVolume = parseInt(searchVolumeStr) || 0;

      // 예상 가치에서 '$' 제거하고 숫자만 추출
      const valueStr = values[valueIndex]?.replace('$', '').trim() || '0';
      const estimatedValue = parseInt(valueStr) || 0;

      // 브랜딩 잠재력 매핑
      const brandingPotentialMap: { [key: string]: BrandingPotential } = {
        'High': '높음',
        'Medium': '중간',
        'Low': '낮음',
        '높음': '높음',
        '중간': '중간',
        '낮음': '낮음'
      };

      const rawBrandingPotential = values[brandingPotentialIndex]?.trim() || '중간';
      const brandingPotential = brandingPotentialMap[rawBrandingPotential] || '중간';

      return {
        id: `domain-${index + 1}`,
        name: values[nameIndex] || '',
        extension: values[extensionIndex] || '',
        niche: values[nicheIndex] || '',
        estimatedValue,
        searchVolume,
        brandingPotential,
        notes: values[notesIndex] || '',
      };
    });
}

export function domainsToCSV(domains: Domain[]): string {
  const headers = ['도메인', '확장자', '키워드', '예상 가치($)', '검색량', '브랜딩 잠재력', '메모'];
  const rows = domains.map(domain => [
    domain.name,
    domain.extension,
    domain.niche,
    `$${domain.estimatedValue}`,
    `${domain.searchVolume}/월`,
    domain.brandingPotential,
    domain.notes,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function filterDomains(domains: Domain[], filters: {
  extension?: string;
  niche?: string;
  minValue?: number;
  maxValue?: number;
  minSearchVolume?: number;
  brandingPotential?: BrandingPotential;
}): Domain[] {
  return domains.filter(domain => {
    if (filters.extension && domain.extension !== filters.extension) return false;
    if (filters.niche && !domain.niche.includes(filters.niche)) return false;
    if (filters.minValue && domain.estimatedValue < filters.minValue) return false;
    if (filters.maxValue && domain.estimatedValue > filters.maxValue) return false;
    if (filters.minSearchVolume && domain.searchVolume < filters.minSearchVolume) return false;
    if (filters.brandingPotential && domain.brandingPotential !== filters.brandingPotential) return false;
    return true;
  });
}

export function sortDomains(domains: Domain[], sortBy: keyof Domain, ascending: boolean = true): Domain[] {
  return [...domains].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return ascending ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
} 