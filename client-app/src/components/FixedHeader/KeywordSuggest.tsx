import { useEffect, useState } from 'react'
import { KeywordTags } from '../../api/generated'
import { createApiClient } from '../../api/clientFactory'

type Props = {
  isLarge: boolean
  value: string
  onChange: (v: string) => void
  onSelect: (v: string) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus: () => void
  formRef: React.RefObject<HTMLFormElement>
}

export default function KeywordSuggest({
  isLarge,
  value,
  onChange,
  onSelect,
  onBlur,
  onFocus,
  formRef
}: Props) {
  const [keywords, setKeywords] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  useEffect(() => {
    const client = createApiClient()
    client
      .keywords()
      .then((tags: KeywordTags) => {
        const all = [
          ...(tags.roles ?? []),
          ...(tags.skills ?? []),
          ...(tags.domains ?? []),
          ...(tags.employment ?? []),
          ...(tags.locations ?? [])
        ]
        setKeywords(Array.from(new Set(all)))
      })
      .catch(() => {
        setKeywords([])
      })
  }, [])

  // update suggestions
  useEffect(() => {
    if (isLarge && value.trim().length > 0) {
      const input = value.trim().toLowerCase()
      const filtered = keywords
        .filter((k) => k.toLowerCase().includes(input))
        .slice(0, 8)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
      setHighlightedIndex(-1)
    } else {
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }
  }, [value, isLarge, keywords])

  useEffect(() => {
    setShowSuggestions(false)
    setHighlightedIndex(-1)
  }, [isLarge])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault()
        const selected = suggestions[highlightedIndex]
        onChange(selected)
        onSelect(selected)
        setShowSuggestions(false)
        setHighlightedIndex(-1)
      }
    }
  }

  const handleSuggestionClick = (s: string) => {
    onChange(s)
    onSelect(s)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
  }

  return (
    <>
      <input
        type="search"
        placeholder="Keyword"
        className="no-search-cancel w-full bg-transparent px-6 py-3 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={(e) => {
          onBlur(e)
          setShowSuggestions(false)
        }}
        onKeyDown={handleInputKeyDown}
        aria-activedescendant={
          highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
        }
        aria-autocomplete="list"
        aria-controls="suggestion-list"
      />
      {showSuggestions && (
        <ul
          className="absolute left-0 top-full z-20 m-0 mt-2 w-full -translate-x-2 list-none rounded-[32px] border border-gray-200 bg-white p-4 shadow-lg"
          style={{ minWidth: formRef.current?.offsetWidth || undefined }}
          role="listbox"
          id="suggestion-list"
        >
          {suggestions.map((s, i) => (
            <li
              key={s}
              id={`suggestion-${i}`}
              className={`cursor-pointer rounded-lg px-4 py-2 font-bold transition-colors ${
                highlightedIndex === i ? 'bg-indigo-100' : 'hover:bg-indigo-100'
              }`}
              onMouseDown={() => handleSuggestionClick(s)}
              role="option"
              aria-selected={highlightedIndex === i}
              tabIndex={-1}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
