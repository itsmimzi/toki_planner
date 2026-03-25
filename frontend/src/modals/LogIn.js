import React, { useState } from "react";
import {Form, Button, Modal, Alert} from 'react-bootstrap';
import { useAuth } from '../components/AuthContext'; 

const LogIn = () => {
    const {
        modalLogin,
        toggleLogin,
        loginError,
        logInUser,
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email"){
            setEmail(value);
        } else if (name === "password"){
            setPassword(value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const success = await logInUser({email, password});
        if(success){
            closeModal();      
        }
    };

    const closeModal = () => {
        toggleLogin(); 
        setEmail(''); 
        setPassword(''); 
    };

  return (
    <Modal show={modalLogin} onHide={closeModal} centered>
        <Modal.Header closeButton>
            <Modal.Title>Log in to your account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {loginError && <Alert variant="danger">{loginError}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Enter your email</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email"
                            value={email}
                            autoComplete="off"
                            onChange={handleChange}
                            required/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Enter your password</Form.Label>
                        <Form.Control 
                            type="password"
                            name="password"
                            value ={password}
                            onChange={handleChange}
                            required/>
                </Form.Group> 
                    <div className="submit-btn">
                        <Button className="mt-3" variant="success" size="lg" type="submit" centered>Continue</Button>
                    </div>          
            </Form>
        </Modal.Body>
    </Modal>
  );
};

export default LogIn;
