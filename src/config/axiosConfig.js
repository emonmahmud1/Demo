import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const axiosClient = (forLogin=false) => {
    if(forLogin) {
        return axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }else{
        return axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

}


export default axiosClient;

export const fetcher = url => axiosClient(false).get(url).then(res => {
    res.data.fetchTime = new Date();
    return res.data;
});