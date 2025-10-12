"use client";

import React, { useMemo } from "react";
import { generateHTML } from "@tiptap/react";
import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

import parse from "html-react-parser";

export function RenderSubDescription({ json }: { json: JSONContent }) {
  const output = useMemo(() => {
    // Validate JSON input
    if (!json || typeof json !== "object") {
      console.error("Invalid JSON content:", json);
      return "<p>Invalid content</p>";
    }

    try {
      return generateHTML(json, [
        StarterKit,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ]);
    } catch (error) {
      console.error("Error generating HTML from JSON:", error);
      console.error("JSON content:", json);
      return "<p>Error rendering content</p>";
    }
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary max-w-none">
      {parse(output)}
    </div>
  );
}
