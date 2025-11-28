import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface ErrorRes {
  message: string;
}

const useSignUp = () => {
  const queryClient = useQueryClient();

   const mutation = useMutation<unknown, AxiosError<ErrorRes>, SignupData>({
    mutationFn: async (signupData) => {
      const res = await axiosInstance.post("/auth/signup", signupData);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
  return {
    isPending: mutation.isPending,
    error: mutation.error,
    signupMutation: mutation.mutate,
  };
};

export default useSignUp;
