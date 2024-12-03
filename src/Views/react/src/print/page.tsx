export default import(pathname("/jsx/imports")).then(async ({ React, getAsyncImport }) => {
  const { default: { MainContext } } = await getAsyncImport("/jsx/context");

  function PrintButton() {
    return (
      <button type="button" className="print:hidden fixed top-5 right-5 px-3 py-2 bg-blue-800 text-white hover:bg-blue-500 rounded-lg" onClick={() => window.print()}> Print</button>
    )
  }

  return function Print() {
    const searchParams = React.useMemo(() => new URLSearchParams(window.location.search), [window.location.search]);
    const title = React.useMemo(() => searchParams.get('title'), [searchParams])
    const department = React.useMemo(() => searchParams.get('department'), [searchParams])
    const course = React.useMemo(() => searchParams.get('course'), [searchParams])
    const [isError, setError] = React.useState(false)
    const pageData = React.useContext(MainContext)
    const thesis = React.useMemo(() => {
      let data: any[] = pageData?.thesis || []
      if (!!department) {
        data = data.filter((d) => d.department?.toString() === department?.toString())
      }
      if (!!course) {
        data = data.filter((d) => d.course?.toString() === course?.toString())
      }
      return data;
    }, [pageData])

    React.useEffect(() => {
      if (title) {
        window.document.title = title;
      }
      if (!pageData.thesis) {
        setError(true)
      }
    }, [])

    return isError ? (
      <div className="min-h-screen w-full flex items-center justify-center">Print not found</div>
    ) : (
      <>
        <div style={{ maxWidth: 8.5 * 96, minHeight: 11 * 96, backgroundColor: "white" }} className="border shadow mx-auto p-[12.2mm]">
          <div className="w-full text-center pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="w-20">
                <img src={pathname("/smcclogo.png")} alt="School Logo" className="w-full h-auto" />
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-xl font-bold">Saint Michael College of Caraga</h1>
                <p className="text-sm">Brgy. 4, Nasipit, Agusan del Norte, Philippines</p>
                <p className="text-sm">
                  Tel. Nos. +63 085 343-3251 / +63 085 283-3113 Fax No. +63 085 808-0892
                </p>
                <p className="text-sm">www.smccnasipit.edu.ph</p>
              </div>
              <div className="w-20">
                <img src={pathname("/socotechlogo.jpg")} alt="Certification Logo" className="w-full h-auto" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-left mb-4 uppercase">Thesis/Capstone List</h2>
            <table className="table w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-black text-center p-4">TITLE</th>
                  <th className="border border-black text-center p-4">AUTHORS</th>
                  <th className="border border-black text-center p-4">YEAR</th>
                  <th className="border border-black text-center p-4">DEPARTMENT</th>
                  <th className="border border-black text-center p-4">COURSES</th>
                </tr>
              </thead>
              <tbody>
                {thesis.length === 0 && (
                  <tr>
                    <td colSpan={6} className="border border-black p-4 text-center">No records</td>
                  </tr>
                )}
                {thesis.length > 0 && thesis.map((data: any, i: number) => (
                  <tr key={data.id}>
                    <td className={"border border-black p-1 text-center"}>{data.title}</td>
                    <td className={"border border-black p-1 text-center"}>{data.author}</td>
                    <td className={"border border-black p-1 text-center"}>{data.year}</td>
                    <td className={"border border-black p-1 text-center"}>{data.department}</td>
                    <td className={"border border-black p-1 text-center"}>{data.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <PrintButton />
      </>
    )
  }
})