import { useEffect, useState } from "react";
import { Pencil, Trash, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ROLE } from "../enum/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { ColumnDef } from "../components/Table/DataTable";
import { toast } from "react-toastify";
import { registerUser } from "@/api/auth.api";
import { getAllUsers } from "@/api/user.api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


// ------------------- ZOD SCHEMA -------------------
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  role: z.nativeEnum(ROLE, { required_error: "Role is required" }),


  mobileNo: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .refine((val) => /^\d+$/.test(val), "Only numbers allowed"),

  address: z.string().min(5, "Address must be at least 5 characters"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

type UserForm = z.infer<typeof userSchema>;


// ------------------- COMPONENT START -------------------
const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  // ------------------- Fetch Users -------------------
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res);
    } catch {
      toast.error("Failed to load Users")
    } finally {
      setLoading(false)
    }
    }

    fetchUsers()
  },[])

    // ------------------- CREATE USER -------------------

  const submitForm = async (data: UserForm) => {
    console.log("PAYLOAD SENT:", data);
    try {
      const res = await registerUser(data);
      toast.success(res.data.message || "User created successfully!");
      reset();
      setIsModalOpen(false);

      const updatedList = await getAllUsers()
      setUsers(updatedList);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  // ------------------- Mobile Input Only Numbers -------------------
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("mobileNo", value, { shouldValidate: true });
  };

  const columns: ColumnDef<any>[] = [
    { key: "id", label: "ID", width: "80px" },
    { key: "name", label: "Name", width: "200px" },
    { key: "email", label: "Email", width: "220px" },
    { key: "mobileNo", label: "Mobile", width: "140px" },
    { key: "role", label: "Role", width: "120px" },
    {
      key: "actions",
      label: "Actions",
      width: "120px",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-md hover:bg-blue-50 text-gray-600 transition"
            onClick={() => console.log("Edit", row.id)}
          >
            <Pencil size={16} />
          </button>
          <button className="p-2 rounded-md hover:bg-red-50 text-red-600 transition">
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="w-auto px-10 py-5">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
          <Button
            onClick={() => {
              setIsEdit(false);
              reset();
              setIsModalOpen(true);
            }}
            size="lg"
          >
            + Add New User
          </Button>
        </div>

        <DataTable columns={columns} data={users} />
      </div>

      {/* Add User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-b">
              {isEdit ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <Label>Name</Label>
                <Input {...register("name")} placeholder="Enter full name" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input {...register("email")} type="email" placeholder="user@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <Label>Mobile Number</Label>
                <Input
                  {...register("mobileNo")}
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  onChange={handleMobileChange}
                />
                {errors.mobileNo && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobileNo.message}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <Label>Address</Label>
                <Input {...register("address")} placeholder="Full address" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              {/* Role */}
              <div>
                <Label>Role</Label>
                <Select onValueChange={(value) => setValue("role", value as ROLE)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ROLE).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.split('_')[1]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Update User" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;