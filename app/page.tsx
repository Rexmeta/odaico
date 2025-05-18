"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import type { Domain, DomainFilterState, DomainSort } from './types/domain';
import { filterDomains, sortDomains, parseCSVToDomains, domainsToCSV } from './utils/domain';
import DomainTable from './components/DomainTable';
import DomainFilters from './components/DomainFilters';
import DomainModal from './components/DomainModal';

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | undefined>();
  const [filters, setFilters] = useState<DomainFilterState>({
    searchTerm: '',
    niche: '',
    brandingPotential: '',
  });
  const [sort, setSort] = useState<DomainSort>({
    field: 'name',
    order: 'asc',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const filtered = filterDomains(domains, filters);
    const sorted = sortDomains(filtered, sort);
    setFilteredDomains(sorted);
  }, [domains, filters, sort]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/domains.csv');
      if (!response.ok) {
        throw new Error('CSV 파일을 불러오는데 실패했습니다');
      }
      const csvContent = await response.text();
      const parsedDomains = parseCSVToDomains(csvContent);
      setDomains(parsedDomains);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = () => {
    setEditingDomain(undefined);
    setIsModalOpen(true);
  };

  const handleEditDomain = (id: number) => {
    const domain = domains.find((d) => d.id === id);
    setEditingDomain(domain);
    setIsModalOpen(true);
  };

  const handleDeleteDomain = async (id: number) => {
    if (!confirm('정말로 이 도메인을 삭제하시겠습니까?')) return;
    setDomains(domains.filter((d) => d.id !== id));
  };

  const handleSaveDomain = async (domainData: Omit<Domain, 'id'>) => {
    try {
      const newDomain: Domain = {
        id: editingDomain?.id || domains.length + 1,
        ...domainData
      };

      if (editingDomain) {
        setDomains(domains.map((d) => (d.id === newDomain.id ? newDomain : d)));
      } else {
        setDomains([...domains, newDomain]);
      }

      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedDomains = parseCSVToDomains(content);
        setDomains(parsedDomains);
        setError(null);
      } catch (err) {
        setError('파일을 읽는데 실패했습니다');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csv = domainsToCSV(domains);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'domains.csv';
    link.click();
  };

  const handleSort = (field: DomainSort['field']) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-7xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                도메인 관리 시스템
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                도메인 정보를 관리하고 분석하는 시스템
              </p>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddDomain}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  새 도메인 추가
                </button>
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  파일 업로드
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  CSV 내보내기
                </button>
              </div>
            </div>

            <DomainFilters filters={filters} onFilterChange={setFilters} />

            <div className="mt-8">
              <DomainTable
                domains={filteredDomains}
                onEdit={handleEditDomain}
                onDelete={handleDeleteDomain}
                onSort={handleSort}
                sort={sort}
              />
            </div>
          </div>
        </div>
      </div>

      <DomainModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDomain}
        domain={editingDomain}
        isEditing={!!editingDomain}
      />
    </div>
  );
}
