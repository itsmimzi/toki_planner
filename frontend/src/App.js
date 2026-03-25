import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import LogIn from './modals/LogIn';
import SignUp from './modals/SignUp';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Pricing from './pages/Pricing';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-white font-sans">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/"           element={<Home />} />
                <Route path="/home"       element={<Home />} />
                <Route path="/homepage"   element={<PrivateRoute><HomePage /></PrivateRoute>} />
                <Route path="/about-us"   element={<AboutUs />} />
                <Route path="/pricing"    element={<Pricing />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="*"           element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            {/* Modals at root level — prevents remount on NavBar re-renders */}
            <LogIn />
            <SignUp />
          </div>
        </AuthProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
