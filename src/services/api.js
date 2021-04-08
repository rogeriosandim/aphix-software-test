import axios from 'axios';

const api = axios.create({
  baseURL: 'https://s3-eu-west-1.amazonaws.com/webshop/tests/',
});

export default api;
