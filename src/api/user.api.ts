import axiosInstance from "./axios";
import type { IResponse, User } from "../types/User";


export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("users/all");
  return response.data;
};


export const getAllDealers = (): Promise<IResponse<User[]>> => {
  return axiosInstance.get("users/getDealers");
};
