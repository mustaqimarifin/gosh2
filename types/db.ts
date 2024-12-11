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
      comments: {
        Row: {
          body: string
          cid: number
          createdAt: string
          isDeleted: boolean
          isPinned: boolean
          parentId: number | null
          slug: string
          uid: string
          updatedAt: string | null
        }
        Insert: {
          body: string
          cid?: number
          createdAt?: string
          isDeleted?: boolean
          isPinned?: boolean
          parentId?: number | null
          slug: string
          uid: string
          updatedAt?: string | null
        }
        Update: {
          body?: string
          cid?: number
          createdAt?: string
          isDeleted?: boolean
          isPinned?: boolean
          parentId?: number | null
          slug?: string
          uid?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'comments_parentId_fkey'
            columns: ['parentId']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['cid']
          },
          {
            foreignKeyName: 'comments_slug_fkey'
            columns: ['slug']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['slug']
          },
          {
            foreignKeyName: 'comments_uid_fkey'
            columns: ['uid']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['uid']
          },
        ]
      }
      hotline: {
        Row: {
          author_id: string
          body: string | null
          id: number
          parent_id: number | null
          posted_at: string
        }
        Insert: {
          author_id: string
          body?: string | null
          id?: number
          parent_id?: number | null
          posted_at?: string
        }
        Update: {
          author_id?: string
          body?: string | null
          id?: number
          parent_id?: number | null
          posted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'hotline_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['uid']
          },
          {
            foreignKeyName: 'hotline_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'hotline'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'hotline_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'hotline_bling'
            referencedColumns: ['id']
          },
        ]
      }
      pageviews: {
        Row: {
          id: number
          slug: string
          view_count: number
        }
        Insert: {
          id?: number
          slug: string
          view_count?: number
        }
        Update: {
          id?: number
          slug?: string
          view_count?: number
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: number
          slug: string
          view_count: number
        }
        Insert: {
          id?: number
          slug: string
          view_count?: number
        }
        Update: {
          id?: number
          slug?: string
          view_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          last_sign_in: string
          mugshot: string | null
          name: string | null
          uid: string
        }
        Insert: {
          email?: string | null
          last_sign_in?: string
          mugshot?: string | null
          name?: string | null
          uid: string
        }
        Update: {
          email?: string | null
          last_sign_in?: string
          mugshot?: string | null
          name?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_uid_fkey'
            columns: ['uid']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      votes: {
        Row: {
          cid: number
          uid: string
          value: number
        }
        Insert: {
          cid: number
          uid: string
          value: number
        }
        Update: {
          cid?: number
          uid?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: 'votes_cid_fkey'
            columns: ['cid']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['cid']
          },
          {
            foreignKeyName: 'votes_uid_fkey'
            columns: ['uid']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['uid']
          },
        ]
      }
    }
    Views: {
      hotline_bling: {
        Row: {
          author_id: string | null
          body: string | null
          id: number | null
          mugshot: string | null
          name: string | null
          posted_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'hotline_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['uid']
          },
        ]
      }
      totalViews: {
        Row: {
          sum: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      commentTree: {
        Args: {
          cid: number
        }
        Returns: Json
      }
      commentTreeJSONB: {
        Args: {
          cid: number
        }
        Returns: Json
      }
      increment_page_view: {
        Args: {
          page_slug: string
        }
        Returns: undefined
      }
      threadedComments: {
        Args: {
          slug: string
        }
        Returns: Json
      }
      threadedCommentsJSONB: {
        Args: {
          slug: string
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
}
