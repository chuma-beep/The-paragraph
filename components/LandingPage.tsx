"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import RiveComponent from "@rive-app/react-canvas";
import HomeButton from "../components/LogoButton";
import AuthButton from "../components/AuthButton";
import { WriteIcon } from "@/components/WriteIcon";
import { ModeToggle } from "@/components/toggle-theme";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Button } from "./ui/button";
import CommunityIcon from "../components/CommunityIcon"
import { BiDownArrow } from "react-icons/bi";




const AnalyticsVideo = dynamic(() => import("./AnalyticsVideo"));
const WriteVideo = dynamic(() => import("./WriteVideo"));

export default function LandingPage() {


  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };




  return (
    <>
   <nav className="w-full flex flex-row justify-between items-center border-b border-b-foreground/10 h-16 bg-background px-8 sm:px-8">
          <HomeButton />

        {/* Right Section: Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
           <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span className="IconButton">
                  <WriteIcon />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  Write
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
          <ModeToggle/>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span className="IconButton cursor-pointer">
                  <CommunityIcon/>
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5}>
                  Community
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
          <AuthButton />
        </div>
      </nav>

    {/* // <div className="w-full flex flex-col gap-8"> */}
    <motion.div
    initial="hidden"
    animate="visible"
    className="w-full flex flex-col gap-8 md:mt-14"
    variants={staggerContainer}
  >
      {/* <div className="flex flex-row justify-center items-center align-middle w-full  md:h-[30vh] h-[30vh] gap-0 pt-8"> */}
      <motion.div
        className="flex flex-row justify-center items-center w-full md:h-[30vh] h-[30vh] sm:pt-8 pt-0"
        variants={staggerContainer}
      >
        {/* <div className="flex flex-col w-[50vw] max-w-[500px] h-[100%]  text-left top-10 lg:mt-0 px-6"> */}
        <motion.div
          className="flex flex-col w-[50vw] max-w-[500px] px-6"
          variants={fadeInUp}
        >

          <span className="landing-span sm:text-lg md:text-xl lg:text-left">
            Welcome to
          </span>
          <h1 className="Landing-h1 text-3xl sm:text-5xl lg:text-left">
            The
          </h1>
          <h1 className="Landing-h1 text-4xl sm:text-6xl lg:text-left">
            Paragraph
          </h1>
          <p className="mt-2 text-sm sm:text-base lg:text-lg font-extralight text-slate-600 lg:text-left">
          Open Source minimalist writing platform with social features
          </p>
        </motion.div>

        {/* <div className="w-[50%] flex flex-col h-[100%]  justify-start max-w-[800px]"> */}
        <motion.div
          className="w-[50%] flex justify-start max-w-[800px]"
          variants={fadeInUp}
        >
          <Image
            width={700}
            height={800}
            alt="Top-view of a laptop and notebook surrounded by flower pots on a transparent background"
            src="/top-view-laptop-notebook-flowerpots-dark-background.png"
            className="sm:w-[30vw] md:w-[60vw] min-w-[10vw] h-auto"
          />
        </motion.div>
      </motion.div>

      {/* <div className="w-[100%] flex flex-col text-center gap-8 justify-center md:mt-64 px-4 sm:px-0"> */}
      <motion.div
        className="w-full flex flex-col text-center gap-8 md:mt-64 px-4"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
      >
      <motion.h1 className="md:text-3xl text-2xl"> Minimalist Interface</motion.h1>
      <motion.p className="text-sm sm:text-base lg:text-lg font-extralight text-slate-600 "> More focus, Less distraction</motion.p>
        <motion.div className="w-full flex justify-center" variants={fadeInUp}>
        <Image
          src="/theparagraph.png"
          width={700}
          height={700}
          alt="Home page sample"
          className="rounded-2xl shadow-lg shadow-slate-600 max-w-[900px] sm:w-[50vw] w-[100%]"
          />
      </motion.div>
          </motion.div>

      {/* <div className="w-full flex flex-col md:flex-row items-center justify-between sm:gap-0 gap-2 px-4 lg:px-16 md:mt-28"> */}
      <motion.div
        className="w-full flex flex-col md:flex-row items-center justify-between px-4 lg:px-16 md:mt-28"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
      >
        <div className="flex flex-col items-center max-w-[400px] min-h-[50px]">
          <div className="w-[100px] h-[100px] flex items-center justify-center">
            <RiveComponent src="/animations/data_analysis_cart_animation.riv" />
          </div>
          <h1 className="mt-4 text-2xl md:text-4xl text-center">
            Analytics made Easy
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-extralight text-slate-600"> Easily track and veiw interactions on posts</p>
        </div>

        {/* <div className="flex justify-center items-center min-w-[200px] min-h-[200px] w-full sm:w-1/2"> */}
        <motion.div className="flex justify-center w-full sm:w-1/2" variants={fadeInUp}>

          <AnalyticsVideo />
        </motion.div>
      </motion.div>

      <motion.div className="w-full flex flex-col md:flex-row-reverse items-center justify-between gap-0 px-4 lg:px-16 md:mt-28" 
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        >
      {/* <motion.div className="flex flex-col items-center max-w-[400px]" variants={fadeInUp}> */}
        <div className="flex flex-col items-center max-w-[400px] min-h-[50px] md:mb-20">
          <div className="w-[100px] h-[100px] flex items-center justify-center">
            <RiveComponent src="/simple_writting_notepad.riv" />
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl text-center">
           What You See Is What You Get (WYSIWYG) Editor
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-extralight text-slate-600 text-center">The Rich text editor lets you easily format and save time while customizing text.</p>
          </div>


          <motion.div className="flex justify-center items-center min-w-[200px] min-h-[200px] w-full sm:w-1/2" variants={fadeInUp}>
          {/* <AnalyticsVideo /> */}
          <WriteVideo/>
        </motion.div>
          </motion.div>
         

    </motion.div>
          <motion.div className="flex flex-col gap-12 mt-8 justify-center items-center min-w-[200px] min-h-[200px] w-full sm:w-1/2" variants={fadeInUp}>
            {/* <button>
              start writing
            </button> */}
<div className="flex items-center justify-center">
  <div className="relative group">
    <button
      className="relative inline-block p-px font-semibold leading-6 text-white bg-blue-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
    >
      <span
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-300 via-blue-300 to-purple-400 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      ></span>

      <span className="relative z-10 block px-6 py-3 rounded-xl bg-blue-800">
        <div className="relative z-10 flex items-center space-x-2">
          <span className="transition-all duration-500 group-hover:translate-x-1"
            >Let's get started</span
          >
          <svg
            className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
            data-slot="icon"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
      </span>
    </button>
  </div>
</div>
     <span className="flex flex-col text-center items-center">
      <p>
        you can view our community here
        </p>
     <BiDownArrow />
      </span>
     <CommunityIcon/>


           </motion.div>
</>
  );
}



