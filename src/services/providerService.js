import api from "./api.js";

export const fetchProviders = async () => {
  const response = await api.get("/sp/list");
  return response.data;
};

export const fetchProviderById = async (id) => {
  const response = await api.get(`/sp/${id}`);
  return response.data;
};
