import AddThesisForm from "../admin/addthesis";
import { Table, TableRowAction } from "../admin/table";
import { Select } from "../global/input";
import Modal from "../global/modal";
import PdfViewer from "../global/pdfviewer";
import { useDepartments } from "../global/useDepartments";
import { React, Sweetalert2, pathname } from '../imports';
import { CellAlign, TableCellType } from "../types";

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


export default function ThesesPage() {
  const { departments: departmentsAndCourses, refresh } = useDepartments();
  const [openAddThesisForm, setShowAddThesisForm] = React.useState(false)
  const [pdfUrl, setPdfUrl] = React.useState<string|null>(null)
  const [pdfTitle, setPdfTitle] = React.useState("")
  const [pdfAuthor, setPdfAuthor] = React.useState("")
  const [tableData, setTableData] = React.useState([])
  const [thesisYear, setThesisYear] = React.useState("")
  const [thesisDepartment, setThesisDepartment] = React.useState("");
  const [thesisCourse, setThesisCourse] = React.useState("");
  const departmentList = React.useMemo(() => Object.keys(departmentsAndCourses).map((d) => ({ label: d, value: d })), [departmentsAndCourses])
  const courseList = React.useMemo(() => !!thesisDepartment && departmentList.length > 0 ? departmentsAndCourses[thesisDepartment].map((d: any) => ({ label: d, value: d })) : [], [thesisDepartment, departmentsAndCourses])
  const yearsList = React.useMemo(() => Array.from({ length: (new Date()).getFullYear() - 2000 }, (_, i) => (new Date()).getFullYear() - i).map((y) => ({ label: y.toString(), value: y.toString() })), [])

  const fetchList = () => {
    refresh();
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

  const handlePrint = React.useCallback(() => {
    const url = new URL(pathname('/admin/print/theses'), window.location.origin)
    url.searchParams.append('title', 'Theses Print');
    if (!!thesisDepartment) {
      url.searchParams.append('department', thesisDepartment);
    }
    if (!!thesisCourse) {
      url.searchParams.append('course', thesisCourse);
    }
    if (!!thesisYear) {
      url.searchParams.append('year', thesisYear);
    }
    window.open(url, '_blank', 'width=1000,height=1000, menubar=no, toolbar=no, scrollbars=yes, location=no, status=no');
  }, [thesisDepartment, thesisCourse, thesisYear])

  React.useEffect(() => {
    if (!pdfUrl) {
      setPdfTitle("");
      setPdfAuthor("");
    }
  }, [pdfUrl])

  React.useEffect(() => {
    fetchList();
  }, [])

  React.useEffect(() => {
    setThesisCourse("")
  }, [thesisDepartment])

  const finalData = React.useMemo(() => !!thesisDepartment
    ? tableData?.filter((td: any) => td.department?.toString() === thesisDepartment?.toString() && (!!thesisCourse ? td.course?.toString() === thesisCourse?.toString() : true) && (!!thesisYear ? td.year?.toString() === thesisYear?.toString() : true))
    : (!!thesisYear ? tableData?.filter((td: any) => td.year?.toString() === thesisYear?.toString()) : tableData)
  , [tableData, thesisDepartment, thesisCourse, thesisYear])

  return (
    <div className="w-full min-h-[calc(100vh-160px)] h-fit p-4 min-w-fit">
      <h1 className="text-2xl my-2">Thesis/Capstone List</h1>
      <Table columns={columns} items={finalData}>
        {/* Additional Toolbar Button */}
        <div className="px-4">
          <Select className="max-w-[120px] min-w-[120px] text-black" items={[{ label: "Department", value: "" }, ...departmentList]} label="Department" name="department" value={thesisDepartment} onChange={(e: any) => { setThesisDepartment(e.target.value); setThesisCourse(""); }} />
        </div>
        <div className="px-4">
          <Select className="max-w-[120px] min-w-[120px] text-black" items={[{ label: "Course", value: "" }, ...courseList]} label="Course" name="course" value={thesisCourse} onChange={(e: any) => setThesisCourse(e.target.value)} disabled={!thesisDepartment} />
        </div>
        <div className="px-4">
          <Select className="max-w-[100px] min-w-[100px] text-black" items={[{ label: "Year", value: "" }, ...yearsList]} label="Year" name="year" value={thesisYear} onChange={(e: any) => setThesisYear(e.target.value)} />
        </div>
        <div className="px-4">
          <button type="button" onClick={() => handlePrint()} className="hover:text-slate-800 text-blue-800" title="Print List"><span className="material-symbols-outlined text-blue-800 hover:text-slate-800">print</span></button>
        </div>
        <div className="px-4">
          <button type="button" onClick={() => fetchList()} className="hover:text-yellow-500" title="Refresh List"><span className="material-symbols-outlined">refresh</span></button>
        </div>
        <div className="px-4">
          <button type="button" onClick={() => setShowAddThesisForm(true)} className="hover:text-yellow-500" title="Add Thesis"><span className="material-symbols-outlined">add</span></button>
        </div>
        <AddThesisForm open={openAddThesisForm} onClose={() => setShowAddThesisForm(false)} onSuccess={() => fetchList()} className="shadow-lg w-3/4" />
      </Table>
      <Modal open={!!pdfUrl} onClose={() => setPdfUrl(null)} content={<PdfViewer src={pdfUrl} />} header={pdfTitle} showCancelButton={false} showConfirmButton={false} footer={pdfAuthor} />
    </div>
  )
}