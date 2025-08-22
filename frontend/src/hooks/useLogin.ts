import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import type { AxiosError } from "axios";
import type { ErrorRes } from "./useSignUp";

interface loginRes {
  success: boolean;
  user: {
    fullName: string;
    email: string;
  };
}

interface loginData {
  email: string;
  password: string;
}

const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    loginRes,
    AxiosError<ErrorRes>,
    loginData
  >({
    mutationFn: async (loginData) => {
      const response = await axiosInstance.post("/auth/login", loginData);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;
