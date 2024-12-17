import { React } from "./imports";
// @ts-ignore
export const MainContext = React.createContext<{
  authenticated?: boolean;
  authData?: any;
  [key: string]: any;
}>({});

export function Context({
  children,
  pageData = {},
  rootDOM,
}: Readonly<{
  children: React.ReactNode;
  pageData: any;
  rootDOM: HTMLElement;
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