import axios from "axios";

const API_URL = import.meta.env.API_URL;

export const getAIDecisions = async () => {
  const response = await axios.get(
    `${API_URL}/api/ai/decisions`
  );

  return response.data;
};

export const analyzePayment = async (paymentId) => {
  const response = await axios.post(
    `${API_URL}/api/ai/analyze/${paymentId}`
  );

  return response.data;
};