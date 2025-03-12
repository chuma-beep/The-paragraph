import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from 'next';
 



export const metadata: Metadata = {
  // metadataBase: new URL(defaultUrl),
  title:{
    template: '%s | the-paragraph',
    default: 'the-paragraph'
  },
  description: "Real-time Blogging platform with rich text editing",
  metadataBase: new URL('https://www.the-paragraph.com/'),
};



export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <>{children}</>;
}
