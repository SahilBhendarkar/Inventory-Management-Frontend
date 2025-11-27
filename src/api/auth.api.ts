// srcauth.api.ts
import axiosInstance from "./axios";
import type { LoginResponse, RegisterPayload, LoginPayload } from "../types/Auth";

export const registerUser = (payload: RegisterPayload) => {
  return axiosInstance.post("users/register", payload);

};

export const loginUser = (payload: LoginPayload): Promise<LoginResponse> => {
  return axiosInstance.post("users/login", payload);

};