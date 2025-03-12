import Link from "next/link";
import { JSX, SVGProps } from "react";
import DeployButton from "./LogoButton";
import ParagraphLogo from "./ParagrapghLogo";

export default function MainFooter() {
  return (
    <footer className="bg-transparent py-2 gap-0 md:py-4 md:gap-0 rounded-none md:rounded-full md:w-full ">
      <div className="container mx-auto w-full flex flex-col items-center justify-between gap-4 md:flex-row md:gap-6">
        <div className="flex justify-center md:justify-start">
          {/* <DeployButton /> */}
        
          <div className="w-full max-w-md mr-2 ml-0">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 cursor-pointer hover:border-blue-400">
            <ParagraphLogo />
          </span>
        </div>
        {/* <h1 className="text-xs sm:text-lg font-semibold text-blue-400 text-center lg:display-none">The Paragraph</h1> */}
        <h1 className="text-xs sm:text-lg font-semibold text-blue-400 text-center">
          The Paragraph
        </h1> 
              </div>
    </div>
        
        </div>
        <p className="text-sm text-muted-foreground text-center md:text-left">&copy; 2024 TheParagraph Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" aria-label="Twitter" prefetch={false}>
            <TwitterIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="#" aria-label="Facebook" prefetch={false}>
            <FacebookIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="#" aria-label="Instagram" prefetch={false}>
            <InstagramIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
