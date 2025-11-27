import { ROLE } from "@/enum/User";

export interface User {
  id: number;
  email: string;
  name?: string;
  role?: ROLE;
  permissions?: Record<string, { read: boolean }> | null;
}

export interface IResponse<T> {
data:T;
status:number;
message:string;
}