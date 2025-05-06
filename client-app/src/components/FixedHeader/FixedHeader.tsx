import { useState, useRef } from 'react';
import logoWide from 'assets/logo-wide.svg'
import searchIcon from 'assets/search.svg'
import KeywordSuggest from './KeywordSuggest';

function FixedHeader({ onSearch, isLarge, setIsLarge }: { onSearch: (key: string | null) => void, isLarge: boolean, setIsLarge: (isLarge: boolean) => void }) {
  const [searchKeyStr, setSearchKeyStr] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  // サジェストクリック時
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchKeyStr(suggestion);
    onSearch(suggestion);
  };

  // フォーカス外れたらサジェスト非表示
  const handleBlur = () => {
    setTimeout(() => setIsLarge(window.scrollY < 10), 100);
  };

  const handleSearch = () => {
    onSearch(searchKeyStr.trim() === '' ? null : searchKeyStr);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-10 flex items-center justify-between transition-all duration-300
        ${isLarge ? 'h-32 p-8' : 'h-20 px-8 py-4'}
        bg-white border-b border-gray-300 shadow-md`}
    >
      <img src={logoWide} alt="JobHuntX Logo" className="h-10 flex-shrink-0 mr-4" />
      <form
        ref={formRef}
        role="search"
        className={
          `absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 border border-gray-300 rounded-full bg-white overflow-visible m-0
          transition-all duration-300
          ${isLarge
            ? 'max-w-[600px] w-full px-4 md:px-6 p-2 h-16'
            : 'max-w-[340px] w-[260px] px-3 py-1 h-12'}
          `
        }
        onSubmit={e => { e.preventDefault(); handleSearch(); }}
        autoComplete="off"
      >
        <KeywordSuggest
          isLarge={isLarge}
          value={searchKeyStr}
          onChange={setSearchKeyStr}
          onSelect={handleSuggestionSelect}
          onBlur={handleBlur}
          onFocus={() => setIsLarge(true)}
          formRef={formRef}
        />
        <button
          type="submit"
          className={`flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all duration-300
            ${isLarge ? 'w-16 h-12' : 'w-10 h-8'}
          `}
        >
          <img src={searchIcon} alt="Search" className="w-8 h-8" />
        </button>
      </form>
    </header>
  )
}

export default FixedHeader
