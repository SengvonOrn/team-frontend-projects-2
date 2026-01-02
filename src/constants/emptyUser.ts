import { UserData } from "@/types/user";

export const EMPTY_USER: UserData = {
  id: '',
  name: "",
  email: "",
  username: "",
  image: null,
  role: "",
  status: "",
  createdAt: "",
  updatedAt: "",

  profileImage: null,
  customers: [],
  comments: [],
  cartItems: [],
  locations: [],
};
