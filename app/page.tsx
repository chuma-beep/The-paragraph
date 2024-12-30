"use client";

import HomeButton from "../components/LogoButton";
import AuthButton from "../components/AuthButton";
import MainFooter from "@/components/main-footer";
import { WriteIcon } from "@/components/WriteIcon";
import Search from "@/components/Search/Search";
import { ModeToggle } from "@/components/toggle-theme";
import * as Tooltip from "@radix-ui/react-tooltip";
import LandingPage from "../components/LandingPage";

export default function Index() {
  return (
    <>
    {/* <div
      data-testid="Home"
      className="flex flex-col items-center min-h-screen w-[]"
      > */}
        <LandingPage />

      {/* Footer */}
      <footer className="w-full">
        <MainFooter />
      </footer>
    {/* </div> */}
          </>
  );
}
