export default import(pathname("/jsx/imports")).then(async ({ React, clsx }) => {
  const { LogMessage, LogType } = await import(pathname("/jsx/types"));
  return function LogsApp() {
    const [logs, setLogs] = React.useState([])
    const logRef = React.useRef(null);

    const fetchLogs = React.useCallback(() => {
      fetch(pathname('/api/logs'))
      .then(response => response.json())
      .then(({ data }) => {
        const splitted = data.split('\n');
        const mapped = splitted.reduce((init: (typeof LogMessage)[], msg: string, index: number, orig: any) => {
          const result = msg.substring(1).split('] ');
          if (Object.values(LogType).includes(result[0] as typeof LogType)) {
            return [
              ...init,
              {
                type: result[0],
                message: result[1] + "] " + result[2],
              }
            ];
          }
          return [
            ...init,
            {
              type: "",
              message: msg,
            }
          ];
        }, []).filter((v: typeof LogMessage) => !(!v.type && !v.message));
        mapped;
        setLogs(mapped);
      })
    }, [logRef]);


    React.useEffect(() => {
      fetchLogs();
      setTimeout(() => {
        logRef.current?.scroll({ top: logRef.current?.scrollHeight });
      }, 1000);
    }, []);

    React.useEffect(() => {
      setTimeout(() => {
        fetchLogs();
      }, 1000);
    }, [logs])

    return (
      <div>
        <h1 className="p-8 text-2xl pb-0">Server Logs</h1>
        <div className="w-full p-8">
          <div ref={logRef} className="bg-slate-900 p-3 text-white border border-white rounded shadow mx-auto h-full max-h-[calc(100vh-250px)] overflow-x-hidden overflow-y-auto">
            {
              logs.map(({ type, message }: typeof LogMessage, index: number) => (
                <p key={index} className="text-wrap">
                  <span className={
                    clsx(
                      type === LogType.USER_INFO
                      ? "text-green-300"
                      : type === LogType.USER_ERROR
                      ? "text-red-500"
                      : type === LogType.USER_WARNING
                      ? "text-yellow-400"
                      : type === LogType.USER_DEBUG
                      ? "text-gray-500"
                      : "text-gray-400"
                    )
                  }>
                    {type}{type && ": "}
                  </span>
                  &nbsp;
                  <span>
                    {message}
                  </span>
                </p>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
});