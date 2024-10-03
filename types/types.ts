import { Database } from "@/lib/database.types"


// Extract specific table row types
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];


export interface PostWithRelations extends Post {
  profiles?: Profile;
  isbookmarked?: boolean; 
  post_tags?: Database["public"]["Tables"]["post_tags"]["Row"][];
}
