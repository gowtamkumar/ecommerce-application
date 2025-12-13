"use client";
import React from 'react';
import ReactQuill from 'react-quill';
// Importing from 'quill' directly because 'react-quill/dist/quill.snow.css' is not resolving correctly
import "quill/dist/quill.snow.css";

interface TextQuillEditorProps {
  editorContent: string;
  setEditorContent: any;
}

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
