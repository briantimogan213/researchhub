export default import(pathname("/jsx/imports")).then(async ({ React, Sweetalert2, getAsyncImport }) => {
  const { CellAlign, TableCellType } = await import(pathname("/jsx/types"));
  const { default: AddJournalForm } = await getAsyncImport("/jsx/admin/addjournal");
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
    { label: "Published Date", key: "ed_date", sortable: true, cellType: TableCellType.Date, align: CellAlign.Center },
    { label: "Reads", key: "reads", sortable: true, cellType: TableCellType.Number, align: CellAlign.Center },
    { label: "Status", key: "is_public", sortable: true, cellType: TableCellType.Custom, align: CellAlign.Center },
    { label: "Action", key: "action", sortable: false, cellType: TableCellType.Custom, align: CellAlign.Center },
  ];


  return function JournalsPage() {
    const [openAddJournalForm, setShowAddJournalForm] = React.useState(false)
    const [pdfUrl, setPdfUrl] = React.useState("")
    const [pdfTitle, setPdfTitle] = React.useState("")
    const [pdfAuthor, setPdfAuthor] = React.useState("")
    const [tableData, setTableData] = React.useState([])

    const fetchList = () => {
      fetch(pathname('/api/journal/all'))
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
              ed_date: data.published_date,
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
                          title: 'Do you want to display this journal publicly?',
                          confirmButtonText: 'Yes, Display Journal publicly',
                          confirmButtonColor: '#3085d6',
                          showDenyButton: true,
                          denyButtonText: 'No, Cancel',
                          denyButtonColor: '#d33',
                          showLoaderOnConfirm: true,
                          preConfirm: async () => {
                            try {
                              const publishUrl = new URL(pathname('/api/journal/publish'), window.location.origin);
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
                                text: 'Failed to make journal public: ' + result.value.error,
                                timer: 3000,
                                toast: true,
                                position: 'center'
                              })
                            } else {
                              Sweetalert2.fire({
                                icon: 'success',
                                title: 'Journal Publicly Displayed Successfully',
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
                        title: 'Do you want to hide this journal to the public?',
                        confirmButtonText: 'Yes, Hide Journal',
                        confirmButtonColor: '#3085d6',
                        showDenyButton: true,
                        denyButtonText: 'No, Cancel',
                        denyButtonColor: '#d33',
                        showLoaderOnConfirm: true,
                        preConfirm: async () => {
                          try {
                            const publishUrl = new URL(pathname('/api/journal/publish'), window.location.origin);
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
                              text: 'Failed to make journal hidden: ' + result.value.error,
                              timer: 3000,
                              toast: true,
                              position: 'center'
                            })
                          } else {
                            Sweetalert2.fire({
                              icon: 'success',
                              title: 'Journal Hidden Successfully',
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
                      // Open the view journal modal
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
                      confirmButtonText: 'Yes, delete journal!'
                    }).then(({ isConfirmed }: any) => {
                      if (isConfirmed) {
                        fetch(pathname(`/api/journal/delete?id=${id}`), { method: 'DELETE' })
                        .then(response => response.json())
                        .then(({ success, error }) => {
                          if (!success) {
                            console.log(error);
                            Sweetalert2.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'Failed to delete journal: ' + error,
                              confirmButtonText: 'Try Again',
                            });
                          } else {
                            fetchList();
                            Sweetalert2.fire({
                              icon:'success',
                              title: 'Deleted!',
                              text: 'Journal has been deleted successfully.',
                              timer: 3000
                            });
                          }
                        })
                        .catch((er) => {
                          console.log(er);
                          Sweetalert2.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete journal',
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
          text: 'Failed to fetch journal list',
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
        <h1 className="text-white text-2xl my-2">Journal List</h1>
        <Table columns={columns} items={tableData}>
          {/* Additional Toolbar Button */}
          <div className="px-4">
            {/* Refresh Button */}
            <button type="button" onClick={() => fetchList()} className="hover:text-yellow-500" title="Refresh List"><span className="material-symbols-outlined">refresh</span></button>
          </div>
          <div className="px-4">
            <button type="button" onClick={() => setShowAddJournalForm(true)} className="hover:text-yellow-500" title="Add Journal"><span className="material-symbols-outlined">add</span></button>
          </div>
          <AddJournalForm open={openAddJournalForm} onClose={() => setShowAddJournalForm(false)} onSuccess={() => fetchList()} className="absolute right-3 top-full mt-4 shadow-lg" />
        </Table>
        <Modal open={!!pdfUrl} onClose={() => setPdfUrl(null)} content={<PdfViewer src={pdfUrl} />} header={pdfTitle} showCancelButton={false} showConfirmButton={false} footer={pdfAuthor} />
      </div>
    )
  }
});