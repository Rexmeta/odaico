import type { Domain, DomainSort } from '../types/domain';

interface DomainTableProps {
  domains: Domain[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onSort: (field: DomainSort['field']) => void;
  sort: DomainSort;
}

export default function DomainTable({ domains, onEdit, onDelete, onSort, sort }: DomainTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>도메인</span>
                  {sort.field === 'name' && (
                    <svg className={`w-4 h-4 transform ${sort.order === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => onSort('extension')}
              >
                <div className="flex items-center space-x-1">
                  <span>확장자</span>
                  {sort.field === 'extension' && (
                    <svg className={`w-4 h-4 transform ${sort.order === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">분야</th>
              <th 
                className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => onSort('estimatedValue')}
              >
                <div className="flex items-center space-x-1">
                  <span>예상 가치</span>
                  {sort.field === 'estimatedValue' && (
                    <svg className={`w-4 h-4 transform ${sort.order === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">검색량</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">브랜딩 잠재력</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">메모</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {domains.map((domain) => (
              <tr key={domain.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{domain.name}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{domain.extension}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{domain.niche}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">${domain.estimatedValue.toLocaleString()}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{domain.searchVolume.toLocaleString()}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${domain.brandingPotential === 'High' ? 'bg-emerald-100 text-emerald-800' : 
                      domain.brandingPotential === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                      'bg-rose-100 text-rose-800'}`}>
                    {domain.brandingPotential}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{domain.notes}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(domain.id)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(domain.id)}
                      className="text-rose-600 hover:text-rose-900 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 