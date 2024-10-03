'use client'
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import {useEffect, useMemo, useState} from "react";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { Unica_One } from "next/font/google";
//import TextareaAutosize from "react-textarea-autosize";
// import { title } from "process";


 export default function Write() {
  const [content, setContent] = useState("");


  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor"), { ssr: false }), 
    []
  );

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };
  


  return (

      <main className="min-h-screen">
         <div className="flex flex-col px-24 py-10 w-full">
      <Editor
      id="editor"
       editable={true}
       onChange={handleEditorChange}
       initialContent=""/>
      <ToastContainer
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
     </div>

     </main>
  );
}