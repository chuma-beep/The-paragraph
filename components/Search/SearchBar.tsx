
'use client'

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
// import { supabase } from '../services/supabaseClient';




interface SearchBarProps {
  onSearch: (params: { keyword: string }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const supabase = createClient()
  const [open, setOpen] = useState(false); 
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounce(keyword, 300);
  const [suggestions, setSuggestions] = useState<any[]>([]);


   const handleSubmit = (e: React.FormEvent) =>{
    e.preventDefault();
    onSearch({ keyword });
   }

  // Fetch suggestions based on the keyword
  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]); 
      return;
    }

    const { data, error } = await supabase
      .from("post")
      .select("id, name")
      .ilike("name", `%${value}%`)
      .limit(5);

    if (!error && data) {
      setSuggestions(data); 
      setOpen(true); 
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedKeyword);
  }, [debouncedKeyword, fetchSuggestions]);

  useEffect(() => {
    if (debouncedKeyword) {
      onSearch({ keyword: debouncedKeyword });
    }
  }, [debouncedKeyword, onSearch]);

  // Close the suggestions when clicking outside of the input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".search-input-container")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-sm relative search-input-container">
      <form onSubmit={handleSubmit}>

      <Input
        placeholder="Search..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setOpen(suggestions.length > 0)}
        />

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion) => (
            <div
            key={suggestion.id}
            className="p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => {
              setKeyword(suggestion.name); 
              setOpen(false); 
            }}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
      </form>
    </div>
  );
}
