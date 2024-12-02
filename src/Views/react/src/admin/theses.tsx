export default import(pathname("/jsx/imports")).then(async ({ React, Sweetalert2, getAsyncImport }) => {
  const { CellAlign, TableCellType } = await import(pathname("/jsx/types"));
  const { default: AddThesisForm } = await getAsyncImport("/jsx/admin/addthesis");
  const { default: Modal } = await getAsyncImport("/jsx/global/modal");
  const { default: PdfViewer } = await getAsyncImport("/jsx/global/pdfviewer");
  const { default: { Table, TableRowAction } } = await getAsyncImport("/jsx/admin/table");

  const columns = [
    { label: "#", key: "id", sortable: true, filterable: true, cellType: TableCellType.Number, align: CellAlign.Center },
    { label: "Date Created", key: "created_at", sortable: true, cellType: TableCellType.Date, align: CellAlign.Center },
    { label: "Title", key: "title", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Author", key: "author", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Year", key: "year", sortable: true, cellType: TableCellType.Number, align: CellAlign.Center },
    { label: "Department", key: "department", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Course", key: "course", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Adviser", key: "adviser", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Reads", key: "reads", sortable: true, cellType: TableCellType.Number, align: CellAlign.Center },
    { label: "Status", key: "is_public", sortable: true, cellType: TableCellType.Custom, align: CellAlign.Center },
    { label: "Action", key: "action", sortable: false, cellType: TableCellType.Custom, align: CellAlign.Center },
  ];


  return function ThesesPage() {
    const [openAddThesisForm, setShowAddThesisForm] = React.useState(false)
    const [pdfUrl, setPdfUrl] = React.useState("")
    const [pdfTitle, setPdfTitle] = React.useState("")
    const [pdfAuthor, setPdfAuthor] = React.useState("")
    const [tableData, setTableData] = React.useState([])

    const fetchList = () => {
      fetch(pathname('/api/thesis/all'))
      .then(response => response.json())
      .then(({ success, error }) => {
        if (error) {
          console.log(error);
        } else {
          setTableData(success.map((data: any) => ({
              id: data.id,
              created_at: data.created_at,
              title: data.title,
              author: data.author,
              year: data.year,
              department: data.department,
              course: data.course,
              adviser: data.adviser,
              reads: data.reads || 0,
              is_public: {
                value: !data.is_public ? 'No' : 'Yes',
                content: !data.is_public
                  ? (
                    <button
                      type="button"
                      className="bg-white px-3 py-2 text-red-500 rounded-2xl font-[500] leading-[14.63px] text-[12px]"
                      onClick={() => {
                        Sweetalert2.fire({
                          icon: 'question',
                          title: 'Do you want to display this thesis publicly?',
                          confirmButtonText: 'Yes, Display Thesis publicly',
                          confirmButtonColor: '#3085d6',
                          showDenyButton: true,
                          denyButtonText: 'No, Cancel',
                          denyButtonColor: '#d33',
                          showLoaderOnConfirm: true,
                          preConfirm: async () => {
                            try {
                              const publishUrl = new URL(pathname('/api/thesis/publish'), window.location.origin);
                              const response = await fetch(publishUrl, {
                                method: 'POST',
                                body: JSON.stringify({ id: data.id, is_public: true }),
                                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                              })
                              if (!response.ok) {
                                const { error } = await response.json()
                                return Sweetalert2.showValidationMessage('Failed: ' + error);
                              }
                              return response.json();
                            } catch (error) {
                              Sweetalert2.showValidationMessage('Failed: ' + error);
                            }
                          },
                          allowOutsideClick: () => !Sweetalert2.isLoading()
                        }).then((result: any) => {
                          if (result.isConfirmed) {
                            if (result.value?.error) {
                              Sweetalert2.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to make thesis public: ' + result.value.error,
                                timer: 3000,
                                toast: true,
                                position: 'center'
                              })
                            } else {
                              Sweetalert2.fire({
                                icon: 'success',
                                title: 'Thesis Publicly Displayed Successfully',
                                timer: 3000,
                                toast: true,
                                position: 'center'
                              });
                              fetchList();
                            }
                          }
                        })
                      }}
                    >
                      Hidden
                    </button>
                  ) : (
                  <button
                    type="button"
                    className="bg-white px-3 py-2 text-green-700 font-bold rounded-2xl leading-[14.63px] text-[12px]"
                    onClick={() => {
                      Sweetalert2.fire({
                        icon: 'question',
                        title: 'Do you want to hide this thesis to the public?',
                        confirmButtonText: 'Yes, Hide Thesis',
                        confirmButtonColor: '#3085d6',
                        showDenyButton: true,
                        denyButtonText: 'No, Cancel',
                        denyButtonColor: '#d33',
                        showLoaderOnConfirm: true,
                        preConfirm: async () => {
                          try {
                            const publishUrl = new URL(pathname('/api/thesis/publish'), window.location.origin);
                            const response = await fetch(publishUrl, {
                              method: 'POST',
                              body: JSON.stringify({ id: data.id, is_public: false }),
                              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            })
                            if (!response.ok) {
                              const { error } = await response.json()
                              return Sweetalert2.showValidationMessage('Failed: ' + error);
                            }
                            return response.json();
                          } catch (error) {
                            Sweetalert2.showValidationMessage('Failed: ' + error);
                          }
                        },
                        allowOutsideClick: () => !Sweetalert2.isLoading()
                      }).then((result: any) => {
                        if (result.isConfirmed) {
                          if (result.value?.error) {
                            Sweetalert2.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'Failed to make thesis hidden: ' + result.value.error,
                              timer: 3000,
                              toast: true,
                              position: 'center'
                            })
                          } else {
                            Sweetalert2.fire({
                              icon: 'success',
                              title: 'Thesis Hidden Successfully',
                              timer: 3000,
                              toast: true,
                              position: 'center'
                            });
                            fetchList();
                          }
                        }
                      })
                    }}
                  >
                    Public
                  </button>
                )
              },
              action: (
                <TableRowAction
                  id={data.id}
                  onView={(id: any) => {
                    if (id === data.id) {
                      // Open the view thesis modal
                      setPdfTitle(data.title);
                      setPdfAuthor("Author/s: " + data.author + " (" + data.year + ")");
                      setPdfUrl(new URL(pathname(`/read${data.url}`), window.location.origin).toString());
                    }
                  }}
                  onDelete={(id: any) => {
                    Sweetalert2.fire({
                      title: 'Are you sure?',
                      text: "You won't be able to revert this!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, delete thesis!'
                    }).then(({ isConfirmed }: any) => {
                      if (isConfirmed) {
                        fetch(pathname(`/api/thesis/delete?id=${id}`), { method: 'DELETE' })
                        .then(response => response.json())
                        .then(({ success, error }) => {
                          if (!success) {
                            console.log(error);
                            Sweetalert2.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'Failed to delete thesis: ' + error,
                              confirmButtonText: 'Try Again',
                            });
                          } else {
                            fetchList();
                            Sweetalert2.fire({
                              icon:'success',
                              title: 'Deleted!',
                              text: 'Thesis has been deleted successfully.',
                              timer: 3000
                            });
                          }
                        })
                        .catch((er) => {
                          console.log(er);
                          Sweetalert2.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete thesis',
                            timer: 3000
                          });
                        })
                      }
                    })
                  }}
                />
              ),
            }
          )))
        }
      })
      .catch((e) => {
        console.log(e);
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch thesis list',
          confirmButtonText: 'Try Again',
          showCancelButton: true,
        }).then(({ isConfirmed }: any) => {
          if (isConfirmed) {
            setTimeout(() => fetchList(), 50);
          }
        })
      })
    };

    React.useEffect(() => {
      if (!pdfUrl) {
        setPdfTitle("");
        setPdfAuthor("");
      }
    }, [pdfUrl])

    React.useEffect(() => {
      fetchList();
    }, [])

    return (
      <div className="w-full min-h-[calc(100vh-160px)] h-fit bg-[#37414e] p-4 min-w-fit">
        <h1 className="text-white text-2xl my-2">Thesis/Capstone List</h1>
        <Table columns={columns} items={tableData}>
          {/* Additional Toolbar Button */}
          <div className="px-4">
            {/* Refresh Button */}
            <button type="button" onClick={() => fetchList()} className="hover:text-yellow-500" title="Refresh List"><span className="material-symbols-outlined">refresh</span></button>
          </div>
          <div className="px-4">
            <button type="button" onClick={() => setShowAddThesisForm(true)} className="hover:text-yellow-500" title="Add Thesis"><span className="material-symbols-outlined">add</span></button>
          </div>
          <AddThesisForm open={openAddThesisForm} onClose={() => setShowAddThesisForm(false)} onSuccess={() => fetchList()} className="absolute right-3 top-full mt-4 shadow-lg" />
        </Table>
        <Modal open={!!pdfUrl} onClose={() => setPdfUrl(null)} content={<PdfViewer src={pdfUrl} />} header={pdfTitle} showCancelButton={false} showConfirmButton={false} footer={pdfAuthor} />
      </div>
    )
  }
});