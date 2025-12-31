'use client';
import MDEditor from "@uiw/react-md-editor";

export default function PostContent({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="text-gray-600 mt-4 blog-content">
      <MDEditor.Markdown source={content} style={{ whiteSpace: "pre-wrap", backgroundColor: "transparent", color: "inherit" }} />
    </div>
  )
}
