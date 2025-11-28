  "use client";

import { useAuthStore } from "@/store/authstore";
import { useEffect, useState } from "react";

  export default function Dashboard() {
    const { user } = useAuthStore()


    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name ?? "User"} 👋</h1>
        <p className="text-lg text-gray-600">Glad to see you back!</p>
      </div>
    );
  }
