interface Announcement { id: string, a_type: "text"|"video", title: string, url?: string, message?:string, expires: string }


import { pathname, purifyHTML, React, ReactPlayerYoutube, Sweetalert2, useParseMarkup } from '../imports';
import AddUpdateAnnouncement from './addUpdateAnnouncement';

async function fetchAnnouncements() {
  const url = new URL(pathname('/api/home/announcements'), window.location.origin);
  const response = await fetch(url);
  const { success, error } = await response.json();
  if (error) {
    throw new Error(error);
  }
  return [...(success.toSorted(
    (a: Announcement, b: Announcement) => {
      const ae = (new Date(a.expires)).getTime();
      const be = (new Date(b.expires)).getTime();
      return ae > be ? -1 : ae < be ? 1 : 0;
    }))];
}


function VideoPlayer({ url }: { url: string }) {
  return <ReactPlayerYoutube url={url} width="100%" height="100%" controls />
  // return <ReactPlayer url={url} width="100%" height="100%" controls /> if you want to use videos from local or from other platforms
}

export default function HomepageManagementPage() {
  const { parseHTML, htmlParsed } = useParseMarkup()
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [ticking, setTicking] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setTicking(!ticking), 1000);
  }, [ticking])

  const checkExpired = React.useCallback((date: any) => {
    const now = Date.now();
    const expirationDate = new Date(date);
    return now > expirationDate.getTime();
  }, [ticking])

  React.useEffect(() => {
    fetchAnnouncements().then(setAnnouncements).catch(console.log)
  }, []);

  const [openAddAnnouncement, setOpenAddAnnouncement] = React.useState<boolean>(false)
  const [editData, setEditData] = React.useState<Announcement|undefined>()

  const onAddModal = React.useCallback(() => {
    setOpenAddAnnouncement(true)
  }, [purifyHTML]);

  const onEditModal = React.useCallback((data: Announcement) => {
    setEditData(data)
  }, [purifyHTML]);

  const onDelete = React.useCallback((data: Announcement) => {
    Sweetalert2.fire({
      title: 'Delete Announcement',
      text: "Are you sure you want to delete this announcement?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete announcement!'
    }).then(({ isConfirmed }: any) => {
      if (isConfirmed) {
        const url = new URL(pathname("/api/home/announcement/delete"), window.location.origin);
        const body = JSON.stringify({ id: data.id });
        fetch(url,{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body,
        })
          .then(response => response.json())
          .then(({ success, error }) => {
            if (error) {
              throw new Error(error)
            }
            Sweetalert2.fire({
              icon:'success',
              title: 'Announcement Deleted',
              text: success,
              toast: true,
              showConfirmButton: false,
              position: 'center',
              timer: 2000,
            })
            fetchAnnouncements().then(setAnnouncements).catch(console.log)
          })
          .catch(console.error)
      }
    });
  }, []);

  React.useEffect(() => {
    if (announcements.length > 0) {
      announcements.filter((ann: Announcement) => ann.a_type === "text").forEach((ann: Announcement) => {
        parseHTML(ann.message!, `id_${ann.id}`)
      });
    }
  }, [announcements])

  return (<>
    <div className="w-full min-h-[calc(100vh-160px)] h-fit text-black p-4 min-w-fit">
      <h1 className="text-2xl my-2">Manage Homepage</h1>
      <div><button type="button" className="bg-white hover:bg-slate-300 px-4 py-2 rounded shadow" onClick={() => onAddModal()}>Add New Announcement</button></div>
      <div className="p-4 tw-flex tw-flex-wrap tw-gap-8">
        {announcements.length === 0 ? <span className="">No Announcements</span> : announcements.map((announcement: Announcement) =>(
          <>
          {announcement.a_type === "text" && (
            <div key={announcement.id} className="rich-text-editor w-[500px] md:w-[700px] lg:w-[1000px] min-w-[500px] bg-gray-100 border-l-2 border-blue-500 rounded">
              <div className="text-xl py-3 px-4  border-b text-blue-500 font-semibold flex justify-between flex-nowrap">
                <h2>{announcement.title}</h2>
                <div className="flex flex-nowrap gap-x-2">
                  <button type="button" onClick={() => onDelete(announcement)} className="px-2 text-sm bg-red-100 hover:bg-red-200 text-black shadow">Delete</button>
                  <button type="button" onClick={() => onEditModal(announcement)} className="px-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-black shadow">Edit</button>
                </div>
              </div>
              <div className="text-center p-3 text-slate-900 my-3 announcement editor-area">
                {htmlParsed[`id_${announcement.id}`]}
              </div>
              <div className="text-left py-1 text-slate-700 my-3 text-sm italic px-3 border-t">
                {checkExpired(announcement.expires) ? <span className="text-red-700 font-bold">EXPIRED</span> : <>Expires on {(new Date(announcement.expires)).toLocaleDateString('en-PH', { month: "long", day: "numeric", year: "numeric" })}</>}
              </div>
            </div>
          )}
          {announcement.a_type === "video" && (
            <div key={announcement.id} className="w-[500px] md:w-[700px] lg:w-[1000px] min-w-[500px] bg-gray-100 border-l-2 border-blue-500 rounded">
              <div className="text-xl py-3 px-4 border-b  text-blue-500 font-semibold flex justify-between flex-nowrap">
                <h2>{announcement.title}</h2>
                <div className="flex flex-nowrap gap-x-2">
                  <button type="button" onClick={() => onDelete(announcement)} className="px-2 text-sm bg-red-100 hover:bg-red-200 text-black shadow">Delete</button>
                  <button type="button" onClick={() => onEditModal(announcement)} className="px-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-black shadow">Edit</button>
                </div>
              </div>
              <div className="w-full h-full px-[10%] py-[5%] aspect-video">
                <VideoPlayer url={announcement.url || ""} />
              </div>
              <div className="text-left py-1 text-slate-700 my-3 text-sm italic px-3 border-t">
                {checkExpired(announcement.expires) ? <span className="text-red-700 font-bold">EXPIRED</span> : <>Expires on {(new Date(announcement.expires)).toLocaleDateString('en-PH', { month: "long", day: "numeric", year: "numeric" })}</>}
              </div>
            </div>
          )}
          </>
        ))}
      </div>
    </div>
    <AddUpdateAnnouncement
      isOpen={openAddAnnouncement || !!editData}
      data={editData}
      onClose={() => { setEditData(undefined); setOpenAddAnnouncement(false); }}
      onSuccess={(msg?: string) => {
        if (!!editData) {
          Sweetalert2.fire({
            icon:'success',
            title: 'Announcement Updated',
            text: msg || 'Announcement has been updated successfully.',
            toast: true,
            showConfirmButton: false,
            position: 'center',
            timer: 2000,
          })
          setEditData(undefined);
        } else {
          Sweetalert2.fire({
            icon:'success',
            title: 'Announcement Added',
            text: msg || 'Announcement has been added successfully.',
            toast: true,
            showConfirmButton: false,
            position: 'center',
            timer: 2000,
          })
          setOpenAddAnnouncement(false)
        }
        fetchAnnouncements().then(setAnnouncements).catch(console.log)
      }}
      onError={(msg?: string) => {
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: msg || 'Failed to add or update announcement.',
          toast: true,
          showConfirmButton: false,
          position: 'center',
          timer: 2000,
        })
      }}
      title={!!editData ? "Edit Announcement" : "Create Announcement"}
    />
  </>)
}