"use client";

import { Domain, BrandingPotential } from "../types/domain";
import { useState, useEffect } from "react";

interface DomainModalProps {
  domain: Domain | null;
  onSave: (domain: Omit<Domain, "id">) => void;
  onClose: () => void;
}

export default function DomainModal({
  domain,
  onSave,
  onClose,
}: DomainModalProps) {
  const [formData, setFormData] = useState<Omit<Domain, "id">>({
    name: "",
    extension: "",
    niche: "",
    estimatedValue: 0,
    searchVolume: 0,
    brandingPotential: "중간",
    notes: "",
  });

  useEffect(() => {
    if (domain) {
      setFormData({
        name: domain.name,
        extension: domain.extension,
        niche: domain.niche,
        estimatedValue: domain.estimatedValue,
        searchVolume: domain.searchVolume,
        brandingPotential: domain.brandingPotential,
        notes: domain.notes,
      });
    }
  }, [domain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleBrandingPotentialChange = (value: string) => {
    const potential = value as BrandingPotential;
    setFormData({ ...formData, brandingPotential: potential });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            {domain ? "도메인 수정" : "새 도메인 추가"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              도메인 이름
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              확장자
            </label>
            <input
              type="text"
              value={formData.extension}
              onChange={(e) =>
                setFormData({ ...formData, extension: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              분야
            </label>
            <input
              type="text"
              value={formData.niche}
              onChange={(e) =>
                setFormData({ ...formData, niche: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              예상 가치 ($)
            </label>
            <input
              type="number"
              value={formData.estimatedValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedValue: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색량 (월)
            </label>
            <input
              type="number"
              value={formData.searchVolume}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  searchVolume: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              브랜딩 잠재력
            </label>
            <select
              value={formData.brandingPotential}
              onChange={(e) => handleBrandingPotentialChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="낮음">낮음</option>
              <option value="중간">중간</option>
              <option value="높음">높음</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메모
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 