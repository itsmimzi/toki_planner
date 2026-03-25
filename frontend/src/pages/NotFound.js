import React from 'react';
import logo_404 from '../logo/logo404.png';

const NotFound = () => {
    return (
        <div>
            <div className="body-wrapper">
                <div className="not-found-title">
                    <b>this is under construction..</b> 
                </div>
                <div>
                    <img className="logo-separator" src={logo_404} alt="logo404" />
                </div>
                <div className="notFound-body">
                        <a 
                        href="/home" 
                        className="follow-button">
                            GO BACK
                        </a>              
                </div>
            </div>
        </div>
    );
};
export default NotFound;