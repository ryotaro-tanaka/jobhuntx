import { useState, useRef } from 'react';
import logoLarge from 'assets/logo-wide.svg'
import logoSmall from 'assets/logo.svg'
import searchIcon from 'assets/search.svg'
import KeywordSuggest from './KeywordSuggest';

function FixedHeader({ onSearch, isLarge, setIsLarge }: { onSearch: (key: string | null) => void, isLarge: boolean, setIsLarge: (isLarge: boolean) => void }) {
  const [searchKeyStr, setSearchKeyStr] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  // 仮のトグル状態
  const [isJobList, setIsJobList] = useState(true);

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchKeyStr(suggestion);
    onSearch(suggestion);
  };

  const handleBlur = () => {
    setTimeout(() => setIsLarge(window.scrollY < 10), 100);
  };

  const handleSearch = () => {
    onSearch(searchKeyStr.trim() === '' ? null : searchKeyStr);
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-300 shadow-md transition-all duration-300 px-8
        ${isLarge ? 'h-48 pb-8' : 'h-20'}
      `}
    >
      {/* 1行目: ロゴとトグル */}
      <div className="relative w-full h-20 flex items-center">
        {/* 左: ロゴ */}
        <div className="flex-shrink-0">
          {/* PC（md以上）は常にlogoLarge */}
          <img
            src={logoLarge}
            alt="JobHuntX Logo"
            className="h-10 hidden md:block"
          />
          {/* スマホ（md未満）は常にlogoSmall。ただしisLarge=falseのときのみ上にフェードアウト */}
          <img
            src={logoSmall}
            alt="JobHuntX Logo Small"
            className={`
              h-10 md:hidden
              transition-all duration-300
              ${!isLarge ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100'}
            `}
          />
        </div>
        {/* 中央: トグルボタン */}
        <div
          className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex
            transition-all duration-300
            ${!isLarge ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100'}
          `}
        >
          <button
            type="button"
            className={`px-4 py-2 transition
              ${isJobList ? 'text-indigo-600 font-semibold' : 'text-gray-400'}
            `}
            onClick={() => setIsJobList(true)}
          >
            Jobs
          </button>
          <button
            type="button"
            className={`px-4 py-2 transition
              ${!isJobList ? 'text-indigo-600 font-semibold' : 'text-gray-400'}
            `}
            onClick={() => setIsJobList(false)}
          >
            Talent
          </button>
        </div>
      </div>
      {/* 2行目: 検索フォーム */}
      <div
        className={`
          flex justify-center items-center w-full h-20
          transition-all duration-300 
        `}
        style={{
          // isLarge=falseのとき1行目の高さ分だけ上にスライド
          transform: isLarge
            ? 'translateY(0)'
            : 'translateY(-80px)', // 1行目がh-20=80pxの場合
          zIndex: 1,
        }}
      >
        <form
          ref={formRef}
          role="search"
          className={
            `flex items-center space-x-2 border border-gray-300 rounded-full bg-white overflow-visible m-0
            shadow-md ring-1 ring-indigo-100 transition-all duration-300
            ${isLarge
              ? 'w-full md:w-[80vw] px-6 py-2 h-16'
              : 'w-full md:w-[50vw] md:min-w-[382.4px] px-3 py-1 h-12'}
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
      </div>
    </header>
  )
}

export default FixedHeader
