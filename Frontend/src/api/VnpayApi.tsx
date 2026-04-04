import api from './axiosInstance';


export const createVNPayUrl = async (amount: number, orderId: string) => {
  try {
    const data = await api.post('/vnpay/create_payment_url', { amount, orderId });
    return data.paymentUrl;
  } catch (error) {
    console.error("Error fetching VNPAY payment URL:", error);
    throw error;
  }
}

export const verifyVNPayReturn = async (queryParams: URLSearchParams) => {
  try {
    return await api.get('/vnpay/vnpay_return', { params: queryParams });
  } catch (error) {
    console.error("Error verifying VNPAY return:", error);
    throw error;
  }
};

