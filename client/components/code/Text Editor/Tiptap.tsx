"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
import textAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

const Tiptap = ({ field }: { field: any }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      textAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl",
      },
    },
    content: "<p>Talk more about your course</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
  });

  // 🔥 Update TipTap editor content whenever the form value changes
  useEffect(() => {
    if (editor && field?.value) {
      try {
        const value =
          typeof field.value === "string"
            ? JSON.parse(field.value)
            : field.value;

        // Only update if the current content differs (avoids infinite loop)
        const currentContent = editor.getJSON();
        if (JSON.stringify(currentContent) !== JSON.stringify(value)) {
          editor.commands.setContent(value);
        }
      } catch {
        editor.commands.setContent("<p>Talk more about your course</p>");
      }
    }
  }, [field.value, editor]);

  return (
    <div className="w-full border border-slate-300 focus:outline-none rounded-lg overflow-hidden">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
