import React from "react";


const AboutUs = () => {
    return (
        <>
            <div className="body-wrapper">
                <div className="about-us-header">
                        <div className="about-us-title">Welcome to Toki </div>
                        <div className="about-us-subtitle"> Your smart task companion that not only organizes your day but predicts your future! 🚀</div>
                </div>
                <div className="about-us-body">
                        <p className="intro-left-text">
                            Struggling to gauge how long a task will take? Drowning in a sea of to-dos without knowing what to tackle first? Say hello to Toki, 
                            the AI-driven task manager that not only schedules and tracks your tasks but also learns from you to predict task durations and set 
                            priorities with mind-blowing accuracy.
                            <br />
                            <br />
                            🎯 <b>Intuitive Prioritization:</b> Gone are the days of random guesswork. Toki's multi-output MLP (that's a snazzy multi-layer perceptron for the tech-savvy) crunches numbers, analyses patterns, 
                            and pops out which task deserves your immediate attention.
                            <br />
                            <br />
                            <b>⏱ Smart Duration Estimation:</b> Toki studies your pace and performance to predict how long you’ll really need for that spreadsheet or the new blog post. 
                            Wave goodbye to overrunning tasks!
                            <br />
                            <br />
                            <b>🔄 Automated Scheduling:</b> With just a few clicks, watch Toki magically slot tasks into your calendar, filling in gaps and rescheduling like a pro. Never miss a beat, meet every deadline, 
                            and still have time for coffee!
                            <br />
                            <br />
                            <b>🛠 Track Progress with Ease:</b> As you check tasks off, Toki keeps score, offering you a visual progress bar that leaves no room for uncertainty. 100% means it's done and dusted, archived for your records.
                            Join us now and start making every moment count!
                            <br />
                            <br />
                            Embrace the future of task management with Toki, where each tick of the clock moves you closer to perfect productivity. Let Toki tame your task list today, and reclaim your time tomorrow!
                        </p>                                            
                </div>
                <div className="about-us-footer">
                    <div className="about-us-footer-text">
                        <p><b>Follow the whole project on</b></p>
                    </div>
                    <div className="follow-button-container">
                        <a 
                        href="https://itsmimzi.github.io/toki_planner" 
                        className="follow-button">
                            /itsmimzi/toki.git
                        </a>                
                    </div>
                </div>
            </div>
           
        </>
    );
};

export default AboutUs;