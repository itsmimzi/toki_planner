import React, { useState } from "react";
import {Form, Button, Modal, Alert} from 'react-bootstrap';
import { useAuth } from '../components/AuthContext'; 


const SignUp = () => {

    const {
        modalSignup,
        toggleSignup,
        signUpUser,
        loginError,
    } = useAuth();

    const [formData, setFormData] = useState({
        username : '',
        email: '',
        password1: '',
        password2: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        const { username, email, password1, password2 } = formData;

        if (!username.trim()) newErrors.username = 'Username is required';
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) newErrors.email = 'Enter a valid email address';
        if (!/[A-Z]/.test(password1)) newErrors.password1 = 'Password must include an uppercase letter';
        if (!/[a-z]/.test(password1)) newErrors.password1 = 'Password must include a lowercase letter';
        if (!/\d/.test(password1)) newErrors.password1 = 'Password must include a number';
        if (!/[.@$!%*#?]/.test(password1)) newErrors.password1 = 'Password must include a special character .@$!%*#?';
        if (!(password1.length >= 8 && password1.length <= 100)) newErrors.password1 = 'Password must be between 8 and 100 characters';
        if (password1 !== password2) newErrors.password2 = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetFormState = () => {
        setFormData({
            username: '',
            email: '',
            password1: '',
            password2: ''
        });
        setErrors({});
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        const success = await signUpUser(formData);
        if (validateForm()) {
            if(success){
                closeModal();
            }
        } else {
            alert('Please correct errors in form.');
        }
    };

    const closeModal = () => {
        toggleSignup(); 
        resetFormState();
    };


    return (
        <Modal show={modalSignup} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign up with Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loginError && <Alert variant="danger">{loginError}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Choose a username</Form.Label>
                        <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Your email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>                        
                    <Form.Group className="mb-3">
                        <Form.Label>Choose a password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password1"
                                value={formData.password1}
                                onChange={handleChange}
                                required
                                isInvalid={!!errors.password1}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password1}
                            </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                            isInvalid={!!errors.password2}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password2}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <small className="password-check" style={{"marginTop" : "5px"}}> Your password must:
                        <ul style={{"margin": "0.1rem 0 0.5rem 1.75rem"}}>
                            <li>Include an UPPER and lowercase letter</li>
                            <li>Include a number</li>
                            <li>Include one or more of these special characters: .@$!%*#?</li>
                            <li>Be between 8 and 100 characters</li>
                        </ul>
                    </small>
                    <div className="d-flex justify-content-center">
                        <Button className="mt-3" variant="success" size="lg" type="submit" centered>Submit</Button>{' '}
                    </div>
                    <p className="mt-5">
                        By signing up, you agree to Toki's
                        <a href="#terms-of-service">Terms of Service</a> ,
                        <a href="#code-conduct">Code of Conduct</a>, and
                        <a href="#privacy-policy"> Privacy Policy</a>.
                    </p>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SignUp;
