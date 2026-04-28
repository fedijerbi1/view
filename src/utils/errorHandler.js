// Error handling utilities

export const handleApiError = (error, customMessages = {}) => {
  const status = error.response?.status;
  const defaultMessages = {
    400: 'Invalid request. Please check your input.',
    401: 'Unauthorized. Please log in again.',
    403: 'Access forbidden. You do not have permission.',
    404: 'Resource not found.',
    500: 'Server error. Please try again later.',
    default: 'An unexpected error occurred. Please try again.',
  };

  const message = error.response?.data?.message || 
                  customMessages[status] || 
                  defaultMessages[status] || 
                  defaultMessages.default;

  return {
    message,
    status,
    error,
  };
};

export const logError = (error, context = '') => {
  console.error(`[${context}]`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    config: error.config,
  });
};

export default {
  handleApiError,
  logError,
};
