export type UserRole = "guest" | "viewer" | "admin" | "contributor";

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  status: "active" | "suspended" | "deleted";
  created_at: string;
  last_sign_in_at?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  isLoading: boolean;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
