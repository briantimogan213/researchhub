export default import(pathname("/jsx/imports")).then(({ React, Sweetalert2 }) => {
  return function Downloads() {

    const [downloadables, setDownloadables] = React.useState([]);

    const fetchList = React.useCallback(() => {
      const url = new URL(pathname('/api/downloadables/available'), window.location.origin)
      fetch(url)
      .then(response => response.json())
      .then(({ success, error }: any) => {
        if (error) {
          Sweetalert2.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please login to display downloadables',
            toast: true,
            showConfirmButton: false,
            position: 'center',
          })
        } else if (success) {
          setDownloadables(success);
        }
      })
      .catch(console.log)
    }, [])

    React.useEffect(() => {
      fetchList()
    }, [])

    const handleDownloadFile = React.useCallback((item: any) => {
      const url = new URL(pathname(`/download${item.url}`), window.location.origin).toString()
      const w = window.open(url, '_blank')
      setTimeout(() => {
        if (w) {
          w.close();
        }
      }, 1000);
    }, [])

    return (
      <div className="min-h-[calc(100vh-200px)] py-4 px-4 lg:px-8">
        <h1 className="text-2xl font-bold mt-8 mb-4">Downloadables</h1>
        <div className="border-t">
          <div className="flex max-w-full overflow-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-auto">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">#</th>
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Filename</th>
                  <th scope="col" className="px-6 py-3">Download</th>
                </tr>
              </thead>
              <tbody className="bg-white border-b">
                { downloadables.length > 0 && downloadables.map((item: any, i: number) => (
                  <tr key={item.id + '_' + item.type} className="bg-white border-b cursor-pointer hover:bg-sky-100">
                    <th scope="row" className="px-6 py-4">{i + 1}</th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.title}</td>
                    <td className="px-6 py-4">{(new Date(item.created_at)).toLocaleString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-6 py-4">{item.name + item.ext}</td>
                    <td className="px-6 py-4"><button type="button" onClick={() => handleDownloadFile(item)} title="Download File" className="mx-auto aspect-square p-2"><span className="material-symbols-outlined">download</span></button></td>
                  </tr>
                ))}
                { downloadables.length === 0  && (
                  <tr>
                    <td colSpan={8}>
                      <div className="h-[200px] mb-2 mx-auto text-center">
                        <div className="rounded-lg p-4">
                          <div className="text-gray-500">No Downloadables.</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
});