"use client";

import { useState } from "react";
import { Domain } from "./types/domain";
import { parseCSVToDomains, domainsToCSV } from "./utils/domain";
import DomainList from "./components/DomainList";
import DomainModal from "./components/DomainModal";
import MobileHeader from "./components/MobileHeader";
import MobileBottomNav from "./components/MobileBottomNav";
import { FilterOptions } from "./types/domain";

export default function Home() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    extension: "",
    niche: "",
    minValue: "",
    maxValue: "",
    minSearchVolume: "",
    brandingPotential: "",
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsedDomains = parseCSVToDomains(text);
      setDomains(parsedDomains);
      setError(null);
    } catch (err) {
      setError("CSV 파일을 파싱하는 중 오류가 발생했습니다.");
    }
  };

  const handleExportCSV = () => {
    const csv = domainsToCSV(domains);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "domains.csv";
    link.click();
  };

  const handleAddDomain = () => {
    setEditingDomain(null);
    setIsModalOpen(true);
  };

  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setIsModalOpen(true);
  };

  const handleDeleteDomain = (id: string) => {
    setDomains(domains.filter((domain) => domain.id !== id));
  };

  const handleSaveDomain = (domainData: Omit<Domain, "id">) => {
    if (editingDomain) {
      setDomains(
        domains.map((domain) =>
          domain.id === editingDomain.id
            ? { ...domainData, id: domain.id }
            : domain
        )
      );
    } else {
      setDomains([
        ...domains,
        { ...domainData, id: Math.random().toString(36).substr(2, 9) },
      ]);
    }
    setIsModalOpen(false);
  };

  const filteredDomains = domains.filter((domain) => {
    if (filterOptions.extension && domain.extension !== filterOptions.extension)
      return false;
    if (filterOptions.niche && domain.niche !== filterOptions.niche)
      return false;
    if (
      filterOptions.minValue &&
      domain.estimatedValue < parseInt(filterOptions.minValue)
    )
      return false;
    if (
      filterOptions.maxValue &&
      domain.estimatedValue > parseInt(filterOptions.maxValue)
    )
      return false;
    if (
      filterOptions.minSearchVolume &&
      domain.searchVolume < parseInt(filterOptions.minSearchVolume)
    )
      return false;
    if (
      filterOptions.brandingPotential &&
      domain.brandingPotential !== filterOptions.brandingPotential
    )
      return false;
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MobileHeader />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">
              <span className="sr-only">CSV 파일 선택</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </label>
            <button
              onClick={handleExportCSV}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              CSV 내보내기
            </button>
            <button
              onClick={handleAddDomain}
              className="w-full py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              새 도메인 추가
            </button>
          </div>

          <DomainList
            domains={filteredDomains}
            onEdit={handleEditDomain}
            onDelete={handleDeleteDomain}
            filterOptions={filterOptions}
            onFilterChange={setFilterOptions}
          />
        </div>
      </main>

      <MobileBottomNav />

      {isModalOpen && (
        <DomainModal
          domain={editingDomain}
          onSave={handleSaveDomain}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
