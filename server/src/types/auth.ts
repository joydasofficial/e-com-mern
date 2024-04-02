export interface Login {
  email: string;
  password: string;
}

export interface Token {
  refreshToken: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
