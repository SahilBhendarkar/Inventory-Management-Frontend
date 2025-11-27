export interface Product {
  id?: number;
  name: string;
  category: string;
  brand: string;
  description?: string;
  price: number;
  quantity: number;
  minStockLevel: number;
  dealerId: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface ProductReposne{
  data :{

  }
}



export interface AddProductResponse {
  data: {
    status: "SUCCESS" | "ERROR";
    message: string;
    data: Product;
    timestamp: Date;
  }
}



export interface GetProductByIdResponse {
  data: {
    status: string;
    message: string;
    data: Product;
    timestamp: string;
  }
}


export interface PaginationData<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface GetAllProductsResponse {
  data: {
    status: string;
    message: string;
    data: PaginationData<Product>;
    timestamp: string;
  }
}


export interface UpdateProductResponse {
  data: {
    status: "SUCCESS" | "ERROR";
    message: string;
    data: Product;
    timestamp: string;
  }
}