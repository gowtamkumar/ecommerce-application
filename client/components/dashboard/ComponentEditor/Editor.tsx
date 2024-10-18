import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const TextEditor = () => {
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (content: React.SetStateAction<string>) => {
    setEditorContent(content);
  };

  return (
    <div>
      <h2>React Text Editor</h2>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        theme="snow" // You can choose between 'bubble' or 'snow'
        placeholder="Start typing here..."
      />
      <div style={{ marginTop: '20px' }}>
        <h3>Editor Output</h3>
        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
      </div>
    </div>
  );
};

export default TextEditor;
