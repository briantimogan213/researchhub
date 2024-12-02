export default import(pathname("/jsx/imports")).then(async ({ React, getAsyncImport }) => {
  const { default: { MainContext } } = await getAsyncImport("/jsx/context");
  const { default: Modal } = await getAsyncImport("/jsx/global/modal");
  const { default: PdfViewer } = await getAsyncImport("/jsx/global/pdfviewer");

  return function Library() {
    const { authenticated, authData } = React.useContext(MainContext)
    const [data, setData] = React.useState([])

    const [page, setPage] = React.useState(1)
    const totalPages = React.useMemo(() => Math.ceil(data.length / 20), [data])

    const finalDisplay = React.useMemo(() => data.length === 0 ? undefined : data?.slice((page - 1) * 20, Math.min(page * 20)), [page, data, totalPages])

    const nextPage = React.useCallback(() => setPage((prev: number) => Math.min(totalPages, Math.max(totalPages === 0 ? 0 : 1, prev + 1))), [totalPages])
    const prevPage = React.useCallback(() => setPage((prev: number) => Math.min(totalPages, Math.max(totalPages === 0 ? 0 : 1, prev - 1))), [totalPages])

    const fetchData = async () => {
      const url = new URL(pathname('/api/favorites/all'), window.location.origin);
      url.searchParams.set(authData?.account, authData?.id);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { success, error } = await response.json();
        if (error) {
          throw new Error(`HTTP error: ${error.message}`);
        } else if (success) {
          setData(success);
        }
      } catch (e) {
        console.log(e)
      }
    }

    React.useEffect(() => {
      fetchData().catch()
    }, [])

    const [pdfUrl, setPdfUrl] = React.useState()
    const [pdfTitle, setPdfTitle] = React.useState()
    const [pdfAuthor, setPdfAuthor] = React.useState()

    const handleViewPdf = React.useCallback((id: string, uri: string, title: string, author: string) => {
      const url = new URL(pathname(`/read${uri}&id=${id}`), window.location.origin).toString()
      setPdfTitle(title);
      setPdfUrl(url);
      setPdfAuthor(author);
      setTimeout(() => fetchData().catch(), 1000);
    }, [fetchData])

    return (<>
      <div className="py-4 px-8 mt-4">
        <div className="mt-3">
          <h1 className="text-2xl font-bold text-center mb-3">Library</h1>
          <div className="flex max-w-full overflow-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-auto">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Authors</th>
                  <th scope="col" className="px-6 py-3">Year</th>
                  <th scope="col" className="px-6 py-3">Department</th>
                  <th scope="col" className="px-6 py-3">Course</th>
                  <th scope="col" className="px-6 py-3">Read</th>
                </tr>
              </thead>
              <tbody className="bg-white border-b">
                { finalDisplay?.map((item: any) => (
                  <tr key={item.id + '_' + item.type} className="bg-white border-b cursor-pointer hover:bg-sky-100" onClick={() => handleViewPdf(item.id, item.url, item.title, item.author + ' (' + item.year + ')')}>
                    <th scope="row" className="px-6 py-4">{item.type}</th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.title}</td>
                    <td className="px-6 py-4">{item.author}</td>
                    <td className="px-6 py-4">{item.year}</td>
                    <td className="px-6 py-4">{item.department}</td>
                    <td className="px-6 py-4">{item.course}</td>
                    <td className="px-6 py-4 text-center">{item.read} times</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={8}>
                      <div className="h-[200px] mb-2 mx-auto text-center">
                        <div className="rounded-lg p-4">
                          <div className="text-gray-500">No favorites.</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex-shrink text-slate-700 font-[600] mx-auto">
            <button type="button" className="p-1 hover:text-yellow-700" onClick={() => setPage(totalPages === 0 ? 0 : 1)}>{"<<"}</button>
            <button type="button" className="p-1 hover:text-yellow-700" onClick={prevPage}>{"<"} Prev</button>
            <button type="button" className="p-1 hover:text-yellow-700" onClick={nextPage}>Next {">"}</button>
            <button type="button" className="p-1 hover:text-yellow-700" onClick={() => setPage(totalPages)}>{">>"}</button>
          </div>
        </div>
      </div>
      <Modal open={!!pdfUrl} onClose={() => { setPdfUrl(undefined); setPdfTitle(undefined); setPdfAuthor(undefined); }} content={authenticated ? <PdfViewer src={pdfUrl} /> : <div className="w-full text-center min-h-[150px] pt-16">Please <a href={pathname("/login")} className="text-sky-700 underline">login</a> to view.</div>} header={pdfTitle} showCancelButton={false} showConfirmButton={false} footer={pdfAuthor} />
    </>)
  }
});