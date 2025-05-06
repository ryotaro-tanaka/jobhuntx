import { useEffect, useState, useRef } from 'react';
import { Client, KeywordTags } from 'api/generated';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Props = {
  isLarge: boolean;
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  formRef: React.RefObject<HTMLFormElement>;
};

export default function KeywordSuggest({isLarge, value, onChange, onSelect, onBlur, onFocus, formRef,}: Props) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // キーワード取得
  useEffect(() => {
    if (isLarge) {
      const client = new Client(API_BASE_URL);
      client.keywords().then((tags: KeywordTags) => {
        const all = [
          ...(tags.roles ?? []),
          ...(tags.skills ?? []),
          ...(tags.domains ?? []),
          ...(tags.employment ?? []),
          ...(tags.locations ?? []),
        ];
        setKeywords(Array.from(new Set(all)));
      });
    }
  }, [isLarge]);

  // 入力に応じてサジェストを更新
  useEffect(() => {
    if (isLarge && value.trim().length > 0) {
      const input = value.trim().toLowerCase();
      const filtered = keywords
        .filter(k => k.toLowerCase().includes(input))
        .slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, keywords, isLarge]);

  const handleSuggestionClick = (s: string) => {
    onSelect(s);
    setShowSuggestions(false);
  };

  return (
    <>
      <input
        type="search"
        placeholder="Keyword"
        className="w-full px-6 py-3 text-lg bg-transparent focus:outline-none no-search-cancel"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {isLarge && showSuggestions && (
        <ul
          className="absolute left-0 -translate-x-2 top-full mt-2 w-full bg-white rounded-[32px] shadow-lg border border-gray-200 z-20 list-none m-0 p-4"
          style={{ minWidth: formRef.current?.offsetWidth || undefined }}
          role="listbox"
        >
          {suggestions.map(s => (
            <li
              key={s}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-100 transition-colors"
              onMouseDown={() => handleSuggestionClick(s)}
              role="option"
              tabIndex={-1}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}