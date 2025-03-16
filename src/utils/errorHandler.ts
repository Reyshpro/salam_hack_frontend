export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      message: error.response.data.message || 'An error occurred',
      code: error.response.data.code || 'UNKNOWN_ERROR',
      status: error.response.status
    };
  }
  return {
    message: 'Network error',
    code: 'NETWORK_ERROR',
    status: 500
  };
}; 