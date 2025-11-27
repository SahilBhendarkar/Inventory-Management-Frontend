import { Product, ProductPayload, StockUpdatePayload } from "@/types/Product";

export const dummyProducts: Product[] = [
    {
        id: 1,
        name: "Laptop Pro 15",
        category: "Electronics",
        brand: "TechCore",
        description: "High-performance laptop for professionals.",
        price: 120000,
        quantity: 12,
        minStockLevel: 5,
        dealerId: 2101,
        createdAt: "2025-01-10T10:20:00Z"
    },
    {
        id: 2,
        name: "Wireless Mouse",
        category: "Accessories",
        brand: "ClickMaster",
        description: "Ergonomic wireless mouse with fast response.",
        price: 1500,
        quantity: 50,
        minStockLevel: 10,
        dealerId: 2102,
        createdAt: "2025-01-15T09:00:00Z"
    },
    {
        id: 3,
        name: "Office Chair",
        category: "Furniture",
        brand: "ComfortPlus",
        description: "High-back ergonomic office chair.",
        price: 8500,
        quantity: 7,
        minStockLevel: 3,
        dealerId: 2103,
        createdAt: "2025-02-01T12:30:00Z"
    }
]


export const dummyProductPayloads: ProductPayload[] = [
    { name: "Laptop Pro 15", quantity: 5 },
    { name: "Wireless Mouse", quantity: 20 },
    { name: "Office Chair", quantity: 3 }
];


export const dummyStockUpdates: StockUpdatePayload[] = [
    { quantityChange: 10, chnageType: "INCREASE" },
    { quantityChange: 5, chnageType: "DECREASE" },
    { quantityChange: 3, chnageType: "INCREASE" }
];
