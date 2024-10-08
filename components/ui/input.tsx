
import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border hover:border-transparent bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="absolute left-2 top-2.5">
          <Image src="/search.svg" height={20} width={20} alt="Search Icon" className="hover:blue-400"/>
        </span>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };



