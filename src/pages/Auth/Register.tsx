import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthTabs } from "../../enum/Tab";


const schema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
  mobileNo: z.string().length(10, "Must be 10 digits"),
  address: z.string().min(10, "Address too short"),
  role: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function Register({setTab,setSwitchTab}:{setTab:Dispatch<SetStateAction<string>>,setSwitchTab: Dispatch<SetStateAction<boolean>>}) {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { role: "CUSTOMER" },
    });

  const onSubmit = async (data: FormData) => {
    setSwitchTab(false)
    try {
      await registerUser(data);
      toast.success("Registration complete!");
      setTab(AuthTabs.LOGIN)
    } catch (err: any) {
      toast.error(err?.response?.data || "Registration failed");
    }
    finally{
      setSwitchTab(true)
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      {/* Row 1 — Full Name + Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input {...register("name")} placeholder="John Doe" />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        <div>
          <Label>Mobile Number</Label>
          <Input {...register("mobileNo")} maxLength={10} autoComplete="tel" placeholder="9876543210"
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, ""); 
              setValue("mobileNo", onlyNums, { shouldValidate: true });
            }}
          />
          {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo.message}</p>}
        </div>
      </div>

      {/* Row 2 — Email + Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
      </div>

      {/* Address (Full Width) */}
      <div>
        <Label>Address</Label>
        <Textarea {...register("address")} rows={3} placeholder="Full address" />
        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
      </div>


      {/* Register As (Full Width) */}
      <div>
        <Label>Register As</Label>
        <Select onValueChange={(value) => setValue("role", value as string)} defaultValue="CUSTOMER">
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="DEALER">Dealer</SelectItem>
          </SelectContent>
        </Select>

        {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating Account..." : "Register"}
      </Button>

    </motion.form>

  );
}
