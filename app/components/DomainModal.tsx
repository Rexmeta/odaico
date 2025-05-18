import type { Domain } from '../types/domain';

interface DomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (domain: Omit<Domain, 'id'>) => void;
  domain?: Domain;
  isEditing: boolean;
}

export default function DomainModal({ isOpen, onClose, onSave, domain, isEditing }: DomainModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const domainData = {
      name: formData.get('name') as string,
      length: parseInt(formData.get('length') as string),
      extension: formData.get('extension') as string,
      keywords: formData.get('keywords') as string,
      niche: formData.get('niche') as string,
      estimatedValue: parseInt(formData.get('estimatedValue') as string),
      searchVolume: parseInt(formData.get('searchVolume') as string),
      brandingPotential: formData.get('brandingPotential') as string,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string,
    };

    onSave(domainData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? '도메인 수정' : '새 도메인 추가'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                도메인 이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={domain?.name}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                길이
              </label>
              <input
                type="number"
                id="length"
                name="length"
                defaultValue={domain?.length}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="extension" className="block text-sm font-medium text-gray-700">
                확장자
              </label>
              <input
                type="text"
                id="extension"
                name="extension"
                defaultValue={domain?.extension}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                키워드
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                defaultValue={domain?.keywords}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="niche" className="block text-sm font-medium text-gray-700">
                분야
              </label>
              <select
                id="niche"
                name="niche"
                defaultValue={domain?.niche}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">선택하세요</option>
                <option value="Technology">기술</option>
                <option value="Finance">금융</option>
                <option value="Health">건강</option>
                <option value="Education">교육</option>
                <option value="Entertainment">엔터테인먼트</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700">
                예상 가치 ($)
              </label>
              <input
                type="number"
                id="estimatedValue"
                name="estimatedValue"
                defaultValue={domain?.estimatedValue}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="searchVolume" className="block text-sm font-medium text-gray-700">
                검색량
              </label>
              <input
                type="number"
                id="searchVolume"
                name="searchVolume"
                defaultValue={domain?.searchVolume}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="brandingPotential" className="block text-sm font-medium text-gray-700">
                브랜딩 잠재력
              </label>
              <select
                id="brandingPotential"
                name="brandingPotential"
                defaultValue={domain?.brandingPotential}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">선택하세요</option>
                <option value="High">높음</option>
                <option value="Medium">중간</option>
                <option value="Low">낮음</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                상태
              </label>
              <input
                type="text"
                id="status"
                name="status"
                defaultValue={domain?.status}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                메모
              </label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={domain?.notes}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 