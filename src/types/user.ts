export type User = {
  id: number;
  name: string;
  email: string;
};

// For login request
export type LoginRequest = {
  email: string;
  password: string;
};

// For register request
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

// JWT token response from NestJS
export type LoginResponse = {
  access_token: string;
};

// Register response (usually returns created user)
export type RegisterResponse = User;

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

export type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

export type Transaction = {
  id: string;
  $id: string;
  name: string;
  role: string
  paymentChannel: string;
  type: string;
  accountId: string;
  amount: number;
  pending: boolean;
  category: string;
  date: string;
  image: string;
  $createdAt: string;
  channel: string;
  senderBankId: string;
  receiverBankId: string;
};
