import { useState, useRef } from 'react'
import logoLarge from '../../assets/logo-wide.svg'
import logoSmall from '../../assets/logo.svg'
import searchIcon from '../../assets/search.svg'
import KeywordSuggest from './KeywordSuggest'

interface FixedHeaderProps {
  onSearch: (key: string | null) => void
  isLarge: boolean
  setIsLarge: (isLarge: boolean) => void
  isJobList: boolean
  setIsJobList: (v: boolean) => void
}

function FixedHeader({
  onSearch,
  isLarge,
  setIsLarge,
  isJobList,
  setIsJobList
}: FixedHeaderProps) {
  const [searchKeyStr, setSearchKeyStr] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchKeyStr(suggestion)
    onSearch(suggestion)
  }

  const handleBlur = () => {
    setTimeout(() => setIsLarge(window.scrollY < 10), 100)
  }

  const handleSearch = () => {
    onSearch(searchKeyStr.trim() === '' ? null : searchKeyStr)
  }

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-10 border-b border-gray-300 bg-white px-8 shadow-md transition-all duration-300
        ${isLarge ? 'h-48 pb-8' : 'h-20'}
      `}
    >
      {/* 1行目: ロゴとトグル */}
      <div className="relative flex h-20 w-full items-center">
        {/* 左: ロゴ */}
        <div className="shrink-0">
          <img
            src={logoLarge}
            alt="JobHuntX Logo"
            className="hidden h-10 md:block"
          />
          <img
            src={logoSmall}
            alt="JobHuntX Logo Small"
            className={`
              h-10 transition-all
              duration-300 md:hidden
              ${
                !isLarge
                  ? 'pointer-events-none -translate-y-4 opacity-0'
                  : 'opacity-100'
              }
            `}
          />
        </div>
        {/* 中央: トグルボタン */}
        <div
          className={`
            absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2
            transition-all duration-300
            ${
              !isLarge
                ? 'pointer-events-none -translate-y-8 opacity-0'
                : 'opacity-100'
            }
          `}
        >
          <button
            type="button"
            className={`px-4 py-2 transition
              ${isJobList ? 'font-semibold text-indigo-600' : 'text-gray-400'}
            `}
            onClick={() => setIsJobList(true)}
          >
            Jobs
          </button>
          <button
            type="button"
            className={`px-4 py-2 transition
              ${!isJobList ? 'font-semibold text-indigo-600' : 'text-gray-400'}
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
          flex h-20 w-full items-center justify-center
          transition-all duration-300 
        `}
        style={{
          transform: isLarge ? 'translateY(0)' : 'translateY(-80px)',
          zIndex: 1
        }}
      >
        <form
          ref={formRef}
          role="search"
          className={`relative m-0 flex items-center space-x-2 overflow-visible rounded-full border border-gray-300 bg-white
            shadow-md ring-1 ring-indigo-100 transition-all duration-300
            ${
              isLarge
                ? 'h-16 w-full px-6 py-2 md:w-[80vw]'
                : 'h-12 w-full px-3 py-1 md:w-[50vw] md:min-w-[382.4px]'
            }
            `}
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
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
            className={`flex items-center justify-center rounded-full bg-indigo-600 transition-all duration-300 hover:bg-indigo-700 focus:outline-none
              ${isLarge ? 'h-12 w-16' : 'h-8 w-10'}
            `}
          >
            <img src={searchIcon} alt="Search" className="size-8" />
          </button>
        </form>
      </div>
    </header>
  )
}

export default FixedHeader
