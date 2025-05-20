import type { Domain, DomainFilterState, DomainSort } from '../types/domain';
import { BrandingPotential } from "../types/domain";

export function filterDomains(domains: Domain[], filters: DomainFilterState): Domain[] {
  return domains.filter((domain) => {
    const matchesSearch = !filters.searchTerm || 
      domain.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
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

export function parseCSVToDomains(csvText: string): Domain[] {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  const nameIndex = headers.findIndex((h) => h === "도메인");
  const extensionIndex = headers.findIndex((h) => h === "확장자");
  const nicheIndex = headers.findIndex((h) => h === "키워드");
  const valueIndex = headers.findIndex((h) => h === "예상 가치($)");
  const searchVolumeIndex = headers.findIndex((h) => h === "검색량");
  const brandingPotentialIndex = headers.findIndex((h) => h === "브랜딩 잠재력");
  const notesIndex = headers.findIndex((h) => h === "메모");

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line, index) => {
      const values = line.split(",").map((value) => value.trim());
      
      // 검색량에서 '/월' 제거하고 숫자만 추출
      const searchVolumeStr = values[searchVolumeIndex]?.replace("/월", "").trim() || "0";
      const searchVolume = parseInt(searchVolumeStr) || 0;

      // 예상 가치에서 '$' 제거하고 숫자만 추출
      const valueStr = values[valueIndex]?.replace("$", "").trim() || "0";
      const estimatedValue = parseInt(valueStr) || 0;

      // 브랜딩 잠재력 매핑
      const brandingPotentialMap: { [key: string]: BrandingPotential } = {
        "High": "높음",
        "Medium": "중간",
        "Low": "낮음",
        "높음": "높음",
        "중간": "중간",
        "낮음": "낮음"
      };

      const rawBrandingPotential = values[brandingPotentialIndex]?.trim() || "중간";
      const brandingPotential = brandingPotentialMap[rawBrandingPotential] || "중간";

      return {
        id: `domain-${index + 1}`,
        name: values[nameIndex] || "",
        extension: values[extensionIndex] || "",
        niche: values[nicheIndex] || "",
        estimatedValue,
        searchVolume,
        brandingPotential,
        notes: values[notesIndex] || "",
      };
    });
}

export function domainsToCSV(domains: Domain[]): string {
  const headers = ["도메인", "확장자", "키워드", "예상 가치($)", "검색량", "브랜딩 잠재력", "메모"];
  const rows = domains.map((domain) => [
    domain.name,
    domain.extension,
    domain.niche,
    `$${domain.estimatedValue}`,
    `${domain.searchVolume}/월`,
    domain.brandingPotential,
    domain.notes,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
} 