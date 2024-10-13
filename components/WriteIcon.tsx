import { Button } from "@/components/ui/button"
import { GiNotebook } from "react-icons/gi";
// import { TfiWrite } from "react-icons/tfi";
import Link from "next/link";



export function WriteIcon() {
  return (
      <div data-testid="write-icon">
    <Button  variant="outline" className="bg-transparent text-primary rounded-full flex flex-row hover:text-blue-300">
      <Link
      href="/protected/account/write"     
      >
    <GiNotebook
        className="w-5 h-5 "  
    
    />
      </Link>
    </Button>
  </div>
  )
}
