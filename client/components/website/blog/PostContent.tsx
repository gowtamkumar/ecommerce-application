'use client';
import MDEditor from "@uiw/react-md-editor";

export default function PostContent({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="text-gray-700 leading-relaxed blog-content" data-color-mode="light">
      <MDEditor.Markdown
        source={content}
        style={{
          whiteSpace: "pre-wrap",
          backgroundColor: "transparent",
          color: "inherit",
          fontFamily: "inherit",
          fontSize: "1.0625rem",
          lineHeight: "1.8",
        }}
      />
    </div>
  );
}
