import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../components/AuthContext'; 


const Contact = () => {

    const { sendContact } = useAuth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: ''});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email"){
            setEmail(value);
        } else if (name === "message"){
            setMessage(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await sendContact({ email, message });
        if (success) {
            setAlert({ show: true, message: 'Message sent successfully!', type: 'success'});
            clearForm();
        }
    };

    const clearForm = () => {
        setEmail(''); 
        setMessage(''); 
        setAlert({ show: false, message: '', type: '' });
    };

    return (
        <div>
            <div className="body-wrapper">
                <div className='contact-form'>
                    <div className="contact-us-title">
                        <b >Contact Us</b> 
                    </div>
                    <div className='contact-us-body'>
                        {alert.show && <Alert variant={alert.type}>{alert.message}</Alert>}
                        <Form onSubmit={handleSubmit} >
                            <Form.Group controlId='formBasicEmail'>
                                <Form.Label className='label-about-us'><b>YOUR EMAIL</b></Form.Label>
                                <Form.Control 
                                    type='email' 
                                    name='email'
                                    placeholder='Enter email' 
                                    value ={email}             
                                    onChange={handleChange} 
                                    required />
                            </Form.Group>
                            <small className="email-help">We'll never share your email with anyone else.</small>
                            <Form.Group  controlId='formBasicMessage'>
                                <Form.Label className='label-about-us'><b>YOUR MESSAGE</b></Form.Label>
                                <Form.Control 
                                    as='textarea' 
                                    name='message'
                                    rows={10}
                                    placeholder='Your message...' 
                                    value={message} 
                                    onChange={handleChange} 
                                    required />
                            </Form.Group>   
                            <div className="contact-us-footer">
                                <div className="contact-us-footer-left">
                                    <Button variant="secondary" size="lg" type='submit'>Submit</Button>             
                                </div>
                            </div>                     
                        </Form>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default Contact;