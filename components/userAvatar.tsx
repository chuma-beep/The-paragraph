import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { UserAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

export function Avatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="AvatarImage" />
          <AvatarFallback>JP</AvatarFallback>
          <span className="sr-only">Toggle user menu</span>
        </UserAvatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <div className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <div className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <div className="h-4 w-4" />
            <span>Log Out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
