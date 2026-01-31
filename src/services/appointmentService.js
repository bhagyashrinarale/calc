import api from "./api.js";

const bookEndpoint =
  import.meta.env.VITE_API_APPOINTMENTS_BOOK_PATH || "/appointments/book";
const tasksEndpoint =
  import.meta.env.VITE_API_APPOINTMENTS_TASKS_PATH || "/appointments/my-tasks";
const bookingsEndpoint =
  import.meta.env.VITE_API_APPOINTMENTS_BOOKINGS_PATH ||
  "/appointments/my-bookings";
const statusEndpoint =
  import.meta.env.VITE_API_APPOINTMENTS_STATUS_PATH || "/appointments/status";

export const bookAppointment = async (payload) => {
  const response = await api.post(bookEndpoint, payload);
  return response.data;
};

export const fetchProviderTasks = async (status) => {
  const response = await api.get(tasksEndpoint, {
    params: status ? { status } : {},
  });
  return response.data;
};

export const updateAppointmentStatus = async (payload) => {
  const response = await api.patch(statusEndpoint, payload);
  return response.data;
};

export const fetchClientBookings = async (status) => {
  const response = await api.get(bookingsEndpoint, {
    params: status ? { status } : {},
  });
  return response.data;
};
