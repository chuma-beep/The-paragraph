"use client";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { BookmarkIcon} from "lucide-react";
import { HiOutlineSaveAs } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { BiLineChart } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { PiPackageDuotone } from "react-icons/pi";
import { LuPanelLeftOpen } from "react-icons/lu";
import { TiPencil } from "react-icons/ti";
import { SiHomebridge } from "react-icons/si";




export default function SideNav() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Link
              href="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              prefetch={false}
            >
              <PiPackageDuotone />
              <span className="sr-only">The Paragraph</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <GoHome className="h-5 w-5" />  
                  <span className="sr-only">Home</span>

                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Home</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:bg-accent/90 hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  {/* <ShoppingCartIcon className="h-5 w-5" /> */}
                  <BookmarkIcon className="h-5 w-5" />
                  <span className="sr-only">Bookmarks</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Bookmarks</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  {/* <PackageIcon className="h-5 w-5" /> */}
                  <HiOutlineSaveAs />
                  <span className="sr-only">Drafts</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Drafts</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
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
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <BiLineChart className="h-5 w-5" /> 
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
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
                  href="#"
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
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  prefetch={false}
                >
                  <TiPencil />  
                  <span className="sr-only">The Paragraph</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <SiHomebridge className="h-5 w-5" />
                  <span className="sr-only">Home</span>

                </Link>
                <Link href="#" className="flex items-center gap-4 px-2.5 text-foreground" prefetch={false}>
                  <BookmarkIcon className="h-5 w-5" />  
                  Bookmarks   
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <HiOutlineSaveAs className="h-5 w-5" /> 
                  Drafts    
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >
                  <FiUsers className="h-5 w-5" />
                users
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  prefetch={false}
                >

                  <BiLineChart className="h-5 w-5" /> 
                  Analytics
                </Link>
                <Link
                  href="#"
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
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <img
                  src="/placeholder.svg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                  style={{ aspectRatio: "36/36", objectFit: "cover" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0" />
      </div>
    </div>
  )
}
