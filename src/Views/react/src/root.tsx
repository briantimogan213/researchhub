import useBackgroundImage from './global/backgroundimage';
import linkTo from './global/linkto';
import { React, pathname } from './imports';

export default function RootPage(): React.ReactNode {
  useBackgroundImage()
  return (<>
    <div className="w-full min-h-screen relative flex flex-col lg:flex-row justify-center lg:justify-between items-center p-4">
      <div className="hidden lg:flex lg:justify-center lg:items-center lg:w-1/3">
        <img src={pathname("/images/SMCC-logo.svg")} className="object-contain w-[230px] h-[230px]" alt="SMCC" />
      </div>
      <div className="lg:hidden flex gap-x-4 justify-center mb-4">
        <div>
          <img src={pathname("/images/SMCC-logo.svg")} className="object-contain w-[150px] h-[150px]" alt="SMCC" />
        </div>
        <div>
          <img src={pathname("/images/smcc-research.png")} className="object-contain w-[150px] h-[150px]" alt="SMCC Research" />
        </div>
      </div>
      <div className="w-full md:w-[400px] h-[420px] max-w-[400px] max-h-[420px] font-[Poppins] flex flex-col shadow">
        <div className="h-[50px] bg-[#192F5D] text-white text-center flex items-center justify-center w-full rounded-t">
          SMCC WEB BASED RESEARCH HUB
        </div>
        <div className="grid grid-cols-1 items-center justify-center gap-y-10 py-10 px-16 bg-white w-full h-full flex-grow rounded-b">
          <button type="button" className="bg-[#192F5D] text-white h-full w-full rounded" onClick={() => linkTo("/guest/login")}>GUEST</button>
          <button type="button" className="bg-[#192F5D] text-white h-full w-full rounded" onClick={() => linkTo("/student/login")}>STUDENT</button>
          <button type="button" className="bg-[#192F5D] text-white h-full w-full rounded" onClick={() => linkTo("/teacher/login")}>TEACHER</button>
          <button type="button" className="bg-[#192F5D] text-white h-full w-full rounded" onClick={() => linkTo("/admin/login")}>ADMIN</button>
        </div>
      </div>
      <div className="hidden lg:flex lg:justify-center lg:items-center lg:w-1/3">
        <img src={pathname("/images/smcc-research.png")} className="object-contain w-[230px] h-[230px]" alt="SMCC Research" />
      </div>
    </div>
  </>)
}