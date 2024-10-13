import LogoButton from "@/components/LogoButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MainFooter from "@/components/main-footer";
// import SearchBar  from "@/components/Search/SearchBar";

import PostList from "../postlist/PostList";
import { WriteIcon } from "@/components/WriteIcon";
import { ComponentsBlogSidebar } from "@/components/BlogSideBar";
import Search from "@/components/Search/Search";
import { ModeToggle } from "@/components/toggle-theme";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }




  return (
    <>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
              <LogoButton />
              <div className="flex flex-row-reverse w-full items-end mr-4 gap-2">
              <ModeToggle/>
              <WriteIcon />
              <Search />
              </div>
              <AuthButton />
            </div>
          </nav>
        </div>

        {/* Layout for sidebar and post list */}
        <div className="flex flex-row w-full max-w-5xl mx-auto px-3">
          {/* Sidebar */}
          <div className="flex mr-5">
            <ComponentsBlogSidebar />
          </div>
          
          {/* Post List */}
          <div className="w-full lg:w-4/4">
            <PostList />
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
}
