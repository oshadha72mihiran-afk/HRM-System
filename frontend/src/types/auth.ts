// frontend/types/auth.ts
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";
  is_active: boolean;
}

export interface AuthResponse {
  user: User;
  token: {
    access_token: string;
    token_type: string;
  };
}
