export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      company: {
        Row: {
          created_at: string
          id: number
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          logo_url?: string | null
          name?: string
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
      email_notification_log: {
        Row: {
          body: string | null
          created_at: string | null
          email: string | null
          id: number
          title: string | null
          type: string
          user_uuid: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          title?: string | null
          type: string
          user_uuid: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          title?: string | null
          type?: string
          user_uuid?: string
        }
        Relationships: []
      }
      fire: {
        Row: {
          created_at: string
          created_by: string
          id: number
          ref_uuid: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          ref_uuid: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          ref_uuid?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_fire_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
        ]
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
      job_journey: {
        Row: {
          application_submitted_date: string
          company_id: number | null
          company_name: string | null
          created_at: string
          created_by: string
          description: string
          fire_count: number
          id: number
          industry_uuid: string
          job_level: string
          job_type: string
          last_step_status: string | null
          last_step_status_updated_at: string | null
          location_uuid: string
          position_title: string
          source: string
          status: string
          title: string
          updated_at: string | null
          uuid: string | null
          visibility: string
        }
        Insert: {
          application_submitted_date: string
          company_id?: number | null
          company_name?: string | null
          created_at?: string
          created_by: string
          description: string
          fire_count?: number
          id?: number
          industry_uuid: string
          job_level: string
          job_type: string
          last_step_status?: string | null
          last_step_status_updated_at?: string | null
          location_uuid: string
          position_title: string
          source: string
          status?: string
          title: string
          updated_at?: string | null
          uuid?: string | null
          visibility?: string
        }
        Update: {
          application_submitted_date?: string
          company_id?: number | null
          company_name?: string | null
          created_at?: string
          created_by?: string
          description?: string
          fire_count?: number
          id?: number
          industry_uuid?: string
          job_level?: string
          job_type?: string
          last_step_status?: string | null
          last_step_status_updated_at?: string | null
          location_uuid?: string
          position_title?: string
          source?: string
          status?: string
          title?: string
          updated_at?: string | null
          uuid?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_journey_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_journey_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "public_job_journey_industry_uuid_fkey"
            columns: ["industry_uuid"]
            isOneToOne: false
            referencedRelation: "industry"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "public_job_journey_location_uuid_fkey"
            columns: ["location_uuid"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["uuid"]
          },
        ]
      }
      job_journey_step: {
        Row: {
          created_at: string
          created_by: string
          id: number
          interview_location: string | null
          interview_type: string | null
          job_journey_uuid: string
          position: number
          remarks: string | null
          step_date: string
          step_type: string
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          interview_location?: string | null
          interview_type?: string | null
          job_journey_uuid: string
          position: number
          remarks?: string | null
          step_date: string
          step_type: string
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          interview_location?: string | null
          interview_type?: string | null
          job_journey_uuid?: string
          position?: number
          remarks?: string | null
          step_date?: string
          step_type?: string
          updated_at?: string | null
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_journey_step_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "job_journey_step_job_journey_uuid_fkey"
            columns: ["job_journey_uuid"]
            isOneToOne: false
            referencedRelation: "job_journey"
            referencedColumns: ["uuid"]
          },
        ]
      }
      location: {
        Row: {
          cantonese_name: string
          country_uuid: string | null
          english_name: string
          id: number
          level: number
          meta_data: Json
          parent_uuid: string | null
          uuid: string
          value: string
        }
        Insert: {
          cantonese_name: string
          country_uuid?: string | null
          english_name: string
          id?: number
          level: number
          meta_data?: Json
          parent_uuid?: string | null
          uuid?: string
          value: string
        }
        Update: {
          cantonese_name?: string
          country_uuid?: string | null
          english_name?: string
          id?: number
          level?: number
          meta_data?: Json
          parent_uuid?: string | null
          uuid?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_country_uuid_fkey"
            columns: ["country_uuid"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "location_parent_uuid_fkey"
            columns: ["parent_uuid"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["uuid"]
          },
        ]
      }
      message: {
        Row: {
          body: string | null
          conversation_uuid: string
          created_at: string
          document: Json | null
          id: number
          is_document_expired: boolean
          sender_uuid: string
          status: Database["public"]["Enums"]["message_status"]
          uuid: string
        }
        Insert: {
          body?: string | null
          conversation_uuid: string
          created_at?: string
          document?: Json | null
          id?: number
          is_document_expired?: boolean
          sender_uuid?: string
          status?: Database["public"]["Enums"]["message_status"]
          uuid?: string
        }
        Update: {
          body?: string | null
          conversation_uuid?: string
          created_at?: string
          document?: Json | null
          id?: number
          is_document_expired?: boolean
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
      message_notification_queue: {
        Row: {
          created_at: string
          id: number
          message_uuid: string
          status: string
          user_uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          message_uuid: string
          status?: string
          user_uuid: string
        }
        Update: {
          created_at?: string
          id?: number
          message_uuid?: string
          status?: string
          user_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_message_notification_queue_message_uuid_fkey"
            columns: ["message_uuid"]
            isOneToOne: false
            referencedRelation: "message"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "public_message_notification_queue_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
        ]
      }
      notification: {
        Row: {
          created_at: string
          data: Json
          id: number
          is_seen: boolean
          type: string
          user_uuid: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: number
          is_seen?: boolean
          type: string
          user_uuid: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: number
          is_seen?: boolean
          type?: string
          user_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_user_uuid_fkey"
            columns: ["user_uuid"]
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
          contact_request_count: number
          country_uuid: string | null
          created_at: string | null
          created_by: string
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
          contact_request_count?: number
          country_uuid?: string | null
          created_at?: string | null
          created_by?: string
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
          contact_request_count?: number
          country_uuid?: string | null
          created_at?: string | null
          created_by?: string
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
          message_uuid: string | null
          post_uuid: string | null
          sender_uuid: string | null
          type: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message?: string | null
          message_uuid?: string | null
          post_uuid?: string | null
          sender_uuid?: string | null
          type?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string | null
          message_uuid?: string | null
          post_uuid?: string | null
          sender_uuid?: string | null
          type?: string | null
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_contact_history_message_uuid_fkey"
            columns: ["message_uuid"]
            isOneToOne: false
            referencedRelation: "message"
            referencedColumns: ["uuid"]
          },
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
          message_uuid: string | null
          receiver_uuid: string | null
          sender_uuid: string | null
          type: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message?: string | null
          message_uuid?: string | null
          receiver_uuid?: string | null
          sender_uuid?: string | null
          type?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string | null
          message_uuid?: string | null
          receiver_uuid?: string | null
          sender_uuid?: string | null
          type?: string | null
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_contact_history_message_uuid_fkey"
            columns: ["message_uuid"]
            isOneToOne: false
            referencedRelation: "message"
            referencedColumns: ["uuid"]
          },
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
          contact_request_count: number
          country_uuid: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: number
          industry_uuid: string | null
          is_referee: boolean | null
          is_referer: boolean | null
          job_title: string | null
          links: Json
          notification_permissions: Json
          province_uuid: string | null
          role: string | null
          status: string | null
          username: string
          uuid: string
          year_of_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          city_uuid?: string | null
          company_name?: string | null
          contact_request_count?: number
          country_uuid?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: number
          industry_uuid?: string | null
          is_referee?: boolean | null
          is_referer?: boolean | null
          job_title?: string | null
          links?: Json
          notification_permissions?: Json
          province_uuid?: string | null
          role?: string | null
          status?: string | null
          username: string
          uuid?: string
          year_of_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          city_uuid?: string | null
          company_name?: string | null
          contact_request_count?: number
          country_uuid?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: number
          industry_uuid?: string | null
          is_referee?: boolean | null
          is_referer?: boolean | null
          job_title?: string | null
          links?: Json
          notification_permissions?: Json
          province_uuid?: string | null
          role?: string | null
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
      check_user_status: {
        Args: {
          status_value: string
        }
        Returns: boolean
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
          user_metadata: Json | null
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
          user_metadata?: Json | null
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
          user_metadata?: Json | null
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
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
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
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
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
