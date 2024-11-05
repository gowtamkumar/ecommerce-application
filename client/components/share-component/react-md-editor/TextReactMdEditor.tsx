import React from "react";
import MDEditor from "@uiw/react-md-editor";

interface TextQuillEditorProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TextReactMdEditor: React.FC<TextQuillEditorProps> = ({
  value,
  setValue,
}) => {
  const handleEditorChange = (content: any) => {
    setValue(content);
  };

  return (
    <div>
      <MDEditor value={value} onChange={handleEditorChange} />
      <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
};

export default TextReactMdEditor;
