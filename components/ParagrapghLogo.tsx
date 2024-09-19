
import Image from "next/image";
import Link from "next/link";

export default function ParagraphLogo() {
  return (
    <>
    <Link
      href="/"
      className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full  text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
      prefetch={false}  
    >
    <Image 
      src="/favicon.ico"
      alt="The Paragraph Logo"
      width={25}
      height={25}      
      />
      </Link>
      </>
  );
}
