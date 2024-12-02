// @ts-ignore
const pathname = window.pathname;
export default import(pathname("/jsx/imports")).then(({ React, ReactQrScanner }) => {
  return function Scanner({ pause = false, format = 'qr_code', onResult = (...result: string[]) => {}, regExFormat = [], children, ...props }: { pause: boolean, format?: any, onResult?: (...props: string[]) => void, regExFormat?: RegExp[], children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
    const [scannedData, setScannedData] = React.useState([])

    const reset = React.useCallback(() => setScannedData([]), [])

    React.useEffect(() => {
      if (regExFormat.length === 0 || (regExFormat.length > 0 && scannedData.length === regExFormat.length && regExFormat.every((regex: RegExp, index: number) => regex.test(scannedData[index])))) {
        onResult(...scannedData)
        setTimeout(() => reset(), 1000)
      }
    }, [scannedData, reset])

    const handleScan = React.useCallback((result: any) => result?.[0]?.format === format && setScannedData(result?.[0]?.rawValue.split('\r\n')), [])

    return (
      <div {...props}>
        <div className={"mx-auto max-w-[350px] aspect-square p-4 rounded-lg " + (scannedData.length > 0 ? 'bg-green-300' : 'bg-gray-300')}>
          <ReactQrScanner onScan={handleScan} paused={pause} />
        </div>
        {children}
      </div>
    )
  }
});