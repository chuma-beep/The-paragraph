import Link from "next/link";
import { JSX, SVGProps } from "react";
import DeployButton from "./LogoButton";

export default function LandingPage() {
  return (
    <footer className="bg-transparent py-2 gap-0 md:py-4 md:gap-0 rounded-none md:rounded-full md:w-full ">
      <div className="container mx-auto w-full flex flex-col items-center justify-between gap-4 md:flex-row md:gap-6">
        <div className="flex justify-center md:justify-start">
          <DeployButton />
        </div>
      </div>
    </footer>
  );
}

  
