/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentForm from './components/PaymentForm';
import PaymentList from './components/PaymentList';
import PaymentSummary from './components/PaymentSummary';
// import { Payment } from './types/payment';

export interface Payment {
  id: number;
  amount: number;
  description: string;
  date: string;
}



const API_URL = 'http://localhost:5000/api';

// Configure axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string>('');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setConnectionError('');
      
      // Test connection first
      try {
        await axios.get(`${API_URL}/health`);
      } catch (healthError) {
        setConnectionError('Cannot connect to backend server. Make sure Express is running on port 5000.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/payments`);
      setPayments(response.data);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      
      if (error.code === 'ERR_NETWORK') {
        setConnectionError('Network error: Cannot connect to backend. Make sure Express server is running.');
      } else {
        setConnectionError('Error loading payments. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: { amount: string; description: string }) => {
    try {
      const response = await axios.post(`${API_URL}/payments`, paymentData);
      setPayments([...payments, response.data]);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Error creating payment:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to create payment. Check backend connection.' 
      };
    }
  };

  const updatePayment = async (id: number, paymentData: { amount?: string; description?: string }) => {
    try {
      const response = await axios.patch(`${API_URL}/payments/${id}`, paymentData);
      setPayments(payments.map(p => p.id === id ? response.data : p));
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Error updating payment:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update payment' 
      };
    }
  };

  const deletePayment = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/payments/${id}`);
      setPayments(payments.filter(p => p.id !== id));
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting payment:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to delete payment' 
      };
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments Management System</h1>
          <p className="text-gray-600 mt-2">Manage your payment records with ease</p>
          
          {connectionError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Connection Issue:</p>
              <p className="text-red-600">{connectionError}</p>
              <button
                onClick={fetchPayments}
                className="mt-2 bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
              >
                Retry Connection
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Payment</h2>
              <PaymentForm onCreate={createPayment} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">All Payments</h2>
                <button
                  onClick={fetchPayments}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition duration-200"
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh List'}
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading payments...</p>
                </div>
              ) : connectionError ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-4">{connectionError}</p>
                  <button
                    onClick={fetchPayments}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <PaymentList 
                  payments={payments} 
                  onUpdate={updatePayment} 
                  onDelete={deletePayment} 
                />
              )}
            </div>

            <PaymentSummary payments={payments} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;