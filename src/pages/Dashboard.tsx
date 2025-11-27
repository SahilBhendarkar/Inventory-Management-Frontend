"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("toke") || "{}");
    setUserName(user?.name || user?.username || "User");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome, {userName} 👋</h1>
      <p className="text-lg text-gray-600">Glad to see you back!</p>
    </div>
  );
}
