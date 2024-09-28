import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCallback, useRef } from 'react';
import { Button } from 'react-daisyui';

const SearchView = function SearchView({ performSearch }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchCallback = useCallback(
    (e) => {
      let searchValue = '';
      if (inputRef.current && inputRef.current.value) {
        searchValue = inputRef.current.value;
      }
      performSearch(searchValue);
      e.preventDefault();
    },
    [performSearch],
  );
  return (
    <div>
      <form
        onSubmit={searchCallback}
        className="flex items-center gap-2 input input-bordered"
      >
        <input
          ref={inputRef}
          type="text"
          className="grow"
          id="search-input"
          placeholder="Search"
          aria-label="Search"
        />
        <Button type="submit" color="ghost" shape="circle" size="sm">
          <MagnifyingGlassIcon
            role="img"
            className="w-4 h-4 opacity-70"
            aria-label="Search"
          />
        </Button>
      </form>
    </div>
  );
};

export default SearchView;
