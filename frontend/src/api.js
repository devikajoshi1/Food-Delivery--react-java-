import axios from 'axios';

const api = axios.create({
    // set VITE_API_URL when deploying, e.g. https://food-backend.onrender.com/api
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
})

//jwt token
api.interceptors.request.use((config)=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user && user.token){
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
})

//token is expire , invalid
api.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if(error.response && error.response.status === 401 && localStorage.getItem("user")){
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

//get a readable error msg 
export function getError(error){
    return error.response?.data?.message || "something went wrong"
}

export default api;