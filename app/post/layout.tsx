import { ReactNode } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import DeployButton from "@/components/LogoButton";
import { WriteIcon } from "@/components/WriteIcon";
import MainFooter from "@/components/main-footer";
import AuthButton from "@/components/AuthButton";
import Search from "@/components/Search/Search";
import { ModeToggle } from "@/components/toggle-theme";




export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-scree min-w-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white sm:p-0 px-12">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sm:p-0 px-12 pl-0">
      <div className="w-full max-w-4xl flex items-center text-sm gap-0">
          <DeployButton />
          <div className="flex flex-row-reverse w-full items-end mr-2 gap-2">
            <ModeToggle/>
          <WriteIcon />
          <Search/>
          </div>
          <AuthButton />
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
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