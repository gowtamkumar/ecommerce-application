import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

interface TextQuillEditorProps {
  editorContent: string;
  // setEditorContent: React.Dispatch<React.SetStateAction<string>>;
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
        theme="snow" // You can choose between 'bubble' or 'snow'
        placeholder="Start typing here..."
      />
      <div style={{ marginTop: "20px" }}>
        <h3>Editor Output</h3>
        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
      </div>
    </div>
  );
};

export default TextQuillEditor;
