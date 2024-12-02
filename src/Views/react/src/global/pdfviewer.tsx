export default import(pathname("/jsx/imports")).then(({ React, ReactPDF }) => {
  return function PdfViewer({ src }: { src: string }) {
    const [numPages, setNumPages] = React.useState(0);
    const [pageNumber, setPageNumber] = React.useState(1)
    const onDocumentLoadSuccess = React.useCallback(({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
    }, [src])
    React.useEffect(() => {
      return () => {
        setNumPages(0);
        setPageNumber(1);
      }
    }, [src]);
    return (
      <div className="w-full max-h-fit overflow-hidden bg-gray-300/50 pb-4 text-black">
        <div className="flex justify-center items-center gap-1">
          <button type="button" onClick={() => setPageNumber(1)} className="p-1 aspect-square rounded-l hover:bg-sky-100">
            <span className="material-symbols-outlined">
              keyboard_double_arrow_left
            </span>
          </button>
          <button type="button" onClick={() => setPageNumber((prev: number) => Math.max(1, prev - 1))} className="p-1 aspect-square rounded-l hover:bg-sky-100">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="font-[600]">Page {pageNumber} of {numPages}</div>
          <button type="button" onClick={() => setPageNumber((prev: number) => Math.min(numPages, prev + 1))} className="p-1 aspect-square rounded-r hover:bg-sky-100">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <button type="button" onClick={() => setPageNumber(numPages)} className="p-1 aspect-square rounded-l hover:bg-sky-100">
            <span className="material-symbols-outlined">
              keyboard_double_arrow_right
            </span>
          </button>
        </div>
        <ReactPDF.Document file={src} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(err: any) => console.log("ERROR:", err)}>
          <ReactPDF.Page className="max-w-fit mx-auto overflow-x-auto overflow-y-hidden border drop-shadow-lg text-black"  renderTextLayer={false} renderAnnotationLayer={false} canvasBackground={"#fff"} pageNumber={pageNumber} />
        </ReactPDF.Document>
      </div>
    );
  }
})