"use client";
import dynamic from 'next/dynamic';
import React from 'react';
import 'react-quill/dist/quill.snow.css';

interface TextQuillEditorProps {
  editorContent: string;
  setEditorContent: any;
}
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

const TextQuillEditor: React.FC<TextQuillEditorProps> = ({ editorContent, setEditorContent }) => {
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <div>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        theme="snow"
        placeholder="Start typing here..."
      />
    </div>
  );
};

export default TextQuillEditor;
