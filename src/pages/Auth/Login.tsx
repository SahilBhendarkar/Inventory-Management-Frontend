import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/store/authstore'
import { getTokenData } from '@/utils/token'
import { Eye, EyeOff } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react";
import { LOGIN_RESPONSE } from "@/enum/Response";
import { AuthTabs } from "@/enum/Tab";
import { getPermission } from "@/constant/permission";
import { ROLE } from "@/enum/User";

const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function Login({ setTab, setSwitchTab }: { setTab: Dispatch<SetStateAction<string>>, setSwitchTab: Dispatch<SetStateAction<boolean>> }) {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
    });
  const setAuth = useAuthStore((state) => state.setAuth);

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      setSwitchTab(false)
      const response = await loginUser({
        email: data.email.trim(),
        password: data.password
      });


      const token = response.data.token;
      localStorage.setItem('token', token);
      const decoded = getTokenData();
      const permissions = getPermission(decoded?.role ?? ROLE.CUSTOMER)
      console.log(permissions)
      setAuth({ token, user: decoded,permissions });

      toast.success("Login Successful");
      navigate('/dashboard')

    } catch (err: any) {
      if (err.response.data === LOGIN_RESPONSE.INVALID_PASSWORD) {
        toast.error("Invalid password");
      }
      if (err.response.data === LOGIN_RESPONSE.USER_NOT_FOUND) {
        toast.error("Email id not found, Please Register");
        setTab(AuthTabs.REGISTER)
      }
    }
    finally {
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
      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input {...register("email")} type="email" autoComplete="username" placeholder="you@example.com" />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      {/* Password */}
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

      <Button type="submit" disabled={isSubmitting} className="w-full px-2 py-4">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </motion.form>
  );
}
