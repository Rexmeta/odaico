"use client";

import { Domain } from "../types/domain";

interface DomainTableProps {
  domains: Domain[];
  onEdit: (domain: Domain) => void;
  onDelete: (id: string) => void;
}

export default function DomainTable({
  domains,
  onEdit,
  onDelete,
}: DomainTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              도메인
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              확장자
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              분야
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              예상 가치
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              검색량
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              브랜딩 잠재력
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              메모
            </th>
            <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {domains.map((domain) => (
            <tr key={domain.id}>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {domain.name}
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                {domain.extension}
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                {domain.niche}
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                ${domain.estimatedValue.toLocaleString()}
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                {domain.searchVolume.toLocaleString()}/월
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                {domain.brandingPotential}
              </td>
              <td className="px-4 sm:px-6 py-3 text-sm text-gray-500">
                {domain.notes}
              </td>
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(domain)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
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
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 