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
      products: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          stock: number
          featured: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          stock?: number
          featured?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          category?: string
          stock?: number
          featured?: boolean
        }
      }
      orders: {
        Row: {
          id: number
          created_at: string
          user_id: string
          status: string
          total: number
          special_offer_applied: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          status: string
          total: number
          special_offer_applied?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          status?: string
          total?: number
          special_offer_applied?: string | null
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number
          quantity: number
          price: number
        }
        Insert: {
          id?: number
          order_id: number
          product_id: number
          quantity: number
          price: number
        }
        Update: {
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          price?: number
        }
      }
      reviews: {
        Row: {
          id: number
          created_at: string
          user_id: string
          product_id: number
          rating: number
          comment: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          product_id: number
          rating: number
          comment?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          product_id?: number
          rating?: number
          comment?: string | null
        }
      }
    }
  }
}