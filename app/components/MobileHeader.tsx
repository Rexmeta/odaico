"use client";

export default function MobileHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">도메인 관리</h1>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-500">도메인 분석 및 관리 시스템</span>
          </div>
        </div>
      </div>
    </header>
  );
} 