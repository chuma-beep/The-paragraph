// 'use client'

import DeployButton from "../components/LogoButton";
import AuthButton from "../components/AuthButton";
import MainFooter from "@/components/main-footer";
import PostList from "@/app/postlist/PostList";
import { WriteIcon } from '@/components/WriteIcon';
import Search from '@/components/Search/Search'
import { ComponentsBlogSidebar } from "@/components/BlogSideBar";
import { ModeToggle } from "@/components/toggle-theme";




export default function Index() {

  return (
    <div data-testid="Home"  className="w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex items-center text-sm gap-0">
          <DeployButton />
          <div className="flex flex-row-reverse w-full mr-1 items-end gap-1">
               <ModeToggle/>
                  <WriteIcon />
              <Search/>
          </div>
          <AuthButton />
        </div>
      </nav>
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
          
        <main className="flex flex-row  justify-between">
          <span className="h-fit">

        <ComponentsBlogSidebar />
          </span>
          <span
           className=""
          >

          <PostList />
          </span>
        </main>
      </div>
      <div>
        <MainFooter />
      </div>
    </div>
  );
}
