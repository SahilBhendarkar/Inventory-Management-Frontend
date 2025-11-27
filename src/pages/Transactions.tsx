import React, { useEffect, useState } from "react";
import { getAllTransactionLogs } from "@/api/stock.api";
import { TransactionLog } from "@/types/Stock";
import DataTable, { ColumnDef } from "../components/Table/DataTable";

const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionLog[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getAllTransactionLogs();
        setTransactions(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  // ------------------- TABLE COLUMNS -------------------
  const columns: ColumnDef<TransactionLog>[] = [
    { key: "id", label: "ID", width: "80px" },
    { key: "productId", label: "Product ID", width: "150px" },
    { key: "userId", label: "User ID", width: "150px" },
    { key: "quantityChanged", label: "Quantity", width: "120px" },
    {
      key: "createdAt",
      label: "Date",
      width: "180px",
      render: (_, row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="w-auto px-10 py-5">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Transaction Logs
      </h1>

      <DataTable columns={columns} data={transactions} />
    </div>
  );
};

export default Transactions;
