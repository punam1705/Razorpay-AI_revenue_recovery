import axios from "axios";

const API_URL = import.meta.env.API_URL;

export const getDashboardSummary = async () => {
  const response = await axios.get(
    `${API_URL}/api/dashboard/summary`
  );

  return response.data;
};