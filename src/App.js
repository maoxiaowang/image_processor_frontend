import React, {useEffect} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import ROUTES from "./config/route"
import {AuthProvider, useAuth} from "./context/useAuth";
import NotFound from "./pages/shared/NotFound";
import ImageList from "./pages/image/ImageList";


const App = () => {
    const theme = createTheme({
        spacing: 8,  // default
    });

    const ProtectedRoute = ({element}) => {
        const {isAuthenticated} = useAuth();

        const navigate = useNavigate();

        useEffect(() => {
            if (!isAuthenticated) {
                // Redirect to login page
                navigate(ROUTES.auth.loginPage, {replace: true});
            }
        }, [isAuthenticated, navigate]);

        // Render the protected route or redirect to login page based on isAuthenticated
        return isAuthenticated ? element : null; // Return null if not authenticated
    };

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
        </ThemeProvider>
    );
};

export default App;