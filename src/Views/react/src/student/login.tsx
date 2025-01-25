import { IDRegExFormat } from '../global/enums';
import { React, Sweetalert2, pathname } from '../imports';
import Scanner from "../qrscan";

export default function StudentLogin() {
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
            window.location.href = pathname(`/student/signup?student_id=${studentId}&full_name=${studentName}`);
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
    <div className="relative w-full min-h-screen flex justify-center items-start p-4">
      <button type="button" onClick={() => window.location.replace(pathname("/login"))} className="absolute top-0 left-0 ml-4 mt-4 text-sky-500 hover:text-sky-3 bg-white drop-shadow-lg pl-2 pr-3 py-1 rounded flex items-center"><span className="material-symbols-outlined">arrow_left</span> Back</button>
      <div className="bg-transparent min-w-full md:min-w-[400px] max-w-[400px]" style={{boxShadow: "none"}}>
        <div className="flex justify-center text-center w-full gap-x-4 my-8">
          <img src={pathname("/images/SMCC-logo.svg")} className="object-contain w-[120px] h-[120px]" alt="SMCC" />
          <img src={pathname("/images/smcc-research.png")} className="object-contain w-[120px] h-[120px]" alt="SMCC Research" />
        </div>
        <div className="bg-[#192F5D] text-white rounded-t text-center p-4">
          <h4 className="flex justify-center">SMCC STUDENT</h4>
        </div>
        <div className="w-full min-h-[300px]" style={{background: "#ffffff", boxShadow: "0 5px 15px rgba(0,0,0,.05)", padding: "20px 40px 15px"}}>
          <div className="w-full">
            <div className="flex flex-col">
              <Scanner className="mt-4" onResult={onResult} pause={pause || !showScanner} regExFormat={[IDRegExFormat.studentName, IDRegExFormat.studentId]} />
            </div>
            <div className="mt-8 text-center font-bold">
              Scan your Student ID QR Code
              <br />
              <button type="button" className="text-sky-500 hover:text-sky-300 hover:underline mt-2" onClick={() => setShowScanner(false)}>or Login with your Student ID</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="relative w-full min-h-screen flex justify-center items-start p-4">
      <button type="button" onClick={() => window.location.replace(pathname("/login"))} className="absolute top-0 left-0 ml-4 mt-4 text-sky-500 hover:text-sky-3 bg-white drop-shadow-lg pl-2 pr-3 py-1 rounded flex items-center"><span className="material-symbols-outlined">arrow_left</span> Back</button>
      <div className="bg-transparent min-w-full md:min-w-[400px] max-w-[400px]" style={{boxShadow: "none"}}>
        <div className="flex justify-center text-center w-full gap-x-4 my-8">
          <img src={pathname("/images/SMCC-logo.svg")} className="object-contain w-[120px] h-[120px]" alt="SMCC" />
          <img src={pathname("/images/smcc-research.png")} className="object-contain w-[120px] h-[120px]" alt="SMCC Research" />
        </div>
        <div className="bg-[#192F5D] text-white rounded-t text-center p-4">
          <h4 className="flex justify-center">SMCC STUDENT</h4>
        </div>
        <div className="w-full min-h-[300px]" style={{background: "#ffffff", boxShadow: "0 5px 15px rgba(0,0,0,.05)", padding: "20px 40px 15px"}}>
          <form onSubmit={onLogin} className="w-full">
            <div className="flex flex-col">
              <div>
                <div className="mb-4">
                  <label htmlFor="idno" className="block text-gray-700 font-medium mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="idno"
                    value={studentId || ""} onChange={(e: any) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="pwd" className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="pwd"
                    value={password} onChange={(e: any) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 mb-2">
              <button type="submit" disabled={pending} className="bg-[#192F5D] rounded-full py-2 w-full text-white">
                {pending ? <span className="animate-pulse">Loading...</span> : <>LOGIN</>}
              </button>
            </div>
            <div>
              <a href={pathname("/student/signup")} className="text-gray-700 hover:text-gray-900 hover:underline text-sm">No account? Register now</a>
            </div>
            <div className="mt-4 text-center">
              <button type="button" className="text-gray-500 hover:text-gray-700 underline mt-2" onClick={() => setShowScanner(true)}>Scan your Student ID QR Code instead</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}