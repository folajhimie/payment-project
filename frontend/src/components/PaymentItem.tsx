import React, { useState } from 'react';


export interface Payment {
  id: number;
  amount: number;
  description: string;
  date: string;
}

interface PaymentItemProps {
  payment: Payment;
  isEditing: boolean;
  onEdit: (id: number) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number, data: { amount: string; description: string }) => void;
  onDelete: (id: number) => void;
}

const PaymentItem: React.FC<PaymentItemProps> = ({ 
  payment, 
  isEditing, 
  onEdit, 
  onCancelEdit, 
  onSaveEdit, 
  onDelete 
}) => {
  const [editData, setEditData] = useState({
    amount: payment.amount.toString(),
    description: payment.description
  });

  const handleSave = () => {
    onSaveEdit(payment.id, editData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {payment.id}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="number"
            name="amount"
            step="0.01"
            value={editData.amount}
            onChange={handleChange}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
            placeholder="Amount"
          />
        ) : (
          <div className="text-sm text-gray-900 font-medium">
            ${payment.amount.toFixed(2)}
          </div>
        )}
      </td>
      
      <td className="px-6 py-4">
        {isEditing ? (
          <input
            type="text"
            name="description"
            value={editData.description}
            onChange={handleChange}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
            placeholder="Description"
          />
        ) : (
          <div className="text-sm text-gray-700">{payment.description}</div>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {payment.date}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-900 px-3 py-1 rounded-md bg-green-50 hover:bg-green-100 transition duration-150"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md bg-gray-50 hover:bg-gray-100 transition duration-150"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(payment.id)}
              className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-150"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(payment.id)}
              className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 transition duration-150"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default PaymentItem;