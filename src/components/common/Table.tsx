import React from 'react'


const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
<div className="bg-white rounded shadow overflow-auto">
<table className="min-w-full divide-y divide-gray-200">
{children}
</table>
</div>
)


export default Table