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
      application_answers: {
        Row: {
          answer: string | null
          event_id: string
          id: string
          question_id: string | null
          question_type: Database["public"]["Enums"]["Question Type"]
          vendor_id: string
        }
        Insert: {
          answer?: string | null
          event_id: string
          id: string
          question_id?: string | null
          question_type?: Database["public"]["Enums"]["Question Type"]
          vendor_id: string
        }
        Update: {
          answer?: string | null
          event_id?: string
          id?: string
          question_id?: string | null
          question_type?: Database["public"]["Enums"]["Question Type"]
          vendor_id?: string
        }
        Relationships: []
      }
      application_standard_questions: {
        Row: {
          id: string
          question_prompt: string
        }
        Insert: {
          id?: string
          question_prompt: string
        }
        Update: {
          id?: string
          question_prompt?: string
        }
        Relationships: []
      }
      application_terms_and_conditions: {
        Row: {
          event_id: string
          id: string
          term: string
        }
        Insert: {
          event_id: string
          id?: string
          term: string
        }
        Update: {
          event_id?: string
          id?: string
          term?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_terms_and_conditions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      application_vendor_information: {
        Row: {
          additional_information: string | null
          check_in_location: string
          check_in_time: string
          event_id: string
          id: string
          wifi_availability: boolean
        }
        Insert: {
          additional_information?: string | null
          check_in_location: string
          check_in_time: string
          event_id: string
          id?: string
          wifi_availability: boolean
        }
        Update: {
          additional_information?: string | null
          check_in_location?: string
          check_in_time?: string
          event_id?: string
          id?: string
          wifi_availability?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "application_vendor_information_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
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
      checkout_sessions: {
        Row: {
          created_at: string
          event_id: string
          id: string
          metadata: Json | null
          price_type: Database["public"]["Enums"]["Checkout Price Type"]
          promo_id: string | null
          quantity: number
          ticket_id: string
          ticket_type: Database["public"]["Enums"]["Checkout Ticket Types"]
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string
          id?: string
          metadata?: Json | null
          price_type?: Database["public"]["Enums"]["Checkout Price Type"]
          promo_id?: string | null
          quantity: number
          ticket_id?: string
          ticket_type: Database["public"]["Enums"]["Checkout Ticket Types"]
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          metadata?: Json | null
          price_type?: Database["public"]["Enums"]["Checkout Price Type"]
          promo_id?: string | null
          quantity?: number
          ticket_id?: string
          ticket_type?: Database["public"]["Enums"]["Checkout Ticket Types"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkout_sessions_promo_id_fkey"
            columns: ["promo_id"]
            isOneToOne: false
            referencedRelation: "event_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_checkout_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_checkout_sessions_user_Id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_categories: {
        Row: {
          category_id: string
          event_id: string
        }
        Insert: {
          category_id?: string
          event_id?: string
        }
        Update: {
          category_id?: string
          event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_codes: {
        Row: {
          code: string
          created_at: string
          discount: number
          event_id: string
          id: string
          num_used: number
          status: Database["public"]["Enums"]["Promo Code Status"]
          type: Database["public"]["Enums"]["Promo Code Type"]
          usage_limit: number | null
        }
        Insert: {
          code?: string
          created_at?: string
          discount?: number
          event_id?: string
          id?: string
          num_used?: number
          status?: Database["public"]["Enums"]["Promo Code Status"]
          type?: Database["public"]["Enums"]["Promo Code Type"]
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount?: number
          event_id?: string
          id?: string
          num_used?: number
          status?: Database["public"]["Enums"]["Promo Code Status"]
          type?: Database["public"]["Enums"]["Promo Code Type"]
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_event_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_dates: {
        Row: {
          date: string
          end_time: string | null
          event_id: string
          id: string
          start_time: string
        }
        Insert: {
          date: string
          end_time?: string | null
          event_id: string
          id?: string
          start_time: string
        }
        Update: {
          date?: string
          end_time?: string | null
          event_id?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_dates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_guests: {
        Row: {
          avatar_url: string
          bio: string
          event_id: string
          id: string
          name: string
        }
        Insert: {
          avatar_url: string
          bio?: string
          event_id: string
          id?: string
          name?: string
        }
        Update: {
          avatar_url?: string
          bio?: string
          event_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_highlights: {
        Row: {
          event_id: string
          id: string
          picture_url: string
          uploaded_at: string
        }
        Insert: {
          event_id?: string
          id?: string
          picture_url: string
          uploaded_at?: string
        }
        Update: {
          event_id?: string
          id?: string
          picture_url?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_highlights_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_likes: {
        Row: {
          event_id: string
          liked_on: string
          user_id: string
        }
        Insert: {
          event_id: string
          liked_on?: string
          user_id: string
        }
        Update: {
          event_id?: string
          liked_on?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_likes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_roles: {
        Row: {
          event_id: string
          id: string
          role: Database["public"]["Enums"]["Event Roles"]
          user_id: string
        }
        Insert: {
          event_id?: string
          id?: string
          role: Database["public"]["Enums"]["Event Roles"]
          user_id?: string
        }
        Update: {
          event_id?: string
          id?: string
          role?: Database["public"]["Enums"]["Event Roles"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_roles_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tags: {
        Row: {
          event_id: string
          id: string
          tag_id: string
        }
        Insert: {
          event_id: string
          id?: string
          tag_id: string
        }
        Update: {
          event_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tags_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tickets: {
        Row: {
          attendee_id: string
          created_at: string
          email: string | null
          event_id: string
          id: string
          ticket_id: string
          valid: boolean
        }
        Insert: {
          attendee_id: string
          created_at?: string
          email?: string | null
          event_id: string
          id?: string
          ticket_id: string
          valid?: boolean
        }
        Update: {
          attendee_id?: string
          created_at?: string
          email?: string | null
          event_id?: string
          id?: string
          ticket_id?: string
          valid?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tickets_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tickets_dates: {
        Row: {
          checked_in_at: string | null
          event_dates_id: string
          event_ticket_id: string
          id: string
          valid: boolean
        }
        Insert: {
          checked_in_at?: string | null
          event_dates_id: string
          event_ticket_id: string
          id?: string
          valid?: boolean
        }
        Update: {
          checked_in_at?: string | null
          event_dates_id?: string
          event_ticket_id?: string
          id?: string
          valid?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_dates_event_dates_id_fkey"
            columns: ["event_dates_id"]
            isOneToOne: false
            referencedRelation: "event_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tickets_dates_event_ticket_id_fkey"
            columns: ["event_ticket_id"]
            isOneToOne: false
            referencedRelation: "event_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      event_vendor_tags: {
        Row: {
          event_id: string
          tag_id: string
          vendor_id: string
        }
        Insert: {
          event_id: string
          tag_id: string
          vendor_id: string
        }
        Update: {
          event_id?: string
          tag_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_vendor_tags_event_id_vendor_id_fkey"
            columns: ["event_id", "vendor_id"]
            isOneToOne: false
            referencedRelation: "event_vendors"
            referencedColumns: ["event_id", "vendor_id"]
          },
          {
            foreignKeyName: "event_vendor_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      event_vendors: {
        Row: {
          application_email: string
          application_phone: string
          application_status: Database["public"]["Enums"]["Application Status"]
          assignment: number | null
          checked_in: boolean
          comments: string | null
          event_id: string
          inventory: string
          notified_of_assignment: boolean
          payment_status: Database["public"]["Enums"]["Payment Status"]
          table_id: string
          table_quantity: number
          vendor_id: string
          vendors_at_table: number
        }
        Insert: {
          application_email: string
          application_phone: string
          application_status?: Database["public"]["Enums"]["Application Status"]
          assignment?: number | null
          checked_in?: boolean
          comments?: string | null
          event_id: string
          inventory: string
          notified_of_assignment?: boolean
          payment_status?: Database["public"]["Enums"]["Payment Status"]
          table_id: string
          table_quantity: number
          vendor_id: string
          vendors_at_table: number
        }
        Update: {
          application_email?: string
          application_phone?: string
          application_status?: Database["public"]["Enums"]["Application Status"]
          assignment?: number | null
          checked_in?: boolean
          comments?: string | null
          event_id?: string
          inventory?: string
          notified_of_assignment?: boolean
          payment_status?: Database["public"]["Enums"]["Payment Status"]
          table_id?: string
          table_quantity?: number
          vendor_id?: string
          vendors_at_table?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_vendors_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_event_vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_views: {
        Row: {
          event_id: string
          id: string
          visited_at: string
          visitor_id: string | null
        }
        Insert: {
          event_id?: string
          id?: string
          visited_at?: string
          visitor_id?: string | null
        }
        Update: {
          event_id?: string
          id?: string
          visited_at?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_page_views_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_page_views_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string
          city: string
          cleaned_name: string
          created_at: string
          date: string
          description: string
          end_time: string
          featured: number
          id: string
          lat: number
          lng: number
          name: string
          organizer_id: string
          organizer_type: string
          poster_url: string
          sales_status: Database["public"]["Enums"]["Event Ticket Status"]
          start_time: string
          state: string
          vendor_exclusivity: Database["public"]["Enums"]["Vendor Exclusivity"]
          venue_map_url: string | null
          venue_name: string
        }
        Insert: {
          address: string
          city?: string
          cleaned_name: string
          created_at?: string
          date: string
          description: string
          end_time: string
          featured?: number
          id?: string
          lat: number
          lng: number
          name: string
          organizer_id: string
          organizer_type?: string
          poster_url: string
          sales_status?: Database["public"]["Enums"]["Event Ticket Status"]
          start_time: string
          state?: string
          vendor_exclusivity?: Database["public"]["Enums"]["Vendor Exclusivity"]
          venue_map_url?: string | null
          venue_name: string
        }
        Update: {
          address?: string
          city?: string
          cleaned_name?: string
          created_at?: string
          date?: string
          description?: string
          end_time?: string
          featured?: number
          id?: string
          lat?: number
          lng?: number
          name?: string
          organizer_id?: string
          organizer_type?: string
          poster_url?: string
          sales_status?: Database["public"]["Enums"]["Event Ticket Status"]
          start_time?: string
          state?: string
          vendor_exclusivity?: Database["public"]["Enums"]["Vendor Exclusivity"]
          venue_map_url?: string | null
          venue_name?: string
        }
        Relationships: []
      }
      line_items: {
        Row: {
          id: string
          item_id: string
          item_type: Database["public"]["Enums"]["Checkout Ticket Types"]
          order_id: number
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          item_id: string
          item_type: Database["public"]["Enums"]["Checkout Ticket Types"]
          order_id: number
          price: number
          quantity: number
        }
        Update: {
          id?: string
          item_id?: string
          item_type?: Database["public"]["Enums"]["Checkout Ticket Types"]
          order_id?: number
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "line_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          application: string
          id: number
          type: string
          user_id: string
          username: string
        }
        Insert: {
          application: string
          id?: number
          type?: string
          user_id: string
          username: string
        }
        Update: {
          application?: string
          id?: number
          type?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_paid: number
          created_at: string
          customer_id: string
          event_id: string
          id: number
          metadata: Json | null
        }
        Insert: {
          amount_paid: number
          created_at?: string
          customer_id: string
          event_id: string
          id?: number
          metadata?: Json | null
        }
        Update: {
          amount_paid?: number
          created_at?: string
          customer_id?: string
          event_id?: string
          id?: number
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_pictures: {
        Row: {
          id: string
          picture_url: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          id?: string
          picture_url: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          id?: string
          picture_url?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_pictures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_transfers: {
        Row: {
          id: string
          new_user_id: string | null
          temp_profile_id: string | null
        }
        Insert: {
          id?: string
          new_user_id?: string | null
          temp_profile_id?: string | null
        }
        Update: {
          id?: string
          new_user_id?: string | null
          temp_profile_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          bio: string | null
          business_name: string | null
          created_at: string
          discriminator: number | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: string
          username: string
        }
        Insert: {
          avatar_url?: string
          bio?: string | null
          business_name?: string | null
          created_at?: string
          discriminator?: number | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          role?: string
          username: string
        }
        Update: {
          avatar_url?: string
          bio?: string | null
          business_name?: string | null
          created_at?: string
          discriminator?: number | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      signup_invite_tokens: {
        Row: {
          created_at: string
          id: string
          temp_profile_id: string
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          temp_profile_id: string
          token: string
        }
        Update: {
          created_at?: string
          id?: string
          temp_profile_id?: string
          token?: string
        }
        Relationships: []
      }
      tables: {
        Row: {
          additional_information: string | null
          event_id: string
          id: string
          number_vendors_allowed: number
          price: number
          quantity: number
          section_name: string
          space_allocated: number
          table_provided: boolean
          total_tables: number
        }
        Insert: {
          additional_information?: string | null
          event_id: string
          id?: string
          number_vendors_allowed?: number
          price: number
          quantity: number
          section_name: string
          space_allocated?: number
          table_provided?: boolean
          total_tables?: number
        }
        Update: {
          additional_information?: string | null
          event_id?: string
          id?: string
          number_vendors_allowed?: number
          price?: number
          quantity?: number
          section_name?: string
          space_allocated?: number
          table_provided?: boolean
          total_tables?: number
        }
        Relationships: [
          {
            foreignKeyName: "tables_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
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
      temporary_profiles: {
        Row: {
          avatar_url: string
          business_name: string
          id: string
          instagram: string | null
          username: string
        }
        Insert: {
          avatar_url?: string
          business_name: string
          id?: string
          instagram?: string | null
          username: string
        }
        Update: {
          avatar_url?: string
          business_name?: string
          id?: string
          instagram?: string | null
          username?: string
        }
        Relationships: []
      }
      temporary_profiles_vendors: {
        Row: {
          avatar_url: string
          business_name: string
          creator_id: string
          email: string | null
          id: string
          instagram: string | null
        }
        Insert: {
          avatar_url: string
          business_name: string
          creator_id?: string
          email?: string | null
          id?: string
          instagram?: string | null
        }
        Update: {
          avatar_url?: string
          business_name?: string
          creator_id?: string
          email?: string | null
          id?: string
          instagram?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "temporary_profiles_vendors_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      temporary_vendors: {
        Row: {
          assignment: number | null
          event_id: string
          tag_id: string | null
          vendor_id: string
        }
        Insert: {
          assignment?: number | null
          event_id: string
          tag_id?: string | null
          vendor_id: string
        }
        Update: {
          assignment?: number | null
          event_id?: string
          tag_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "temporary_vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "temporary_vendors_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "temporary_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "temporary_profiles_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_dates: {
        Row: {
          event_date_id: string
          id: string
          ticket_id: string
        }
        Insert: {
          event_date_id: string
          id?: string
          ticket_id: string
        }
        Update: {
          event_date_id?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_dates_event_date_id_fkey"
            columns: ["event_date_id"]
            isOneToOne: false
            referencedRelation: "event_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_dates_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          name: string
          price: number
          quantity: number
          total_tickets: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          name?: string
          price: number
          quantity: number
          total_tickets?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          price?: number
          quantity?: number
          total_tickets?: number
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_invite_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string | null
        }
        Relationships: []
      }
      vendor_transactions: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          item_name: string | null
          method: string
          vendor_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          item_name?: string | null
          method: string
          vendor_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          item_name?: string | null
          method?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_vendor_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_order: {
        Args: {
          user_id: string
          event_id: string
          item_id: string
          item_type: Database["public"]["Enums"]["Checkout Ticket Types"]
          purchase_quantity: number
          price: number
        }
        Returns: string
      }
      get_attendee_count: {
        Args: {
          event_id: string
        }
        Returns: number
      }
      get_attendee_data: {
        Args: {
          event_id: string
        }
        Returns: {
          attendee_id: string
          first_name: string
          last_name: string
          email: string
          avatar_url: string
          phone: string
          number_tickets_purchased: number
          date_of_last_purchase: string
          number_tickets_scanned: number
          ticket_names: string[]
        }[]
      }
      get_nearby_events: {
        Args: {
          user_lat: number
          user_lon: number
          radius: number
        }
        Returns: {
          address: string
          city: string
          cleaned_name: string
          created_at: string
          date: string
          description: string
          end_time: string
          featured: number
          id: string
          lat: number
          lng: number
          name: string
          organizer_id: string
          organizer_type: string
          poster_url: string
          sales_status: Database["public"]["Enums"]["Event Ticket Status"]
          start_time: string
          state: string
          vendor_exclusivity: Database["public"]["Enums"]["Vendor Exclusivity"]
          venue_map_url: string | null
          venue_name: string
        }[]
      }
      get_tagged_nearby_events: {
        Args: {
          user_lat: number
          user_lon: number
          radius: number
          tagid: string
        }
        Returns: {
          address: string
          city: string
          cleaned_name: string
          created_at: string
          date: string
          description: string
          end_time: string
          featured: number
          id: string
          lat: number
          lng: number
          name: string
          organizer_id: string
          organizer_type: string
          poster_url: string
          sales_status: Database["public"]["Enums"]["Event Ticket Status"]
          start_time: string
          state: string
          vendor_exclusivity: Database["public"]["Enums"]["Vendor Exclusivity"]
          venue_map_url: string | null
          venue_name: string
        }[]
      }
      haversine_distance: {
        Args: {
          lat1: number
          lon1: number
          lat2: number
          lon2: number
        }
        Returns: number
      }
      increment_promo: {
        Args: {
          promo_id: string
        }
        Returns: number
      }
      purchase_table: {
        Args: {
          table_id: string
          event_id: string
          user_id: string
          purchase_quantity: number
        }
        Returns: {
          order_id: number
          event_name: string
          organizer_id: string
          event_date: string
          event_address: string
          event_description: string
          event_cleaned_name: string
          event_poster_url: string
          table_section_name: string
          table_price: number
          vendor_first_name: string
          vendor_last_name: string
          vendor_business_name: string
          vendor_application_email: string
          vendor_application_phone: string
          vendor_table_quantity: number
          vendor_inventory: string
          vendor_vendors_at_table: number
        }[]
      }
      purchase_tickets: {
        Args: {
          ticket_id: string
          event_id: string
          user_id: string
          purchase_quantity: number
          email: string
          amount_paid: number
          metadata?: Json
          promo_id?: string
        }
        Returns: {
          order_id: number
          event_ticket_ids: string[]
          event_name: string
          event_date: string
          event_address: string
          event_description: string
          event_cleaned_name: string
          event_poster_url: string
          event_organizer_id: string
          ticket_name: string
          ticket_price: number
          attendee_first_name: string
          attendee_last_name: string
          attendee_business_name: string
          attendee_email: string
          attendee_phone: string
          organizer_id: string
          organizer_phone: string
        }[]
      }
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v3: {
        Args: {
          namespace: string
          name: string
        }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: {
          namespace: string
          name: string
        }
        Returns: string
      }
      uuid_nil: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      "Application Status":
        | "REJECTED"
        | "DRAFT"
        | "PENDING"
        | "ACCEPTED"
        | "WAITLISTED"
      "Checkout Price Type": "RSVP" | "REGULAR"
      "Checkout Ticket Types": "TICKET" | "TABLE"
      "Event Roles": "HOST" | "COHOST" | "STAFF" | "SCANNER"
      "Event Ticket Status":
        | "NO_SALE"
        | "TABLES_ONLY"
        | "ATTENDEES_ONLY"
        | "SELLING_ALL"
      "Payment Status": "UNPAID" | "PAID" | "PREBOOKED"
      "Promo Code Status": "INACTIVE" | "ACTIVE"
      "Promo Code Type": "DOLLAR" | "PERCENT"
      "Question Type": "STANDARD" | "UNIQUE"
      "Vendor Exclusivity":
        | "PUBLIC"
        | "APPLICATIONS"
        | "APPLICATIONS_NO_PAYMENT"
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
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
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

