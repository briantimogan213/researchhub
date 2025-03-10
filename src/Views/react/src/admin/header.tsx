import avatar from "../global/avatar";
import { React, ReactDOM } from '../imports';

function SearchHeaderInput() {
  const [search, setSearch] = React.useState('')

  return (
    <div>
      <input type="search" placeholder="Enter Keywords" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-[#1764E8] text-black py-2 px-4 rounded placeholder:text-gray-300 font-[600] bg-white w-full" />
      <span className="material-symbols-outlined absolute top-1/2 -translate-y-[12px] right-0 text-black h-full mr-2">
        search
      </span>
    </div>
  )
}

export function render() {
  // dropdown avatar
  avatar();

  const containerRoot = document.getElementById("search-header");
  if (containerRoot) {
    const root = ReactDOM.createRoot(containerRoot);
    root.render(<SearchHeaderInput />);
  }
}