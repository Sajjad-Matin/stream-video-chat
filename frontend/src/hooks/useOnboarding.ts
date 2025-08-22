import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import type { AxiosError } from "axios";
import type { ErrorRes } from "./useSignUp";

export interface OnboardingData {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  location: string;
  profilePic: string;
}


const useOnboarding = () => {
    const mutation = useMutation<
    any,
    AxiosError<ErrorRes>,
    OnboardingData
  >({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/auth/onboarding", userData);
      return response.data;
    }
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending
  }
};

export default useOnboarding;
