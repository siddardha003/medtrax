import React from 'react';
import SectionHeading from '../components/SectionHeading';
import Funfact from '../components/Funfact';

const AboutPage = () => {
    return (
        <div style={{ marginTop: '40px' }}>
            <div className="st-height-b120 st-height-lg-b50" />
            <SectionHeading 
                title="Why Medtrax !" 
                subTitle="Medtrax integrates various hospitals into single platform.  We provide <br/> online/offline interactions with doctor, AI assisted prescription prediction for Seasonal/Regular <br/> Health issues. Helps you track weight,sleep cycle etc.. through health tracker. You can provide your medication schedules <br/>and we send timely reminders to your mobile phones for better health management." 
            />
            <Funfact />
        </div>
    );
};

export default AboutPage;
