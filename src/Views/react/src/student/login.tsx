

export default import(pathname("/jsx/imports")).then(async ({ React, Sweetalert2, getAsyncImport }) => {
  const { IDRegExFormat } = await import(pathname("/jsx/global/enums"));
  const { default: SMCCLogo } = await getAsyncImport("/jsx/global/smcclogo");
  const { default: Scanner } = await getAsyncImport("/jsx/qrscan");
  return function StudentLogin() {
    const searchParams = React.useMemo(() => new URLSearchParams(window.location.search), [window.location.search]);
    const { student_id } = React.useMemo(() => ({ student_id: searchParams.get('student_id'), full_name: searchParams.get('full_name') }), [searchParams]);
    const [showScanner, setShowScanner] = React.useState(false);
    const [pause ,setPause] = React.useState(false);
    const [studentId, setStudentId] = React.useState(student_id);
    const [password, setPassword] = React.useState('')
    const [pending, setPending] = React.useState(false)

    const onResult = React.useCallback((studentName?: string, studentId?: string) => {
      if (!!studentId) {
        setPause(true);
        fetch(pathname(`/api/student?q=exist&id=${studentId}`))
        .then(response => response.json())
        .then(({ error, exists }) => {
          if (error) {
            Sweetalert2.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to check student existence: ' + error
            })
          } else {
            if (!exists) {
              // redirect to sign up with the scanned studentId
              window.location.href = pathname(`/signup?student_id=${studentId}&full_name=${studentName}`);
            } else {
              setStudentId(studentId)
              setShowScanner(false);
            }
          }
        })
        .catch((e) => {
          Sweetalert2.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to retrieve student information:' + e.message,
            toast: true,
            showConfirmButton: false,
            position: 'top',
            timer: 3000,
          })
        })
        .finally(() => setTimeout(() => setPause(false), 1000))
      }
    }, [])

    const onLogin = React.useCallback((e: React.FormEvent) => {
      e.preventDefault()
      setPending(true)
      fetch(pathname('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ account: 'student', username: studentId, password }),
      })
      .then(response => response.json())
      .then(({ error, success }) => {
        if (error) {
          Sweetalert2.fire({
            icon: 'error',
            title: error,
            toast: true,
            showConfirmButton: false,
            position: 'top',
            timer: 3000,
          })
          console.log(error)
        } else if (success) {
          window.location.replace(pathname('/'));
        }
      })
      .catch((e) => {
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to login. Please try again.',
          toast: true,
          showConfirmButton: false,
          position: 'top',
          timer: 3000,
        })
        console.log(e)
      })
      .finally(() => {
        setPassword('')
        setPending(false)
      })
    }, [studentId, password])

    return showScanner ? (
      <div className="w-full pt-16 relative">
        <button type="button" onClick={() => window.location.replace(pathname("/"))} className="absolute top-0 left-0 ml-4 mt-4 text-sky-500 hover:text-sky-3 bg-white drop-shadow-lg pl-2 pr-3 py-1 rounded flex items-center"><span className="material-symbols-outlined">arrow_left</span> Home</button>
        <div className="p-4">
          <div className="max-w-md mx-auto flex flex-col gap-8 border border-sky-300 rounded-lg p-8 shadow-lg pt-10">
            <SMCCLogo className="w-[100px] aspect-square mx-auto" />
            <div className="text-[24px] font-[700] text-center">Student Login</div>
            <Scanner className="mt-4" onResult={onResult} pause={pause || !showScanner} regExFormat={[IDRegExFormat.studentName, IDRegExFormat.studentId]} />
          </div>
          <div className="mt-8 text-center font-bold">
            Scan your Student ID QR Code
            <br />
            <button type="button" className="text-sky-500 hover:text-sky-300 hover:underline mt-2" onClick={() => setShowScanner(false)}>or Login with your Student ID</button>
          </div>
        </div>
      </div>
    ) : (
      <div className="w-full pt-16 relative">
        <button type="button" onClick={() => window.location.replace(pathname("/"))} className="absolute top-0 left-0 ml-4 mt-4 text-sky-500 hover:text-sky-3 bg-white drop-shadow-lg pl-2 pr-3 py-1 rounded flex items-center"><span className="material-symbols-outlined">arrow_left</span> Home</button>
        <div className="p-4">
          <form onSubmit={onLogin} className="max-w-md mx-auto flex flex-col gap-8 border border-sky-300 rounded-lg p-8 shadow-lg pt-10">
            <SMCCLogo className="w-[100px] aspect-square mx-auto" />
            <h5 className="text-[24px] font-[700] text-center text-blue-600">
                    Web-based Research Hub for SMCC
              </h5>
            <div className="text-[24px] font-[700] text-center">Student Login</div>
            <div className="flex justify-center px-4">
              <input type="text" className="p-4 w-full border-2 border-gray-300 rounded-lg" placeholder="Student ID" value={studentId} onChange={(e: any) => setStudentId(e.target.value)} />
            </div>
            <div className="flex justify-center px-4">
              <input type="password" className="p-4 w-full border-2 border-gray-300 rounded-lg" placeholder="Password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
            </div>
            <div className="flex justify-center px-4">
              <button type="submit" disabled={pending} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 text-[22px] w-full disabled:bg-gray-300">
                {pending ? <span className="animate-pulse">Loading...</span> : <>Login</>}
              </button>
            </div>
            <div>
              <a href={pathname("/signup")} className="text-sky-500 hover:text-sky-300 hover:underline pl-4">No Account? Register Now!</a>
            </div>
          </form>
          <div className="mt-8 text-center font-bold">
            Login with your Student ID
            <br />
            <button type="button" className="text-sky-500 hover:text-sky-300 hover:underline mt-2" onClick={() => setShowScanner(true)}>or Scan your Student ID QR Code</button>
          </div>
        </div>
      </div>
    )
  }
})