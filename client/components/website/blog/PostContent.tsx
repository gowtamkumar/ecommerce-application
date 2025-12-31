'use client';
import MDEditor from "@uiw/react-md-editor";

export default function PostContent({ content }: { content: string }) {
  return (
    <div className="text-gray-600 mt-4">
      <MDEditor.Markdown source={content.slice(0, 300)} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  )
}
