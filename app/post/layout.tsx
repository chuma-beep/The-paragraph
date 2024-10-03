// Import necessary modules and components
import { ReactNode } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import DeployButton from "@/components/LogoButton";
import { SearchBar } from "@/components/search-bar";
import { WriteIcon } from "@/components/WriteIcon";
import MainFooter from "@/components/main-footer";
import AuthButton from "@/components/AuthButton";
// import { BlogFloatingBookmarkButton } from "@/components/BlogFloatingBookmarkButton";


// Define the layout component
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-scree min-w-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />
          <SearchBar />
          <WriteIcon />
          <AuthButton />
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
        {/* <BlogFloatingBookmarkButton postId="your-post-id" userId={user?.id} /> */}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <MainFooter />
        </div>
      </footer>
    </div>
  );
}
