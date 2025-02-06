import React, { useState } from "react";
import CodeContent from "../ui/CodeContent";
import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";
import CopySnippet from "../ui/CopySnippet";

const SnipetSyntaxModal = ({
  children,
  snippet,
  handleCopy,
  copiedSnippetId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {isOpen &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-65 flex justify-center p-5"
            onClick={closeModal}
          >
            <div className="fixed top-10 right-10 xl:hidden block z-40 text-white cursor-pointer">
              <MdClose size={24} />
            </div>
            <div className="max-w-5xl w-full flex justify-center flex-col gap-2">
              <CodeContent type="modal" onClick={(e) => e.stopPropagation()}>
                {children}
              </CodeContent>
              <div
                className="items-start mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <CopySnippet
                  snippet={snippet}
                  copiedSnippetId={copiedSnippetId}
                  handleCopy={handleCopy}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
      <CodeContent type="trigger" onClick={openModal}>
        {children}
      </CodeContent>
    </>
  );
};

export default SnipetSyntaxModal;
