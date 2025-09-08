export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      deck_cards: {
        Row: {
          card_id: string
          card_image: string
          card_name: string
          created_at: string
          deck_id: string
          id: string
          is_legendary: boolean
          position: number
        }
        Insert: {
          card_id: string
          card_image: string
          card_name: string
          created_at?: string
          deck_id: string
          id?: string
          is_legendary?: boolean
          position: number
        }
        Update: {
          card_id?: string
          card_image?: string
          card_name?: string
          created_at?: string
          deck_id?: string
          id?: string
          is_legendary?: boolean
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "deck_cards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          author_name: string | null
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          name: string
          notes: string | null
          type: Database["public"]["Enums"]["deck_type"]
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          name: string
          notes?: string | null
          type: Database["public"]["Enums"]["deck_type"]
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          name?: string
          notes?: string | null
          type?: Database["public"]["Enums"]["deck_type"]
          updated_at?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          last_activity: string | null
          player_name: string | null
          player_role: string
          room_id: string
          session_token: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_activity?: string | null
          player_name?: string | null
          player_role: string
          room_id: string
          session_token: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_activity?: string | null
          player_name?: string | null
          player_role?: string
          room_id?: string
          session_token?: string
        }
        Relationships: []
      }
      player_decks: {
        Row: {
          card_id: string
          card_image: string
          card_name: string
          id: string
          is_legendary: boolean | null
          player_side: string
          room_id: string
          selection_order: number
        }
        Insert: {
          card_id: string
          card_image: string
          card_name: string
          id?: string
          is_legendary?: boolean | null
          player_side: string
          room_id: string
          selection_order: number
        }
        Update: {
          card_id?: string
          card_image?: string
          card_name?: string
          id?: string
          is_legendary?: boolean | null
          player_side?: string
          room_id?: string
          selection_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_decks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      room_cards: {
        Row: {
          card_id: string
          card_image: string
          card_name: string
          id: string
          is_legendary: boolean | null
          room_id: string
          round_number: number
          selected_by: string | null
          side: string
          turn_order: number | null
        }
        Insert: {
          card_id: string
          card_image: string
          card_name: string
          id?: string
          is_legendary?: boolean | null
          room_id: string
          round_number: number
          selected_by?: string | null
          side: string
          turn_order?: number | null
        }
        Update: {
          card_id?: string
          card_image?: string
          card_name?: string
          id?: string
          is_legendary?: boolean | null
          room_id?: string
          round_number?: number
          selected_by?: string | null
          side?: string
          turn_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_cards_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          creator_name: string
          creator_ready: boolean | null
          current_phase: string | null
          current_round: number | null
          draft_type: string
          first_pick_player: string | null
          id: string
          joiner_name: string | null
          joiner_ready: boolean | null
          mega_draft_turn_count: number | null
          round_duration_seconds: number | null
          round_start_time: string | null
          status: string
          triple_draft_first_pick: string | null
          triple_draft_phase: number | null
        }
        Insert: {
          created_at?: string
          creator_name: string
          creator_ready?: boolean | null
          current_phase?: string | null
          current_round?: number | null
          draft_type?: string
          first_pick_player?: string | null
          id: string
          joiner_name?: string | null
          joiner_ready?: boolean | null
          mega_draft_turn_count?: number | null
          round_duration_seconds?: number | null
          round_start_time?: string | null
          status?: string
          triple_draft_first_pick?: string | null
          triple_draft_phase?: number | null
        }
        Update: {
          created_at?: string
          creator_name?: string
          creator_ready?: boolean | null
          current_phase?: string | null
          current_round?: number | null
          draft_type?: string
          first_pick_player?: string | null
          id?: string
          joiner_name?: string | null
          joiner_ready?: boolean | null
          mega_draft_turn_count?: number | null
          round_duration_seconds?: number | null
          round_start_time?: string | null
          status?: string
          triple_draft_first_pick?: string | null
          triple_draft_phase?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      extend_session_expiry: {
        Args: { session_token_param: string }
        Returns: undefined
      }
      validate_room_access: {
        Args: { room_id_param: string; session_token_param: string }
        Returns: {
          can_interact: boolean
          player_name: string
          player_role: string
        }[]
      }
    }
    Enums: {
      deck_type: "aggro" | "control" | "destroy" | "discard" | "move" | "ramp"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      deck_type: ["aggro", "control", "destroy", "discard", "move", "ramp"],
    },
  },
} as const
