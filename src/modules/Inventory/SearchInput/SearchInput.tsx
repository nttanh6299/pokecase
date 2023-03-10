import { useEffect, useState } from "react";

interface SearchInputProps {
  setValue(value: string): void;
  defaultValue?: string;
}

const SearchInput = ({ defaultValue, setValue }: SearchInputProps) => {
  const [input, setInput] = useState(defaultValue || "");

  useEffect(() => {
    setInput(defaultValue || "");
  }, [defaultValue]);

  const onSearchClick = () => {
    setValue(input);
  };

  return (
    <div style={{ display: "flex" }}>
      <input
        placeholder="search by name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={onSearchClick}>Search</button>
    </div>
  );
};

export default SearchInput;
