// @ts-nocheck
export interface SelectItem {
  label: string,
  value: string,
  disabled?: boolean
}

export default import(pathname("/jsx/imports")).then(({ React, clsx }) => {
  function Input({ label, name, type = "text", placeholder = "", className = "", labelColor, inputClassName, required, disabled, ...props }: { label: string, name: string, placeholder?: string, className?: string, type?: React.HTMLInputTypeAttribute, labelColor?: string, inputClassName?: string, required?: boolean, disabled?: boolean } & React.InputHTMLAttributes<HTMLInputElement> ) {
    const colorLabel = React.useMemo(() => labelColor || 'text-white', [labelColor])
    const inputClass = React.useMemo(() => clsx("disabled:bg-gray-200 px-2 py-1 w-full rounded border", inputClassName), [inputClassName])
    return (
      <div className={
        clsx(
          "flex flex-col justify-start w-full",
          className,
        )
      }>
        <label htmlFor={name} className={clsx("text-[12px] font-[400] font-['Century Gothic'] px-2", colorLabel)}>{label}</label>
        <input className={inputClass} type={type} id={name} name={name} placeholder={placeholder} required={required} disabled={disabled} {...props} />
      </div>
    )
  }
  function Select({ label, name, items, className = "", labelColor, required, disabled, ...props }: { label: string, name: string, items: SelectItem[], className?: string, labelColor?: string, required?: boolean, disabled?: boolean } & React.InputHTMLAttributes<HTMLInputElement> ) {
    return (
      <div className={
        clsx(
          "flex flex-col justify-start w-full",
          className,
        )
      }>
        <label htmlFor={name} className={clsx("text-[12px] font-[400] font-['Century Gothic'] px-2", labelColor ? 'text-' + labelColor : 'text-white' )}>{label}</label>
        <select className="px-2 py-1 w-full rounded border" id={name} name={name}  required={required} disabled={disabled} {...props}>
          {items.map((item: SelectItem) => (
            <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>
          ))}
        </select>
      </div>
    )
  }


  function TextArea({ label, name, placeholder = "", className = "", ...props }: { label: string, name: string, placeholder?: string, className?: string, type?: React.HTMLInputTypeAttribute } & React.InputHTMLAttributes<HTMLInputElement> ) {
    return (
      <div className={
        clsx(
          "flex flex-col justify-start w-full",
          className,
        )
      }>
        <label htmlFor={name} className="text-[12px] font-[400] text-white font-['Century Gothic'] px-2">{label}</label>
        <textarea className="px-2 py-1 w-full rounded" id={name} name={name} placeholder={placeholder} {...props}>
        </textarea>
      </div>
    )
  }

  return {
    Input,
    Select,
    TextArea,
  }
});