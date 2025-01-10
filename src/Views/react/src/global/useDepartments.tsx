import { React, pathname } from '../imports'
import { DepartmentCourses } from '../types'


interface DepartmentsProps {
  [department: string]: string[]
}

export const useDepartments = () => {
  const [departments, setDepartments] = React.useState<DepartmentsProps>({})
  const allDepartments = React.useMemo(() => Object.keys(departments).length > 0 ? ({...departments}) : ({...DepartmentCourses}), [departments]);
  const fetchDepartments = () => {
    const url = new URL(pathname('/api/departments'), window.location.origin)
    console.log(url)
    fetch(url.toString())
      .then(response => response.json())
      .then(({ success, error }) => {
        if (error) {
          throw new Error(error)
        }
        setDepartments({ ...DepartmentCourses, ...success });
      })
      .catch(console.log)
  }
  React.useEffect(() => {
    fetchDepartments()
  }, [])

  const onRefresh = () => {
    fetchDepartments()
  }
  return React.useMemo(() => ({
    refresh: onRefresh,
    departments: allDepartments
  }), [onRefresh, allDepartments])
}