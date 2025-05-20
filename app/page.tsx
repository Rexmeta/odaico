"use client";

import { useState, useEffect } from "react";
import { Domain, BrandingPotential } from "./types/domain";
import { loadDomains, filterDomains, sortDomains } from "./utils/domain";
import DomainModal from "./components/DomainModal";
import MobileHeader from "./components/MobileHeader";
import MobileBottomNav from "./components/MobileBottomNav";

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [filters, setFilters] = useState({
    extension: "",
    niche: "",
    minValue: "",
    maxValue: "",
    minSearchVolume: "",
    brandingPotential: "" as BrandingPotential | "",
  });
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Domain;
    ascending: boolean;
  }>({ field: "name", ascending: true });

  useEffect(() => {
    const fetchDomains = async () => {
      const data = await loadDomains();
      setDomains(data);
      setFilteredDomains(data);
    };
    fetchDomains();
  }, []);

  useEffect(() => {
    let result = [...domains];

    // 필터 적용
    result = filterDomains(result, {
      extension: filters.extension || undefined,
      niche: filters.niche || undefined,
      minValue: filters.minValue ? parseInt(filters.minValue) : undefined,
      maxValue: filters.maxValue ? parseInt(filters.maxValue) : undefined,
      minSearchVolume: filters.minSearchVolume ? parseInt(filters.minSearchVolume) : undefined,
      brandingPotential: filters.brandingPotential || undefined,
    });

    // 정렬 적용
    result = sortDomains(result, sortConfig.field, sortConfig.ascending);

    setFilteredDomains(result);
  }, [domains, filters, sortConfig]);

  const handleSort = (field: keyof Domain) => {
    setSortConfig(prev => ({
      field,
      ascending: prev.field === field ? !prev.ascending : true
    }));
  };

  const handleAddDomain = () => {
    setSelectedDomain(null);
    setIsModalOpen(true);
  };

  const handleEditDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setIsModalOpen(true);
  };

  const handleSaveDomain = (domainData: Omit<Domain, "id">) => {
    if (selectedDomain) {
      // 수정
      setDomains(prev =>
        prev.map(d =>
          d.id === selectedDomain.id ? { ...domainData, id: d.id } : d
        )
      );
    } else {
      // 추가
      const newDomain = {
        ...domainData,
        id: `domain-${domains.length + 1}`,
      };
      setDomains(prev => [...prev, newDomain]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <main className="container mx-auto px-4 py-6">
        {/* 필터 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="확장자"
              value={filters.extension}
              onChange={(e) => setFilters(prev => ({ ...prev, extension: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="분야"
              value={filters.niche}
              onChange={(e) => setFilters(prev => ({ ...prev, niche: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="최소 가치"
              value={filters.minValue}
              onChange={(e) => setFilters(prev => ({ ...prev, minValue: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="최대 가치"
              value={filters.maxValue}
              onChange={(e) => setFilters(prev => ({ ...prev, maxValue: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="최소 검색량"
              value={filters.minSearchVolume}
              onChange={(e) => setFilters(prev => ({ ...prev, minSearchVolume: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <select
              value={filters.brandingPotential}
              onChange={(e) => setFilters(prev => ({ ...prev, brandingPotential: e.target.value as BrandingPotential | "" }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">브랜딩 잠재력</option>
              <option value="낮음">낮음</option>
              <option value="중간">중간</option>
              <option value="높음">높음</option>
            </select>
          </div>
        </div>

        {/* 도메인 목록 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    도메인
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("extension")}
                  >
                    확장자
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("niche")}
                  >
                    분야
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("estimatedValue")}
                  >
                    예상 가치
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("searchVolume")}
                  >
                    검색량
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("brandingPotential")}
                  >
                    브랜딩 잠재력
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDomains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {domain.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {domain.extension}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {domain.niche}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${domain.estimatedValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {domain.searchVolume.toLocaleString()}/월
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {domain.brandingPotential}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditDomain(domain)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 추가 버튼 */}
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8">
          <button
            onClick={handleAddDomain}
            className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
      </main>

      <MobileBottomNav />

      {isModalOpen && (
        <DomainModal
          domain={selectedDomain}
          onSave={handleSaveDomain}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
