import { memo, useState } from "react";
import type { MovieFilters, MovieLanguage } from "../types/movie";
import { Input } from "./Input";
import { SelectBox } from "./SelectBox";
import { LanguageSelector } from "./LanguageSelector";
import { LANGUAGE_OPTIONS } from "../constants/movie";

interface MovieFilterProps {
  onChange: (filter: MovieFilters) => void;
}

export const MovieFilter = memo(({ onChange }: MovieFilterProps) => {
  const [query, setQuery] = useState<string>("");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState<MovieLanguage>("ko-KR");

  const handleSubmit = () => {
    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };
    onChange(filters);
  };

  return (
    <div>
      <div className="transform space-y-6 rounded-2xl border-gray-300 bg-white p-6 shadow-xl transition-all hover:shadow-2xl">
        <div className="flex flex-wrap gap-10 mb-4">
          <div className="min-w-[450px] flex-1">
            <label className="mb-2 block text-base font-medium text-gray-700 flex items-center justify-center">
              영화 제목
            </label>
            <Input value={query} onChange={setQuery} />
          </div>

          <div className="min-w-[250px] flex-1">
            <label className="mb-2 block text-base font-medium text-gray-700 flex items-center justify-center">
              옵션
            </label>
            <SelectBox
              checked={includeAdult}
              onChange={setIncludeAdult}
              label="성인 콘텐츠 표시"
              id="include_adult"
            />
          </div>

          <div className="min-w-[250px] flex-1">
            <label className="mb-2 block text-base font-medium text-gray-700 flex items-center justify-center">
              언어
            </label>
            <LanguageSelector
              value={language}
              onChange={(value: string) =>
                setLanguage(value as MovieLanguage)
              }
              options={LANGUAGE_OPTIONS}
            />
          </div>
        </div>

        <button onClick={handleSubmit} className="cursor-pointer bg-black text-white px-4 py-2 rounded-2xl hover:bg-gray-800 transition flex items-center justify-center m-auto">
          영화 검색
        </button>
      </div>
    </div>
  );
});

