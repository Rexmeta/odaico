"use client";

import { Domain, FilterOptions } from "../types/domain";

interface DomainListProps {
  domains: Domain[];
  onEdit: (domain: Domain) => void;
  onDelete: (id: string) => void;
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function DomainList({
  domains,
  onEdit,
  onDelete,
  filterOptions,
  onFilterChange,
}: DomainListProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">필터</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              확장자
            </label>
            <input
              type="text"
              value={filterOptions.extension}
              onChange={(e) =>
                onFilterChange({ ...filterOptions, extension: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder=".com, .net 등"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              분야
            </label>
            <input
              type="text"
              value={filterOptions.niche}
              onChange={(e) =>
                onFilterChange({ ...filterOptions, niche: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="기술, 금융 등"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최소 가치
            </label>
            <input
              type="number"
              value={filterOptions.minValue}
              onChange={(e) =>
                onFilterChange({ ...filterOptions, minValue: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="최소 가치"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 가치
            </label>
            <input
              type="number"
              value={filterOptions.maxValue}
              onChange={(e) =>
                onFilterChange({ ...filterOptions, maxValue: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="최대 가치"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="bg-white rounded-lg shadow p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {domain.name}
                  <span className="text-sm text-gray-500 ml-2">
                    {domain.extension}
                  </span>
                </h3>
                <p className="text-sm text-gray-600">{domain.niche}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(domain)}
                  className="p-2 text-indigo-600 hover:text-indigo-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(domain.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">예상 가치:</span>
                <span className="ml-2 text-gray-900">
                  ${domain.estimatedValue.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">검색량:</span>
                <span className="ml-2 text-gray-900">
                  {domain.searchVolume.toLocaleString()}/월
                </span>
              </div>
              <div>
                <span className="text-gray-500">브랜딩 잠재력:</span>
                <span className="ml-2 text-gray-900">
                  {domain.brandingPotential}
                </span>
              </div>
            </div>
            {domain.notes && (
              <p className="text-sm text-gray-600 mt-2">{domain.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 