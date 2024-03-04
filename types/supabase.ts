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
          }
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
          }
        ]
      }
      checkout_sessions: {
        Row: {
          event_id: string
          id: string
          quantity: number
          ticket_id: string
          ticket_type: Database["public"]["Enums"]["Checkout Ticket Types"]
          user_id: string
        }
        Insert: {
          event_id?: string
          id?: string
          quantity: number
          ticket_id?: string
          ticket_type: Database["public"]["Enums"]["Checkout Ticket Types"]
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          quantity?: number
          ticket_id?: string
          ticket_type?: Database["public"]["Enums"]["Checkout Ticket Types"]
          user_id?: string
        }
        Relationships: [
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
          }
        ]
      }
      event_guests: {
        Row: {
          event_id: string
          guest_id: string
        }
        Insert: {
          event_id: string
          guest_id: string
        }
        Update: {
          event_id?: string
          guest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_event_guests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      event_likes: {
        Row: {
          event_id: string
          user_id: string
        }
        Insert: {
          event_id: string
          user_id: string
        }
        Update: {
          event_id?: string
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
          }
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
          }
        ]
      }
      event_tickets: {
        Row: {
          attendee_id: string
          event_id: string
          id: string
          ticket_id: string
          valid: boolean
        }
        Insert: {
          attendee_id: string
          event_id: string
          id?: string
          ticket_id: string
          valid?: boolean
        }
        Update: {
          attendee_id?: string
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
          }
        ]
      }
      event_vendors: {
        Row: {
          application_status: Database["public"]["Enums"]["Application Status"]
          comments: string | null
          event_id: string
          inventory: string
          payment_status: Database["public"]["Enums"]["Payment Status"]
          table_id: string
          table_quantity: number
          vendor_id: string
          vendors_at_table: number
        }
        Insert: {
          application_status?: Database["public"]["Enums"]["Application Status"]
          comments?: string | null
          event_id: string
          inventory: string
          payment_status?: Database["public"]["Enums"]["Payment Status"]
          table_id: string
          table_quantity: number
          vendor_id: string
          vendors_at_table: number
        }
        Update: {
          application_status?: Database["public"]["Enums"]["Application Status"]
          comments?: string | null
          event_id?: string
          inventory?: string
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
          }
        ]
      }
      events: {
        Row: {
          address: string
          city: string
          cleaned_name: string
          comment: string
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
          table_public: number
          ticket_tailor_event_id: string | null
          tickets_status: number
          toc: string
          vendor_exclusivity: Database["public"]["Enums"]["Vendor Exclusivity"]
          venue_map_url: string | null
          venue_name: string
        }
        Insert: {
          address: string
          city?: string
          cleaned_name: string
          comment?: string
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
          table_public?: number
          ticket_tailor_event_id?: string | null
          tickets_status?: number
          toc?: string
          vendor_exclusivity?: Database["public"]["Enums"]["Vendor Exclusivity"]
          venue_map_url?: string | null
          venue_name: string
        }
        Update: {
          address?: string
          city?: string
          cleaned_name?: string
          comment?: string
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
          table_public?: number
          ticket_tailor_event_id?: string | null
          tickets_status?: number
          toc?: string
          vendor_exclusivity?: Database["public"]["Enums"]["Vendor Exclusivity"]
          venue_map_url?: string | null
          venue_name?: string
        }
        Relationships: []
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
          }
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
          }
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
          }
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
          space_allocated: number | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          table_provided: boolean
        }
        Insert: {
          additional_information?: string | null
          event_id: string
          id?: string
          number_vendors_allowed?: number
          price: number
          quantity: number
          section_name: string
          space_allocated?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          table_provided?: boolean
        }
        Update: {
          additional_information?: string | null
          event_id?: string
          id?: string
          number_vendors_allowed?: number
          price?: number
          quantity?: number
          section_name?: string
          space_allocated?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          table_provided?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "tables_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
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
          created_at: string
          id: string
          instagram: string | null
          username: string
        }
        Insert: {
          avatar_url?: string
          business_name: string
          created_at?: string
          id?: string
          instagram?: string | null
          username: string
        }
        Update: {
          avatar_url?: string
          business_name?: string
          created_at?: string
          id?: string
          instagram?: string | null
          username?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          event_id: string
          id: string
          name: string
          price: number
          quantity: number | null
          stripe_price_id: string
          stripe_product_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          name?: string
          price: number
          quantity?: number | null
          stripe_price_id: string
          stripe_product_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          name?: string
          price?: number
          quantity?: number | null
          stripe_price_id?: string
          stripe_product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      vendor_applications: {
        Row: {
          collection_type: string
          contact: string
          created_at: string
          event_id: string
          status: number
          vendor_id: string
        }
        Insert: {
          collection_type?: string
          contact?: string
          created_at?: string
          event_id: string
          status?: number
          vendor_id: string
        }
        Update: {
          collection_type?: string
          contact?: string
          created_at?: string
          event_id?: string
          status?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_applications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
      "Application Status": "REJECTED" | "DRAFT" | "PENDING" | "ACCEPTED"
      "Checkout Ticket Types": "TICKET" | "TABLE"
      "Event Ticket Status":
        | "NO_SALE"
        | "TABLES_ONLY"
        | "ATTENDEES_ONLY"
        | "SELLING_ALL"
      "Payment Status": "UNPAID" | "PAID" | "PREBOOKED"
      "Question Type": "STANDARD" | "UNIQUE"
      "Vendor Exclusivity": "PUBLIC" | "APPLICATIONS"
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
