
import { useDepartments } from "../global/useDepartments";
import { React, Sweetalert2, pathname } from '../imports';
import { CellAlign, DepartmentCourses, TableCellType, TableColumn } from '../types';
import { Table, TableRowAction } from "./table";

const departmentColumns: TableColumn[] = [
  { label: "Department Name", key: "department_name", sortable: true, filterable: true, cellType: TableCellType.String, align: CellAlign.Center },
  { label: "Action", key: "action", sortable: false, cellType: TableCellType.Custom, align: CellAlign.Center },
];

const coursesColumns: TableColumn[] = [
  { label: "Course Name", key: "course_name", sortable: true, filterable: true, cellType: TableCellType.String, align: CellAlign.Center },
  { label: "Action", key: "action", sortable: false, cellType: TableCellType.Custom, align: CellAlign.Center },
];

export default function ManageDepartmentsPage() {
  const { departments, refresh } = useDepartments();
  console.log("departments", departments);
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>("")

  const handleViewDepartment = (department: string) => {
    setSelectedDepartment(department)
  }

  const handleEditDepartment = (department: string) => {
    Sweetalert2.fire({
      title: 'Edit Department:',
      inputLabel: department,
      input: 'text',
      inputAttributes: {
        placeholder: 'Enter Department Name'
      },
      inputValue: department,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm(name: string) {
        if (!name) {
          Sweetalert2.fire('Error', 'Department name is required', 'error')
          return false
        }
        return new Promise((resolve, reject) => {
          const url = new URL(pathname('/api/departments/edit'), window.location.origin);
          const formData = new FormData();
          formData.append('old_department', department);
          formData.append('new_department', name);
          fetch(url, {
            method: 'POST',
            body: formData,
          })
          .then((response: any) => response.json())
          .then(({ success, error }) => {
            if (error) {
              throw new Error(error)
            }
            resolve(success)
          }).catch((err) => reject(err))
        })
          .then((success) => success)
          .catch((err) => {
            Sweetalert2.showValidationMessage("Failed to Edit Department");
          })
      }
    })
    .then(({ isConfirmed, value }) => {
      if (isConfirmed) {
        if (!!value) {
          Sweetalert2.fire({
            icon:'success',
            title: 'Department Edited Successfully',
            timer: 3000,
            toast: true,
            position: 'center'
          })
          refresh();
        }
      }
    })
  }

  const handleDeleteDepartment = (department: string) => {
    Sweetalert2.fire({
      title: 'Delete Department?',
      text: `Are you sure you want to delete department '${department}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = new URL(pathname('/api/departments/delete'), window.location.origin);
        url.searchParams.append('department', department)
        fetch(url, {
          method: 'DELETE',
        })
        .then((response: any) => response.json())
        .then(({ success, error }) => {
          if (error) {
            throw new Error(error)
          }
          Sweetalert2.fire({
            icon:'success',
            title: 'Department Deleted Successfully',
            timer: 3000,
            toast: true,
            position: 'center'
          })
          refresh();
        }).catch((err) => {
          Sweetalert2.fire({
            icon: 'error',
            title: 'Failed to Delete Department',
            text: err.message,
            timer: 3000,
            toast: true,
            position: 'center'
          })
        })
      }
    })
  }

  const departmentTabledData = React.useMemo(() => {
    return !departments ? [] : Object.keys(departments).filter((dept?: string) => !!dept).map((department: string) => ({
      department_name: department,
      action: <TableRowAction id={department} disabledEdit={!!DepartmentCourses[department]} disabledDelete={!!DepartmentCourses[department]} onView={() => handleViewDepartment(department)} onEdit={() => handleEditDepartment(department)} onDelete={() => handleDeleteDepartment(department)} />,
    }))
  }, [departments])

  const handleDeleteCourse = (department: string, course: string) => {
    Sweetalert2.fire({
      title: 'Delete Course?',
      text: `Are you sure you want to delete course '${course}' from department '${selectedDepartment}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = new URL(pathname('/api/departments/courses/edit'), window.location.origin);
        const formData = new FormData();
        formData.append('department', selectedDepartment);
        const payload = departments[selectedDepartment].filter((c: string) => c !== course);
        payload.forEach((c: string) => {
          formData.append('courses[]', c);
        });
        fetch(url, {
          method: 'POST',
          body: formData,
        })
        .then((response: any) => response.json())
        .then(({ success, error }) => {
          if (error) {
            throw new Error(error)
          }
          Sweetalert2.fire({
            icon:'success',
            title: 'Course Deleted Successfully',
            timer: 3000,
            toast: true,
            position: 'center'
          })
          refresh();
        })
        .catch(console.log)
      }
    })
  }
  const coursesColumnData = React.useMemo(() => {
    if (!!selectedDepartment) {
      return departments[selectedDepartment].filter((course: any) => !!course).map((course: any) => ({
        course_name: course,
        action: <TableRowAction id={course} disabledDelete={DepartmentCourses[selectedDepartment]?.includes(course)} onDelete={(c: any) => handleDeleteCourse(selectedDepartment, c)} />,
      }))
    }
    return [];
  }, [selectedDepartment, departments])
  const handleAddDepartment = () => {
    Sweetalert2.fire({
      title: 'Add Department:',
      inputLabel: 'Add Department:',
      input: 'text',
      inputAttributes: {
        placeholder: 'Enter Department Name'
      },
      inputValue: '',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm(name: string) {
        if (!name) {
          Sweetalert2.fire('Error', 'Department name is required', 'error')
          return false
        }
        if (Object.keys(DepartmentCourses).includes(name)) {
          Sweetalert2.fire('Error', 'Department already exists', 'error')
          return false
        }
        return new Promise((resolve, reject) => {
          const url = new URL(pathname('/api/departments/add'), window.location.origin);
          const formData = new FormData();
          formData.append('department', name);
          fetch(url, {
            method: 'POST',
            body: formData,
          })
          .then((response: any) => response.json())
          .then(({ success, error }) => {
            if (error) {
              throw new Error(error)
            }
            resolve(success)
          }).catch((err) => reject(err))
        })
          .then((success) => success)
          .catch((err) => {
            Sweetalert2.showValidationMessage("Failed to Add Department");
          })
      }
    })
      .then(({ isConfirmed, value }) => {
        if (isConfirmed) {
          if (!!value) {
            Sweetalert2.fire({
              icon:'success',
              title: 'Department Added Successfully',
              timer: 3000,
              toast: true,
              position: 'center'
            })
            refresh();
          }
        }
      })
  }

  const handleAddCourse = React.useCallback(() => {
    if (!!selectedDepartment) {
      Sweetalert2.fire({
        title: selectedDepartment,
        inputLabel: 'Add Course:',
        input: 'text',
        inputAttributes: {
          placeholder: 'Enter Course Name'
        },
        inputValue: '',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm(name: string) {
          if (!name) {
            Sweetalert2.fire('Error', 'Course name is required', 'error')
            return false
          }
          return new Promise((resolve, reject) => {
            const url = new URL(pathname('/api/departments/courses/add'), window.location.origin);
            const formData = new FormData();
            formData.append('department', selectedDepartment);
            formData.append('course', name);
            fetch(url, {
              method: 'POST',
              body: formData,
            })
              .then((response: any) => response.json())
              .then(({ success, error }) => {
                if (error) {
                  throw new Error(error)
                }
                resolve(success)
              }).catch((err) => reject(err))
          })
            .then((success) => success)
            .catch((err) => {
              Sweetalert2.showValidationMessage("Failed to Add Course");
            })
        }
      }).then(({ isConfirmed, value}) => {
        if (isConfirmed) {
          if (!!value) {
            Sweetalert2.fire({
              icon:'success',
              title: 'Course Added Successfully',
              timer: 3000,
              toast: true,
              position: 'center'
            })
            refresh();
          }
        }
      })
    }
  }, [selectedDepartment]);

  return (<>
    <div className="w-full min-h-[calc(100vh-160px)] h-fit bg-[#37414e] p-4 min-w-fit">
      <h1 className="text-white text-2xl my-2">Departments and Courses</h1>
      <div className="grid gap-y-8 lg:grid-cols-2 items-start gap-x-2 p-4">
        <div>
          <h2 className="text-white text-xl my-2">Departments</h2>
          <div className="block relative h-fit">
            <Table columns={departmentColumns} items={departmentTabledData}>
              {/* Additional Toolbar Button */}
              <div className="px-4">
                {/* Refresh Button */}
                <button type="button" onClick={() => refresh()} className="hover:text-yellow-500" title="Refresh List"><span className="material-symbols-outlined">refresh</span></button>
              </div>
              <div className="px-4">
                {/* Add Department Button */}
                <button type="button" onClick={() => handleAddDepartment()} className="hover:text-yellow-500" title="Add Department"><span className="material-symbols-outlined">add</span></button>
              </div>
            </Table>
          </div>
        </div>
        <div>
          <h2 className="text-white text-xl my-2">{selectedDepartment || "Courses"}</h2>
          <div className="block relative h-fit">
            <Table columns={coursesColumns} items={coursesColumnData}>
              <div className="px-4">
                {/* Add Course Button */}
                <button type="button" onClick={() => handleAddCourse()} className="hover:text-yellow-500" title="Add Department"><span className="material-symbols-outlined">add</span></button>
              </div>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </>)
}