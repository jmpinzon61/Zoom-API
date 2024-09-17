import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',// Accedo a mi app backend
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;