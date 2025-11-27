import axiosInstance from "./axios";
import type { Stock } from "../types/Stock";
import type { Product } from "@/types/Product";
import { TransactionLog } from "../types/Stock";


//    ------------Stock---------------

export const updateStock = (id: number, payload: any): Promise<Stock> => {
  return axiosInstance.patch(`products/${id}/stock`, payload);
};

export const getLowStockProducts = (): Promise<Product[]> => {
  return axiosInstance.get("products/low-stock");
};


//     --------Transactions-------------

export const getAllTransactionLogs = async (): Promise<TransactionLog[]> => {
  const response = await axiosInstance.get<TransactionLog[]>("transactions/all");
  return response.data;
};

export const getTransactionLogsByProduct = async (productId: number): Promise<TransactionLog[]> => {
  const response = await axiosInstance.get<TransactionLog[]>(`transactions/product/${productId}`);
  return response.data;
};
