// 'use client'

import DeployButton from "../components/LogoButton";
import AuthButton from "../components/AuthButton";
import MainFooter from "@/components/main-footer";
import PostList from "@/app/postlist/PostList";
import { WriteIcon } from '@/components/WriteIcon';
import Search from '@/components/Search/Search'




export default function Index() {

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />
          <div className="flex flex-row-reverse w-full items-end space-y-4 justify-items-center ">
                  <WriteIcon />
              <Search/>
          </div>
          <AuthButton />
        </div>
      </nav>
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6 px-4">
          <PostList />
        </main>
      </div>
      <div>
        <MainFooter />
      </div>
    </div>
  );
}
