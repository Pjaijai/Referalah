export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      city: {
        Row: {
          cantonese_name: string
          english_name: string
          id: number
          province_uuid: string
          uuid: string
          value: string
        }
        Insert: {
          cantonese_name: string
          english_name: string
          id?: number
          province_uuid: string
          uuid?: string
          value: string
        }
        Update: {
          cantonese_name?: string
          english_name?: string
          id?: number
          province_uuid?: string
          uuid?: string
          value?: string
        }
        Relationships: []
      }
      config: {
        Row: {
          id: number
          name: string
          value: string
        }
        Insert: {
          id?: number
          name: string
          value: string
        }
        Update: {
          id?: number
          name?: string
          value?: string
        }
        Relationships: []
      }
      conversation: {
        Row: {
          created_at: string
          id: number
          is_receiver_accepted: boolean
          is_receiver_seen: boolean
          is_sender_seen: boolean
          last_message_uuid: string | null
          last_updated_at: string
          receiver_uuid: string
          sender_uuid: string
          status: Database["public"]["Enums"]["conversation_status"]
          uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_receiver_accepted?: boolean
          is_receiver_seen?: boolean
          is_sender_seen?: boolean
          last_message_uuid?: string | null
          last_updated_at?: string
          receiver_uuid: string
          sender_uuid: string
          status?: Database["public"]["Enums"]["conversation_status"]
          uuid?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_receiver_accepted?: boolean
          is_receiver_seen?: boolean
          is_sender_seen?: boolean
          last_message_uuid?: string | null
          last_updated_at?: string
          receiver_uuid?: string
          sender_uuid?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_last_message_uuid_fkey"
            columns: ["last_message_uuid"]
            isOneToOne: false
            referencedRelation: "message"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "conversation_receiver_uuid_fkey"
            columns: ["receiver_uuid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "conversation_sender_uuid_fkey"
            columns: ["sender_uuid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
        ]
      }
      country: {
        Row: {
          cantonese_name: string
          english_name: string
          id: number
          uuid: string
          value: string
        }
        Insert: {
          cantonese_name: string
          english_name: string
          id?: number
          uuid?: string
          value: string
        }
        Update: {
          cantonese_name?: string
          english_name?: string
          id?: number
          uuid?: string
          value?: string
        }
        Relationships: []
      }
      industry: {
        Row: {
          cantonese_name: string
          english_name: string
          id: number
          uuid: string
          value: string
        }
        Insert: {
          cantonese_name: string
          english_name: string
          id?: number
          uuid?: string
          value: string
        }
        Update: {
          cantonese_name?: string
          english_name?: string
          id?: number
          uuid?: string
          value?: string
        }
        Relationships: []
      }
      message: {
        Row: {
          body: string
          conversation_uuid: string
          created_at: string
          id: number
          sender_uuid: string
          status: Database["public"]["Enums"]["message_status"]
          uuid: string
        }
        Insert: {
          body: string
          conversation_uuid: string
          created_at?: string
          id?: number
          sender_uuid?: string
          status?: Database["public"]["Enums"]["message_status"]
          uuid?: string
        }
        Update: {
          body?: string
          conversation_uuid?: string
          created_at?: string
          id?: number
          sender_uuid?: string
          status?: Database["public"]["Enums"]["message_status"]
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_sender_uuid_fkey"
            columns: ["sender_uuid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
        ]
      }
      post: {
        Row: {
          city_uuid: string | null
          company_name: string | null
          country_uuid: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          industry_uuid: string | null
          job_title: string | null
          province_uuid: string | null
          status: Database["public"]["Enums"]["post_status"]
          type: string | null
          url: string | null
          uuid: string | null
          year_of_experience: number | null
        }
        Insert: {
          city_uuid?: string | null
          company_name?: string | null
          country_uuid?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          industry_uuid?: string | null
          job_title?: string | null
          province_uuid?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          type?: string | null
          url?: string | null
          uuid?: string | null
          year_of_experience?: number | null
        }
        Update: {
          city_uuid?: string | null
          company_name?: string | null
          country_uuid?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          industry_uuid?: string | null
          job_title?: string | null
          province_uuid?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          type?: string | null
          url?: string | null
          uuid?: string | null
          year_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_city_uuid_fkey"
            columns: ["city_uuid"]
            isOneToOne: false
            referencedRelation: "city"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_country_uuid_fkey"
            columns: ["country_uuid"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_industry_uuid_fkey"
            columns: ["industry_uuid"]
            isOneToOne: false
            referencedRelation: "industry"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_province_uuid_fkey"
            columns: ["province_uuid"]
            isOneToOne: false
            referencedRelation: "province"
            referencedColumns: ["uuid"]
          },
        ]
      }
      post_contact_history: {
        Row: {
          created_at: string | null
          id: number
          message: string | null
          post_uuid: string | null
          sender_uuid: string | null
          type: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message?: string | null
          post_uuid?: string | null
          sender_uuid?: string | null
          type?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string | null
          post_uuid?: string | null
          sender_uuid?: string | null
          type?: string | null
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_contact_history_post_uuid_fkey"
            columns: ["post_uuid"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_contact_history_sender_uuid_fkey"
            columns: ["sender_uuid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
        ]
      }
      province: {
        Row: {
          cantonese_name: string
          country_uuid: string
          english_name: string
          id: number
          uuid: string
          value: string
        }
        Insert: {
          cantonese_name: string
          country_uuid: string
          english_name: string
          id?: number
          uuid?: string
          value: string
        }
        Update: {
          cantonese_name?: string
          country_uuid?: string
          english_name?: string
          id?: number
          uuid?: string
          value?: string
        }
        Relationships: []
      }
      referral_contact_history: {
        Row: {
          created_at: string | null
          id: number
          message: string | null
          receiver_uuid: string | null
          sender_uuid: string | null
          type: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message?: string | null
          receiver_uuid?: string | null
          sender_uuid?: string | null
          type?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string | null
          receiver_uuid?: string | null
          sender_uuid?: string | null
          type?: string | null
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_contact_history_receiver_uuid_fkey"
            columns: ["receiver_uuid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "referral_contact_history_sender_uuid_fkey"
            columns: ["sender_uuid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
        ]
      }
      user: {
        Row: {
          avatar_url: string | null
          city_uuid: string | null
          company_name: string | null
          country_uuid: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: number
          industry_uuid: string | null
          is_referee: boolean | null
          is_referer: boolean | null
          job_title: string | null
          province_uuid: string | null
          resume_url: string | null
          role: string | null
          social_media_url: string | null
          status: string | null
          username: string
          uuid: string
          year_of_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          city_uuid?: string | null
          company_name?: string | null
          country_uuid?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: number
          industry_uuid?: string | null
          is_referee?: boolean | null
          is_referer?: boolean | null
          job_title?: string | null
          province_uuid?: string | null
          resume_url?: string | null
          role?: string | null
          social_media_url?: string | null
          status?: string | null
          username: string
          uuid?: string
          year_of_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          city_uuid?: string | null
          company_name?: string | null
          country_uuid?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: number
          industry_uuid?: string | null
          is_referee?: boolean | null
          is_referer?: boolean | null
          job_title?: string | null
          province_uuid?: string | null
          resume_url?: string | null
          role?: string | null
          social_media_url?: string | null
          status?: string | null
          username?: string
          uuid?: string
          year_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_city_uuid_fkey"
            columns: ["city_uuid"]
            isOneToOne: false
            referencedRelation: "city"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_country_uuid_fkey"
            columns: ["country_uuid"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_industry_uuid_fkey"
            columns: ["industry_uuid"]
            isOneToOne: false
            referencedRelation: "industry"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_province_uuid_fkey"
            columns: ["province_uuid"]
            isOneToOne: false
            referencedRelation: "province"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_has_conversation_unseen: {
        Args: Record<PropertyKey, never>
        Returns: {
          has_unseen: boolean
        }[]
      }
      find_conversation: {
        Args: {
          user1_uuid: string
          user2_uuid: string
        }
        Returns: {
          id: number
          created_at: string
          sender_uuid: string
          receiver_uuid: string
          uuid: string
          is_receiver_accepted: boolean
          status: Database["public"]["Enums"]["conversation_status"]
          is_receiver_seen: boolean
          is_sender_seen: boolean
          last_message_uuid: string
        }[]
      }
    }
    Enums: {
      conversation_status: "active" | "inactive"
      message_status: "active" | "inactive"
      post_status: "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
