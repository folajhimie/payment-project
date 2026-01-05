import React, { useState } from 'react';


export interface Payment {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export interface CreatePaymentDTO {
  amount: string;
  description: string;
}

interface PaymentFormProps {
  onCreate: (paymentData: CreatePaymentDTO) => Promise<{ success: boolean; error?: string }>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState<CreatePaymentDTO>({
    amount: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const result = await onCreate(formData);
    
    if (result.success) {
      setFormData({ amount: '', description: '' });
      alert('Payment created successfully!');
    } else {
      alert(result.error || 'Failed to create payment');
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($)
        </label>
        <input
          type="number"
          name="amount"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What is this payment for?"
          required
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating...' : 'Create Payment'}
      </button>
    </form>
  );
};

export default PaymentForm;