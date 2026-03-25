import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// Context
import { AuthProvider} from './components/AuthContext';

// Components
import PrivateRoute from './components/PrivateRoute';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';



function App() {
  return (
      <Router> 
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <div className="App">
                <Header/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/homepage" element={<PrivateRoute><HomePage/></PrivateRoute>} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="not-found" element={<NotFound />} />
                    <Route path="/contact-us" element={<Contact />} />
                    {/* <Route path="/homepage" element={<HomePage/>} /> */}
                </Routes>
                <Footer/>
            </div>
          </AuthProvider>
        </LocalizationProvider>
      </Router>
  );
} 

export default App;

