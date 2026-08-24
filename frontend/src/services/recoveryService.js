import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getRecoveries = async () => {
  const response = await axios.get(
    `${API_URL}/api/recoveries`
  );

  return response.data;
};

export const getRecovery = async (recoveryId) => {
  const response = await axios.get(
    `${API_URL}/api/recoveries/${recoveryId}`
  );

  return response.data;
};

export const createRecovery = async (recoveryData) => {
  const response = await axios.post(
    `${API_URL}/api/recoveries`,
    recoveryData
  );

  return response.data;
};

export const updateRecoveryStatus = async (
  recoveryId,
  status
) => {
  const response = await axios.patch(
    `${API_URL}/api/recoveries/${recoveryId}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const executeRecovery = async (
  recoveryId
) => {
  const response = await axios.post(
    `${API_URL}/api/recoveries/${recoveryId}/execute`
  );

  return response.data;
};

export const updateRecoveryResult = async (
  recoveryId,
  recovered
) => {
  const response = await axios.post(
    `${API_URL}/api/recoveries/${recoveryId}/result`,
    null,
    {
      params: {
        recovered,
      },
    }
  );

  return response.data;
};