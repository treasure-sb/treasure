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
            foreignKeyName: "event_guests_guest_id_fkey"
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
          order_id: string
          ticket_id: string
          valid: boolean
        }
        Insert: {
          attendee_id: string
          event_id: string
          id?: string
          order_id: string
          ticket_id: string
          valid?: boolean
        }
        Update: {
          attendee_id?: string
          event_id?: string
          id?: string
          order_id?: string
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
            foreignKeyName: "event_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
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
          event_id: string
          vendor_id: string
        }
        Insert: {
          event_id: string
          vendor_id: string
        }
        Update: {
          event_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
          start_time: string
          state: string
          ticket_tailor_event_id: string | null
          tickets_status: number
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
          start_time: string
          state?: string
          ticket_tailor_event_id?: string | null
          tickets_status?: number
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
          start_time?: string
          state?: string
          ticket_tailor_event_id?: string | null
          tickets_status?: number
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
          created_at: string
          discriminator: number | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          role: string
          username: string
        }
        Insert: {
          avatar_url?: string
          bio?: string | null
          created_at?: string
          discriminator?: number | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          role?: string
          username: string
        }
        Update: {
          avatar_url?: string
          bio?: string | null
          created_at?: string
          discriminator?: number | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
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
          stripe_price_id: string | null
          stripe_product_id: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          name?: string
          price: number
          quantity?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          name?: string
          price?: number
          quantity?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
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
          created_at: string
          event_id: string
          status: number
          vendor_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          status?: number
          vendor_id: string
        }
        Update: {
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
            foreignKeyName: "vendor_transactions_vendor_id_fkey"
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
