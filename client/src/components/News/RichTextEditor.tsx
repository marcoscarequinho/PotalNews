import { useState, useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
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
      </div>
      
      {/* Editor Content */}
      <div
        ref={editorRef}
        className="p-4 min-h-64 focus:outline-none focus:ring-2 focus:ring-secondary-blue"
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        data-testid="editor-content"
        style={{
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
}
