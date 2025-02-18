import React, { useState, forwardRef, useImperativeHandle } from "react";
import CodeContent from "../ui/CodeContent";
import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";
import CopySnippet from "../ui/CopySnippet";
import { FiMaximize2 } from "react-icons/fi";

const SnipetSyntaxModal = forwardRef(
  ({ children, snippet, handleCopy, copiedSnippetId }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };

    useImperativeHandle(ref, () => ({
      openModal,
    }));

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
        <div className="group relative flex-1 flex flex-col h-full">
          <CodeContent type="trigger" onClick={openModal} className="flex-1">
            {children}
          </CodeContent>
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openModal();
            }}
          >
            <FiMaximize2
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              size={18}
            />
          </div>
        </div>
      </>
    );
  }
);

export default SnipetSyntaxModal;
