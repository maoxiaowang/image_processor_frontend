import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Backdrop, CircularProgress, CssBaseline} from "@mui/material";
import ROUTES from "./config/route"
import {AuthProvider, useAuth} from "./context/useAuth";
import NotFound from "./pages/shared/NotFound";
import {axiosInstance, baseAxiosInstance} from "./services/axios";
import useBackdrop from "./hooks/useBackdrop";
import Typography from "@mui/material/Typography";
import ImageList from "./pages/image/ImageList2";
import {useSnackbar} from "./context/useSnackbar";


const App = () => {
    console.log('RUN App')
    const theme = createTheme({
        spacing: 8,  // default
    });
    const {backdropOpen, backdropMessage, openBackdrop, closeBackdrop} = useBackdrop();

    const ProtectedRoute = ({element}) => {
        const {isAuthenticated} = useAuth();
        // Render the protected route or redirect to login page based on isAuthenticated
        return isAuthenticated ? element : <Navigate to={ROUTES.auth.loginPage} replace={true}/>;
    };

    const {openSnackbar} = useSnackbar();
    useEffect(() => {
        console.log('useEffect App')
        // 请求拦截器
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
        // 响应拦截器
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
                        return Promise.reject(error);
                    } else if (errStatus >= 500) {
                        openSnackbar(error.response.statusText, 'error')
                    } else {
                        openSnackbar(error.response.data.detail, 'error')
                    }

                    // window.location.href = ROUTES.auth.loginPage; // 使用 React Router 的 navigate 函数重定向
                    return Promise.reject(error); // 返回一个被拒绝的 Promise，以便在调用方处理
                }
                // 处理其他响应错误
                return Promise.reject(error);
            }
        );
        const baseRequestInterceptor = baseAxiosInstance.interceptors.request.use(
            (config) => {
                openBackdrop();
                return config;
            },
            (error) => {
                closeBackdrop();
                return Promise.reject(error);
            }
        );
        const baseResponseInterceptor = baseAxiosInstance.interceptors.response.use(
            (response) => {
                closeBackdrop();
                return response;
            },
            (error) => {
                closeBackdrop();
                return Promise.reject(error);
            }
        );
        return () => {
            // 在组件卸载时清理拦截器
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
            baseAxiosInstance.interceptors.request.eject(baseRequestInterceptor);
            baseAxiosInstance.interceptors.response.eject(baseResponseInterceptor);
        };
    }, [closeBackdrop, openBackdrop, openSnackbar]);

    const GlobalBackdrop = React.memo(() => {
        console.log('RUN GlobalBackdrop')
        return (
            <Backdrop open={backdropOpen} sx={{zIndex: (theme) => theme.zIndex.drawer + 101}}>
                {/* Modal 1300, Drawer 1200 */}
                <CircularProgress sx={{color: "#fff"}}/>
                {backdropMessage && <Typography sx={{color: '#fff', marginLeft: 2}}>{backdropMessage}</Typography>}
            </Backdrop>
        )
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AuthProvider>
                <Routes>
                    <Route path={ROUTES.homePage} element={<ProtectedRoute element={<Home/>}/>}/>
                    <Route path={ROUTES.auth.loginPage} element={<Login/>}/>
                    <Route path={ROUTES.image.imageListPage} element={<ProtectedRoute element={<ImageList/>}/>}/>
                    <Route path="*" element={<NotFound/>}></Route>
                </Routes>
            </AuthProvider>
            {/* 遮罩层 */}
            <GlobalBackdrop/>
        </ThemeProvider>
    );
};

export default App;