import Modal from './global/modal';
import PdfViewer from './global/pdfviewer';
import { React, ReactDOM, ReactPlayerYoutube, clsx, parseMarkup, pathname } from './imports';

function VideoPlayer({ url }: { url: string }) {
  return <ReactPlayerYoutube url={url} width="100%" height="100%" controls />
  // return <ReactPlayer url={url} width="100%" height="100%" controls /> if you want to use videos from local or from other platforms
}

async function fetchAnnouncements() {
  const url = new URL(pathname('/api/home/announcements'), window.location.origin);
  const response = await fetch(url);
  const { success, error } = await response.json();
  if (error) {
    throw new Error(error);
  }
  return success || [];
}

function Announcements() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [announcements, setAnnouncements] = React.useState([]);
  const [ticking, setTicking] = React.useState(false);
  React.useEffect(() => {
    fetchAnnouncements()
      .then((data) => { setAnnouncements(data); setIsLoading(false); })
      .catch(console.log);
  }, []);

  React.useEffect(() => {
    setTimeout(() => setTicking(!ticking), 1000);
  }, [ticking])

  const checkExpired = React.useCallback((date: any) => {
    const now = Date.now();
    const expirationDate = new Date(date);
    return now > expirationDate.getTime();
  }, [ticking])

  if (isLoading) {
    return <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 border-solid rounded-full animate-spin"></div>
  }

  return <>
  {announcements.map((announcement: {a_type: "video"|"text", url?: string, message?: string, title: string, expires: string, id?: string|number}, i: number) => (
    <React.Fragment key={"announcement_" + i + announcement?.id}>
      {announcement.a_type === "video" && !checkExpired(announcement.expires) && (
        <div className="w-[500px] md:w-[700px] lg:w-[1000px] min-w-[500px] bg-gray-100 rounded">
          <div className="text-xl py-3 px-4 border-b  text-blue-500 font-semibold"><h2>{announcement.title}</h2></div>
          <div className="w-full h-full px-[10%] py-[5%] aspect-video">
            <VideoPlayer url={announcement.url || ""} />
          </div>
        </div>
      )}
      {announcement.a_type === "text" && !checkExpired(announcement.expires) && (
        <div className="w-[500px] md:w-[700px] lg:w-[1000px] min-w-[500px] bg-gray-100 rounded rich-text-editor">
          <div className="text-xl py-3 px-4  border-b text-blue-500 font-semibold"><h2>{announcement.title}</h2></div>
          <div className="text-center p-3 text-slate-900 my-3 announcement editor-area">
            {parseMarkup(announcement.message!)?.split("\n").map((v: any) => <><span dangerouslySetInnerHTML={{ __html: v }} /><br /></> || "")}
          </div>
        </div>
      )}
    </React.Fragment>
  ))}
  </>
}

async function fetchMostViews(type: "journals"|"theses", setIsLoading: any) {
  setIsLoading && setIsLoading(true);
  const url = new URL(pathname('/api/home/most-views'), window.location.origin);
  const response = await fetch(url);
  const { success, error } = await response.json();
  if (error) {
    throw new Error(error);
  }
  return success?.[type] || [];
}

function MostViewsTheses() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchMostViews("theses", setIsLoading).then(setData).catch(console.log).finally(() => setIsLoading(false));
  }, []);

  const [pdfUrl, setPdfUrl] = React.useState<string|undefined>()
  const [pdfTitle, setPdfTitle] = React.useState<string|undefined>()
  const [pdfAuthor, setPdfAuthor] = React.useState<string|undefined>()
  const [openView, setOpenView] = React.useState<boolean>(false)

  const onViewPdf = React.useCallback((uri: string, title: string, author: string) => {
    setPdfTitle(title);
    setPdfUrl(uri);
    setPdfAuthor(author);
  }, []);

  const handleView = React.useCallback(({ id, url, title, author, year }: { id: string, url: string, title: string, author: string, year: string }) => {
    const uri = new URL(pathname(`/read${url}&id=${id}`), window.location.origin).toString()
    onViewPdf && onViewPdf(uri, title, author + ' (' + year + ')')
  }, [onViewPdf]);


  const authenticated = React.useMemo(() => {
    return window?.sessionStorage.getItem('authenticated') == 'true';
  }, []);

  return (<>
    <div
      className={clsx(
        "bg-slate-50 p-3 mb-4 border shadow relative overflow-hidden transition-all delay-0 duration-500",
        openView ? "" : "h-[50px]"
      )}
    >
      <h1 className="font-bold text-lg">Most Viewed Thesis</h1>
      <button type="button" className="absolute right-2 top-2 hover:text-gray-600" onClick={() => setOpenView(prev => !prev)}>
        {!openView && <span className="material-symbols-outlined">menu</span>}
        {openView && <span className="material-symbols-outlined">close</span>}
      </button>
      <div className="max-h-[180px] overflow-y-auto">
        <div className="grid grid-cols-1">
          {isLoading && (
            <div className="w-full mt-4"><div className="mx-auto w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div></div>
          )}
          {!isLoading && data.length === 0 && (
            <div className="w-full mt-4"><div className="mx-auto text-center text-slate-600">No thesis has been viewed yet.</div></div>
          )}
          {!isLoading && data.length > 0 && (
            data.map((thesis: { title: string, views: number, id: number|string }, i: number) => (
              <div onClick={() => handleView(thesis as any)} key={"thesis_" + i + "_" + thesis.id} className="py-4 px-2 cursor-pointer *:hover:text-blue-500 border-b border-gray-200 flex flex-nowrap justify-between items-center">
                <div className="font-[400] text-slate-900">{thesis.title}</div>
                <div className="text-slate-900 text-md pr-4"><span className="material-symbols-outlined text-sm translate-y-0.5">visibility</span>&nbsp;{thesis.views}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    <Modal open={!!pdfUrl} onClose={() => { setPdfUrl(undefined); setPdfTitle(undefined); setPdfAuthor(undefined); }} content={!!authenticated ? <PdfViewer src={pdfUrl} /> : <div className="w-full text-center min-h-[150px] pt-16">Please <a href={pathname("/login")} className="text-sky-700 underline">login</a> to view journal.</div>} header={pdfTitle} showCancelButton={false} showConfirmButton={false} footer={pdfAuthor} />
  </>)
}

function MostViewsJournals() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchMostViews("journals", setIsLoading).then(setData).catch(console.log).finally(() => setIsLoading(false));
  }, []);

  const [pdfUrl, setPdfUrl] = React.useState<string|undefined>()
  const [pdfTitle, setPdfTitle] = React.useState<string|undefined>()
  const [pdfAuthor, setPdfAuthor] = React.useState<string|undefined>()

  const onViewPdf = React.useCallback((uri: string, title: string, author: string) => {
    setPdfTitle(title);
    setPdfUrl(uri);
    setPdfAuthor(author);
  }, []);

  const handleView = React.useCallback(({ id, url, title, author, year }: { id: string, url: string, title: string, author: string, year: string }) => {
    const uri = new URL(pathname(`/read${url}&id=${id}`), window.location.origin).toString()
    onViewPdf && onViewPdf(uri, title, author + ' (' + year + ')')
  }, [onViewPdf]);


  const authenticated = React.useMemo(() => {
    return window?.sessionStorage.getItem('authenticated') == 'true';
  }, []);
  return (<>
    <div className="bg-slate-100 p-3">
      <h1 className="font-bold text-lg">Most Viewed Journals</h1>
      <div className="grid grid-cols-1">
        {isLoading && (
          <div className="w-full mt-4"><div className="mx-auto w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div></div>
        )}
        {!isLoading && data.length === 0 && (
          <div className="w-full mt-4"><div className="mx-auto text-center text-slate-600">No journal has been viewed yet.</div></div>
        )}
        {!isLoading && data.length > 0 && (
          data.map((journal: { title: string, views: number, id: number|string }, i: number) => (
            <div onClick={() => handleView(journal as any)} key={"journal_" + i + "_" + journal.id} className="py-4 px-2 cursor-pointer hover:*:text-blue-500 border-gray-200 flex flex-nowrap justify-between items-center">
              <div className="font-semibold text-slate-900">{i + 1}. {journal.title}</div>
              <div className="text-slate-600 italic text-xs"><span className="material-symbols-outlined text-xs">visibility</span>&nbsp;{journal.views}</div>
            </div>
          ))
        )}
      </div>
    </div>
    <Modal open={!!pdfUrl} onClose={() => { setPdfUrl(undefined); setPdfTitle(undefined); setPdfAuthor(undefined); }} content={!!authenticated ? <PdfViewer src={pdfUrl} /> : <div className="w-full text-center min-h-[150px] pt-16">Please <a href={pathname("/login")} className="text-sky-700 underline">login</a> to view journal.</div>} header={pdfTitle} showCancelButton={false} showConfirmButton={false} footer={pdfAuthor} />
  </>)
}

export function render() {
  const mostViewsThesesRoot = ReactDOM.createRoot(document.getElementById("most-view-container-theses")!)
  mostViewsThesesRoot.render(<MostViewsTheses />)

  // const mostViewsJournalsRoot = ReactDOM.createRoot(document.getElementById("most-view-container-journals")!)
  // mostViewsJournalsRoot.render(<MostViewsJournals />)

  const root = ReactDOM.createRoot(document.getElementById("home-announcement-container")!)
  root.render(<Announcements />)
}