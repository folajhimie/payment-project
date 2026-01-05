import React from 'react';


export interface Payment {
  id: number;
  amount: number;
  description: string;
  date: string;
}




interface PaymentSummaryProps {
  payments: Payment[];
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ payments }) => {
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const averageAmount = payments.length > 0 ? totalAmount / payments.length : 0;

  const stats = [
    {
      name: 'Total Payments',
      value: payments.length,
      color: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Amount',
      value: `$${totalAmount.toFixed(2)}`,
      color: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Average Payment',
      value: `$${averageAmount.toFixed(2)}`,
      color: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} p-6 rounded-lg`}>
            <p className="text-sm font-medium mb-2">{stat.name}</p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentSummary;