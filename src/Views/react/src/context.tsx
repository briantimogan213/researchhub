export default import(pathname('/jsx/imports')).then(({ React }) => {
  // @ts-ignore
  const MainContext = React.createContext<{
    authenticated?: boolean;
    authData?: any[];
    [key: string]: any;
  }>({});

  function Context({
    children,
    pageData = {},
    rootDOM,
  }: Readonly<{
    children: React.ReactNode;
    pageData: any;
    rootDOM: HTMLDivElement;
  }>) {
    // @ts-ignore
    const [data, setData] = React.useState<{
      authenticated?: boolean;
      authData?: any[];
      [key: string]: any;
    }>(JSON.parse(pageData || "{}"))

    React.useEffect(() => {
      setData(JSON.parse(rootDOM?.dataset?.pageData || "{}"))
    }, [rootDOM?.dataset?.pageData])

    return (
      <MainContext.Provider value={data}>
        {children}
      </MainContext.Provider>
    );
  }
  return {
    MainContext,
    Context,
  }
});