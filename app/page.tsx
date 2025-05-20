"use client";

import { useState, useEffect } from "react";
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
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다');
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
      } catch (error) {
        setError(error instanceof Error ? error.message : '파일을 읽는데 실패했습니다');
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6">
      <div className="px-4 py-10">
        <div className="relative px-4 py-10 bg-white shadow-xl sm:rounded-3xl sm:p-20">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                도메인 관리 시스템
              </h1>
              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                도메인 정보를 효율적으로 관리하고 분석하는 시스템
              </p>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  새 도메인 추가
                </button>
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
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
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
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
