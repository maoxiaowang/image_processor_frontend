import {BASE_URL} from "../config/api";
import {useSnackbar} from "../context/useSnackbar";
import {useEffect} from "react";
import useBackdrop from "../hooks/useBackdrop";
import axios from 'axios';

const baseArgs = {
    baseURL: BASE_URL,
    withCredentials: true
}

export const defaultAxios = axios.create({...baseArgs});

const useAxios = () => {

    const {openSnackbar, closeSnackbar} = useSnackbar();
    const {backdropOpen, openBackdrop, closeBackdrop} = useBackdrop();
    const axiosInstance = axios.create({...baseArgs});

    useEffect(() => {

        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                openBackdrop();
                return config;
            },
            (error) => {
                closeBackdrop();
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => {
                closeBackdrop();
                return response;
            },
            (error) => {
                closeBackdrop();
                if (error.response) {
                    const errStatus = error.response.status
                    if (errStatus === 400) {
                        console.log('........................400')
                        const errData = error.response.data;
                        if (Array.isArray(errData)) {
                            errData.forEach((error) => {
                                openSnackbar(error, 'error');
                            });
                        } else if (typeof errData === 'object' && errData !== null) {
                            Object.keys(errData).forEach((fieldName) => {
                                const messages = errData[fieldName];
                                const combinedMessage = messages.join(', ');
                                openSnackbar(`${fieldName}: ${combinedMessage}`, 'error');
                            });
                        } else {
                            // 处理其他类型的 errData
                            console.error('Invalid errData format:', errData);
                        }
                        return Promise.reject(error)
                    } else if (errStatus === 401) {
                        // 如果响应状态码是 401，执行重定向到登录页面的操作
                        openSnackbar('请登录后操作', "warning");
                    } else if (errStatus === 404) {
                        openSnackbar(error.response.message)
                    } else if (errStatus >= 500) {
                        openSnackbar(error.response.statusText, 'error')
                    } else {
                        openSnackbar(error.response.data.detail, 'error')
                    }
                    return Promise.reject(error); // 返回一个被拒绝的 Promise，以便在调用方处理
                }
                // 处理其他响应错误
                return Promise.reject(error);
            }
        );

        return () => {
            // 清理拦截器
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [
        openSnackbar,
        closeSnackbar,
        closeBackdrop,
        closeSnackbar,
        openBackdrop,
        axiosInstance.interceptors.request,
        axiosInstance.interceptors.response
    ]);

    return {backdropOpen, axiosInstance};
}

export default useAxios;
