
export default import(pathname("/jsx/imports")).then(({ React, clsx }) => {
  return function Modal({ open, defaultOpen, header, content, footer, showHeader = true, showFooter = true, showCancelButton = true, showConfirmButton = true, onClose = () => { }, onCancel = () => { }, onConfirm = (onClose: () => void) => { }, }: { open?: boolean, defaultOpen?: boolean, content: React.ReactNode | string, header?: React.ReactNode | string, footer?: React.ReactNode | string, showHeader?: boolean, showFooter?: boolean, showCancelButton?: boolean, showConfirmButton?: boolean, onConfirm?: (onClose: () => void) => void, onClose?: () => void, onCancel?: () => void }) {
    const [showModal, setShowModal] = React.useState(open === undefined ? defaultOpen || false : open);
    React.useEffect(() => {
      if (open !== undefined) {
        setShowModal(open);
        if (!open) {
          onClose && onClose();
        }
      }
    }, [open]);

    const onCloseModal = React.useCallback(() => {
      if (open === undefined) {
        setShowModal(false);
      }
      onClose && onClose();
    }, [open, onClose]);

    return (
      <div
        tabIndex={-1}
        aria-hidden="true"
        className={clsx(
          "overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] min-h-screen max-h-screen bg-black/50",
          showModal ? "block" : "hidden",
        )}
      >
        <div onClick={onCloseModal} className="w-full h-full z-0 absolute left-0 top-0"></div>
        <div className="relative p-4 w-full max-w-4xl max-h-full mx-auto">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow ">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t w-full">
              {showHeader && (
                <h3 className="text-xl font-semibold text-gray-900">
                  {header}
                </h3>
              )}
              <button type="button" onClick={onCloseModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="px-3 pb-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {content}
            </div>
            {/* <!-- Modal footer --> */}
            {showFooter && (
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
                {footer}
                {showConfirmButton && <button type="button" onClick={() => { onConfirm(onCloseModal); }} className="text-white bg-sky-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Confirm</button>}
                {showCancelButton && <button type="button" onClick={() => { onCancel(); onCloseModal(); }} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 ">Cancel</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
});