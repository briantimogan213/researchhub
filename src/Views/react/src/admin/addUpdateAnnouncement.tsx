import RichTextEditor from '../global/richtext';
import { React, ReactDOMClient, pathname } from '../imports';

interface UploadedImagesProps {
  total: number
  uploaded: number
  failed: number
  files: {
    file: string
    mimetype: string
    original_filename: string
    type: "base64"|"url"
  }[]
  errors: string[]
}

function genHexString(len = 24) {
  const hex = '0123456789ABCDEF';
  let output = '';
  for (let i = 0; i < len; ++i) {
      output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

const generateBase64Image = (imgBase64: string, mimeType: string) => {
  if (imgBase64 && ["image/jpeg", "image/png"].includes(mimeType)) {
    return `data:${mimeType};base64,${imgBase64}`
  }
  return ""
}

interface PayloadProps {
  id?: string;
  title: string;
  a_type: "text"|"video"
  message?: string
  url?: string
  expires: string
}

interface AnnouncementProps {
  title: string
  isOpen: boolean
  onSuccess?: (success?: string) => void
  onError?: (error?: string) => void
  onClose?: () => void,
  data?: PayloadProps
}
export default function AddUpdateAnnouncement({ title, isOpen, onSuccess, onError, onClose, data }: AnnouncementProps): React.ReactNode {
  const [open, setOpen] = React.useState<boolean>(isOpen);
  const [announcementTitle, setAnnouncementTitle] = React.useState<string>("")
  const [announcementType, setAnnouncementType] = React.useState<"text"|"video">("text")
  const [expiresOn, setExpiresOn] = React.useState<string>("")
  const [announementHTMLOrLink, setAnnouncementHTMLOrLink] = React.useState<string>("");
  const [imagesUsed, setImagesUsed] = React.useState<any[]>([]);
  const isUpdate = React.useMemo(() => !!data, [data])
  const [error, setError] = React.useState({
    title: "",
    text: "",
    expiresOn: "",
  })
  const clearData = () => {
    setAnnouncementTitle("")
    setAnnouncementType("text")
    setExpiresOn("")
    setAnnouncementHTMLOrLink("")
    setError({ title: "", text: "", expiresOn: "" })
  }
  React.useEffect(() => {
    if (isUpdate && !!data) {
      setAnnouncementTitle(data.title)
      setAnnouncementType(data.a_type || "text")
      setExpiresOn(new Date(data.expires).toISOString().slice(0, 10))
      setAnnouncementHTMLOrLink(data.message || "")
      setAnnouncementHTMLOrLink(data.url || "")
    }
  }, [isUpdate])

  const handleClose = () => {
    onClose && onClose();
    clearData();
  }

  const handleSubmit = React.useCallback(async (e: any) => {
    e.preventDefault()
    if (!announcementTitle) {
      setError({ ...error, title: "Title is required." })
      return
    }
    setError({ ...error, title: "" })
    if (announcementType === "text" && !announementHTMLOrLink) {
      setError({...error, text: "Content is required." })
      return
    }
    if (announcementType === "video" && !announementHTMLOrLink) {
      setError({...error, text: "Video URL is required." })
      return
    }

    const expires = new Date(expiresOn).toISOString();
    // Post the announcement
    const url = new URL(pathname(isUpdate ? '/api/home/announcement/edit' : '/api/home/announcement/add'), window.location.origin);
    const body: PayloadProps = {
      id: data?.id,
      a_type: announcementType,
      title: announcementTitle,
      expires,
    };
    let imageUrls: {[id: string]: string} = {}
    let imagesToUpload = new FormData()
    for (let imgSrc of imagesUsed) {
      if (imgSrc[1] === "url") {
        imageUrls[imgSrc[0]] = imgSrc[2]
      } else {
        console.log(imgSrc)
        imagesToUpload.append("photo[]", imgSrc[2] as File, imgSrc[2].name as string);
      }
    }
    if ([...imagesToUpload.entries()].filter((v) => v[0] === "photo[]").length > 0) {
      let response = await fetch(new URL(pathname("/api/upload/images"), window.location.origin), {
        method: "POST",
        body: imagesToUpload,
      })
      if (response.ok) {
        const {total, uploaded, failed, files, errors}: UploadedImagesProps = await response.json();
        let uploadedFiles: any[] = []
        for (let f of files) {
          let iid = imagesUsed.find((im: any[]) => im[1] === "upload" && im[2].name === f.original_filename)?.[0] || ""
          imageUrls[iid] = f.type == "base64" ? generateBase64Image(f.file, f.mimetype) : (new URL(pathname(f.file), window.location.origin)).toString();
          uploadedFiles.push(iid)
        }
        if (failed > 0) {
          console.log("Error uploading images:", errors)
          // try again only once
          let response2 = await fetch(new URL(pathname("/api/upload/images"), window.location.origin), {
            method: "POST",
            body: imagesToUpload,
          })
          if (response2.ok) {
            const {total: total2, uploaded: uploaded2, failed: failed2, files: files2, errors: errors2}: UploadedImagesProps = await response.json();
            for (let f of files2) {
              let iid = imagesUsed.find((im: any[]) => im[1] === "upload" && im[2].name === f.original_filename)?.[0] || ""
              imageUrls[iid] = f.type == "base64" ? generateBase64Image(f.file, f.mimetype) : (new URL(pathname(f.file), window.location.origin)).toString();
            }
          } else {
            console.log("Error uploading images:", response2.statusText)
          }
        }
      } else {
        console.log("Error uploading images:", response.statusText)
      }
    }
    if (body.a_type === "text") {
      if (Object.keys(imageUrls).length > 0) {
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = announementHTMLOrLink;
        for (let imid of Object.keys(imageUrls)) {
          let eli: HTMLImageElement|null = tempContainer.querySelector(`img[id=${imid}]`)
          if (!!eli) {
            eli.src = imageUrls[imid]
          }
        }
        let announementHTMLOrLinkWithImages = "";
        announementHTMLOrLinkWithImages += tempContainer.innerHTML.toString();
        body.message = announementHTMLOrLinkWithImages;
      } else {
        body.message = announementHTMLOrLink;
      }
    } else if (body.a_type === "video") {
      body.url = announementHTMLOrLink;
    }
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(({ success, error: err }) => {
        if (err) {
          throw new Error(err)
        }
        onSuccess && onSuccess(success)
        setOpen(false)
      })
      .catch((err) => {
        onError && onError(err)
      })
  }, [error, isUpdate, announcementTitle, announcementType, announementHTMLOrLink, imagesUsed, onSuccess, onError]);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    if (!open) {
      handleClose();
    }
  }, [open]);


  if (!isOpen) {
    return null;
  }

  return ReactDOMClient.createPortal(
    <div className="fixed left-0 top-0 w-full min-h-screen bg-black/50 flex justify-center items-start lg:items-center z-40 max-h-screen h-screen">
      <div className="relative p-6 bg-white rounded-lg shadow-md z-50 max-h-[calc(100vh-50px)] max-w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition"
          aria-label="Close Modal"
        >
          &#x2715;
        </button>
        <h2 className="text-center text-3xl font-bold mb-6">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full h-full">
          <div className="max-h-[calc(100vh-200px)] relative overflow-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" name="title" value={announcementTitle} onChange={(e: any) => setAnnouncementTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              <p className="text-xs text-gray-500">Title of the announcement.</p>
              {error.title && <p className="text-xs text-red-500">{error.title}</p>}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
              <select id="type" name="type" value={announcementType} onChange={(e: any) => setAnnouncementType(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="text">Text</option>
                <option value="video">Video</option>
              </select>
              <p className="text-xs text-gray-500">Announcement Type. (Text or Video)</p>
            </div>
            <div>
              <label htmlFor="expiresOn" className="block text-sm font-medium text-gray-700">Expires On</label>
              <input type="date" id="expiresOn" name="expiresOn" value={expiresOn} onChange={(e: any) => setExpiresOn(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              <p className="text-xs text-gray-500">Date when the announcement should expire.</p>
              {error.expiresOn && <p className="text-xs text-red-500">{error.expiresOn}</p>}
            </div>
            {
              announcementType === "text" ? (
                <div>
                  <label htmlFor="text" className="block text-sm font-medium text-gray-700">Announcement</label>
                  <RichTextEditor data={isUpdate ? data?.message : undefined} onEdit={(content: string, imagesUsed: any[]) => { setAnnouncementHTMLOrLink(content); setImagesUsed(imagesUsed)}} />
                  <p className="text-xs text-gray-500">Content of the announcement.</p>
                  {error.text && <p className="text-xs text-red-500">{error.text}</p>}
                </div>
              ) : announcementType === "video" && (
                <div>
                  <label htmlFor="video" className="block text-sm font-medium text-gray-700">Link</label>
                  <input type="text" id="video" name="video" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={announementHTMLOrLink} onChange={(e: any) => setAnnouncementHTMLOrLink(e.target.value)} required />
                  <p className="text-xs text-gray-500">YouTube link for the video.</p>
                </div>
              )
            }
          </div>
          <div className="flex justify-end">
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">
              {!isUpdate ? "Add" : "Update"}
            </button>
            <button onClick={() => setOpen(false)} className="ml-4 w-full px-4 py-2 text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  , document.body)
}