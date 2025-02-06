import React from "react";
import { IoIosClose } from 'react-icons/io';

function Modal({ isOpen, onClose, onOk, children }) {
  const showHideClassName = isOpen ? "block" : "hidden";

  return (
    <div className={`fixed z-50 inset-0 overflow-y-auto ${showHideClassName}`}>
      <div className="flex items-center justify-center h-screen pt-4 px-4 pb-20 text-center  ">
     
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-400 opacity-80"></div>
        </div>
     
        <div
          className="inline-block bg-white rounded-md text-center overflow-hidden shadow-xl transform transition-all sm:my-8 align-middle  w-10/12 sm:max-w-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
           <div className="h-1 w-auto bg-red-700"></div>
           <button  onClick={onClose} className="absolute top-0 right-0 w-12 h-12 m-0 p-1 text-gray-300 hover:text-gray-600 ">
           <IoIosClose size={35}/>
           </button>
          {children}

          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between gap-6">
            <button
              type="button"
              className="flex h-9 w-full justify-center px-3 sm:px-4 py-1 text-slate-700 border border-slate-300  hover:bg-gray-200 rounded-md duration-150"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 w-full flex justify-center items-center rounded-md border border-transparent shadow-sm px-3 sm:px-4 py-1 bg-red-700 text-base text-white hover:bg-red-800"
              onClick={onOk}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
