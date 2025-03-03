"use client";
import MainFooter from "@/components/main-footer";
import LandingPage from "../components/LandingPage";
import 'react-tooltip/dist/react-tooltip.css'

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
