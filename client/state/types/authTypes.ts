export interface User {
  firstName: string;
  lastName: string;
  profilePic: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    user: User;
    newAccessToken: string;
  };
}
