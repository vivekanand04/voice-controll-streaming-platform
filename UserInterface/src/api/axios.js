// src/api/axios.js  (create or add to main.jsx before app render)
import axios from "axios";

axios.defaults.withCredentials = true;               // important: send cookies
axios.defaults.baseURL = import.meta.env.VITE_API_URL; // optional: centralize base URL

export default axios;
