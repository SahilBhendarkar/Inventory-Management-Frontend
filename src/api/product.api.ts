import axiosInstance from './axios';
import type { Product } from '../types/Product';


//     --------GetALlProducts-------------

export const getAllProducts = (params?: any) => {
  return axiosInstance.get("products", { params });
}

//     --------Get Product By ID-----------

export const getProductById = async (id: number) => {
  return axiosInstance.get(`products/${id}`)
}

//     --------Add Product---------

export const addProduct = (payload: any): any => {
  return axiosInstance.post('products/add', payload);

}

//    ---------Update Product-----------

export const updateProduct = (id: number, product: Partial<Product>): Promise<Product> => {
  return axiosInstance.put(`products/${id}`, product);
};

//     --------Delete Product-------------

export const deleteProduct = (id: number) => {
  return axiosInstance.delete(`products/${id}`);
}