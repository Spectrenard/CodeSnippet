import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeContent = ({ type, children, onClick }) => {
  return (
    <SyntaxHighlighter
      language="javascript"
      className={`rounded-lg flex-grow overflow-auto !mt-0 ${
        type === "trigger" || "cursor-pointer"
      }`}
      style={vscDarkPlus}
      onClick={onClick}
      customStyle={{
        borderRadius: type === "trigger" && "0.5rem",
        padding: "1rem",
        fontSize: "0.9rem",
        maxHeight: type === "trigger" ? "12rem" : "100%",
        overflow: "auto",
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeContent;
