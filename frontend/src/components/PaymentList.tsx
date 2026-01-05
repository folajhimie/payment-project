import React, { useState } from 'react';
// import { Payment } from '../types/payment';
import PaymentItem from './PaymentItem';


export interface Payment {
  id: number;
  amount: number;
  description: string;
  date: string;
}


interface PaymentListProps {
  payments: Payment[];
  onUpdate: (id: number, data: { amount?: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: number) => Promise<{ success: boolean; error?: string }>;
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: number, data: { amount: string; description: string }) => {
    const updateData: { amount?: string; description?: string } = {};
    
    if (data.amount && data.amount !== '') {
      updateData.amount = data.amount;
    }
    
    if (data.description && data.description !== '') {
      updateData.description = data.description;
    }
    
    if (Object.keys(updateData).length === 0) {
      alert('Please enter at least one field to update');
      return;
    }
    
    const result = await onUpdate(id, updateData);
    if (result.success) {
      setEditingId(null);
      alert('Payment updated successfully!');
    } else {
      alert(result.error || 'Failed to update payment');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      const result = await onDelete(id);
      if (!result.success) {
        alert(result.error || 'Failed to delete payment');
      }
    }
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
        <p className="text-gray-600">Create your first payment to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <PaymentItem
              key={payment.id}
              payment={payment}
              isEditing={editingId === payment.id}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;