import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

interface AuthUser {
  success: boolean;
  user: User;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  location: string;
  learningLanguage: string;
  nativeLanguage: string;
  bio: string;
  isOnboarded: {
    type: Boolean;
    default: false;
  };
}

const useAuthUser = () => {
  return useQuery<AuthUser, Error>({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    retry: false,
  });
};

export default useAuthUser;
