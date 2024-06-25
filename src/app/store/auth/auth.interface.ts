export interface SignInType {
  username: string;
  password: string;
}

export interface SignUpType {
  username: string;
  password: string;
  role: string;
}

export interface SignInResponseType {
  role: string,
  token: string;
}
