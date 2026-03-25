import React, {createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [alert, setAlert] = useState({ show: false, message: '', type: ''});
    const [tasks, setTasks] = useState([]);
    const [loginError, setLoginError] = useState("");
    const [modalLogin, setModalLogin] = useState(false);
    const [modalSignup, setModalSignup] = useState(false);

    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn);
        localStorage.setItem("username", username);
        if (isLoggedIn) {
            fetchTasks();
            navigate('/homepage');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-use-before-define
    },[isLoggedIn, username, navigate, fetchTasks]);

    const getCsrfToken = () => {
        return Cookies.get('csrftoken');
    };

    const logInUser = async ({ email, password }) => {
        const csrfToken = getCsrfToken();
        try {
            const response = await axios.post(`${API_BASE}/api/login/`, { username: email, password }, {
                headers: {'X-CSRFToken': csrfToken, 'Content-Type': 'application/json'} 
            });
            if (response.status === 200) {
                setIsLoggedIn(true);
                setUsername(response.data.username);
                setModalLogin(false);
                setLoginError('');
                navigate('/homepage');
            }
            else {
                throw new Error(response.statusText || "Login failed due to server error");
            }
        } catch (error) {
            const errMsg = error.response && error.response.data.ERROR
                ? error.response.data.ERROR 
                : (error.response
                    ? (error.response.data.__all__
                        ? error.response.data.__all__[0]
                        : JSON.stringify(error.response.data))
                : "No response from server");
            console.error('Login error:', errMsg);
            setLoginError(errMsg);
            setIsLoggedIn(false);
        }
    };

    const signUpUser = async ({ username, email, password1, password2 }) => {
        const csrfToken = getCsrfToken();
        const userData = {
            username,
            email,
            password1: password1,
            password2: password2
        };
        try {
            const response = await axios.post(`${API_BASE}/api/signup/`, JSON.stringify(userData), {
                headers: {'X-CSRFToken': csrfToken, 'Content-Type': 'application/json'} 
            });
            if (response.status===201) {
                setIsLoggedIn(true);
                setUsername(userData.username);
                setModalSignup(false);
                setLoginError('');
                return true;
            } else {
                throw new Error('Failed to sign up.');
            }
        } catch (error) {
            let errMsg = "An error occurred during signup.";
            if (error.response && error.response.data) {
                errMsg = Object.values(error.response.data).map((msgs) => msgs.join(" ")).join(" ");
            }
            console.error("Signup error:", errMsg);
            setLoginError(errMsg);
            setIsLoggedIn(false);
            return false;
        }
    };

    const logOutUser = () => {
        setIsLoggedIn(false);
        setUsername("");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        navigate('/home'); 
    };

    const sendContact = async ({ email, message }) => {
        const csrfToken = getCsrfToken();
        try {
            const response = await axios.post(`${API_BASE}/api/contact/`, JSON.stringify({ email, message }), {
                headers: { 'X-CSRFToken': csrfToken, 'Content-Type':'application/json' },
            });
            if (response.status===200) {
                setAlert({ show: true, message: 'Message sent successfully!', type: 'success' });
                console.log('Submitting form', { email, message });
                return true;
            } else { 
                throw new Error('Failed to send message');
            }
        } catch (error) {
            setAlert({ show: true, message: error.message, type: 'danger'});
            return false;
        }
    };

    const toggleLogin = () => {
        setModalLogin(!modalLogin);
        setLoginError("");
    };

    const toggleSignup = () => {
        setModalSignup(!modalSignup);
        setLoginError("");
    };

    const createTask = async (taskData) => {
        const csrfToken = getCsrfToken();
        try { 
            const response = await axios.post(`${API_BASE}/api/tasks/create/`, JSON.stringify(taskData), {
                headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' }
            });
            if (response.status === 201) {
                setTasks(prevTasks => [...prevTasks, {...taskData, id: response.data.task_id}]);
                setAlert({ show: true, message: 'Task created successfully!', type: 'success' });
                return true;
            } else {
                throw new Error('Task creation failed.');
            }
        } catch (error) {
            setAlert({ show: true, message: error.message, type: 'danger' });
            return false;
        }
    };

    const updateTask = async (taskData) => {
        console.log("update task with this new data => :", taskData)

        const csrfToken = getCsrfToken();
        try {
            console.log(taskData)
            const response = await axios.patch(`${API_BASE}/api/tasks/${taskData.task_id}/update/`, JSON.stringify(taskData), {
                headers: { 'X-CSRFToken': csrfToken,'Content-Type': 'application/json' }
        });
        if (response.status === 200) {
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === taskData.task_id ? { ...task, ...taskData } : task)),
            );
            setAlert({ show: true, message: 'Task updated successfully!', type: 'success' });
            return true;
        } else {
            throw new Error('Task update failed.');
        }
        } catch (error) {
            setAlert({ show: true, message: error.message, type: 'danger' });
            return false;
        }
    };

    const deleteTask = async (task_id) => {
        console.log("Attempting to delete task with ID:", task_id);
        const csrfToken = Cookies.get('csrftoken');
        try {
            const response = await axios.delete(`${API_BASE}/api/tasks/${task_id}/delete/`, {
                headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json'}
            });
            if (response.status === 204){
                setTasks(currentTasks => {
                    const updatedTasks = currentTasks.filter(task => task.id !== task_id); 
                    console.log("Updated tasks post-deletion:", updatedTasks);        
                    return updatedTasks;
                });       
                setAlert({ show: true, message: 'Task deleted successfully!', type: 'success' });       
            } else {
                throw new Error('Task deletion failed.');
            }
        } catch (error) {
            console.error("Deletion error:", error);
            setAlert({ show: true, message: error.message, type: 'danger' });    
        }
    };

    const fetchTasks = useCallback( async () => {
        const csrfToken = getCsrfToken();
        try {
            const response = await axios.get(`${API_BASE}/api/tasks/`, {
                headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' }
            });
            if (response.status === 200 && response.data){
                const fetchedTasks = response.data.map(task => ({
                    ...task,
                    id : task.task_id,
                    isComplete: task.isComplete,  
                }));
                setTasks(fetchedTasks);
            } else {
                throw new Error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error.message);
            setAlert({ show: true, message: error.message, type: 'danger' });
        }
    },[]);

    const updateTaskList = (updatedTasks) => {
        setTasks(updatedTasks);
    };    

    const predictTask = async (taskData) => {
        try {
            const csrfToken = getCsrfToken();
            const response = await axios.post(`${API_BASE}/api/predict/`, JSON.stringify(taskData), {
                headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                console.log("Prediction response:", response.data);
                return response.data;  // Returns prediction data from the server
            } else {
                throw new Error('Prediction failed.');
            }
        } catch (error) {
            console.error("Error in prediction:", error);
            setAlert({ show: true, message: error.message || "Failed to predict task details", type: 'danger' });
            return null;
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                isLoggedIn, 
                username, 
                tasks,
                alert,
                loginError, 
                modalLogin, 
                modalSignup,
                setTasks,
                logInUser, 
                signUpUser, 
                logOutUser,
                sendContact,
                toggleLogin, 
                toggleSignup,
                setAlert,
                createTask,
                updateTask,
                deleteTask,
                fetchTasks,
                updateTaskList,
                predictTask
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);



