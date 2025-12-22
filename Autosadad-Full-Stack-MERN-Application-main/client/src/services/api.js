import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' }); // Match your backend port

export default API;