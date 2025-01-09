import { React, pathname } from '../imports'


interface DepartmentsProps {
  [department: string]: string[]
}

export const useDepartments = () => {
  const [departments, setDepartments] = React.useState<DepartmentsProps>({})
  const allDepartments = React.useMemo(() => ({...departments}), [departments])
  const fetchDepartments = () => {
    const url = new URL(pathname('/api/departments'), window.location.origin)
    fetch(url.toString())
      .then(response => response.json())
      .then(({ success, error }) => {
        if (error) {
          throw new Error(error)
        }
        setDepartments({ ...success });
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
    departments: allDepartments,
  }), [onRefresh, allDepartments])
}