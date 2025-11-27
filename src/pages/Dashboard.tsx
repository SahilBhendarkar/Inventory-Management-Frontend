"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/api/product.api";
import { getLowStockProducts } from "@/api/stock.api";
import type { Product } from "@/types/Product";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, Users, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [allRes, lowRes] = await Promise.all([
          getAllProducts(),
          getLowStockProducts(),
        ]);

        const pageData = allRes?.data?.data;

        setProducts(pageData?.content || []);
        setTotalProducts(pageData?.totalElements || 0);


        // setLowStockProducts(lowRes?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalStockValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const lowStockCount = lowStockProducts.length;
  const activeDealers = new Set(products.map((p) => p.dealerId)).size;

  const user = JSON.parse(localStorage.getItem("toke") || "{}");



  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <h1 className="text-3xl font-bold text-center">
        Welcome, {user?.name || user?.username || "User"} 👋
      </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 place-items-center">

        <Card className="min-w-[250px] w-[90%] max-w-[320px]shadow-md">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Total Products</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card className="min-w-[250px] w-[90%] max-w-[320px]shadow-md">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Low Stock</CardTitle>
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{lowStockCount}</p>
          </CardContent>
        </Card>

        <Card className="min-w-[250px] w-[90%] max-w-[320px]shadow-md">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Dealers</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeDealers}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          ) : lowStockProducts.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No low stock products.
            </p>
          ) : (
            <ul className="space-y-2">
              {lowStockProducts.map((p) => (
                <li key={p.id} className="flex justify-between border-b pb-2">
                  <span>{p.name}</span>
                  <span className="font-bold text-red-500">{p.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
