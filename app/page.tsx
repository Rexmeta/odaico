import { useState } from "react";

interface Domain {
  id: number;
  name: string;
  expiryDate: string;
  status: string;
  nameserver: string;
  isDelegated: boolean;
}

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([
    { id: 57, name: "augur.kr", expiryDate: "2025.06.01 ~ 2025-07-01", status: "사용중", nameserver: "ns1.ksdom.kr", isDelegated: true },
    { id: 56, name: "html5test.net", expiryDate: "2025.06.04 ~ 2025-07-04", status: "사용중", nameserver: "ns1.a2hosting.com", isDelegated: false },
    // ... 나머지 도메인 데이터
  ]);

  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState<Partial<Domain>>({});

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain);
  };

  const handleDelete = (id: number) => {
    if (confirm("정말로 이 도메인을 삭제하시겠습니까?")) {
      setDomains(domains.filter(domain => domain.id !== id));
    }
  };

  const handleSave = (domain: Domain) => {
    setDomains(domains.map(d => d.id === domain.id ? domain : d));
    setEditingDomain(null);
  };

  const handleAdd = () => {
    if (newDomain.name && newDomain.expiryDate && newDomain.nameserver) {
      const domain: Domain = {
        id: Math.max(...domains.map(d => d.id)) + 1,
        name: newDomain.name,
        expiryDate: newDomain.expiryDate,
        status: "사용중",
        nameserver: newDomain.nameserver,
        isDelegated: false
      };
      setDomains([...domains, domain]);
      setShowAddModal(false);
      setNewDomain({});
    }
  };

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

        {/* 도메인 목록 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">도메인</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">만료일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">네임서버</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">위임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map((domain) => (
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
