import { MainContext } from "../context";
import Modal from "../global/modal";
import PdfViewer from "../global/pdfviewer";
import { useDepartments } from '../global/useDepartments';
import { React, Sweetalert2, clsx, pathname } from '../imports';
import SearchHeaderInput from "../main/search";

enum ViewLayout {
  GRID = "grid",
  LIST = "list",
}

function ThumbnailThesis({
  id,
  viewLayout,
  title,
  adviser,
  abstract,
  author,
  course,
  year,
  favorite,
  url,
  totalViews = 0,
  onViewPdf,
  onRefresh,
}: {
  id: string|number;
  viewLayout: ViewLayout;
  title: string;
  adviser: string;
  abstract: string;
  author: string;
  course: string;
  year: number;
  favorite: boolean;
  url: string;
  totalViews?: number;
  onViewPdf?: (uri: string, title: string, author: string) => void;
  onRefresh?: () => void,
}) {
  const { authenticated, authData } = React.useContext(MainContext)

  const handleFavoriteClick = React.useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const url = new URL(pathname('/api/thesis/markfavorite'), window.location.origin);
    const body = JSON.stringify({ id, [authData?.account]: authData?.id })
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      },
      body,
    })
      .then(response => response.json())
      .then(({ success, error }) => {
        if (error) {
          Sweetalert2.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to mark thesis as favorite: '+ error,
            toast: true,
            showConfirmButton: false,
            position: 'center',
            timer: 3000,
          })
        } else if (!success) {
          Sweetalert2.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to mark thesis as favorite',
            toast: true,
            showConfirmButton: false,
            position: 'center',
            timer: 3000,
          })
        } else {
          onRefresh && onRefresh()
        }
      })
      .catch(console.log)
  }, [id, authData])

  const handleView = React.useCallback(() => {
    const uri = new URL(pathname(`/read${url}&id=${id}`), window.location.origin).toString()
    console.log("URL:", uri.toString())
    onViewPdf && onViewPdf(uri, title, author + ' (' + year + ')')
  }, [url, onViewPdf, id])

  if (viewLayout === ViewLayout.GRID) {
    return (<>
      <div onClick={handleView} className="text-center relative cursor-pointer border rounded-lg p-4 w-[400px]">
        {authenticated && authData?.account !== 'admin' && (
          <button type="button" onClick={handleFavoriteClick} className="absolute right-2 top-3 z-20 hover:text-yellow-500">
            {favorite && <span className="material-symbols-outlined text-green-700">bookmark_star</span>}
            {!favorite && <span className="material-symbols-outlined">bookmark</span>}
          </button>
        )}
        <div className="h-[75px] pt-4 px-4 font-bold leading-tight">
          {title}
        </div>
        <div className="h-[150px] mb-2 text-justify px-4 leading-tight indent-8">
          {abstract.substring(0, Math.min(320, abstract.length))}...
        </div>
        <div className="pt-4 px-2 leading-tight text-gray-700 italic">
          {author} ({year})
        </div>
        <div className="pt-4 px-2 leading-tight text-gray-700 italic">
          Adviser: {adviser}
        </div>
        <div className="pb-2 px-2 text-sm italic leading-tight text-gray-600">
          {course}
        </div>
        <div className="pb-2 px-2 text-sm italic leading-tight text-gray-600 text-right">
          <div className="material-symbols-outlined aspect-square text-sm mr-1 font-bold">visibility</div>
          <div className="inline pb-1 font-[500]">{totalViews}</div>
        </div>
      </div>
    </>)
  } else {
    // list view
    return (<>
      <div onClick={handleView} className="px-4 lg:px-8 py-2 cursor-pointer flex justify-between items-center gap-x-4 w-full bg-gray-200 hover:bg-gray-50 rounded flex-nowrap">
        <div className="flex-grow px-4 font-bold leading-tight">
          {title}
        </div>
        <div className="flex-shrink px-2 text-sm italic text-gray-600 text-right flex flex-nowrap items-center h-full gap-x-1">
          <div className="material-symbols-outlined aspect-square text-sm mr-1 font-bold">visibility</div>
          <div className="pb-1 font-[500]">{totalViews}</div>
        </div>
        <div className="flex-shrink">
          {authenticated && authData?.account !== 'admin' && (
            <button type="button" onClick={handleFavoriteClick} className="hover:text-yellow-500">
              {favorite && <span className="material-symbols-outlined text-green-700">bookmark_star</span>}
              {!favorite && <span className="material-symbols-outlined">bookmark</span>}
            </button>
          )}
        </div>
      </div>
    </>)
  }
}

export default function Thesis() {
  const { departments } = useDepartments();
  const departmentCourses = React.useMemo(() => ["All Departments", ...Object.keys(departments)], [departments]);
  const { authenticated, authData } = React.useContext(MainContext)
  const [search, setSearch] = React.useState((new URLSearchParams((new URL(window.location.href)).search)).get('search') || '')
  const searchParams = React.useMemo(() => new URLSearchParams((new URL(window.location.href)).search), []);
  const onSearch = React.useCallback((s: string) => {
    setSearch(s)
    searchParams.set('search', s)
    window.history.pushState({}, '', `?${searchParams.toString()}`)
  }, [])
  React.useEffect(() => {

    const preventRightClick = (e: any) => {
      e.preventDefault();
      alert("Right-click is disabled!");
    };
    document.addEventListener("contextmenu", preventRightClick);

    return () => {

      document.removeEventListener("contextmenu", preventRightClick);
    };
  }, []);

  const [data, setData] = React.useState([])
  const [viewLayout, setViewLayout] = React.useState(ViewLayout.GRID) // "grid" | "list" (ViewLayout)

  const yearsList = React.useMemo(() => {
    const allYears = data?.map((v: any) => Number.parseInt(v.year)) || [];
    if (!allYears.includes((new Date()).getFullYear())) {
      allYears.push((new Date()).getFullYear());
    }
    const minYear = Math.min(...allYears);
    const maxYear = Math.max(...allYears);
    return ["All", ...Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).reverse()];
  }, [data]);

  const [selectedDepartment, setSelectedDepartment] = React.useState<any>("All Departments");
  const [selectedYears, setSelectedYears] = React.useState(() => Object.fromEntries([...departmentCourses.map((dep: string) => [dep, "All"])]));

  const displayData = React.useMemo(() => data.filter(
    (item: any) => (selectedDepartment === "All Departments" || item.department?.toString().toLowerCase() === selectedDepartment.toString().toLowerCase())
      && ((!search || item.title.toLowerCase().includes(search)) || item.abstract.toLowerCase().includes(search) || item.author.toLowerCase().includes(search) || item.year.toString().includes(search))
      && (!!selectedYears[item.department?.toString()] && (selectedYears[item.department?.toString()].toString() === "All" || selectedYears[item.department?.toString()].toString() === item.year?.toString()))
    )
  , [data, selectedDepartment, selectedYears, search])

  const [page, setPage] = React.useState(1)
  const totalPages = React.useMemo(() => Math.ceil(displayData.length / 20), [displayData])
  const finalDisplay = React.useMemo(() => displayData.length === 0 ? undefined : displayData?.slice((page - 1) * 20, page * 20), [page, displayData, totalPages])

  const nextPage = React.useCallback(() => setPage((prev: number) => Math.min(totalPages, Math.max(totalPages === 0 ? 0 : 1, prev + 1))), [totalPages])
  const prevPage = React.useCallback(() => setPage((prev: number) => Math.min(totalPages, Math.max(totalPages === 0 ? 0 : 1, prev - 1))), [totalPages])

  const fetchData = async () => {
    const url = new URL(pathname('/api/thesis/public/all'), window.location.origin);
    url.searchParams.set(authData?.account, authData?.id);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { success, error } = await response.json();
      if (error) {
        throw new Error(`HTTP error: ${error.message}`);
      } else if (success) {
        success.sort((a: any, b: any) => (new Date(a.created_at)).getTime() > (new Date(b.created_at)).getTime() ? -1 : (new Date(a.created_at)).getTime() == (new Date(b.created_at)).getTime() ? 0 : 1);
        setData(success);
      }
    } catch (e) {
      console.log(e)
    }
  }

  React.useEffect(() => {
    fetchData().catch()
  }, [])


  const [pdfUrl, setPdfUrl] = React.useState<string|null>(null)
  const [pdfTitle, setPdfTitle] = React.useState<string|null>(null)
  const [pdfAuthor, setPdfAuthor] = React.useState<string|null>(null)

  const handleViewPdf = React.useCallback((uri: string, title: string, author: string) => {
    setPdfTitle(title);
    setPdfUrl(uri);
    setPdfAuthor(author);
  }, []);

  const [showAllCategories, setShowAllCategories] = React.useState<boolean>(false)

  return (<>
    <div className="flex flex-col-reverse lg:flex-row py-4 px-3 lg:px-8 mt-4">
      <div className="flex-grow lg:mt-3 max-w-full">
        <div className="relative">
          <h1 className="text-2xl font-bold text-center">Thesis/Capstone</h1>
          <button type="button" onClick={() => setViewLayout(viewLayout === ViewLayout.LIST ? ViewLayout.GRID : ViewLayout.LIST)} title="Switch View Layout" className="absolute right-0 top-0 lg:right-2 lg:top-1/4 aspect-square text-slate-600/90 hover:text-slate-800/90 hover:bg-black/10 rounded p-1"><span className="material-symbols-outlined">{viewLayout === ViewLayout.LIST ? "view_list" : "grid_view"}</span></button>
        </div>
        <div className="flex flex-wrap p-4 gap-4">
          { !!selectedDepartment && finalDisplay?.map((item: any) => (
            <ThumbnailThesis
              key={item.id}
              viewLayout={viewLayout}
              id={item.id}
              title={item.title}
              adviser={item.adviser}
              abstract={item.abstract}
              author={item.author}
              course={item.course}
              year={item.year}
              favorite={item.favorite}
              url={item.url}
              totalViews={item.totalViews}
              onViewPdf={handleViewPdf}
              onRefresh={fetchData}
            />
          )) || (
            <div className="lg:col-span-2 xl:col-span-3 mx-auto">
              <div className="h-[200px] mb-2">
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <div className="text-gray-500">No thesis found.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={clsx("min-w-full lg:min-w-[326px] lg:max-w-[326px] flex flex-col", showAllCategories ? "h-[600px] max-h-[600px]" : "lg:h-[600px] lg:max-h-[600px] h-[140px] max-h-[140px] overflow-hidden mb-2 lg:overflow-visible lg:mb-0")}>
        <div className="flex-shrink text-slate-700 font-[600] w-full mb-3">
          <SearchHeaderInput search={search} onSearch={onSearch} />
        </div>
        <div className="text-slate-700 font-[600] max-w-full overflow-x-auto overflow-y-hidden">
          <div className="flex">
            {Array.from({ length: totalPages }).map((_, i: number) => (
              <button
                key={i}
                type="button"
                className={clsx(`flex items-center px-4 py-2 text-left`, page === i + 1 ? "bg-gray-200 font-bold" : "hover:bg-gray-300")}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-shrink text-slate-700 font-[600] mx-auto">
          <button type="button" className="p-1 hover:text-yellow-700" onClick={() => setPage(totalPages === 0 ? 0 : 1)}>{"<<"}</button>
          <button type="button" className="p-1 hover:text-yellow-700" onClick={prevPage}>{"<"} Prev</button>
          <button type="button" className="p-1 hover:text-yellow-700" onClick={nextPage}>Next {">"}</button>
          <button type="button" className="p-1 hover:text-yellow-700" onClick={() => setPage(totalPages)}>{">>"}</button>
        </div>
        <div className="flex-grow pt-2 border-t min-h-[400px]">
          <button type="button" onClick={() => setShowAllCategories(!showAllCategories)} className="lg:cursor-default hover:bg-gray-400 font-bold text-xl mb-4 w-full bg-gray-100 lg:bg-transparent lg:hover:bg-transparent rounded text-center lg:text-start px-2 py-1">
            <span>Categories</span>{' '}{showAllCategories ? <span className="material-symbols-outlined lg:hidden">arrow_drop_down</span> : <span className="material-symbols-outlined lg:hidden">arrow_right</span>}
          </button>
          {departmentCourses.length === 0 && (
            <div>
              Loading...
            </div>
          )}
          {departmentCourses.map((value: string) => (
            <div key={value + "dept"} className="flex items-center px-4 py-2 text-left flex-nowrap relative">
              <button
                key={value + "button"}
                type="button"
                className={clsx(`flex items-center pl-4 py-2 pr-[70px] text-left text-sm flex-nowrap flex-grow`, selectedDepartment === value ? "font-bold" : "")}
                onClick={() => setSelectedDepartment(value)}
              >
                {value}
              </button>
              <select className="max-w-16 p-1 text-sm absolute right-4 top-1/4" value={selectedYears[value?.toString()] || ""} onChange={(e) => !!Object.keys(selectedYears).includes && setSelectedYears((prev: any) => ({...prev, [value.toString()]: e.target.value}))}>
                {yearsList.map((yr: number|string) => (
                  <option key={"year__" + yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Modal open={!!pdfUrl} onClose={() => { setPdfUrl(null); setPdfTitle(null); setPdfAuthor(null); fetchData().catch(console.log); }} content={authenticated ? <PdfViewer src={pdfUrl} /> : <div className="w-full text-center min-h-[150px] pt-16">Please <a href={pathname("/login")} className="text-sky-700 underline">login</a> to view thesis.</div>} header={pdfTitle} showCancelButton={false} showConfirmButton={false} footer={pdfAuthor} />
  </>)
}