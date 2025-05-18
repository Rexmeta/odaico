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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('name')}
            >
              도메인 {sort.field === 'name' && (sort.order === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('length')}
            >
              길이 {sort.field === 'length' && (sort.order === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('extension')}
            >
              확장자 {sort.field === 'extension' && (sort.order === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">키워드</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분야</th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('estimatedValue')}
            >
              예상 가치 {sort.field === 'estimatedValue' && (sort.order === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">검색량</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">브랜딩 잠재력</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">메모</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {domains.map((domain) => (
            <tr key={domain.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{domain.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.length}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.extension}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.keywords}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.niche}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${domain.estimatedValue}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.searchVolume}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.brandingPotential}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.notes}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(domain.id)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(domain.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 