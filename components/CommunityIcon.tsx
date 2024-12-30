import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineUserGroup } from "react-icons/hi2";


export default function CommunityIcon() {
  return (
      <div data-testid="write-icon">
    <Button  variant="outline" className="bg-transparent text-primary rounded-full flex flex-row hover:text-blue-300">
      <Link
      href="/community"
      >
    <HiOutlineUserGroup
        className="w-5 h-5"  
    />
      </Link>
    </Button>
  </div>
  )
}
