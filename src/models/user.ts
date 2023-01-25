export interface UserInfoForm {
  username: string;
  nickname: string;
  sex: string;
}

export interface PasswordForm {
  current_password: string;
  new_password: string;
}

export interface UserState {
  username?: string;
  nickname?: string;
  sex?: string;
  role?: string;
  balance?: number;
  created_at?: number;
  updated_at?: number;
}
