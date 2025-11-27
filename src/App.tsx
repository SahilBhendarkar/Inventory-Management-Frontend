import React from "react";
import { BrowserRouter, } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from './routes/AppRoutes'

const App: React.FC = () => {
  return (

    <BrowserRouter>
      <div className="bg-brand min-h-screen">
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
};

export default App;