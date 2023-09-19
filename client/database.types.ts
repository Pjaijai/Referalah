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
          uuid: string | null
          value: string | null
        }
        Insert: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          uuid?: string | null
          value?: string | null
        }
        Update: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          uuid?: string | null
          value?: string | null
        }
        Relationships: []
      }
      industry: {
        Row: {
          cantonese_name: string | null
          english_name: string | null
          id: number
          uuid: string | null
          value: string | null
        }
        Insert: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          uuid?: string | null
          value?: string | null
        }
        Update: {
          cantonese_name?: string | null
          english_name?: string | null
          id?: number
          uuid?: string | null
          value?: string | null
        }
        Relationships: []
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
      user: {
        Row: {
          avatar_url: string | null
          chinese_first_name: string | null
          chinese_last_name: string | null
          city_uuid: string | null
          company_name: string | null
          country_uuid: string | null
          created_at: string | null
          description: string | null
          email: string | null
          english_first_name: string | null
          english_last_name: string | null
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
          uuid: string | null
          year_of_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          chinese_first_name?: string | null
          chinese_last_name?: string | null
          city_uuid?: string | null
          company_name?: string | null
          country_uuid?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          english_first_name?: string | null
          english_last_name?: string | null
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
          uuid?: string | null
          year_of_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          chinese_first_name?: string | null
          chinese_last_name?: string | null
          city_uuid?: string | null
          company_name?: string | null
          country_uuid?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          english_first_name?: string | null
          english_last_name?: string | null
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
          uuid?: string | null
          year_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_uuid_fkey"
            columns: ["uuid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
