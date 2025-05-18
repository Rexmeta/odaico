import { useState, useEffect } from "react";

interface Domain {
  id: number;
  name: string;
  expiryDate: string;
  status: string;
  nameserver: string;
  isDelegated: boolean;
}

type SortField = 'id' | 'name' | 'expiryDate' | 'status' | 'nameserver';
type SortOrder = 'asc' | 'desc';

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([]);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState<Partial<Domain>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDelegated, setFilterDelegated] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 도메인 목록 가져오기
  useEffect(() => {
    fetchDomains();
  }, []);

  // 검색어나 필터가 변경될 때마다 도메인 목록 필터링
  useEffect(() => {
    let result = domains;

    // 검색어로 필터링
    if (searchTerm) {
      result = result.filter(domain =>
        domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        domain.nameserver.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태로 필터링
    if (filterStatus !== "all") {
      result = result.filter(domain => domain.status === filterStatus);
    }

    // 위임 여부로 필터링
    if (filterDelegated !== "all") {
      const isDelegated = filterDelegated === "true";
      result = result.filter(domain => domain.isDelegated === isDelegated);
    }

    // 정렬
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = a.id - b.id;
      } else {
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredDomains(result);
  }, [domains, searchTerm, filterStatus, filterDelegated, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      if (!response.ok) throw new Error('Failed to fetch domains');
      const data = await response.json();
      setDomains(data);
      setFilteredDomains(data);
    } catch (err) {
      setError('도메인 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 도메인을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/domains?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete domain');
        setDomains(domains.filter(domain => domain.id !== id));
      } catch (err) {
        setError('도메인 삭제에 실패했습니다.');
      }
    }
  };

  const handleSave = async (domain: Domain) => {
    try {
      const response = await fetch('/api/domains', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(domain),
      });
      if (!response.ok) throw new Error('Failed to update domain');
      const updatedDomain = await response.json();
      setDomains(domains.map(d => d.id === updatedDomain.id ? updatedDomain : d));
      setEditingDomain(null);
    } catch (err) {
      setError('도메인 수정에 실패했습니다.');
    }
  };

  const handleAdd = async () => {
    if (newDomain.name && newDomain.expiryDate && newDomain.nameserver) {
      try {
        const response = await fetch('/api/domains', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDomain),
        });
        if (!response.ok) throw new Error('Failed to add domain');
        const addedDomain = await response.json();
        setDomains([...domains, addedDomain]);
        setShowAddModal(false);
        setNewDomain({});
      } catch (err) {
        setError('도메인 추가에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">도메인 관리</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            도메인 추가
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="도메인 또는 네임서버 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 상태</option>
              <option value="사용중">사용중</option>
              <option value="만료">만료</option>
            </select>
          </div>
          <div>
            <select
              value={filterDelegated}
              onChange={(e) => setFilterDelegated(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 위임 상태</option>
              <option value="true">위임됨</option>
              <option value="false">위임되지 않음</option>
            </select>
          </div>
        </div>

        {/* 도메인 목록 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  ID {getSortIcon('id')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  도메인 {getSortIcon('name')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('expiryDate')}
                >
                  만료일 {getSortIcon('expiryDate')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  상태 {getSortIcon('status')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('nameserver')}
                >
                  네임서버 {getSortIcon('nameserver')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">위임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDomains.map((domain) => (
                <tr key={domain.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{domain.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.expiryDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.nameserver}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {domain.isDelegated ? "D" : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(domain)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(domain.id)}
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

        {/* 도메인 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">도메인 추가</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">도메인</label>
                  <input
                    type="text"
                    value={newDomain.name || ""}
                    onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">만료일</label>
                  <input
                    type="text"
                    value={newDomain.expiryDate || ""}
                    onChange={(e) => setNewDomain({ ...newDomain, expiryDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">네임서버</label>
                  <input
                    type="text"
                    value={newDomain.nameserver || ""}
                    onChange={(e) => setNewDomain({ ...newDomain, nameserver: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 도메인 수정 모달 */}
        {editingDomain && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">도메인 수정</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">도메인</label>
                  <input
                    type="text"
                    value={editingDomain.name}
                    onChange={(e) => setEditingDomain({ ...editingDomain, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">만료일</label>
                  <input
                    type="text"
                    value={editingDomain.expiryDate}
                    onChange={(e) => setEditingDomain({ ...editingDomain, expiryDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">네임서버</label>
                  <input
                    type="text"
                    value={editingDomain.nameserver}
                    onChange={(e) => setEditingDomain({ ...editingDomain, nameserver: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setEditingDomain(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => handleSave(editingDomain)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
