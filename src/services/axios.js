import axios from 'axios';
import {BASE_URL} from "../config/api";

const baseArgs = {
    baseURL: BASE_URL,
    withCredentials: true
}
const originAxiosInstance = axios.create({...baseArgs});

const axiosInstance = axios.create({...baseArgs});

const baseAxiosInstance = axios.create({...baseArgs});


export { axiosInstance, baseAxiosInstance, originAxiosInstance};