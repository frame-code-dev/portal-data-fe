export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}
