import React from "react";
import {Container, Nav, Navbar, Button} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import SignUp from '../modals/SignUp';
import LogIn from '../modals/LogIn';
import { useAuth } from './AuthContext';



const NavBar = () => {

    const { 
        isLoggedIn, 
        username, 
        logOutUser, 
        toggleLogin, 
        toggleSignup,         
        modalLogin,
        modalSignup,
        loginError,
        logInUser,
        signUpUser 
    } = useAuth();
 
    return (
        <div className="container-navbar">
            <div className='navbar-element'>
                <Navbar expand="lg" className="mb-4">
                    <Container className='navbar-container'>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavLink className="nav-link-custom" to="/about-us"><b>ABOUT US</b></NavLink>
                                <NavLink className="nav-link-custom" to="not-found"><b>PRICING</b></NavLink>
                                <NavLink className="nav-link-custom" to="/contact-us"><b>CONTACT</b></NavLink>
                            </Nav>
                            <Nav>
                                {isLoggedIn ? (
                                    <>
                                        <Nav.Item className="mx-3">
                                            <Nav.Link disabled>Welcome, {username}!</Nav.Link>
                                        </Nav.Item>
                                        <Button onClick={logOutUser} variant="outline-danger">Log Out</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button  className="mx-3" variant="outline-dark" size="lg" onClick={toggleLogin}>Log In</Button>{' '}
                                        <Button variant="outline-success" size="lg" onClick={toggleSignup}>Sign Up</Button>{' '}
                                    </>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar> 
                <LogIn
                    toggleLogin={toggleLogin}
                    modalLogin={modalLogin}
                    login={logInUser}
                    loginError={loginError}
                />
                <SignUp
                    toggleSignup={toggleSignup}
                    modalSignup={modalSignup}
                    signup={signUpUser}
                />
            </div>
        </div>
    );
};

export default NavBar;


