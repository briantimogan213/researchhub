export default import(pathname("/jsx/imports")).then(async ({ React, clsx }) => {
  const { TabLabel } = await import(pathname("/jsx/types"));

  const TabContext = React.createContext({
    activeTabKey: ""
  });

  function Tab({ tabKey, children }: { tabKey: string, children: React.ReactNode }) {
    const { activeTabKey } = React.useContext(TabContext);
    return activeTabKey === tabKey && (
      <>{children}</>
    )
  }

  function Tabs({ tabs = [], children, ...props }: { tabs: (typeof TabLabel)[], children: React.ReactNode }) {
    const [activeTabKey, setActiveTabKey] = React.useState(tabs?.[0].key || "");
    return (
      <TabContext.Provider value={{
        activeTabKey
      }}>
        <div {...props}>
          <div className="sm:hidden">
            <select onChange={(e) => setActiveTabKey(e.target.value)} title="Tabs" className="border text-sm rounded-t-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
              {tabs.map(({ label, key }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <ul className="hidden text-sm font-medium text-center rounded-t-lg shadow sm:flex divide-gray-700 text-gray-400 w-full">
            { tabs.map(({ label, key }, index: number) => (
              <li className="w-full focus-within:z-10">
                <button
                  type="button"
                  onClick={() => setActiveTabKey(key)}
                  className={clsx(
                    "inline-block w-full p-4 border-r focus:ring-4 focus:ring-blue-300 focus:outline-none border-gray-700",
                    index === 0 ? "rounded-tl-lg border-r" : index === tabs.length - 1 ? "rounded-tr-lg" : "border-r",
                    activeTabKey === key ? "bg-sky-600 text-white active" : "bg-gray-800 hover:text-white hover:bg-sky-700/50"
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="p-6 text-medium text-gray-400 bg-gray-800 rounded-b-lg w-full">
            {children}
          </div>
        </div>
      </TabContext.Provider>
    )
  }

  return {
    Tab,
    Tabs
  }
});