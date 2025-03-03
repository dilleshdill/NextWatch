import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react'; // For icons (optional)
import Loader from './Loader';
const Login = () => {
    const [username, setUsername] = useState('rahul');
    const [password, setPassword] = useState('rahul@2021');
    const [notFound, setNotFound] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const onSubmitSuccess = (jwtToken) => {
        Cookies.set('jwt_token', jwtToken, { expires: 30 });
        navigate('/');
    };

    const toLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const userDetails = { username, password };
        const url = 'https://apis.ccbp.in/login';

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(userDetails),
            });
            const data = await response.json();

            if (response.ok) {
                onSubmitSuccess(data.jwt_token);
            } else {
                setNotFound(data.error_msg || 'Invalid username or password');
            }
        } catch (error) {
            setNotFound('Something went wrong. Please try again later.');
            console.log('Error during login:', error);
        }
    };
    if (isLoading) return <Loader />;
    return (
        <div className={`flex h-screen w-screen justify-center items-center transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-100 text-black'}`}>
            <div className={`w-5/6 sm:max-w-[350px] px-[25px] py-[25px] rounded-xl flex flex-col transition-all duration-300 ${isDarkMode ? 'bg-[#272727] text-white' : 'bg-white text-black shadow-lg'}`}>
                {/* Theme Toggle Button */}
                <div onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-md transition-all">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </div>

                {/* Logo */}
                <img
                    src={isDarkMode ? "https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png" : "https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"}
                    alt="logo"
                    className="w-[100px] m-auto sm:w-[130px]"
                />

                {/* Login Form */}
                <form className="flex flex-col gap-2 pb-2 mt-10" onSubmit={toLogin}>
                    <label className="w-full text-xs">USERNAME</label>
                    <input
                        type="text"
                        placeholder="Username"
                        className={`w-full border p-1 px-2 rounded outline-none ${isDarkMode ? 'bg-[#333] border-gray-500 text-white' : 'bg-gray-100 border-gray-300 text-black'}`}
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    <label className="w-full text-xs mt-2">PASSWORD</label>
                    <input
                        type="password"
                        placeholder="Password"
                        className={`w-full border p-1 px-2 rounded outline-none ${isDarkMode ? 'bg-[#333] border-gray-500 text-white' : 'bg-gray-100 border-gray-300 text-black'}`}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    <button type="submit" className="mt-5 outline-none p-2 rounded text-white font-bold"
                        style={{ background: "#6163EE" }}>
                        Login
                    </button>
                    {notFound && <p className="text-red-500">{notFound}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
