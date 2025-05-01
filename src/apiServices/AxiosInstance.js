import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://apis.hocalwire.com/dev/h-api/', // replace with your actual base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    's-id': 'GcVY3jdBSZFsUy2wcsIjPLMfH2oA7YGKmiPiXPFTDa9yDMpXqeRN7QQ0HGEhIRAn',
  },
});

export default axiosInstance;