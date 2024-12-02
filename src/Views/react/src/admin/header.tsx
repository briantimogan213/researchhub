import(pathname("/jsx/imports")).then(async ({ React, ReactDOM }) => {
  const { default: avatar } = await import(pathname("/jsx/global/avatar"));

  function SearchHeaderInput() {
    const [search, setSearch] = React.useState('')

    return (
      <div>
        <input type="search" placeholder="Enter Keywords" value={search} onChange={(e) => setSearch(e.target.value)} className="py-2 px-4 rounded placeholder:text-gray-300 font-[600] bg-[#595f68] w-full" />
        <span className="material-symbols-outlined absolute top-1/2 -translate-y-[12px] right-0 text-white h-full mr-2">
          search
        </span>
      </div>
    )
  }


  // dropdown avatar
  avatar();

  const containerRoot = document.getElementById("search-header");
  if (containerRoot) {
    const root = ReactDOM.createRoot(containerRoot);
    root.render(<SearchHeaderInput />);
  }
});