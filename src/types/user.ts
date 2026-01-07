import { IStore } from "./store";

export type LocationData = {
  id?: string | number;
  latitude: number | null;
  longitude: number | null;
  address: string;
  city: string;
  country: string;
  isDefault?: boolean; // ✅ add this
};

export type ProfileImage = {
  id: number;
  userId: number;
  profile?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  id: string;
  userId: number;
  email: string;
  username: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  userId: number;
  productId: string;
  title: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id?: string;
  productId?: string;
  quantity?: number;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string | null;
  role: string;
  status: string;
  hasStore: boolean;
  followersCount: number;
  createdAt: string;
  updatedAt: string;
  profileImage: ProfileImage | null;
  customers: Customer[];
  comments: Comment[];
  cartItems: CartItem[];
  locations: LocationData[];
  store?: IStore | null;
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
export type RegisterResponse = UserData;

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
  role: string;
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

//===========================================

interface EditProfileFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    username: string;
  };
  saving: boolean;
  token: string; // ✅ ADD
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  currentAvatar?: string;
  currentCover?: string;
}
