export default import(pathname("/jsx/imports")).then(async ({ React, Sweetalert2, getAsyncImport }) => {
  const { CellAlign, TableCellType, TableColumn } = await import(pathname("/jsx/types"));
  const { default: AddDownloadableForm } = await getAsyncImport("/jsx/admin/adddownloadable");
  const { default: { Table, TableRowAction } } = await getAsyncImport("/jsx/admin/table");

  const columns: (typeof TableColumn)[] = [
    { label: "#", key: "id", sortable: true, filterable: true, cellType: TableCellType.Number, align: CellAlign.Center },
    { label: "File Title", key: "title", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "File Name", key: "name", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Date Created", key: "created_at", sortable: true, cellType: TableCellType.Date, align: CellAlign.Center },
    { label: "Downloadable?", key: "downloadable", sortable: true, cellType: TableCellType.Custom, align: CellAlign.Center },
    { label: "Action", key: "action", sortable: false, cellType: TableCellType.Custom, align: CellAlign.Center },
  ];

  return function ThesesPage() {
    const [openAddThesisForm, setShowAddThesisForm] = React.useState(false)
    const [tableData, setTableData] = React.useState([])

    const fetchList = () => {
      fetch(pathname('/api/downloadables/all'))
        .then(response => response.json())
        .then(({ success, error }) => {
          if (error) {
            console.log(error);
          } else if (success) {
            setTableData(success.map((data: any) => ({
              id: data.id,
              created_at: data.created_at,
              title: data.title,
              name: data.name + data.ext,
              downloadable: {
                value: !data.downloadable ? 'No' : 'Yes',
                content: !data.downloadable
                  ? (
                    <button
                      type="button"
                      className="bg-white px-3 py-2 text-red-500 rounded-2xl font-[500] leading-[14.63px] text-[12px]"
                      onClick={() => {
                        Sweetalert2.fire({
                          icon: 'question',
                          title: 'Do you want this file to be available for download?',
                          confirmButtonText: 'Yes, make it available',
                          confirmButtonColor: '#3085d6',
                          showDenyButton: true,
                          denyButtonText: 'No, Cancel',
                          denyButtonColor: '#d33',
                          showLoaderOnConfirm: true,
                          preConfirm: async () => {
                            try {
                              const publishUrl = new URL(pathname('/api/downloadables/publish'), window.location.origin);
                              const response = await fetch(publishUrl, {
                                method: 'POST',
                                body: JSON.stringify({ id: data.id, downloadable: true }),
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
                                text: 'Failed to make file available for download: ' + result.value.error,
                                timer: 3000,
                                toast: true,
                                position: 'center'
                              })
                            } else {
                              Sweetalert2.fire({
                                icon: 'success',
                                title: 'File made available for download',
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
                      No
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bg-white px-3 py-2 text-green-700 font-bold rounded-2xl leading-[14.63px] text-[12px]"
                      onClick={() => {
                        Sweetalert2.fire({
                          icon: 'question',
                          title: 'Do you want to make this file unavailable for download?',
                          confirmButtonText: 'Yes, make it unavailable for download',
                          confirmButtonColor: '#3085d6',
                          showDenyButton: true,
                          denyButtonText: 'No, Cancel',
                          denyButtonColor: '#d33',
                          showLoaderOnConfirm: true,
                          preConfirm: async () => {
                            try {
                              const publishUrl = new URL(pathname('/api/downloadables/publish'), window.location.origin);
                              const response = await fetch(publishUrl, {
                                method: 'POST',
                                body: JSON.stringify({ id: data.id, downloadable: false }),
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
                                text: 'Failed to make this file unavailable for download: ' + result.value.error,
                                timer: 3000,
                                toast: true,
                                position: 'center'
                              })
                            } else {
                              Sweetalert2.fire({
                                icon: 'success',
                                title: 'File made unavailable for download',
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
                      Yes
                    </button>
                  )
              },
              action: (
                <TableRowAction
                  id={data.id}
                  onDownload={(id: any) => {
                    if (id === data.id) {
                      // Open the view thesis modal
                      const downloadTab = window.open(new URL(pathname(`/download${data.url}`), window.location.origin), '_blank')
                      setTimeout(() => {
                        if (downloadTab) {
                          downloadTab.close();
                        }
                      }, 1000);
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
                      confirmButtonText: 'Yes, delete downloadable file!'
                    }).then(({ isConfirmed }: any) => {
                      if (isConfirmed) {
                        fetch(pathname(`/api/downloadables/delete?id=${id}`), { method: 'DELETE' })
                          .then(response => response.json())
                          .then(({ success, error }) => {
                            if (!success) {
                              console.log(error);
                              Sweetalert2.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to delete Downloadable File: ' + error,
                                confirmButtonText: 'Try Again',
                              });
                            } else {
                              fetchList();
                              Sweetalert2.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: 'Downloadable File has been deleted successfully.',
                                timer: 3000
                              });
                            }
                          })
                          .catch((er) => {
                            console.log(er);
                            Sweetalert2.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'Failed to delete Downloadable File',
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
            text: 'Failed to fetch Downloadable File list',
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
      fetchList();
    }, [])

    return (
      <div className="w-full min-h-[calc(100vh-160px)] h-fit bg-[#37414e] p-4 min-w-fit">
        <h1 className="text-white text-2xl my-2">Downloadable List</h1>
        <Table columns={columns} items={tableData}>
          {/* Additional Toolbar Button */}
          <div className="px-4">
            {/* Refresh Button */}
            <button type="button" onClick={() => fetchList()} className="hover:text-yellow-500" title="Refresh List"><span className="material-symbols-outlined">refresh</span></button>
          </div>
          <div className="px-4">
            <button type="button" onClick={() => setShowAddThesisForm(true)} className="hover:text-yellow-500" title="Add Thesis"><span className="material-symbols-outlined">add</span></button>
          </div>
          <AddDownloadableForm open={openAddThesisForm} onClose={() => setShowAddThesisForm(false)} onSuccess={() => fetchList()} className="absolute right-3 top-full mt-4 shadow-lg" />
        </Table>
      </div>
    )
  }
});
