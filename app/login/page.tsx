import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../components/forms/submit-button";
import { Label } from "@/components/forms/label";
import { Input } from "@/components/forms/input";
import { FormMessage, Message } from "@/components/forms/form-message";
import { encodedRedirect } from "@/utils/utils";
import GithubAuthenticate from "./github/GithubAuth";
import GoogleAuthenticate from "./google/GoogleAuthButton";
import Image from "next/image";
import { useSession } from 'next-auth/react'




export default function Login({ searchParams }: { searchParams: Message }) {
  const login = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return encodedRedirect("error", "/login", "Could not authenticate user");
    }

    return redirect("/protected");
  };

  return (
    <div   className="flex flex-col flex-1 p-4 w-full items-center">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>
      <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
        <Image
          src="/LoginGuy.jpg"
          alt="Logo"
          width={600}
          height={600}
          className="mb-6 lg:mb-0 hidden lg:block"
        />

      <div   className="flex flex-col">
      <form className="flex mt-40 flex-col w-full justify-center gap-2 text-foreground [&>input]:mb-6 max-w-md p-4">
        <h1 className="text-2xl font-medium">Log in</h1>
        <p   className="text-sm text-foreground/60">
          Don't have an account?{" "}
          <Link data-testid="signup-link"  className="text-blue-600 font-medium underline" href="/signup">
            Sign up
          </Link>
        </p>
        <div   className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input data-testid="email-input" name="email" placeholder="you@example.com" required />
          <div  className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>

            <Link
              className="text-sm text-blue-600 underline"
              href="/forgot-password"
              >
              Forgot Password?
            </Link>
          </div>
          <Input
            data-testid="password-input"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            />
          <SubmitButton data-testid="login-button"  formAction={login} pendingText="Signing In...">
            Log in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <div className="flex flex-col justify-center items-center">
  <p>or</p>
  <hr className="my-12 h-0.5 w-full border-t-0 bg-slate-300 dark:bg-white/10" />
  <div className="flex space-x-4">
    <GithubAuthenticate />
    <GoogleAuthenticate />
  </div>
</div>
</div>

            </div>
    </div>
  );
}