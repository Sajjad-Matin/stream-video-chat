import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import type { AxiosError } from "axios";
import type { ErrorRes } from "./useSignUp";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation<unknown, AxiosError<ErrorRes>, void>({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
