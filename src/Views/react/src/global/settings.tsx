export default import(pathname("/jsx/imports")).then(async ({ React, Sweetalert2, getAsyncImport }) => {
  const { Courses, Departments, Year } = await import(pathname("/jsx/types"));
  const { default: { MainContext } } = await getAsyncImport("/jsx/context");
  const { default: { Input, Select } } = await getAsyncImport('/jsx/global/input');

  function EditAdmin({
    formData,
    onChange,
  }:
  {
    formData: any,
    onChange: (data: any) => void
  }) {
    return (
      <div className="p-8 min-w-96">
        <Input disabled label="Username" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_admin_user" placeholder="Username" value={formData.username} />
        <Input label="Full Name" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_full_name" placeholder="Full Name" value={formData.full_name} onChange={(e: any) => onChange({...formData, full_name: e.target.value })} required />
        <Input type="email" label="Email Address" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_email" placeholder="Email Address" value={formData.email} onChange={(e: any) => onChange({...formData, email: e.target.value })} required />
        <Input type="password" label="Password" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_password" placeholder="Password (Leave blank if not change)" value={formData.password} onChange={(e: any) => onChange({...formData, password: e.target.value })} />
      </div>
    )
  }

  function EditStudent({
    formData,
    onChange,
  }:
  {
    formData: any,
    onChange: (data: any) => void
  }) {
    return (
      <div className="p-8 min-w-96">
        <Input disabled label="Student ID" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_student_id" placeholder="Student ID" value={formData.username} />
        <Input disabled label="Full Name" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_full_name" placeholder="Full Name" value={formData.full_name} />
        <Input type="email" label="Email Address" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_email" placeholder="Email Address" value={formData.email} onChange={(e: any) => onChange({...formData, email: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Departments).map(([key, value]) => ({ label: value, value }))} label="Department" name="edit_department" placeholder="Department" value={formData.department} onChange={(e: any) => onChange({...formData, department: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Courses).map(([key, value]) => ({ label: value, value }))} label="Course" name="edit_course" placeholder="Course" value={formData.course} onChange={(e: any) => onChange({...formData, course: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Year).map(([key, value]) => ({ label: value, value }))} label="Year" name="edit_year" placeholder="Year" value={formData.year} onChange={(e: any) => onChange({...formData, year: e.target.value })} required />
        <Input type="password" label="Password" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_password" placeholder="Password (Leave blank if not change)" value={formData.password} onChange={(e: any) => onChange({...formData, password: e.target.value })} />
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
      <div className="p-8 min-w-96">
        <Input disabled label="Employee ID" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_personnel_id" placeholder="Employee ID" value={formData.username} />
        <Input label="Full Name" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_full_name" placeholder="Full Name" value={formData.full_name} onChange={(e: any) => onChange({...formData, full_name: e.target.value })} required />
        <Input type="email" label="Email Address" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_email" placeholder="Email Address" value={formData.email} onChange={(e: any) => onChange({...formData, email: e.target.value })} required />
        <Select labelColor="black" items={Object.entries(Departments).map(([key, value]) => ({ label: value, value }))} label="Department" name="edit_department" placeholder="Department" value={formData.department} onChange={(e: any) => onChange({...formData, department: e.target.value })} required />
        <Input type="password" label="Password" inputClassName="border-black"  className="mb-2" labelColor="black" name="edit_password" placeholder="Password (Leave blank if not change)" value={formData.password} onChange={(e: any) => onChange({...formData, password: e.target.value })} />
      </div>
    )
  }

  return function AccountSettings() {
    const { authenticated, authData } = React.useContext(MainContext)
    if (!authenticated || !authData) {
      window.location.replace(pathname('/'))
      return null
    }

    const account = React.useMemo(() => authenticated ? authData.account : null, [authenticated, authData])

    console.log(authenticated, authData, account)

    const [formData, setFormData] = React.useState({
      username: account === 'admin' ? authData?.admin_user || '' : account === 'student' ? authData?.student_id || '' : account === 'personnel' ? authData?.personnel_id || '' : '',
      full_name: authData?.full_name || '',
      email: authData?.email || '',
      password: '',
      department: authData?.department || '',
      course: authData?.course || '',
      year: authData?.year || '',
    })

    const handleSubmit = React.useCallback(async (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        const response = await fetch(pathname('/api/update'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, username: undefined, account, }),
        })
        const data = await response.json()

        if (data.success) {
          close()
          Sweetalert2.fire({
            icon:'success',
            title: 'Success',
            text: 'Updated successfully.',
            timer: 2000
          })
          setTimeout(() => window.location.reload(), 1000)
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
            setTimeout(() => handleSubmit(e), 100)
          }
        })
      }
    }, [formData, account])

    return (
      <div className="min-h-[calc(100vh-200px)] py-4 px-4 lg:px-8">
        <h1 className="text-2xl font-bold mt-8 mb-4">Account Settings</h1>
        <form className="border-t" onSubmit={handleSubmit}>
          <div className="flex max-w-full overflow-auto">
            { account === 'admin' && <EditAdmin formData={formData} onChange={setFormData} />}
            { account === 'personnel' && <EditTeacher formData={formData} onChange={setFormData} />}
            { account === 'student' && <EditStudent formData={formData} onChange={setFormData} />}
          </div>
          <div className="ml-8">
            <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={() => window.history.back()}>Cancel</button>
            <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Save</button>
          </div>
        </form>
      </div>
    )
  }
});