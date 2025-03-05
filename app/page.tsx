"use client";
import MainFooter from "@/components/main-footer";
import LandingPage from "../components/LandingPage";
import 'react-tooltip/dist/react-tooltip.css'
// import { getSession } from 'next-auth/react'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Index() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/protected"); 
    }
  }, [session, router]);

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






