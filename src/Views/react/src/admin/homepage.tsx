interface Announcement { id: string, type: "text"|"video", title: string, url?: string, message?:string, expires: string }


export default import(pathname("/jsx/imports")).then(({ React, Sweetalert2, ReactPlayerYoutube, parseMarkup, purifyHTML }) => {

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

  function genHexString(len = 24) {
    const hex = '0123456789ABCDEF';
    let output = '';
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
  }

  function VideoPlayer({ url }: { url: string }) {
    return <ReactPlayerYoutube url={url} width="100%" height="100%" controls />
    // return <ReactPlayer url={url} width="100%" height="100%" controls /> if you want to use videos from local or from other platforms
  }

  return function HomepageManagementPage() {
    const [announcements, setAnnouncements] = React.useState([]);
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

    const onAddModal = React.useCallback(() => {
      Sweetalert2.fire({
        title: "Add New Annoucement",
        text: "What type of announcement?",
        input: "select",
        inputOptions: {
          "text": "Text",
          "video": "Video",
        },
        confirmButtonText: "Confirm",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        showLoaderOnConfirm: true,
      }).then(({ isConfirmed, value }: any) => {
        if (isConfirmed) {
          const type = value;
          if (type === "text") {
            // Text
            Sweetalert2.fire({
              title: "Enter Title of Announcement",
              input: "text",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: "Next",
              cancelButtonText: "Cancel",
            }).then((step2: any) => {
              if (step2.isConfirmed && step2.value) {
                const title = step2.value;
                Sweetalert2.fire({
                  title,
                  text: "Enter the content of the announcement",
                  input: "textarea",
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: "Next",
                  cancelButtonText: "Cancel",
                })
                .then((step3: any) => {
                  if (step3.isConfirmed && step3.value) {
                    const message = purifyHTML(step3.value);
                    // Set the expiration date
                    Sweetalert2.fire({
                      title: "Set Expiration Date",
                      input: "date",
                      showConfirmButton: true,
                      showCancelButton: true,
                      confirmButtonText: "Post Announcement",
                      cancelButtonText: "Cancel",
                    }).then((step4: any) => {
                      if (step4.isConfirmed && step4.value) {
                        const expires = new Date(step4.value).toISOString();
                        // Post the announcement
                        const url = new URL(pathname('/api/home/announcement/add'), window.location.origin);
                        const body = JSON.stringify({
                          id: genHexString(),
                          type: "text",
                          title,
                          message,
                          expires,
                        });
                        fetch(url,{
                          method: 'POST',
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
                              icon: 'success',
                              title: 'New Announcement Posted',
                              text: success,
                              toast: true,
                              showConfirmButton: false,
                              position: 'center',
                              timer: 2000,
                            })
                            fetchAnnouncements().then(setAnnouncements).catch(console.log)
                          })
                          .catch((error) => {
                            Sweetalert2.fire({
                              icon: 'error',
                              title: 'Failed to add new announcement',
                              text: error,
                              toast: true,
                              showConfirmButton: false,
                              position: 'center',
                              timer: 2000,
                            })
                          })
                        }
                      });
                    }
                  });
                }
              });
          } else if (type === "video") {
            // video
            Sweetalert2.fire({
              title: "Enter Title of Announcement",
              input: "text",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: "Next",
              cancelButtonText: "Cancel",
            }).then((step2: any) => {
              if (step2.isConfirmed && step2.value) {
                const title = step2.value;
                Sweetalert2.fire({
                  title,
                  text: "Enter the video link announcement",
                  input: "text",
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: "Next",
                  cancelButtonText: "Cancel",
                })
                .then((step3: any) => {
                  if (step3.isConfirmed && step3.value) {
                    const urlVideo = step3.value;
                    // Set the expiration date
                    Sweetalert2.fire({
                      title: "Set Expiration Date",
                      input: "date",
                      showConfirmButton: true,
                      showCancelButton: true,
                      confirmButtonText: "Post Announcement",
                      cancelButtonText: "Cancel",
                    }).then((step4: any) => {
                      if (step4.isConfirmed && step4.value) {
                        const expires = new Date(step4.value).toISOString();
                        // Post the announcement
                        const url = new URL(pathname('/api/home/announcement/add'), window.location.origin);
                        const body = JSON.stringify({
                          id: genHexString(),
                          type: "video",
                          title,
                          url: urlVideo,
                          expires,
                        });
                        fetch(url,{
                          method: 'POST',
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
                              icon: 'success',
                              title: 'New Announcement Posted',
                              text: success,
                              toast: true,
                              showConfirmButton: false,
                              position: 'center',
                              timer: 2000,
                            })
                            fetchAnnouncements().then(setAnnouncements).catch(console.log)
                          })
                          .catch((error) => {
                            Sweetalert2.fire({
                              icon: 'error',
                              title: 'Failed to add new announcement',
                              text: error,
                              toast: true,
                              showConfirmButton: false,
                              position: 'center',
                              timer: 2000,
                            })
                          })
                        }
                      });
                    }
                  });
                }
              });
          }
        }
      });
    }, [purifyHTML]);

    const onEditModal = React.useCallback((data: Announcement) => {
      if (data.type === "text") {
        Sweetalert2.fire({
          title: "Enter Title of Announcement",
          input: "text",
          inputValue: data.title,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Next",
          cancelButtonText: "Cancel",
        }).then((step2: any) => {
          if (step2.isConfirmed && step2.value) {
            const title = step2.value;
            Sweetalert2.fire({
              title,
              text: "Enter the content of the announcement",
              input: "textarea",
              inputValue: data.message as string,
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: "Next",
              cancelButtonText: "Cancel",
            })
            .then((step3: any) => {
              if (step3.isConfirmed && step3.value) {
                const message = purifyHTML(step3.value);
                console.log(message);
                // Set the expiration date
                Sweetalert2.fire({
                  title: "Set Expiration Date",
                  input: "date",
                  inputValue: (new Date(data.expires).getFullYear()) + "-" + (new Date(data.expires).getMonth() + 1) + "-" + (new Date(data.expires).getDate()),
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: "Post Announcement",
                  cancelButtonText: "Cancel",
                }).then((step4: any) => {
                  if (step4.isConfirmed && step4.value) {
                    const expires = new Date(step4.value).toISOString();
                    // Post the announcement
                    const url = new URL(pathname('/api/home/announcement/edit'), window.location.origin);
                    const body = JSON.stringify({
                      id: data.id,
                      type: "text",
                      title,
                      message,
                      expires,
                    });
                    fetch(url,{
                      method: 'POST',
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
                          icon: 'success',
                          title: 'Announcement Edited',
                          text: success,
                          toast: true,
                          showConfirmButton: false,
                          position: 'center',
                          timer: 2000,
                        })
                        fetchAnnouncements().then(setAnnouncements).catch(console.log)
                      })
                      .catch((error) => {
                        Sweetalert2.fire({
                          icon: 'error',
                          title: 'Failed to edit announcement',
                          text: error,
                          toast: true,
                          showConfirmButton: false,
                          position: 'center',
                          timer: 2000,
                        })
                      })
                    }
                  });
                }
              });
            }
          });
      } else if (data.type === "video") {
          // video
        Sweetalert2.fire({
          title: "Enter Title of Announcement",
          input: "text",
          inputValue: data.title,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Next",
          cancelButtonText: "Cancel",
        }).then((step2: any) => {
          if (step2.isConfirmed && step2.value) {
            const title = step2.value;
            Sweetalert2.fire({
              title,
              text: "Enter the video link announcement",
              input: "text",
              inputValue: data.url as string,
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: "Next",
              cancelButtonText: "Cancel",
            })
            .then((step3: any) => {
              if (step3.isConfirmed && step3.value) {
                const urlVideo = step3.value;
                // Set the expiration date
                Sweetalert2.fire({
                  title: "Set Expiration Date",
                  input: "date",
                  inputValue: (new Date(data.expires).getFullYear()) + "-" + (new Date(data.expires).getMonth() + 1) + "-" + (new Date(data.expires).getDate()),
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: "Post Announcement",
                  cancelButtonText: "Cancel",
                }).then((step4: any) => {
                  if (step4.isConfirmed && step4.value) {
                    const expires = new Date(step4.value).toISOString();
                    // Post the announcement
                    const url = new URL(pathname('/api/home/announcement/add'), window.location.origin);
                    const body = JSON.stringify({
                      id: data.id,
                      type: "video",
                      title,
                      url: urlVideo,
                      expires,
                    });
                    fetch(url,{
                      method: 'POST',
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
                          icon: 'success',
                          title: 'Announcement Edited',
                          text: success,
                          toast: true,
                          showConfirmButton: false,
                          position: 'center',
                          timer: 2000,
                        })
                        fetchAnnouncements().then(setAnnouncements).catch(console.log)
                      })
                      .catch((error) => {
                        Sweetalert2.fire({
                          icon: 'error',
                          title: 'Announcement Edited',
                          text: error,
                          toast: true,
                          showConfirmButton: false,
                          position: 'center',
                          timer: 2000,
                        })
                      })
                    }
                  });
                }
              });
            }
          });
      }
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

    return (
      <div className="w-full min-h-[calc(100vh-160px)] h-fit bg-[#37414e] p-4 min-w-fit">
        <h1 className="text-white text-2xl my-2">Manage Homepage</h1>
        <div><button type="button" className="bg-white hover:bg-slate-300 px-4 py-2 rounded shadow" onClick={() => onAddModal()}>Add New Announcement</button></div>
        <div className="p-4 tw-flex tw-flex-wrap tw-gap-8">
          {announcements.length === 0 ? <span className="">No Announcements</span> : announcements.map((announcement: Announcement) =>(
            <>
            {announcement.type === "text" && (
              <div key={announcement.id} className="w-[500px] md:w-[700px] lg:w-[1000px] min-w-[500px] bg-gray-100 border-l-2 border-blue-500 rounded">
                <div className="text-xl py-3 px-4  border-b text-blue-500 font-semibold flex justify-between flex-nowrap">
                  <h2>{announcement.title}</h2>
                  <div className="flex flex-nowrap gap-x-2">
                    <button type="button" onClick={() => onDelete(announcement)} className="px-2 text-sm bg-red-100 hover:bg-red-200 text-black shadow">Delete</button>
                    <button type="button" onClick={() => onEditModal(announcement)} className="px-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-black shadow">Edit</button>
                  </div>
                </div>
                <div className="text-center p-3 text-slate-900 my-3 announcement">
                  {parseMarkup(announcement.message)?.split("\n").map((v: any) => <><span dangerouslySetInnerHTML={{ __html: v }} /><br /></> || "")}
                </div>
                <div className="text-left py-1 text-slate-700 my-3 text-sm italic px-3 border-t">
                  {checkExpired(announcement.expires) ? <span className="text-red-700 font-bold">EXPIRED</span> : <>Expires on {(new Date(announcement.expires)).toLocaleDateString('en-PH', { month: "long", day: "numeric", year: "numeric" })}</>}
                </div>
              </div>
            )}
            {announcement.type === "video" && (
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
    )
  }
});