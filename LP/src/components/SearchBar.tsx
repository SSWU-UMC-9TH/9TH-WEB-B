

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="LP 제목을 검색하세요"
      className="
        w-full px-4 py-2 mb-4
        border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    />
  );
};

export default SearchBar;