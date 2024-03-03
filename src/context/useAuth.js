import React from 'react';
import API from "../config/api";
import useAxios, {defaultAxios} from "../services/useAxios";

const AuthContext = React.createContext(null);

export const AuthProvider = React.memo(({children}) => {
    console.log('RUN AuthProvider')
    const [isAuthenticated, setIsAuthenticated] = React.useState(true);
    const [username, setUsername] = React.useState('');
    const [userId, setUserId] = React.useState(null);
    const [token, setToken] = React.useState(null);


    const {axiosInstance} = useAxios();

    // Get user server state
    React.useEffect(() => {
        const fetchAuthData = async () => {
            try {
                const response = await defaultAxios.get(API.auth.whoami);
                const user = response.data;
                setIsAuthenticated(!!user.id);
                setUsername(user.username);
                setUserId(user.id);
            } catch (error) {
                setIsAuthenticated(false);
                setUsername('');
                setUserId(null);
            }
        };

        fetchAuthData();  // Call the fetchData function
    }, []);  // Empty dependency array ensures it only runs on mount

    // Function to handle login and store tokens in cookies
    const login = (username, password) => {
        return axiosInstance.post(
            API.auth.obtainToken, {
                username: username,
                password: password,
            })
            .then(
                response => {
                    console.log('response', response)
                    console.debug('login successfully')
                    setIsAuthenticated(true);
                    const data = response.data;
                    setUsername(data.user.username); // Set username if available
                    setUserId(data.user.id); // Set userId if available
                    setToken(data.access);
                }
            )
            .catch(error => {
                console.error('Login failed:', error);
                return Promise.reject(error);
            });
    };

    // Function to handle logout and clear cookies
    const logout = () => {
        return axiosInstance.delete(API.auth.destroyToken).then(response => {
            console.debug('logout successfully')
            setIsAuthenticated(false)
            setUsername('')
            setUserId(null)
            setToken(null)
        })
    };

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        username,
        setUsername,
        userId,
        setUserId,
        token,
        setToken,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
});

export const useAuth = () => {
    return React.useContext(AuthContext);
};
