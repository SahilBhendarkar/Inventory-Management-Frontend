import axiosInstance from './axios';
import type { Product } from '../types/Product';


export const getAllProducts = (params?: any)=> {
  return axiosInstance.get("products", {params }); 
}

export const getProductById = async (id: number) => {
  return axiosInstance.get(`products/${id}`) 
}


export const addProduct = (payload: any):any => {
  return axiosInstance.post('products/add', payload);

}

export const updateProduct = (id: number, product: Partial<Product>): Promise<Product> => {
  return axiosInstance.put(`products/${id}`, product);
};


export const deleteProduct = (id: number) => {
  return axiosInstance.delete(`products/${id}`);
}