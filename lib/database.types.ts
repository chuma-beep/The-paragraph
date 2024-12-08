export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes: number | null
          post_id: string
          profile_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          post_id: string
          profile_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          post_id?: string
          profile_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      draft_tags: {
        Row: {
          draft_id: string
          tag_id: string
        }
        Insert: {
          draft_id: string
          tag_id: string
        }
        Update: {
          draft_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "draft_tags_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      drafts: {
        Row: {
          content: string | null
          cover_image_url: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          isdraft: boolean | null
          profile_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          isdraft?: boolean | null
          profile_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          isdraft?: boolean | null
          profile_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drafts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: number
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: number
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: number
          post_id: string | null
          profile_id: string | null
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: number
          post_id?: string | null
          profile_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: number
          post_id?: string | null
          profile_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id?: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_post_tags_tag_id"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          cover_image_url: string | null
          created_at: string | null
          id: string
          image_url: string | null
          likes: number | null
          profile_id: string | null
          title: string
          tsv: unknown | null
          user_id: string | null
        }
        Insert: {
          content: string
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          profile_id?: string | null
          title: string
          tsv?: unknown | null
          user_id?: string | null
        }
        Update: {
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          profile_id?: string | null
          title?: string
          tsv?: unknown | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      views: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      follower_count: {
        Row: {
          count: number | null
          following_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      following_count: {
        Row: {
          count: number | null
          follower_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      get_user_post_analytics: {
        Row: {
          post_count: number | null
          unique_posts: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      fetch_analytics: {
        Args: {
          user_id: string
        }
        Returns: {
          post_id: string
          post_title: string
          total_views: number
          total_likes: number
          total_comments: number
          total_bookmarks: number
          top_comments: Json
          recent_views: string
          created_at: string
        }[]
      }
      get_latest_comments:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              comment_id: string
              comment_text: string
              post_title: string
              created_at: string
              commenter_name: string
            }[]
          }
        | {
            Args: {
              user_id: string
            }
            Returns: {
              id: string
              post_id: string
              content: string
              created_at: string
              avatar_url: string
              post_title: string
            }[]
          }
      get_posts_by_tag: {
        Args: {
          tag_name: string
        }
        Returns: {
          id: string
          title: string
          content: string
          created_at: string
          read_time: number
          likes: number
          cover_image_url: string
          user_id: string
          isbookmarked: boolean
        }[]
      }
      get_user_post_analytics: {
        Args: {
          user_id: string
        }
        Returns: {
          post_id: string
          post_title: string
          total_views: number
          total_comments: number
          total_bookmarks: number
          total_likes: number
          created_at: string
          month: string
          year: string
        }[]
      }
      hello_world: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment: {
        Args: {
          count: number
        }
        Returns: number
      }
      increment_likes: {
        Args: {
          table_name: string
          id: string
        }
        Returns: undefined
      }
      post_performance: {
        Args: {
          post_id: string
        }
        Returns: Json
      }
      update_view_count: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
