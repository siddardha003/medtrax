import React, { useState } from 'react';

const EssentialTest = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const stages = [
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e6749dc742345959cf608/rectangle-1145.png", 
            label: "Adolescence (Teens To Early 20s)",
            tests: [
                "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6620afcc347bb190414e5601/adolescence-teens-to-early-20s-.png"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e676e0d4aca450388cef9/rectangle-1148.png", 
            label: "Reproductive Years (20s to 30s)",
            tests: [
                "https://via.placeholder.com/800x600?text=Reproductive+Tests"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e678f452deb459c5b3cf8/rectangle-1150.png", 
            label: "30s to 40s",
            tests: [
                "https://via.placeholder.com/800x600?text=30s+to+40s+Tests"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e6802452deb459c5b4957/rectangle-1154.png", 
            label: "Post 40s",
            tests: [
                "https://via.placeholder.com/800x600?text=Post+40s+Tests"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e6834dc742345959d0ccb/rectangle-1155.png", 
            label: "First Trimester",
            tests: [
                "https://via.placeholder.com/800x600?text=First+Trimester+Tests"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e686cdc742345959d137f/rectangle-1156.png", 
            label: "Second Trimester",
            tests: [
                "https://via.placeholder.com/800x600?text=Second+Trimester+Tests"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e689bbc539044fc0f0da9/rectangle-1160.png", 
            label: "Third Trimester",
            tests: [
                "https://via.placeholder.com/800x600?text=Third+Trimester+Tests"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e68bddc742345959d1bcf/rectangle-1161.png", 
            label: "Fourth Trimester",
            tests: [
                "https://via.placeholder.com/800x600?text=Fourth+Trimester+Tests"
            ]
        },
        { 
            image: "https://www.newmi.in/s/6123687a0e3882eabaee1e6e/661e692b0d4aca450388facb/rectangle-1162.png", 
            label: "Baby Vaccination",
            tests: [
                "https://via.placeholder.com/800x600?text=Baby+Vaccination+Tests"
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
