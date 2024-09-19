import { Button } from "@/components/ui/button"
import { GiNotebook } from "react-icons/gi";
// import { TfiWrite } from "react-icons/tfi";
import Link from "next/link";



export function WriteIcon() {
  return (
    <Button variant="outline" className="bg-white mx-2 text-primary rounded-full flex flex-row hover:text-blue-300">
      <Link
      href="/protected/account/write"     
      >
    <GiNotebook
     className="w-6 h-6 "  
    
    />
      {/* <TfiWrite /> */}
      </Link>
    </Button>
  )
}
