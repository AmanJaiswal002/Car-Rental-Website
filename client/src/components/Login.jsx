import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowLogin, axios, setToken, setUser, setIsOwner, navigate, loginMode, setLoginMode} = useAppContext()

    // state can be "login", "register", or "admin"
    const [state, setState] = React.useState(loginMode || "login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    React.useEffect(() => {
        if (loginMode) {
            setState(loginMode);
        }
        setEmail("");
        setPassword("");
        setName("");
    }, [loginMode]);

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            const endpoint = state === "register" ? "/api/user/register" : "/api/user/login";
            const {data} = await axios.post(endpoint, {name, email, password})

            if (data.success) {
                if (state === "admin" && data.user?.role !== 'owner') {
                    toast.error("Access Denied! Account does not have Admin privileges.");
                    return;
                }

                setToken(data.token)
                localStorage.setItem('token', data.token)
                axios.defaults.headers.common['Authorization'] = `${data.token}`;
                if (data.user) {
                    setUser(data.user)
                    const isUserOwner = data.user.role === 'owner';
                    setIsOwner(isUserOwner)

                    if (state === "admin" || isUserOwner) {
                        toast.success("Welcome Admin! Redirecting to Dashboard...");
                        setShowLogin(false)
                        navigate('/owner')
                        return;
                    }
                }
                setShowLogin(false)
                toast.success(state === "login" ? "Logged in successfully!" : "Account created successfully!")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Login/Register error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.code === "ERR_NETWORK" || !error.response) {
                toast.error("Network Error! Server connect nahi ho pa raha hai.");
            } else {
                toast.error(error.message || "Something went wrong");
            }
        }
    }

  return (
    <div onClick={()=> { setShowLogin(false); if(setLoginMode) setLoginMode('login'); }} className='fixed top-0 bottom-0 left-0 right-0 z-100 
    flex items-center text-sm text-gray-600 bg-black/50'>

       <form onSubmit={onSubmitHandler} autoComplete="off" onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start 
       p-8 py-10 w-80 sm:w-[360px] text-gray-500 rounded-xl shadow-2xl border border-gray-200 bg-white relative">

            {/* Close Button */}
            <button type="button" onClick={() => { setShowLogin(false); if(setLoginMode) setLoginMode('login'); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold">
                ✕
            </button>

            {/* Dedicated Title based on mode */}
            <div className="w-full text-center pb-2 border-b border-gray-100">
                <p className="text-xl font-bold">
                    {state === "admin" ? (
                        <span className="text-red-600">Admin Portal Login</span>
                    ) : (
                        <span><span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}</span>
                    )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {state === "admin" ? "Enter Admin credentials to access Dashboard" : "Access your customer account & bookings"}
                </p>
            </div>

            {state === "register" && (
                <div className="w-full">
                    <p className="font-medium text-xs text-gray-600">Full Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="" autoComplete="off"
                    className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-primary text-sm" type="text" required />
                </div>
            )}
            <div className="w-full">
                <p className="font-medium text-xs text-gray-600">Email Address</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="" autoComplete="off" 
                className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-primary text-sm" type="email" required />
            </div>
            <div className="w-full">
                <p className="font-medium text-xs text-gray-600">Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="" autoComplete="new-password"
                className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-primary text-sm" type="password" required />
            </div>

            {/* Admin mode security notice */}
            {state === "admin" && (
                <div className="w-full bg-red-50 border border-red-100 rounded p-2 text-xs text-red-700 font-medium">
                    🔒 Authorized Admin Access Only.
                </div>
            )}

            {/* User mode toggle between Sign Up and Login */}
            {state !== "admin" && (
                state === "register" ? (
                    <p className="text-xs">
                        Already have account? <span onClick={() => setState("login")} 
                        className="text-primary cursor-pointer font-semibold underline">Login here</span>
                    </p>
                ) : (
                    <p className="text-xs">
                        Don't have an account? <span onClick={() => setState("register")} 
                        className="text-primary cursor-pointer font-semibold underline">Sign up here</span>
                    </p>
                )
            )}

            <button className={`w-full py-2.5 rounded-lg text-white font-medium shadow transition-all cursor-pointer ${state === "admin" ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-blue-700"}`}>
                {state === "admin" ? "Login as Admin" : (state === "register" ? "Create Account" : "User Login")}
            </button>
        </form>
    </div>
  )
}

export default Login