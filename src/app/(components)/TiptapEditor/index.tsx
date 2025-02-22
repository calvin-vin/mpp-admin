import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import React, { useEffect, useCallback } from "react";

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "list-disc pl-6 my-4",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "list-decimal pl-6 my-4",
          },
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== value) {
        onChange(html);
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value) {
      // Hanya set konten jika berbeda
      if (editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  const handleFocus = () => {
    editor?.chain().focus().run();
  };

  if (!editor) return null;

  return (
    <div className="border rounded-md">
      {/* Advanced Toolbar */}
      <div className="flex border-b p-2 space-x-2 bg-gray-50">
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleBold().run();
          }}
          className={`p-1 rounded ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}
          className={`p-1 rounded ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleBulletList().run();
          }}
          className={`p-1 rounded ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={`p-1 rounded ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="p-2 min-h-[150px] focus:outline-none focus:border-none focus:ring-0"
        onFocus={handleFocus}
      />
    </div>
  );
};

export default TiptapEditor;
