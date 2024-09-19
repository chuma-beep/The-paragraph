
"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { JSX, SVGProps } from "react";

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto flex items-center">
      <div
        className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
          isExpanded ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        <button
          className="focus:outline-none"
          onClick={() => setIsExpanded(!isExpanded)}
          onBlur={() => setIsExpanded(false)}
        >
          <SearchIcon
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "transform rotate-90" : ""
            }`}
          />
        </button>
      </div>
      <Input
        type="search"
        placeholder="Search..."
        className={`w-full rounded-full bg-background pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ease-in-out ${
          isExpanded ? "w-full" : "w-0 opacity-0"
        } sm:w-full sm:opacity-100 sm:focus:w-full sm:focus:opacity-100`}
        style={{ paddingRight: isExpanded ? "2.5rem" : "0" }}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => setIsExpanded(false)}
      />
    </div>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

