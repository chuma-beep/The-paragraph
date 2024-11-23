"use client";


import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { BookmarkIcon} from "lucide-react";
import { HiOutlineSaveAs } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { BiLineChart } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { LuPanelLeftOpen } from "react-icons/lu";
import Image from "next/image";
import { GiNotebook } from "react-icons/gi";
import { ModeToggle } from "@/components/toggle-theme";
//import { useEffect, useState } from "react";

import LoggedInUser from "./LoggedInUser";



export default function Layout({ children }: { children: React.ReactNode }) {

  
  const pathname = usePathname(); 
  const isActive = (path: string) => pathname === path;



  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
            <TooltipProvider>
            <TooltipTrigger>
            <Link
              href="/protected"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full  text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              prefetch={false}
              >
                <Image
                  src="/favicon.gif"
                  alt="The Paragraph"
                  width={42}
                  height={42}
                  priority
                  className="h-5 w-5"         
                  />
              <span className="sr-only">The Paragraph</span>
            </Link>
               </TooltipTrigger>
                  <TooltipContent side="right">Home</TooltipContent>
                  </TooltipProvider>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/protected/account/write"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <GiNotebook className="h-5 w-5" />  
                  <span className="sr-only">Write</span>

                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Write</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/protected/account/bookmarks"
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent/90 hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >

                  <BookmarkIcon className="h-5 w-5" />
                  <span className="sr-only">Bookmarks</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Bookmarks</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/protected/account/drafts"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <HiOutlineSaveAs />
                  <span className="sr-only">Drafts</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Drafts</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/protected/account/interactions"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <FiUsers className="h-5 w-5" /> 
                  <span className="sr-only">Interactions</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Interactions</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/protected/account/analytics"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <BiLineChart className="h-5 w-5" /> 
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href=""
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <ModeToggle/>
                  <span className="sr-only">Theme</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
          <Tooltip>
              <TooltipTrigger asChild>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/protected/account"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  
                  <LoggedInUser  />
                  <span className="sr-only">Profile Page</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/protected/account/account-settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <IoSettingsOutline className="h-5 w-5" /> 
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
              <LuPanelLeftOpen />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/protected"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
                  prefetch={false}
                >
                  <Image
                    src="/favicon.gif"
                    alt="The Paragraph"
                    width={42}
                    height={42}
                    className="h-5 w-5"
                  />
                  <span className="sr-only">The Paragraph</span>
                </Link>
                <Link
                  href="/protected/account/write"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <GiNotebook className="h-5 w-5" />
                  Write
                  <span className="sr-only">write</span>

                </Link>
                <Link href="/protected/account/bookmarks" className="flex items-center gap-4 px-2.5" prefetch={false}>
                  <BookmarkIcon className="h-5 w-5" />  
                  Bookmarks   
                </Link>
                <Link
                  href="/protected/account/drafts"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <HiOutlineSaveAs className="h-5 w-5" /> 
                  Drafts    
                </Link>
                <Link
                  href="/protected/account/interactions"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <FiUsers className="h-5 w-5" />
                  interactions
                </Link>
                <Link
                  href="/protected/account/analytics"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >

                  <BiLineChart className="h-5 w-5" /> 
                  Analytics
                </Link>
                <Link
                  href=""
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >

                  <ModeToggle/>
                  Theme
                </Link>
                <Link
                  href="/protected/account/"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >

                  <LoggedInUser />
                  Profile
                </Link>
                <Link
                  href="/protected/account/account-settings"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <IoSettingsOutline className="h-5 w-5" />   
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
          </div>
        </header>
        <main className="flex-1 p-0 sm:px-0 sm:py-0">{children}</main>      
        <main className="flex-1 p-0 sm:px-0 sm:py-0" />
      </div>
    </div>
  )
}