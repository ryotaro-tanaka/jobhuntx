import { useState } from 'react';
import logo from 'assets/logo.svg'
import logoWide from 'assets/logo-wide.svg'
import searchIcon from 'assets/search.svg'

function FixedHeader({ onSearch }: { onSearch: (key: string | null) => void }) {
  const [searchKeyStr, setSearchKeyStr] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchKeyStr.trim() === '' ? null : searchKeyStr); // 空文字列ならnullを送信
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-8 bg-white border-b border-gray-300 shadow-md"
    >
      <img src={logoWide} alt="JobHuntX Logo" className="h-10 flex-shrink-0 mr-4" />
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 border border-gray-300 rounded-full p-2 focus-within:ring-2 focus-within:ring-indigo-500 bg-white overflow-hidden max-w-[600px] w-full px-4 md:px-6">
        <input
          type="text"
          placeholder="Search for jobs..."
          className="w-full px-6 py-3 text-lg focus:outline-none"
          value={searchKeyStr}
          onChange={(e) => setSearchKeyStr(e.target.value)} // 入力値を更新
          onKeyDown={handleKeyDown} // Enterキーで検索
        />
        <button
          className="flex items-center justify-center w-16 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          onClick={handleSearch} // ボタンクリックで検索
        >
          <img src={searchIcon} alt="Search" className="w-8 h-8" />
        </button>
      </div>
    </header>
  )
}

export default FixedHeader
