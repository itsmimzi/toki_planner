import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Token auth: send Authorization header, no cookies needed
axios.defaults.withCredentials = false;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // Token persisted in localStorage — source of truth for auth state
    const [token,      setToken]      = useState(localStorage.getItem('authToken') || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
    const [username,   setUsername]   = useState(localStorage.getItem('username') || '');
    const [alert,      setAlert]      = useState({ show: false, message: '', type: '' });
    const [tasks,      setTasks]      = useState([]);
    const [loginError, setLoginError] = useState('');
    const [modalLogin, setModalLogin] = useState(false);
    const [modalSignup,setModalSignup]= useState(false);

    // Build auth header from current token
    const authHeader = useCallback((tok) => ({
        'Authorization': `Token ${tok || token}`,
        'Content-Type': 'application/json',
    }), [token]);

    // ── Auth ──────────────────────────────────────────────────────────────

    const logInUser = async ({ email, password }) => {
        try {
            const res = await axios.post(`${API_BASE}/api/login/`, { username: email, password });
            if (res.status === 200) {
                const { token: newToken, username: newUsername } = res.data;
                localStorage.setItem('authToken', newToken);
                localStorage.setItem('username',  newUsername);
                setToken(newToken);
                setIsLoggedIn(true);
                setUsername(newUsername);
                setModalLogin(false);
                setLoginError('');
                sessionStorage.setItem('justLoggedIn', 'true');
                await new Promise(r => setTimeout(r, 700));
                navigate('/homepage');
            }
        } catch (error) {
            const errMsg = error.response?.data?.ERROR
                || error.response?.data?.__all__?.[0]
                || (error.response?.data ? JSON.stringify(error.response.data) : 'No response from server');
            setLoginError(errMsg);
            setIsLoggedIn(false);
        }
    };

    const signUpUser = async ({ username: uname, email, password1, password2 }) => {
        try {
            const res = await axios.post(`${API_BASE}/api/signup/`, { username: uname, email, password1, password2 });
            if (res.status === 201) {
                const { token: newToken, username: newUsername } = res.data;
                localStorage.setItem('authToken', newToken);
                localStorage.setItem('username',  newUsername);
                setToken(newToken);
                setIsLoggedIn(true);
                setUsername(newUsername);
                setModalSignup(false);
                setLoginError('');
                sessionStorage.setItem('justLoggedIn', 'true');
                await new Promise(r => setTimeout(r, 700));
                navigate('/homepage');
                return true;
            }
        } catch (error) {
            const errMsg = error.response?.data
                ? Object.values(error.response.data).flat().join(' ')
                : 'An error occurred during signup.';
            setLoginError(errMsg);
            setIsLoggedIn(false);
            return false;
        }
    };

    const logOutUser = async () => {
        try {
            if (token) {
                await axios.post(`${API_BASE}/api/logout/`, {}, { headers: authHeader() });
            }
        } catch (_) { /* best-effort */ }
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setToken(null);
        setIsLoggedIn(false);
        setUsername('');
        setTasks([]);
        navigate('/home');
    };

    // ── Tasks ─────────────────────────────────────────────────────────────

    const fetchTasks = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_BASE}/api/tasks/`, { headers: authHeader(token) });
            if (res.status === 200 && res.data) {
                setTasks(res.data.map(t => ({ ...t, id: t.task_id })));
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error.message);
        }
    }, [token, authHeader]);

    const createTask = async (taskData) => {
        try {
            const res = await axios.post(`${API_BASE}/api/tasks/create/`, taskData, { headers: authHeader() });
            if (res.status === 201) {
                // Optimistic: add immediately with real task_id from server
                setTasks(prev => [...prev, { ...res.data, id: res.data.task_id }]);
                return true;
            }
        } catch (error) {
            setAlert({ show: true, message: error.message, type: 'danger' });
            return false;
        }
    };

    const updateTask = async (taskData) => {
        try {
            const res = await axios.patch(
                `${API_BASE}/api/tasks/${taskData.task_id}/update/`,
                taskData,
                { headers: authHeader() }
            );
            if (res.status === 200) {
                setTasks(prev => prev.map(t => t.id === taskData.task_id ? { ...t, ...res.data, id: res.data.task_id } : t));
                return true;
            }
        } catch (error) {
            setAlert({ show: true, message: error.message, type: 'danger' });
            return false;
        }
    };

    const deleteTask = async (task_id) => {
        try {
            await axios.delete(`${API_BASE}/api/tasks/${task_id}/delete/`, { headers: authHeader() });
            setTasks(prev => prev.filter(t => t.id !== task_id));
        } catch (error) {
            setAlert({ show: true, message: error.message, type: 'danger' });
        }
    };

    const predictTask = async (taskData) => {
        try {
            const res = await axios.post(`${API_BASE}/api/predict/`, taskData, { headers: authHeader() });
            if (res.status === 200) return res.data;
        } catch (error) {
            setAlert({ show: true, message: error.message || 'Prediction failed', type: 'danger' });
            return null;
        }
    };

    const sendContact = async ({ email, message }) => {
        try {
            const res = await axios.post(`${API_BASE}/api/contact/`, { email, message });
            if (res.status === 200) {
                setAlert({ show: true, message: 'Message sent successfully!', type: 'success' });
                return true;
            }
        } catch (error) {
            setAlert({ show: true, message: error.message, type: 'danger' });
            return false;
        }
    };

    // ── Modal toggles ─────────────────────────────────────────────────────

    const toggleLogin  = () => { setModalLogin(v => !v);  setLoginError(''); };
    const toggleSignup = () => { setModalSignup(v => !v); setLoginError(''); };

    // ── Bootstrap: fetch tasks when token is present ──────────────────────

    useEffect(() => {
        if (isLoggedIn && token) {
            fetchTasks();
        }
    }, [isLoggedIn, token]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateTaskList = (updatedTasks) => setTasks(updatedTasks);

    return (
        <AuthContext.Provider value={{
            isLoggedIn, username, tasks, alert, loginError,
            modalLogin, modalSignup,
            setTasks, setAlert,
            logInUser, signUpUser, logOutUser,
            sendContact,
            toggleLogin, toggleSignup,
            createTask, updateTask, deleteTask,
            fetchTasks, updateTaskList, predictTask,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
