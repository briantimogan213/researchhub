import { React, ReactDOMServer, clsx } from "../imports";
const selectClass = {
  className: clsx("p-1 rounded mx-[4px] my-[4px] cursor-pointer")
};
const buttonClass = (isToggled: boolean = false) => ({
  className: clsx(
    "p-1 rounded border text-black mx-[4px] my-[4px]",
    "transition-colors duration-200",
    isToggled ? "bg-gray-300" : "bg-white hover:bg-gray-200"
  )
});
const labelClass = {
  className: clsx("font-bold text-xs text-black")
};

const buttonGroupClass = (index: number, items: number, isToggled: boolean = false) => {
  return {
    className: clsx(
      "p-1 border text-black my-[4px] transition-colors duration-200",
      index === 0 ? "rounded-l ml-[4px]" : index + 1 === items ? "rounded-r mr-[4px]" : "",
      isToggled ? "bg-gray-300" : "bg-white hover:bg-gray-200"
    )
  };
};


export default function RichTextEditor({ data, onEdit } : { data?: string, onEdit: (htmlString: string) => void }) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = React.useState<Set<string>>(new Set());
  const [htmlOutput, setHtmlOutput] = React.useState<string>("");
  const isActive = (command: string) => activeFormats.has(command);

  const handleSelectionChange = () => {
    const newFormats = new Set<string>();
    if (document.queryCommandState("bold")) newFormats.add("bold");
    if (document.queryCommandState("italic")) newFormats.add("italic");
    if (document.queryCommandState("underline")) newFormats.add("underline");
    if (document.queryCommandState("strikeThrough")) newFormats.add("strikeThrough");
    setActiveFormats(newFormats);
  };

  React.useEffect(() => {
    onEdit && onEdit(htmlOutput);
  }, [htmlOutput])

  React.useEffect(() => {
    if (!!data) {
      if (editorRef.current) {
        editorRef.current.innerHTML = data;
      }
    }
  }, [data]);

  React.useEffect(() => {
    // Add event listener for selection changes
    document.addEventListener("selectionchange", handleSelectionChange);

    // Load Material Icons
    const linkstyle = ReactDOMServer.renderToStaticMarkup(
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    );
    const link = document.createElement("div");
    link.innerHTML = linkstyle;
    document.head.appendChild(link.firstElementChild!);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Table border options
  const [borderStyle, setBorderStyle] = React.useState<string>("solid");
  const [borderWidth, setBorderWidth] = React.useState<string>("1");
  const [borderColor, setBorderColor] = React.useState<string>("#000000");

  const handleCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value!);
    editorRef.current?.focus();
    handleSelectionChange();
    updateHtmlOutput();
  };

  const updateHtmlOutput = () => {
    setHtmlOutput(editorRef.current?.innerHTML || "");
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) handleCommand("insertImage", url);
  };

  const insertLink = () => {
    const url = prompt("Enter the link URL:");
    if (url) handleCommand("createLink", url);
  };

  const insertTable = () => {
    const rows = parseInt(prompt("Enter number of rows:", "2") || "0");
    const cols = parseInt(prompt("Enter number of columns:", "2") || "0");

    if (rows > 0 && cols > 0) {
      let table = "<table border='1' style='border-collapse: collapse;'>";
      for (let i = 0; i < rows; i++) {
        table += "<tr>";
        for (let j = 0; j < cols; j++) {
          table += `<td style="border: ${borderWidth}px ${borderStyle} ${borderColor}; padding: 8px;">Cell</td>`;
        }
        table += "</tr>";
      }
      table += "</table>";
      document.execCommand("insertHTML", false, table);
      updateHtmlOutput();
    }
  };

  return (
    <div className="w-[800px] my-0 mx-auto rich-text-editor">
      <div className="flex flex-wrap rounded-t bg-gray-300 p-1">
        <select title="Font Family" onChange={(e) => handleCommand("fontName", e.target.value)} defaultValue="" {...selectClass}>
          <option value="">Font Family</option>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>

        <select title="Font Size" onChange={(e) => handleCommand("fontSize", e.target.value)} {...selectClass}>
          <option value="1">8pt</option>
          <option value="2">10pt</option>
          <option value="3" selected>12pt</option>
          <option value="4">14pt</option>
          <option value="5">18pt</option>
          <option value="6">24pt</option>
          <option value="7">36pt</option>
        </select>

        <button type="button" title="Bold" onClick={() => handleCommand("bold")} {...buttonGroupClass(0, 6, isActive("bold"))}>
          <span className="material-icons">format_bold</span>
        </button>
        <button type="button" title="Italic" onClick={() => handleCommand("italic")} {...buttonGroupClass(1, 6, isActive("italic"))}>
          <span className="material-icons">format_italic</span>
        </button>
        <button type="button" title="Underline" onClick={() => handleCommand("underline")} {...buttonGroupClass(2, 6, isActive("underline"))}>
          <span className="material-icons">format_underlined</span>
        </button>
        <button type="button" title="Strike-through" onClick={() => handleCommand("strikeThrough")} {...buttonGroupClass(3, 6, isActive("strikeThrough"))}>
          <span className="material-icons">format_strikethrough</span>
        </button>
        <button type="button" title="Subscript" onClick={() => handleCommand("subscript")} {...buttonGroupClass(4, 6, isActive("subscript"))}>
          <span className="material-icons">subscript</span>
        </button>
        <button type="button" title="Superscript" onClick={() => handleCommand("superscript")} {...buttonGroupClass(5, 6, isActive("superscript"))}>
          <span className="material-icons">superscript</span>
        </button>

        <button type="button" title="Align Left" onClick={() => handleCommand("justifyLeft")} {...buttonGroupClass(0, 4, isActive("justifyLeft"))}>
          <span className="material-icons">format_align_left</span>
        </button>
        <button type="button" title="Align Center" onClick={() => handleCommand("justifyCenter")} {...buttonGroupClass(1, 4, isActive("justifyCenter"))}>
          <span className="material-icons">format_align_center</span>
        </button>
        <button type="button" title="Align Right" onClick={() => handleCommand("justifyRight")} {...buttonGroupClass(2, 4, isActive("justifyRight"))}>
          <span className="material-icons">format_align_right</span>
        </button>
        <button type="button" title="Align Justify" onClick={() => handleCommand("justifyFull")} {...buttonGroupClass(3, 4, isActive("justifyFull"))}>
          <span className="material-icons">format_align_justify</span>
        </button>

        <button type="button" title="Bullet" onClick={() => handleCommand("insertUnorderedList")} {...buttonGroupClass(0, 4, isActive("insertUnorderedList"))}>
          <span className="material-icons">format_list_bulleted</span>
        </button>
        <button type="button" title="Numbered" onClick={() => handleCommand("insertOrderedList")} {...buttonGroupClass(1, 4, isActive("insertOrderedList"))}>
          <span className="material-icons">format_list_numbered</span>
        </button>

        <button type="button" title="Indent Left" onClick={() => handleCommand("outdent")} {...buttonGroupClass(2, 4, isActive("outdent"))}>
          <span className="material-icons">format_indent_decrease</span>
        </button>
        <button type="button" title="Indent Right" onClick={() => handleCommand("indent")} {...buttonGroupClass(3, 4, isActive("indent"))}>
          <span className="material-icons">format_indent_increase</span>
        </button>

        <select title="Line Spacing" onChange={(e) => handleCommand("formatBlock", `<p style="line-height: ${e.target.value}">`)} {...selectClass}>
          <option value="">Line Spacing</option>
          <option value="1.0">1.0</option>
          <option value="1.5">1.5</option>
          <option value="2.0">2.0</option>
          <option value="2.5">2.5</option>
        </select>

        <button type="button" title="Insert Link" onClick={insertLink} {...buttonClass()}>
          <span className="material-icons">insert_link</span>
        </button>
        <button type="button" title="Insert Image" onClick={insertImage} {...buttonClass()}>
          <span className="material-icons">image</span>
        </button>

        {/* Table Controls */}
        <div className="flex items-center gap-[8px] border border-gray-500 bg-white rounded px-[4px]">
          <label {...labelClass}>Style:</label>
          <select title="Border Style" onChange={(e) => setBorderStyle(e.target.value)} value={borderStyle} {...selectClass}>
            <option value="solid">Solid</option>
            <option value="dotted">Dotted</option>
            <option value="dashed">Dashed</option>
            <option value="none">None</option>
          </select>

          <label {...labelClass}>Width:</label>
          <select title="Border Width" onChange={(e) => setBorderWidth(e.target.value)} value={borderWidth} {...selectClass}>
            <option value="1">1px</option>
            <option value="2">2px</option>
            <option value="3">3px</option>
            <option value="4">4px</option>
            <option value="5">5px</option>
          </select>

          <label {...labelClass}>Color:</label>
          <input
            title="Border Color"
            type="color"
            onChange={(e) => setBorderColor(e.target.value)}
            value={borderColor}
          />

          <button type="button" onClick={insertTable} title="Insert Table" {...buttonClass()}>
            <span className="material-icons">grid_on</span>
          </button>
        </div>

        <button type="button" title="Undo" onClick={() => handleCommand("undo")} {...buttonClass()}>
          <span className="material-icons">undo</span>
        </button>
        <button type="button" title="Redo" onClick={() => handleCommand("redo")} {...buttonClass()}>
          <span className="material-icons">redo</span>
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="editor-area min-h-[200px] border border-[#ccc] p-[10px] bg-white rounded-b text-[16px] outlien-none overflow-y-auto"
        onInput={updateHtmlOutput}
        suppressContentEditableWarning
      ></div>
    </div>
  );
};
