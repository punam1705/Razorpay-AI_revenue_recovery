import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getDashboardSummary = async () => {
  const response = await axios.get(
    `${API_URL}/api/dashboard/summary`
  );

  return response.data;
};