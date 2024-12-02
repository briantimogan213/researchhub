
export default import(pathname("/jsx/imports")).then(async ({ React, Sweetalert2, getAsyncImport }) => {
  const { CellAlign, Courses, Departments, TableCellType, TableColumn, Year } = await import(pathname("/jsx/types"));
  const { default: { Input, Select } } = await getAsyncImport("/jsx/global/input");
  const { default: Modal } = await getAsyncImport("/jsx/global/modal");
  const { default: { Table, TableRowAction } } = await getAsyncImport("/jsx/admin/table");

  const columns: (typeof TableColumn)[] = [
    { label: "Student ID", key: "student_id", sortable: true, filterable: true, cellType: TableCellType.Number, align: CellAlign.Center },
    { label: "Full Name", key: "full_name", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Email Address", key: "email", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Department", key: "department", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Course", key: "course", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
    { label: "Year", key: "year", sortable: true, cellType: TableCellType.Number, align: CellAlign.Center },
    { label: "Date Registered", key: "created_at", sortable: true, cellType: TableCellType.Date, align: CellAlign.Center },
    { label: "Action", key: "action", sortable: false, cellType: TableCellType.Custom, align: CellAlign.Center },
  ];

  function EditStudent({
    formData,
    onChange,
  }:
    {
      formData: any,
      onChange: (data: any) => void
    }) {
    return (
      <div className="p-8">
        <Input disabled label="Student ID" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_student_id" placeholder="Student ID" value={formData.username} onChange={(e: any) => onChange({ ...formData, username: e.target.value })} />
        <Input disabled label="Full Name" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_full_name" placeholder="Full Name" value={formData.full_name} onChange={(e: any) => onChange({ ...formData, full_name: e.target.value })} required />
        <Input type="email" label="Email Address" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_email" placeholder="Email Address" value={formData.email} onChange={(e: any) => onChange({ ...formData, email: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Departments).map(([key, value]) => ({ label: value, value }))} label="Department" name="edit_department" placeholder="Department" value={formData.department} onChange={(e: any) => onChange({ ...formData, department: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Courses).map(([key, value]) => ({ label: value, value }))} label="Course" name="edit_course" placeholder="Course" value={formData.course} onChange={(e: any) => onChange({ ...formData, course: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Year).map(([key, value]) => ({ label: value, value }))} label="Year" name="edit_year" placeholder="Year" value={formData.year} onChange={(e: any) => onChange({ ...formData, year: e.target.value })} required />
        <Input type="password" label="Password" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_password" placeholder="Password (Leave blank if not change)" value={formData.password} onChange={(e: any) => onChange({ ...formData, password: e.target.value })} />
      </div>
    )
  }

  return function StudentsPage() {
    const [tableData, setTableData] = React.useState([])
    const [formData, setFormData] = React.useState({
      account: 'student',
      username: '',
      full_name: '',
      email: '',
      password: '',
      department: Departments.CCIS,
      course: Courses.BSIT,
      year: Year.FirstYear,
    })

    const onCloseModal = React.useCallback(() => {
      setFormData({
        account: 'student',
        username: '',
        full_name: '',
        email: '',
        password: '',
        department: Departments.CCIS,
        course: Courses.BSIT,
        year: Year.FirstYear,
      })
    }, [])

    const [openEditStudent, setOpenEditStudent] = React.useState(false)

    const onOpenEditStudent = React.useCallback((data: any) => {
      setFormData({
        account: 'student',
        username: data.student_id,
        full_name: data.full_name,
        email: data.email,
        password: '',
        department: data.department,
        course: data.course,
        year: data.year,
      })
      setOpenEditStudent(true)
    }, [])

    const fetchList = () => {
      fetch(pathname('/api/student/all'))
        .then(response => response.json())
        .then(({ success, error }) => {
          if (error) {
            console.log(error);
          } else {
            setTableData(success.map((data: any) => {
              return {
                student_id: data.student_id,
                created_at: data.created_at,
                full_name: data.full_name,
                email: data.email,
                year: data.year,
                department: data.department,
                course: data.course,
                action: <TableRowAction id={data.student_id} onEdit={(id: any) => {
                  if (id === data.student_id) {
                    onOpenEditStudent(data);
                  }
                }} onDelete={(id: any) => {
                  console.log("ON DELETE STUDENT ID:", id);
                  Sweetalert2.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete student account!'
                  }).then(({ isConfirmed }: any) => {
                    if (isConfirmed) {
                      fetch(pathname(`/api/student/delete?id=${id}`), { method: 'DELETE' })
                        .then(response => response.json())
                        .then(({ success, error }) => {
                          if (!success) {
                            console.log(error);
                            Sweetalert2.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'Failed to delete student account: ' + error,
                              confirmButtonText: 'Try Again',
                            });
                          } else {
                            fetchList();
                            Sweetalert2.fire({
                              icon: 'success',
                              title: 'Deleted!',
                              text: 'Student account has been deleted successfully.',
                              timer: 3000
                            });
                          }
                        })
                        .catch((er) => {
                          console.log(er);
                          Sweetalert2.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete student account',
                            timer: 3000
                          });
                        })
                    }
                  })
                }} />,
              }
            }))
          }
        })
        .catch((e) => {
          console.log(e);
          Sweetalert2.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch student list',
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

    const handleEditStudent = React.useCallback(async (close: () => void) => {
      console.log(formData)
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
            icon: 'success',
            title: 'Success',
            text: 'Student account has been updated successfully.',
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
          text: 'Failed to update student account',
          confirmButtonText: 'Try Again',
          showCancelButton: true,
        }).then(({ isConfirmed }: any) => {
          if (isConfirmed) {
            setTimeout(() => handleEditStudent(close), 100)
          }
        })
      }
    }, [formData]);

    return (<>
      <div className="w-full min-h-[calc(100vh-160px)] h-fit bg-[#37414e] p-4 min-w-fit">
        <h1 className="text-white text-2xl my-2">Student List</h1>
        <Table columns={columns} items={tableData}>
          {/* Additional Toolbar Button */}
          <div className="px-4">
            {/* Refresh Button */}
            <button type="button" onClick={() => fetchList()} className="hover:text-yellow-500" title="Refresh List"><span className="material-symbols-outlined">refresh</span></button>
          </div>
        </Table>
      </div>
      <Modal open={openEditStudent} header={'Edit Student Account'} content={<EditStudent formData={formData} onChange={setFormData} />} onConfirm={handleEditStudent} onCancel={onCloseModal} onClose={() => setOpenEditStudent(false)} />
    </>)
  }
});