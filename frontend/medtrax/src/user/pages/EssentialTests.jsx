import React, { useState } from 'react';

const EssentialTest = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const stages = [
        {
            image: "https://pregonline.com/wp-content/uploads/2025/04/male-fertility-factor-and-sperm-health.jpg", 
            label: "Hormonal & Reproductive Health (Teens to 40s)",
            tests: [
                "images/5.png"
            ]
        },
        {
            image: "https://www.pulsetoday.co.uk/wp-content/uploads/2023/05/cardiovascular-heart-examination.jpg", 
            label: "Cardiovascular & Metabolic Screening (30s onwards)",
            tests: [
                "images/6.png"
            ]
        },
        {
            image: "https://psu-gatsby-files-prod.s3.amazonaws.com/s3fs-public/styles/4_3_1500w/public/2025/06/prostate-cancer-screening_1200x900.jpg?h=6eb229a4&itok=WtXzCGBf", 
            label: "Prostate & Cancer Screening (40s and up)",
            tests: [
                "images/7.png"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e6749dc742345959cf608/rectangle-1145.png", 
            label: "Adolescence (Teens To Early 20s)",
            tests: [
                "images/1.png"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e676e0d4aca450388cef9/rectangle-1148.png", 
            label: "Reproductive Years (20s to 30s)",
            tests: [
                "images/2.png"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e678f452deb459c5b3cf8/rectangle-1150.png", 
            label: "30s to 40s",
            tests: [
                "images/3.png"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e6802452deb459c5b4957/rectangle-1154.png", 
            label: "Post 40s",
            tests: [
                "images/4.png"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e692b0d4aca450388facb/rectangle-1162.png", 
            label: "Baby Vaccination",
            tests: [
                "images/8.png"
            ]
        }
    ];
    
    const handleCardClick = (stage) => {
        setSelectedImage(stage.tests[0]); // Display the first image in the tests array
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="essential-container">
            <div className="essential-banner">
                <h1>Stay Ahead, Stay Healthy: Know Your Essential Tests & Check-ups by Life Stage!</h1>
                <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/icons%20of%20figma%20(1)%204%20(1).png" alt="Health tracker illustration" className="banner-image" />
            </div>
            <div className="life-stages-container">
                {stages.map((stage, index) => (
                    <div 
                        key={index} 
                        className="stage-card" 
                        onClick={() => handleCardClick(stage)}
                    >
                        <img src={stage.image} alt={stage.label} className="stage-image" />
                        <p className="stage-label">{stage.label}</p>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="essential-modal-overlay" onClick={closeModal}>
                    <div className="essential-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Test Details" className="modal-image" />
                        <button onClick={closeModal} className="close-button"> X</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EssentialTest;
