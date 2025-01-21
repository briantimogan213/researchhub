

import { React, Sweetalert2, pathname } from '../imports';
export default function DashboardPage() {
  const [statistics, setStatistics] = React.useState({
    theses: 0,
    journals: 0,
    publishedTheses: 0,
    publishedJournals: 0,
    students: 0,
    teachers: 0,
    guests: 0,
    weeklyThesisReads: 0,
    weeklyJournalReads: 0,
    monthlyThesisReads: 0,
    monthlyJournalReads: 0,
    yearlyThesisReads: 0,
    yearlyJournalReads: 0,
  });

  const fetchData = React.useCallback(() => {
    fetch(pathname('/api/dashboard/statistics'))
      .then(response => response.json())
      .then(({ error, success }) => {
        if (error) {
          console.log(error);
          Sweetalert2.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch dashboard statistics: ' + error,
            toast: true,
            showConfirmButton: false,
            position: 'center',
            timer: 3000,
          })
        } else {
          setStatistics(success);
        }
      })
      .catch(error => {
        console.log(error);
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch dashboard statistics: ' + error,
          toast: true,
          showConfirmButton: false,
          position: 'center',
          timer: 3000,
        })
      })
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="w-full min-h-[calc(100vh-160px)] h-fit p-4 text-black min-w-fit">
      <div className="w-full pb-8 pt-4 px-6 divide-y divide-gray-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  justify-evenly gap-2 min-w-[120px]">
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.theses}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Thesis</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.journals}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Journals</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.publishedTheses}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Publicly Viewed Thesis</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.publishedJournals}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Publicly Viewed Journals</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.students}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Students Registered</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.guests}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Guests Registered</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.weeklyThesisReads}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Weekly Thesis Reads</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.weeklyJournalReads}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Weekly Journal Reads</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.monthlyThesisReads}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Monthly Thesis Reads</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.monthlyJournalReads}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Monthly Journal Reads</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.yearlyThesisReads}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Yearly Thesis Reads</p>
            </div>
          </div>
          <div className="h-[120px] px-8 py-6 border-[#1764E8] bg-white w-full divide-y rounded shadow shadow-[#1764E8]/50">
            <div className="flex flex-nowrap justify-between pb-2 items-center">
              <p className="font-[600] text-[20px]">{statistics.yearlyJournalReads}</p>
              <span className="material-symbols-outlined">list</span>
            </div>
            <div className="flex flex-nowrap justify-between pt-2">
              <p className="font-[400] text-[14px] pt-3">Yearly Journal Reads</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 px-4">
          {/* More Widgets for Dashboard here */}
        </div>
      </div>
    </div>
  )
}