import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getPayments = async () => {
  const response = await axios.get(
    `${API_URL}/api/payments`
  );

  return response.data;
};

export const getPayment = async (paymentId) => {
  const response = await axios.get(
    `${API_URL}/api/payments/${paymentId}`
  );

  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await axios.post(
    `${API_URL}/api/payments`,
    paymentData
  );

  return response.data;
};

export const retryPayment = async (
  paymentId
) => {
  const response = await axios.post(
    `${API_URL}/api/payments/${paymentId}/retry`
  );

  return response.data;
};