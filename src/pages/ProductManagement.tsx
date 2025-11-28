import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash, Loader2 } from 'lucide-react'
import { z } from "zod"
import { toast } from "react-toastify"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import DataTable, { ColumnDef } from "../components/Table/DataTable"
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "../api/product.api"
import { useProductStore } from "../store/productstore"
import type { Product } from "../types/Product"
import { useAuthStore } from "@/store/authstore";
import { ROLE } from "@/enum/User";
import { updateStock } from "@/api/stock.api";
import { MODULE } from "@/enum/Module";
import { getAllDealers } from "@/api/user.api";
import { User } from "@/types/User";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100).trim(),
  category: z.string().min(1, 'Category is required').max(50).trim(),
  brand: z.string().min(1, 'Brand is required').max(50).trim(),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().positive('Price must be > 0').max(1_000_000),
  quantity: z.coerce.number().int().nonnegative(),
  minStockLevel: z.coerce.number().int().nonnegative(),
  dealerId: z.coerce.number().int().positive('Dealer ID must be positive'),
})

type ProductFormData = z.infer<typeof productSchema>

const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [writeAccess, setWriteAccess] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const { products, setProducts } = useProductStore()
  const { user } = useAuthStore()
  const permissions = useAuthStore((state) => state.permissions);
  const [dealer, setDealer] = useState<User[]>([])


  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);


  const handlePrevious = () => {
    setPage(prev => Math.max(prev - 1, 0));
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      description: "",
      price: 0,
      quantity: 0,
      minStockLevel: 0,
      dealerId: 0,
    }
  })


  useEffect(() => {
    fetchDealers()
  }, [])

  useEffect(() => {
    fetchProducts(page, pageSize);
  }, [page, pageSize])

  useEffect(() => {
    setWriteAccess(permissions?.[MODULE.PRODUCT_MANAGEMENT]?.write ?? false)
  }, [])

  useEffect(() => {
    if (!isModalOpen) {
      reset({
        description: "",
        price: 0,
        quantity: 0,
        minStockLevel: 0,
        dealerId: 0,
      });
    }
  }, [isModalOpen, reset]);


  const fetchDealers = async () => {
    try {
      const response = await getAllDealers()
      console.log(response)
      setDealer(response.data)
    } catch (error) {

    }
  }

  const fetchProducts = async (page?: number, size?: number) => {
    setIsLoading(true)
    try {
      const response = await getAllProducts({ page, size })
      setProducts(response.data.data?.products ?? [])
      setTotal(response.data?.data?.totalCount ?? 0)
      setIsLoading(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEdit && editingProduct) {
        if (user?.role === ROLE.ADMIN) {
          await updateProduct((editingProduct?.id ?? 0), data)
        }
        else {
          await updateStock((editingProduct?.id ?? 0), { quantity: data.quantity })
        }
        toast.success("Product updated successfully")
      } else {
        await addProduct(data)
        toast.success("Product added successfully")
      }
      await fetchProducts()
      handleCloseModal()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Operation failed")
    }
  }

  const handleEdit = (product: Product) => {
    console.log(product)
    setIsEdit(true)
    setEditingProduct(product)
    reset({
      name: product.name,
      category: product.category,
      brand: product.brand,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      minStockLevel: product.minStockLevel,
      dealerId: product.dealerId,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (deleteConfirmId === id) {
      try {
        setIsLoading(true);
        await deleteProduct(id)
        toast.success("Product deleted successfully")
        await fetchProducts(page, pageSize)
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Delete failed")
      } finally {
        setIsLoading(false);
        setDeleteConfirmId(null)
      }
    } else {
      setDeleteConfirmId(id)
      setTimeout(() => setDeleteConfirmId(null), 3000)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEdit(false)
    setEditingProduct(null)
    reset()
  }

  const columns: ColumnDef<Product>[] = [
    { key: "id", label: "ID", width: "80px" },
    { key: "name", label: "Name", width: "200px" },
    { key: "category", label: "Category", width: "140px" },
    { key: "brand", label: "Brand", width: "140px" },
    { key: "price", label: "Price", width: "140px", render: (value) => `₹${Number(value).toLocaleString('en-IN')}`, },
    {
      key: "quantity", label: "Stock", width: "140px",
      render: (_, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.quantity <= row.minStockLevel
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
          }`}>
          {row.quantity} {row.quantity <= row.minStockLevel && "(Low)"}
        </span>
      ),
    },
  ]

  if (ROLE.CUSTOMER === user?.role) {
    columns.pop()
  }

  if (writeAccess) {
    columns.push({
      key: "actions",
      label: "Actions",
      width: "120px",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-md hover:bg-blue-50 text-gray-600 transition"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          {
            user?.role === ROLE.ADMIN && (
              <button
                className={`p-2 rounded-md transition ${deleteConfirmId === row.id
                  ? "bg-red-100 hover:bg-red-200 text-red-700"
                  : "hover:bg-red-50 text-gray-600"
                  }`}
                onClick={() => handleDelete(row?.id ?? 0)}
                title={deleteConfirmId === row.id ? "Click again to confirm delete" : "Delete"}
              >
                <Trash size={16} />
              </button>
            )}
        </div>
      ),
    })
  }

  return (
    <>
      <div className="w-auto px-10 py-5">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Product Management</h1>

          {
            user?.role === ROLE.ADMIN && (

              <Button
                onClick={() => {
                  setIsEdit(false)
                  setEditingProduct(null)
                  reset()
                  setIsModalOpen(true)
                }}
              >
                + Add New Product
              </Button>
            )
          }
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={products} />
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Page {page + 1} of {Math.ceil(total / pageSize)}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={handlePrevious}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  disabled={page >= Math.ceil(total / pageSize)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                  className="border rounded-md p-2 text-sm"
                >
                  {[5, 10, 15, 20].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {
                user?.role === ROLE.ADMIN
                && (
                  <>
                    <div>
                      <Label>Product Name <span className="text-red-500">*</span></Label>
                      <Input {...register("name")} placeholder="e.g. iPhone 15" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <Label>Category <span className="text-red-500">*</span></Label>
                      <Input {...register("category")} placeholder="e.g. Electronics" />
                      {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                      <Label>Brand <span className="text-red-500">*</span></Label>
                      <Input {...register("brand")} placeholder="e.g. Apple" />
                      {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                    </div>

                    <div>
                      <Label>Price (₹) <span className="text-red-500">*</span></Label>
                      <Input {...register("price")} type="number" step="0.01" placeholder="99999" />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                  </>
                )
              }

              {
                (user?.role === ROLE.DEALER || !isEdit)
                && (

                  <div>
                    <Label>Quantity <span className="text-red-500">*</span></Label>
                    <Input {...register("quantity")} type="number" placeholder="50" />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                  </div>
                )}

              {
                user?.role === ROLE.ADMIN
                && (
                  <>

                    <div>
                      <Label>Min Stock Level <span className="text-red-500">*</span></Label>
                      <Input {...register("minStockLevel")} type="number" placeholder="10" />
                      {errors.minStockLevel && <p className="text-red-500 text-xs mt-1">{errors.minStockLevel.message}</p>}
                    </div>

                    <div>
                      <Label>
                        Dealer <span className="text-red-500">*</span>
                      </Label>

                      <Select
                        value={String(watch("dealerId") || "")}
                        onValueChange={(value) => setValue("dealerId", Number(value))}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select Dealer" />
                        </SelectTrigger>

                        <SelectContent>
                          {dealer.map((dealer) => (
                            <SelectItem key={dealer.id} value={String(dealer.id)}>
                              {dealer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {errors.dealerId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dealerId.message}
                        </p>
                      )}
                    </div>



                    <div className="md:col-span-2">
                      <Label>Description (Optional)</Label>
                      <Textarea {...register("description")} rows={3} placeholder="Product details..." />
                    </div>
                  </>
                )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{isEdit ? "Update" : "Add"} Product</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProductManagement