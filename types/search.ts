import { Database } from "@/lib/database.types"


// export interface SearchParams {
//   query: string;
//   keyword: string;
//   username: string;
//   tags?: string| null; 
// }

// types/search.ts
export interface SearchParams {
    query: string;
    tags?: string[]; // Optional if not always required
    username: string;
    keyword: string;
    // avatar_url:string | null;
  }
  