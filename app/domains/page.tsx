"use client";

import { useState, useEffect } from "react";

interface Domain {
  name: string;
  length: number;
  extension: string;
  keywords: string;
  niche: string;
  estimatedValue: number;
  searchVolume: string;
  brandingPotential: string;
  status: string;
  notes: string;
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNiche, setFilterNiche] = useState("all");
  const [filterBranding, setFilterBranding] = useState("all");
  const [sortField, setSortField] = useState<keyof Domain>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/domains`, {
        cache: 'no-store'
      });
      const data = await response.json();
      setDomains(data);
      setError(null);
    } catch (error) {
      console.error('Error loading domains:', error);
      setError('도메인 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDomains = domains
    .filter(domain => {
      const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          domain.keywords.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNiche = filterNiche === "all" || domain.niche.includes(filterNiche);
      const matchesBranding = filterBranding === "all" || domain.brandingPotential === filterBranding;
      return matchesSearch && matchesNiche && matchesBranding;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortOrder === "asc" ? 1 : -1;
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * modifier;
      }
      return String(aValue).localeCompare(String(bValue)) * modifier;
    });

  const handleSort = (field: keyof Domain) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">도메인 분석</h1>

        {/* 검색 및 필터 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="도메인 또는 키워드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterNiche}
            onChange={(e) => setFilterNiche(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 분야</option>
            <option value="Web3">Web3</option>
            <option value="Tech">Tech</option>
            <option value="Food">Food</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Fintech">Fintech</option>
            <option value="Art">Art</option>
            <option value="Metaverse">Metaverse</option>
            <option value="Health">Health</option>
          </select>
          <select
            value={filterBranding}
            onChange={(e) => setFilterBranding(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 브랜딩 잠재력</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* 도메인 목록 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  도메인 {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("length")}
                >
                  길이 {sortField === "length" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("extension")}
                >
                  확장자 {sortField === "extension" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">키워드</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분야</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("estimatedValue")}
                >
                  예상 가치 {sortField === "estimatedValue" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">검색량</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">브랜딩 잠재력</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">메모</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDomains.map((domain, index) => (
                <tr key={index}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 