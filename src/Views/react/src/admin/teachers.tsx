

export default import(pathname("/jsx/imports")).then(async ({ React, Sweetalert2, getAsyncImport }) => {
  const { CellAlign, Departments, TableCellType, TableColumn }  = await import(pathname("/jsx/types"));
  const { default: { Input, Select } } = await getAsyncImport("/jsx/global/input");
  const { default: Modal } = await getAsyncImport("/jsx/global/modal");
  const { default: { Table, TableRowAction } } = await getAsyncImport("/jsx/admin/table");

  const columns: (typeof TableColumn)[] = [
    { label: "Teacher ID", key: "personnel_id", sortable: true, filterable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Full Name", key: "full_name", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Email Address", key: "email", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Department", key: "department", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Date Registered", key: "created_at", sortable: true, cellType: TableCellType.Date, align: CellAlign.Center },
    { label: "Action", key: "action", sortable: false, cellType: TableCellType.Custom, align: CellAlign.Center },
  ];

  function AddTeacher({
    formData,
    onChange,
  }:
  {
    formData: any,
    onChange: (data: any) => void
  }) {
    return (
      <div className="p-8">
        <Input label="Employee ID" borderColor="border-black" className="mb-2" labelColor="black" name="personnel_id" placeholder="Employee ID" value={formData.username} onChange={(e: any) => onChange({...formData, username: e.target.value })} required />
        <Input label="Full Name" borderColor="border-black"  className="mb-2" labelColor="black" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={(e: any) => onChange({...formData, full_name: e.target.value })} required />
        <Input type="email" label="Email Address" borderColor="border-black"  className="mb-2" labelColor="black" name="email" placeholder="Email Address" value={formData.email} onChange={(e: any) => onChange({...formData, email: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Departments).map(([key, value]) => ({ label: value, value }))} label="Department" name="department" placeholder="Department" value={formData.department} onChange={(e: any) => onChange({...formData, department: e.target.value })} required />
      </div>
    )
  }

  function EditTeacher({
    formData,
    onChange,
  }:
  {
    formData: any,
    onChange: (data: any) => void
  }) {
    return (
      <div className="p-8">
        <Input disabled label="Employee ID" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_personnel_id" placeholder="Employee ID" value={formData.username} onChange={(e: any) => onChange({...formData, username: e.target.value })} />
        <Input label="Full Name" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_full_name" placeholder="Full Name" value={formData.full_name} onChange={(e: any) => onChange({...formData, full_name: e.target.value })} required />
        <Input type="email" label="Email Address" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_email" placeholder="Email Address" value={formData.email} onChange={(e: any) => onChange({...formData, email: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Departments).map(([key, value]) => ({ label: value, value }))} label="Department" name="edit_department" placeholder="Department" value={formData.department} onChange={(e: any) => onChange({...formData, department: e.target.value })} required />
        <Input type="password" label="Password" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_password" placeholder="Password (Leave blank if not change)" value={formData.password} onChange={(e: any) => onChange({...formData, password: e.target.value })} />
      </div>
    )
  }


  return function TeachersPage() {
    const [tableData, setTableData] = React.useState([])
    const [formData, setFormData] = React.useState({
      account: 'personnel',
      username: '',
      full_name: '',
      email: '',
      password: '',
      department: Departments.CCIS,
    })

    const onCloseModal = React.useCallback(() => {
      setFormData({
        account: 'personnel',
        username: '',
        full_name: '',
        email: '',
        password: '',
        department: Departments.CCIS,
      })
    }, [])

    const [openEditTeacher, setOpenEditTeacher] = React.useState(false)

    const onOpenEditTeacher = React.useCallback((data: any) => {
      setFormData({
        account: 'personnel',
        username: data.personnel_id,
        full_name: data.full_name,
        email: data.email,
        password: '',
        department: data.department,
      })
      setOpenEditTeacher(true)
    }, [])

    const fetchList = () => {
      fetch(pathname('/api/teacher/all'))
      .then(response => response.json())
      .then(({ success, error }) => {
        if (error) {
          console.log(error);
        } else {
          setTableData(success.map((data: any) => {
            return {
              id: data.personnel_id,
              personnel_id: data.personnel_id,
              created_at: data.created_at,
              full_name: data.full_name,
              email: data.email,
              department: data.department,
              action: <TableRowAction
                id={data.personnel_id}
                onEdit={(id: any) => {
                  if (id === data.personnel_id) {
                    onOpenEditTeacher(data);
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
                    confirmButtonText: 'Yes, delete teacher account!'
                  }).then(({ isConfirmed }: any) => {
                    if (isConfirmed) {
                      fetch(pathname(`/api/teacher/delete?id=${id}`), { method: 'DELETE' })
                      .then(response => response.json())
                      .then(({ success, error }) => {
                        if (!success) {
                          console.log(error);
                          Sweetalert2.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete teacher account: ' + error,
                            confirmButtonText: 'Try Again',
                          });
                        } else {
                          fetchList();
                          Sweetalert2.fire({
                            icon:'success',
                            title: 'Deleted!',
                            text: 'Teacher account has been deleted successfully.',
                            timer: 3000
                          });
                        }
                      })
                      .catch((er) => {
                        console.log(er);
                        Sweetalert2.fire({
                          icon: 'error',
                          title: 'Error',
                          text: 'Failed to delete teacher account',
                          timer: 3000
                        });
                      })
                    }
                  })
                }}
              />,
            }
          }))
        }
      })
      .catch((e) => {
        console.log(e);
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch teacher list',
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

    const handleEditTeacher = React.useCallback(async (close: () => void) => {
      try {
        const response = await fetch(pathname('/api/update'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        const data = await response.json()

        if (data.success) {
          close()
          onCloseModal()
          Sweetalert2.fire({
            icon:'success',
            title: 'Success',
            text: 'Teacher account has been updated successfully.',
            timer: 3000
          })
          setTimeout(() => fetchList(), 100)
        } else {
          Sweetalert2.fire({
            icon: 'error',
            title: 'Failed',
            text: data.error,
          })
        }
      } catch (e) {
        console.log(e)
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update teacher account',
          confirmButtonText: 'Try Again',
          showCancelButton: true,
        }).then(({ isConfirmed }: any) => {
          if (isConfirmed) {
            setTimeout(() => handleEditTeacher(close), 100)
          }
        })
      }
    }, [formData]);

    const [openAddTeacher, setOpenAddTeacher] = React.useState(false)

    const handleAddTeacher = React.useCallback(async (close: () => void) => {
      try {
        if (!formData.username || !formData.department || !formData.email) {
          Sweetalert2.fire({
            icon: 'error',
            title: 'Error',
            text: 'Fill in required fields.',
          })
          return;
        }
        const response = await fetch(pathname('/api/signup'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...formData, password: formData.full_name.replace(' ', '').trim().substring(0, 3).toLowerCase() + formData.username }),
        })
        const data = await response.json()

        if (data.success) {
          close()
          onCloseModal()
          Sweetalert2.fire({
            icon:'success',
            title: 'Success',
            text: 'Teacher account has been added successfully.',
            timer: 3000
          })
          setTimeout(() => fetchList(), 100)
        } else {
          Sweetalert2.fire({
            icon: 'error',
            title: 'Failed',
            text: data.error,
          })
        }
      } catch (e) {
        console.log(e)
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add teacher account',
          confirmButtonText: 'Try Again',
          showCancelButton: true,
        }).then(({ isConfirmed }: any) => {
          if (isConfirmed) {
            setTimeout(() => handleAddTeacher(close), 100)
          }
        })
      }
    }, [formData])

    return (<>
      <div className="w-full min-h-[calc(100vh-160px)] h-fit bg-[#37414e] p-4 min-w-fit">
        <h1 className="text-white text-2xl my-2">Teacher List</h1>
        <Table columns={columns} items={tableData}>
          {/* Additional Toolbar Button */}
          <div className="px-4">
            {/* Refresh Button */}
            <button type="button" onClick={() => fetchList()} className="hover:text-yellow-500" title="Refresh List"><span className="material-symbols-outlined">refresh</span></button>
          </div>
          <div className="px-4">
            <button type="button" onClick={() => setOpenAddTeacher(true)} className="hover:text-yellow-500" title="Add Teacher Account"><span className="material-symbols-outlined">add</span></button>
          </div>
        </Table>
      </div>
      <Modal open={openAddTeacher} header={'Add Teacher Account'} content={<AddTeacher formData={formData} onChange={setFormData} />} onConfirm={handleAddTeacher} onCancel={onCloseModal} onClose={() => setOpenAddTeacher(false)} />
      <Modal open={openEditTeacher} header={'Edit Teacher Account'} content={<EditTeacher formData={formData} onChange={setFormData} />} onConfirm={handleEditTeacher} onCancel={onCloseModal} onClose={() => setOpenEditTeacher(false)} />
    </>)
  }
});