export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      city: {
        Row: {
          cantonese_name: string | null
          english_name: string | null
          id: number
          province_uuid: string | null
          uuid: string
          value: string
        }
        Insert: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          province_uuid?: string | null
          uuid?: string
          value: string
        }
        Update: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          province_uuid?: string | null
          uuid?: string
          value?: string
        }
        Relationships: []
      }
      country: {
        Row: {
          cantonese_name: string | null
          english_name: string | null
          id: number
          uuid: string
          value: string | null
        }
        Insert: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          uuid?: string
          value?: string | null
        }
        Update: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          uuid?: string
          value?: string | null
        }
        Relationships: []
      }
      industry: {
        Row: {
          cantonese_name: string | null
          english_name: string | null
          id: number
          uuid: string
          value: string | null
        }
        Insert: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          uuid?: string
          value?: string | null
        }
        Update: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          uuid?: string
          value?: string | null
        }
        Relationships: []
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
          type?: string | null
          url?: string | null
          uuid?: string | null
          year_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_city_uuid_fkey"
            columns: ["city_uuid"]
            referencedRelation: "city"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_country_uuid_fkey"
            columns: ["country_uuid"]
            referencedRelation: "country"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_industry_uuid_fkey"
            columns: ["industry_uuid"]
            referencedRelation: "industry"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_province_uuid_fkey"
            columns: ["province_uuid"]
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
            referencedRelation: "post"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "post_contact_history_sender_uuid_fkey"
            columns: ["sender_uuid"]
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
        ]
      }
      province: {
        Row: {
          cantonese_name: string | null
          country_uuid: string | null
          english_name: string | null
          id: number
          uuid: string
          value: string
        }
        Insert: {
          cantonese_name?: string | null
          country_uuid?: string | null
          english_name?: string | null
          id?: number
          uuid?: string
          value: string
        }
        Update: {
          cantonese_name?: string | null
          country_uuid?: string | null
          english_name?: string | null
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
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "referral_contact_history_sender_uuid_fkey"
            columns: ["sender_uuid"]
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
          username: string | null
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
          username?: string | null
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
          username?: string | null
          uuid?: string
          year_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_city_uuid_fkey"
            columns: ["city_uuid"]
            referencedRelation: "city"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_country_uuid_fkey"
            columns: ["country_uuid"]
            referencedRelation: "country"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_industry_uuid_fkey"
            columns: ["industry_uuid"]
            referencedRelation: "industry"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_province_uuid_fkey"
            columns: ["province_uuid"]
            referencedRelation: "province"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_uuid_fkey"
            columns: ["uuid"]
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
