'use client'

import SearchBar from "@/components/Search/SearchBar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {motion, AnimatePresence } from 'framer-motion';
import { BiSearch } from "react-icons/bi";
import { searchPosts } from "@/utils/searchUtils";
import { useState } from "react";
import Link from "next/link";

interface SearchParams{
    query: string;
    username: string;
    keyword: string;

}



interface ResultType{
    id: string;
    url: string;
    title: string;
    description: string;
    username: string;
    //avatar_url: string | url;
}




export default function SearchContent(){

    const [searchResults, setSearchResults] = useState<ResultType[]>([])


    const handleSearch = async (params: {keyword: string})=> {

       //serach params
       const searchParams: SearchParams = {
        keyword: params.keyword,
        query: params.keyword,
        username: params.keyword,
       }
        try{
            const results = await searchPosts(searchParams);
            setSearchResults(results);
        }catch(error){
            console.error('Search failed:', error)
        }

    }

     return(
        <Popover>
        <PopoverTrigger asChild>
          <div>
            <BiSearch className="text-3xl font-semibold pb-2 hover:text-blue-400 focus:text-blue-400"/>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 sm:w-full sm:justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <SearchBar onSearch={handleSearch} />
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                className="search-results space-y-2 overflow-y-auto"
                style={{ maxHeight: '300px' }} 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/post/${result.id}`} passHref
                    className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {result.title}
                    </p>
                    <div className="w-full">

                  <div className="space-x-3 flex flex-row justify-end">
                    <div className="flex">
                  <i
                      
                      className="font-sans font-thin text-xs pr-2 ">by</i>
  {(() => {
    try {
      const parsedDescription = JSON.parse(result.description);
      
      return parsedDescription.avatar_url ? (
        <img
        src={parsedDescription.avatar_url}
        alt={`${parsedDescription.username}'s avatar`}
        className="h-6 w-6 rounded-full"
        />
      ) : (
        <img
        src="/path/to/default/avatar.png"
        alt="Default avatar"
        className="h-6 w-6 rounded-full"
        />
      );
    } catch (error) {
      console.error("Failed to parse description:", error);
      return (
        <img
        src="/path/to/default/avatar.png"
        alt="Default avatar"
        className="h-6 w-6 rounded-full"
        />
      );
    }
  })()}

    <p className="text-sm">
      {(() => {
        try {
          const parsedDescription = JSON.parse(result.description);
          return parsedDescription.username || "Unknown User";
        } catch (error) {
          return "Unknown User";
        }
      })()}
    </p>
      </div>
  </div>

                </div>
                  </Link>
                ))}
                </motion.div>
            )}
            </AnimatePresence>
            </PopoverContent>
            </Popover>
            
          )


}