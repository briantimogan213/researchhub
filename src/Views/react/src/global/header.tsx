import(pathname("/jsx/imports")).then(async ({ React, ReactDOM }) => {
  const { NavItems } = await import(pathname("/jsx/types"))
  const { default: avatar } = await import(pathname("/jsx/global/avatar"));

  function SearchInput({ search, setSearch }: { search: string, setSearch: React.Dispatch<React.SetStateAction<string>> }) {
    return (
      <div className="flex flex-row justify-start items-center w-full h-[50px] rounded-full bg-white border border-sky-300 focus-within:border-sky-600 focus-within:border-4">
        <label htmlFor="search" className="material-symbols-outlined h-full flex items-center justify-center min-w-[50px] pl-4">search</label>
        <input type="search" id="search" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-full p-4 outline-none bg-transparent" />
      </div>
    )
  }

  function ResponsiveHeader({ navList, authAvatarList }: { navList: (typeof NavItems)[], authAvatarList: any[] }) {
    const [show, setShow] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const navRef = React.useRef(null);
    const ulRef = React.useRef(null);
    const toggleShow = React.useCallback(() => setShow(!show), [show]);
    const pageData = React.useMemo(() => JSON.parse(document.getElementById('root')?.dataset?.pageData as string), []);

    const pathName = React.useMemo(() => window.location.pathname, []);

    React.useEffect(() => {
      if (!search) {
        console.log("Not searching. Clearing search input.");
      } else {
        console.log("Searching for: " + search);
      }
    }, [search]);

    React.useEffect(() => {
      if (show) {
        navRef.current?.classList.remove("-z-10", "h-0");
        navRef.current?.classList.add("z-10", "h-screen");
      } else {
        navRef.current?.classList.remove("z-10", "h-screen");
        navRef.current?.classList.add("h-0", "-z-10");
      }
    }, [show]);

    React.useEffect(() => {
      if (ulRef.current && ulRef.current.children.length === navList.length) {
        (ulRef.current as HTMLElement).prepend(authAvatarList[0]);
        (ulRef.current as HTMLElement).append(authAvatarList[1]);
      }
    }, [authAvatarList, ulRef]);

    return (<>
      <div ref={navRef} className="absolute bg-white top-full right-0 border w-full h-0 max-h-fit overflow-hidden -z-10 transition-[height] duration-500 delay-10 ease-in-out origin-top shadow-lg">
        <div className="flex w-full h-full px-10 pb-6 pt-4 flex-col justify-start items-start gap-y-4">
          {/* <SearchInput search={search} setSearch={setSearch} /> */}
          <ul className="flex flex-col gap-2 w-full h-full font-[500]" ref={ulRef}>
            <li>
              { pageData?.authenticated ? (
                  <div className="px-4 py-3 text-sm text-gray-900">
                    <div>{pageData?.authData?.full_name}</div>
                    <div className="font-medium truncate capitalize">{pageData?.authData?.account}</div>
                  </div>
                ) : (
                  <div className="px-4 flex flex-col gap-2">
                    <a href={pathname("/login")} className="text-sky-600 hover:text-sky-300">Login</a>
                  </div>
                )
              }
            </li>
            {
              navList.map((item) => (
                <li key={item.label}>
                  <a href={pathname(item.url)} className="indent-4">
                    <div className={
                      `hover:text-sky-500 transition duration-300 w-full
                      ${(pathname(item.url) === pathname("/") && pathName === pathname("/")) || (pathname(item.url) !== pathname("/") && pathName.startsWith(pathname(item.url)))
                      ? "text-black border-l-4 border-sky-300 font-700"
                      : "text-gray-500 w-full"}`
                    }>
                      {item.label}
                    </div>
                  </a>
                </li>
              ))
            }
            <li>
              { pageData?.authenticated ? (
                  <form action={pathname("/logout")} method="post">
                    <a href={pathname("/settings")} className="block px-4 py-2 hover:bg-gray-200">Settings</a>
                    <button type="submit" className="block px-4 pt-2 text-red-400 hover:text-red-700 w-full text-start">Sign out</button>
                  </form>
                ) : (
                  <div className="px-4 flex flex-col gap-2">
                    <a href={pathname("/signup")} className="text-yellow-600 hover:text-sky-300">Sign Up</a>
                  </div>
                )
              }
            </li>
          </ul>
        </div>
      </div>
      <button type="button" onClick={toggleShow} className="w-[50px] h-[50px] aspect-square hover:text-sky-500" >
        <span className="material-symbols-outlined">menu</span>
      </button>
    </>)
  }

  // implement avatar dropdown
  avatar();

  // responsive navigation for small screens
  const containerRoot = document.getElementById("responsive-nav-small");
  if (containerRoot) {
    containerRoot.classList.add("block", "xl:hidden", "p-4", "flex-shrink");
    const authAvatars = [...containerRoot.children];
    const navList = JSON.parse(containerRoot.dataset.navlist as string);
    const root = ReactDOM.createRoot(containerRoot);
    root.render(<ResponsiveHeader navList={navList} authAvatarList={authAvatars} />);
  }
});