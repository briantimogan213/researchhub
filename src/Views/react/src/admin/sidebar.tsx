export default import(pathname("/jsx/imports")).then(async ({ React, ReactDOM, clsx, getAsyncImport }) => {
  const { NavItems }  = await import(pathname("/jsx/types"));
  const { default: SMCCLogo } = await getAsyncImport("/jsx/global/smcclogo");

  function SidebarNav({ defaultShow = true, sidebarList, toggleBtn }: { defaultShow?: boolean, sidebarList: (typeof NavItems)[], toggleBtn: HTMLButtonElement }) {
    const pathName = React.useMemo(() => window.location.pathname, []);
    const [show, setShow] = React.useState(defaultShow);

    React.useEffect(() => {
      toggleBtn.addEventListener("click", () => setShow((prev: boolean) => !prev));
    }, [toggleBtn]);

    React.useEffect(() => {
      localStorage.setItem("sidebarShow", show ? "true" : "false");
    }, [show]);

    return (
      <nav className={
        clsx(
          "text-slate-50 bg-[#262e36] max-w-[250px] h-full relative",
          show ? "w-[250px]" : "w-0 *:hidden",
          "transition-[width] duration-200 ease-in-out",
        )
      }>
        <div className="w-full max-h-[60px] h-[60px] flex items-center justify-center bg-[#21282f]">
          <a href={pathname("/")} className="flex flex-nowrap h-full w-fit items-center justify-start">
            <SMCCLogo className="aspect-square h-full py-2" />
            <h1 className="pr-3 font-[600]">RESEARCH HUB</h1>
          </a>
        </div>
        <ul className="list-none p-0 bg-[#191f26] py-4 w-full">
          { sidebarList.map(({ label, url }) => (
              <li key={label}>
                <a
                  href={pathname(url)}
                  className={
                    "flex p-4 text-sm font-medium hover:bg-sky-300 hover:text-black transition-colors duration-200 ease-in-out"
                    + (pathname(url) === pathName ? " bg-yellow-300 text-black" : " text-white")
                  }
                >
                  {label}
                </a>
              </li>
            )
          )}
        </ul>
      </nav>
    )
  }

  function LoadingSidebar() {
    return (
      <nav className={
        "text-slate-50 bg-[#262e36] max-w-[250px] h-full relative w-[250px]"
      }>
        <div className="w-full max-h-[60px] h-[60px] flex items-center justify-center bg-[#21282f]">
          <div className="flex flex-nowrap h-full w-fit items-center justify-start">
            <img src={pathname("/images/SMCC-logo.svg")} alt="SMCC Logo" className="aspect-square h-full py-2" />
            <h1 className="pr-3 font-[600]">RESEARCH HUB</h1>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-full">
          <div role="status" className="min-h-full w-full flex items-center justify-center"><svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path></svg><span className="sr-only">Loading...</span></div>
        </div>
      </nav>
    )
  }

  const toggleBtn = document.getElementById("sidebar-toggle-btn") as HTMLButtonElement;
  const containerRoot = document.getElementById("sidebar-nav");

  const root = ReactDOM.createRoot(containerRoot);
  if (containerRoot) {
    containerRoot.className = "";
    containerRoot.classList.add(...("flex-shrink max-w-[250px] max-h-screen bg-[#262e36]".split(" ")));
    const sidebarlist = JSON.parse(containerRoot.dataset.sidebarList as string);
    root.render(<SidebarNav sidebarList={sidebarlist} toggleBtn={toggleBtn} />);
  }
});