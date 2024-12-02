export default import(pathname("/jsx/imports")).then(({ React }) => {
  return function SearchHeaderInput({
    search,
    onSearch
  }: {
    search: string,
    onSearch: (query: string) => void,
  }) {

    return (
      <div>
        <input type="search" placeholder="Search" value={search} onChange={(e) => onSearch(e.target.value)} className="py-2 px-4 rounded border font-[600] text-gray-800 bg-white w-full" />
        <span className="material-symbols-outlined absolute top-1/2 -translate-y-[12px] right-0 text-white h-full mr-2">
          search
        </span>
      </div>
    )
  }
});