import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// Attach request interceptor to automatically set Authorization header
axios.interceptors.request.use(
    (config) => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            config.headers.Authorization = savedToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const AppContext = createContext();

export const AppProvider = ({ children })=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [loginMode, setLoginMode] = useState("login"); // "login", "register", "admin"
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [returnLocation, setReturnLocation] = useState('Same as Pick-up Location');

    const [cars, setCars] = useState([]);

    // Function to check if user is logged in
    const fetchUser = async ()=>{
        const currentToken = token || localStorage.getItem('token');
        if(!currentToken) {
            setLoadingUser(false);
            return;
        }
        try {
            axios.defaults.headers.common['Authorization'] = `${currentToken}`;
            const {data} = await axios.get('/api/user/data', {
                headers: { Authorization: currentToken }
            });
            if (data.success && data.user) {
             setUser(data.user)
             setIsOwner(data.user.role === 'owner');
            }
        } catch (error) {
            console.error("User fetch error:", error.message);
        } finally {
            setLoadingUser(false);
        }
    }

    // Function to open Admin Login modal
    const openAdminLogin = () => {
        setLoginMode("admin");
        setShowLogin(true);
    };

    const changeRole = openAdminLogin;

    // function to fetch all cars from the server
    const fetchCars = async () =>{
        try {
            const {data} = await axios.get('/api/user/cars');
            data.success ? setCars(data.cars) : console.error(data.message)
        } catch (error) {
            console.error("Cars fetch error:", error.message);
        }
    }

    // Function to log out user
    const logout = ()=>{
        localStorage.removeItem('token');
        setToken(null)
        setUser(null)
        setIsOwner(false)
        setLoadingUser(false)
        axios.defaults.headers.common['Authorization'] = '';
        toast.success('You have been logged out');
    }


    // useEffect to retrive cars on mount
    useEffect(()=>{
        fetchCars();
    },[])

    // useEffect to fetch user data when token is Available
    useEffect(()=>{
        const currentToken = token || localStorage.getItem('token');
        if(currentToken){
            axios.defaults.headers.common['Authorization'] = `${currentToken}`;
            fetchUser();
        } else {
            setLoadingUser(false);
        }
    },[token])

    const value = {
        navigate, currency, axios, setUser, token, setToken, isOwner, setIsOwner, loadingUser,
        fetchUser, changeRole, openAdminLogin, showLogin, setShowLogin, loginMode, setLoginMode, logout, fetchCars, cars, setCars, pickupDate,
        setPickupDate, returnDate, setReturnDate, pickupLocation, setPickupLocation, destination, setDestination,
        returnLocation, setReturnLocation
    }

    return (
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext);
}