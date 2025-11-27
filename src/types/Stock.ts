export interface Stock {
  id: number;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  quantity: number;
  minStockLevel: number;
  dealerId: number;
  createdAt: string;
  updatedAt: string;
}


export interface UpdateStockResponse {
  data: {
    status: 'SUCCESS' | 'ERROR';
    message: string;
    data: Stock;
    timestamp: string;
  }
}


export interface LowStockProductsResponse {
  data: {
    status: string;
    message: string;
    data: Stock;
    timestamp: string;
  }
}


export interface TransactionLog {
  id: number;
  productId: number;
  userId: number;
  quantityChanged: number;
  createdAt: string;
}


export type TransactionLogResponse = TransactionLog[];

