import React from 'react';

const Footer = () => {
    return (
        <div className="footer-wrapper">
            <div className="footer_container">
                <footer className="text-light text-center p-5">
                    <h4>© {new Date().getFullYear()} Toki - All Rights Reserved</h4>
            </footer>
        </div>
    </div>
    );
};

export default Footer;