import React from "react";
import logoLanding from "../logo/logoFeaturesHeader.png";
import logoSeparator from "../logo/logoSeparator.png";
import iconLeft from "../logo/icons/left.png"
import iconCenter from "../logo/icons/center.png"
import iconRight from "../logo/icons/right.png"



const Home = () => {
    return (
        <>
            <div className="body-wrapper">
                <div className="body-intro">
                    <div className="intro-right">
                        <img className="intro-right-logo" src={logoLanding} alt="LogoLanding"/>
                    </div>
                    <div className="intro-left">
                        <h1 className="intro-left-title">Planning Made Easy.</h1>
                        <p className="intro-left-text">
                            In the ever-evolving world where time is the most precious
                            commodity, Toki emerges as your ultimate ally in mastering
                            productivity and reclaiming control of your day.
                            <br /><br />
                            Toki isn’t just a task manager. It’s your personal assistant,
                            designed to seemingly organize your tasks, priorities, and
                            deadlines with ease and precision.
                            <br /><br />
                            Ready to take the first step towards unparalleled planning?
                            <br />
                            Join us now and start making every moment count!
                        </p>
                        <a href="/not-found" className="try-button">Try Toki for Free</a>                        
                    </div>
                </div>
                <div className="home-separator">
                    <img className="logo-separator" src={logoSeparator} alt="logoSeparator" />
                    <div className="text-separator">
                        <p style={{"margin" : "auto"}}><b>And effortlessly manage your time.</b></p>
                    </div>
                </div>
                <div className="features-board" id="container">
                    <div className="feature-automate" id="left"> 
                        <img className="feature-icon" src={iconLeft} alt="iconLeft"/>
                        <h3 className="feature-title"><b>automate</b></h3>
                        <span className="feature-description">Free your mind from repetitive tasks—let automation handle the details and save precious time!</span>
                    </div>
                    <div className="feature-track" id="center"> 
                        <img className="feature-icon" src={iconCenter} alt="iconCenter"/>
                        <h3 className="feature-title"><b>track</b></h3>
                        <span className="feature-description">Stay in the know with real-time tracking that keeps you updated on progress every step of the way.</span>                    
                    </div>
                    <div className="feature-organize" id="right"> 
                        <img className="feature-icon" src={iconRight} alt="iconRight"/>
                        <h3 className="feature-title"><b>organize</b></h3>
                        <span className="feature-description">Bring order to chaos with intuitive organization tools that make managing your tasks a breeze.</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
