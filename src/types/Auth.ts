export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  mobileNo: string;
  address: string;
  role: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  data:{
    token: string;
    role: string;
  }
};