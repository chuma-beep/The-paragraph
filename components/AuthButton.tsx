'use client';

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { UserAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";


const supabase = createClient();

export default function AuthButton() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      setUser(user);
      
      if (user) {
        const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
        
        if (data) {
          setAvatarUrl(data.avatar_url);
        } else {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUser();
  }, []); 

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar className="h-9 w-9">
          <AvatarImage
            src={avatarUrl || '/placeholder.svg'}
            alt="User Avatar"
          />
          <AvatarFallback>
              A
          </AvatarFallback>
          <span className="sr-only">Toggle user menu</span>
        </UserAvatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/protected/account" className="flex items-center gap-2 w-full py-2 hover:bg-slate-200 text-sm">
          <div className="h-4 w-4" />
          <span>Profile</span>
        </Link>
        <Link href="/protected/account/account-settings" className="flex items-center gap-2 py-2 hover:bg-slate-200 text-sm">
          <div className="h-4 w-4" />
          <span>Settings</span>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <div className="h-4 w-4" />
          <button className="py-2 px-4 text-sm text-left pl-6 gap-2 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover hover:bg-slate-200 w-full">
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex gap-2">
      <Link href="/login" className="h-8 flex items-center justify-center rounded-md no-underline text-sm font-medium px-4">
        Login
      </Link>
      <Link href="/signup" className="h-8 flex items-center justify-center rounded-md no-underline bg-black text-white text-sm font-medium px-4">
        Sign up
      </Link>
    </div>
  );
}
