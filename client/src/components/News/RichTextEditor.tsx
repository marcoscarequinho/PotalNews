import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type EditorMode = 'html' | 'text';

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = useState<EditorMode>('html');
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === 'html' && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value, mode]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const convertHtmlToText = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const convertTextToHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  };

  const toggleMode = () => {
    const newMode: EditorMode = mode === 'html' ? 'text' : 'html';

    if (newMode === 'text') {
      // Converting from HTML to text
      const textContent = convertHtmlToText(value);
      onChange(textContent);
    } else {
      // Converting from text to HTML
      const htmlContent = convertTextToHtml(value);
      onChange(htmlContent);
    }

    setMode(newMode);
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Digite a URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-2 bg-gray-50">
        {/* Mode Toggle Button */}
        <button
          type="button"
          className={`px-3 py-2 rounded font-medium transition-colors ${
            mode === 'html'
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          onClick={toggleMode}
          data-testid="button-toggle-mode"
        >
          <i className={`fas ${mode === 'html' ? 'fa-code' : 'fa-font'} mr-2`}></i>
          {mode === 'html' ? 'HTML' : 'Texto'}
        </button>

        <div className="w-px bg-gray-300"></div>

        {/* HTML editing tools - only show in HTML mode */}
        {mode === 'html' && (
          <>
            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => executeCommand("bold")}
              data-testid="button-bold"
            >
              <i className="fas fa-bold"></i>
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => executeCommand("italic")}
              data-testid="button-italic"
            >
              <i className="fas fa-italic"></i>
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => executeCommand("underline")}
              data-testid="button-underline"
            >
              <i className="fas fa-underline"></i>
            </button>

            <div className="w-px bg-gray-300"></div>

            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => executeCommand("formatBlock", "h1")}
              data-testid="button-h1"
            >
              <i className="fas fa-heading"></i>1
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => executeCommand("formatBlock", "h2")}
              data-testid="button-h2"
            >
              <i className="fas fa-heading"></i>2
            </button>

            <div className="w-px bg-gray-300"></div>

            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={insertLink}
              data-testid="button-link"
            >
              <i className="fas fa-link"></i>
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => executeCommand("insertOrderedList")}
              data-testid="button-ordered-list"
            >
              <i className="fas fa-list-ol"></i>
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={() => executeCommand("insertUnorderedList")}
              data-testid="button-unordered-list"
            >
              <i className="fas fa-list-ul"></i>
            </button>
          </>
        )}
      </div>

      {/* Editor Content */}
      {mode === 'html' ? (
        <div
          ref={editorRef}
          className="p-4 min-h-64 focus:outline-none focus:ring-2 focus:ring-secondary-blue"
          contentEditable
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          data-placeholder={placeholder}
          data-testid="editor-content-html"
          style={{
            whiteSpace: "pre-wrap",
          }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          className="min-h-64 border-0 rounded-none resize-none focus:ring-2 focus:ring-secondary-blue p-4"
          data-testid="editor-content-text"
        />
      )}
    </div>
  );
}
