import { React, Sweetalert2, pathname } from '../imports';

export default function AdminLogin() {

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('')
  const [pending, setPending] = React.useState(false)

  const onLogin = React.useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    fetch(pathname('/api/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ account: 'admin', username, password }),
    })
      .then(response => response.json())
      .then(({ error, success }) => {
        if (error) {
          Sweetalert2.fire({
            icon: 'error',
            title: error,
            toast: true,
            showConfirmButton: false,
            position: 'center',
            timer: 3000,
          })
          console.log(error)
        } else if (success) {
          window.location.replace(pathname('/admin/dashboard'));
        }
      })
      .catch((e) => {
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to login. Please try again.',
          toast: true,
          showConfirmButton: false,
          position: 'center',
          timer: 3000,
        })
        console.log(e)
      })
      .finally(() => {
        setPassword('')
        setPending(false)
      })
  }, [username, password])

  return (
    <div className="relative w-full min-h-screen flex justify-center items-start">
      <button type="button" onClick={() => window.location.replace(pathname("/login"))} className="absolute top-0 left-0 ml-4 mt-4 text-sky-500 hover:text-sky-3 bg-white drop-shadow-lg pl-2 pr-3 py-1 rounded flex items-center"><span className="material-symbols-outlined">arrow_left</span> Back</button>
      <div style={{background: "transparent", boxShadow: "none", minWidth: "400px", maxWidth: "400px"}}>
        <div className="flex justify-center text-center w-full gap-x-4 my-8">
          <img src={pathname("/images/SMCC-logo.svg")} className="object-contain w-[120px] h-[120px]" alt="SMCC" />
          <img src={pathname("/images/smcc-research.png")} className="object-contain w-[120px] h-[120px]" alt="SMCC Research" />
        </div>
        <div className="bg-[#192F5D] text-white rounded-t text-center p-4">
          <h4 className="flex justify-center">ADMIN LOGIN</h4>
        </div>
        <div className="w-full min-h-[300px]" style={{background: "#ffffff", boxShadow: "0 5px 15px rgba(0,0,0,.05)", padding: "20px 40px 15px"}}>
          <form onSubmit={onLogin} className="w-full">
            <div className="flex flex-col">
              <div>
                <div className="mb-4">
                  <label htmlFor="idno" className="block text-gray-700 font-medium mb-2">
                    Admin ID
                  </label>
                  <input
                    type="text"
                    id="idno"
                    value={username} onChange={(e: any) => setUsername(e.target.value)}
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
          </form>
        </div>
      </div>
    </div>
  )
}