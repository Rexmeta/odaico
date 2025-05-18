import type { DomainFilterState } from '../types/domain';

interface DomainFiltersProps {
  filters: DomainFilterState;
  onFilterChange: (filters: DomainFilterState) => void;
}

export default function DomainFilters({ filters, onFilterChange }: DomainFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            검색
          </label>
          <input
            type="text"
            id="search"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            placeholder="도메인 이름 또는 키워드로 검색"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-gray-700">
            분야
          </label>
          <select
            id="niche"
            value={filters.niche}
            onChange={(e) => onFilterChange({ ...filters, niche: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">전체</option>
            <option value="Technology">기술</option>
            <option value="Finance">금융</option>
            <option value="Health">건강</option>
            <option value="Education">교육</option>
            <option value="Entertainment">엔터테인먼트</option>
          </select>
        </div>
        <div>
          <label htmlFor="brandingPotential" className="block text-sm font-medium text-gray-700">
            브랜딩 잠재력
          </label>
          <select
            id="brandingPotential"
            value={filters.brandingPotential}
            onChange={(e) => onFilterChange({ ...filters, brandingPotential: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">전체</option>
            <option value="High">높음</option>
            <option value="Medium">중간</option>
            <option value="Low">낮음</option>
          </select>
        </div>
      </div>
    </div>
  );
} 