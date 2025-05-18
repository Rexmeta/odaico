import type { DomainFilterState } from '../types/domain';

interface DomainFiltersProps {
  filters: DomainFilterState;
  onFilterChange: (filters: DomainFilterState) => void;
}

export default function DomainFilters({ filters, onFilterChange }: DomainFiltersProps) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            검색
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="도메인 이름으로 검색"
            />
          </div>
        </div>

        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-gray-700">
            분야
          </label>
          <select
            id="niche"
            value={filters.niche}
            onChange={(e) => onFilterChange({ ...filters, niche: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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