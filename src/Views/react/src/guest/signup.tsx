import { React, Sweetalert2, pathname } from "../imports";

export default function GuestSignup() {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('student');
  const [school, setSchool] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [reasons, setReasons] = React.useState('');
  const [password, setPassword] = React.useState<string>("")
  const [fullName, setFullName] = React.useState<string>("")
  const [pending, setPending] = React.useState(false);

  const disableSubmit = React.useMemo(() => !fullName || !email || !password, [fullName, email, password]);

  const clearForm = React.useCallback(() => {
    setEmail('');
    setFullName('');
    setSchool('');
    setPosition('');
    setReasons('');
    setPassword('');
  }, [])

  const onSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    const bodyData = { account: 'guest', username: email, full_name: fullName, password, email,
      school: role === "student" ? school : null, position: role === "employee" ? position : null, reasons };
    fetch(pathname('/api/signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(bodyData),
    })
    .then(response => response.json())
    .then(({ error, success }) => {
      if (error) {
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: error,
          toast: true,
          showConfirmButton: false,
          position: 'center',
          timer: 3000,
        });
        console.log(error)
      } else if (success) {
        clearForm();
        Sweetalert2.fire({
          icon:'success',
          title: 'Registration Successful',
          text: 'You have been registered successfully. Please login.',
          toast: true,
          showConfirmButton: false,
          position: 'center',
          timer: 2000,
        }).then(() => {
          window.location.href = pathname('/guest/login');
        });
      }
    })
    .catch((e) => {
      Sweetalert2.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to login. Please try again.'
      });
      console.log(e)
    })
    .finally(() => {
      setPassword('')
      setPending(false)
    })
  }, [email, fullName, password, school, position, reasons]);

  return (
    <div className="relative w-full min-h-screen flex justify-center items-start">
      <button type="button" onClick={() => window.location.replace(pathname("/login"))} className="absolute top-0 left-0 ml-4 mt-4 text-sky-500 hover:text-sky-3 bg-white drop-shadow-lg pl-2 pr-3 py-1 rounded flex items-center"><span className="material-symbols-outlined">arrow_left</span> Back</button>
      <div style={{background: "transparent", boxShadow: "none", minWidth: "400px", maxWidth: "400px"}}>
        <div className="flex justify-center text-center w-full gap-x-4 my-8">
          <img src={pathname("/images/SMCC-logo.svg")} className="object-contain w-[120px] h-[120px]" alt="SMCC" />
          <img src={pathname("/images/smcc-research.png")} className="object-contain w-[120px] h-[120px]" alt="SMCC Research" />
        </div>
        <div className="bg-[#192F5D] text-white rounded-t text-center p-4">
          <h4 className="flex justify-center">GUEST LOGIN</h4>
        </div>
        <div className="w-full min-h-[300px]" style={{background: "#ffffff", boxShadow: "0 5px 15px rgba(0,0,0,.05)", padding: "20px 40px 15px"}}>
          <form onSubmit={onSubmit} className="w-full">
            <div className="flex flex-col">
              <div>
                <div className="mb-4">
                  <label htmlFor="fullname" className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    value={fullName} onChange={(e: any) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email} onChange={(e: any) => setEmail(e.target.value)}
                    placeholder={"example@gmail.com"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    value={role} onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="employee">Employee</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>
              {role === "student" && (
                <div>
                  <div className="mb-4">
                    <label htmlFor="school" className="block text-gray-700 font-medium mb-2">
                      School
                    </label>
                    <input
                      type="text"
                      id="school"
                      value={school} onChange={(e: any) => setSchool(e.target.value)}
                      placeholder={"Name of School Attended"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                      required
                    />
                  </div>
                </div>
              )}
              {role === "employee" && (
                <div>
                  <div className="mb-4">
                    <label htmlFor="position" className="block text-gray-700 font-medium mb-2">
                      Position (Employees only)
                    </label>
                    <input
                      type="text"
                      id="position"
                      value={position} onChange={(e: any) => setPosition(e.target.value)}
                      placeholder={"Position"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <div className="mb-4">
                  <label htmlFor="reasons" className="block text-gray-700 font-medium mb-2">
                    Reasons
                  </label>
                  <input
                    type="text"
                    id="reasons"
                    value={reasons} onChange={(e: any) => setReasons(e.target.value)}
                    placeholder={"Why you want to access this hub?"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 mb-2">
              <button type="submit" disabled={pending || disableSubmit} className="bg-[#192F5D] disabled:bg-gray-500 rounded-full py-2 w-full text-white">
                {pending ? <span className="animate-pulse">Loading...</span> : <>REGISTER</>}
              </button>
            </div>
            <div>
              <a href={pathname("/guest/login")} className="text-gray-700 hover:text-gray-900 hover:underline text-sm">Already have account? Login now</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}