"use client";
import { text } from "stream/consumers";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
export default function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Welcome",
    },
    {
      text: "To the",
    },
    {
      text: "Paragraph",
    },
    {
      text: "Login to",
    },
    { 
      text: "Join the",
    },
    {
      text: "Conversation",

      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[10rem]  ">

      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
       
      </div>
    </div>
  );
}
