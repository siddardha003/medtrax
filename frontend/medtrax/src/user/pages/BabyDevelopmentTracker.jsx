import React, { useState, useRef } from 'react';
import '../css/Baby.css';

const weekData = [
    { 
        week: 4, 
        fruit: 'Poppy Seed', 
        details: 'Your baby is as small as a poppy seed.', 
        structure: 'Height: 0.1 cm & Weight: 0.004 g',
        symptoms: 'Nausea, fatigue, and mood swings', 
        tips: 'Stay hydrated and eat small, frequent meals.'
    },
    { 
        week: 5, 
        fruit: 'Sesame Seed', 
        details: 'Your baby is as small as a sesame seed.', 
        structure: 'Height: 0.2 cm & Weight: 0.03 g',
        symptoms: 'Morning sickness, tiredness', 
        tips: 'Get enough rest and start prenatal vitamins.'
    },
    { 
        week: 6, 
        fruit: 'Lentil', 
        details: 'Your baby is now the size of a lentil.', 
        structure: 'Height: 0.4 cm & Weight: 0.1 g',
        symptoms: 'Increased fatigue, morning sickness', 
        tips: 'Eat small, nutritious meals frequently.'
    },
    { 
        week: 7, 
        fruit: 'Blueberry', 
        details: 'Your baby is the size of a blueberry.', 
        structure: 'Height: 1.0 cm & Weight: 0.8 g',
        symptoms: 'Bloating, nausea, tiredness', 
        tips: 'Consider prenatal yoga or relaxation techniques.'
    },
    { 
        week: 8, 
        fruit: 'Kidney Bean', 
        details: 'Your baby is as big as a kidney bean.', 
        structure: 'Height: 1.6 cm & Weight: 1.0 g',
        symptoms: 'Breast tenderness, fatigue', 
        tips: 'Stay active with gentle exercises.'
    },
    { 
        week: 9, 
        fruit: 'Cherry', 
        details: 'Your baby is now the size of a cherry and starting to form muscles.', 
        structure: 'Height: 2.3 cm & Weight: 2.0 g',
        symptoms: 'Mild cramping, headaches', 
        tips: 'Stay hydrated and avoid overexertion.'
    },
    { 
        week: 10, 
        fruit: 'Strawberry', 
        details: 'Your baby is the size of a strawberry, with arms and legs forming.', 
        structure: 'Height: 3.0 cm & Weight: 4.0 g',
        symptoms: 'Mood swings, food aversions', 
        tips: 'Eat balanced meals and rest when needed.'
    },
    { 
        week: 11, 
        fruit: 'Brussels Sprout', 
        details: 'Your baby is now the size of a Brussels sprout, and vital organs are developing.', 
        structure: 'Height: 4.1 cm & Weight: 7.0 g',
        symptoms: 'Nausea may decrease, but fatigue can linger.', 
        tips: 'Continue prenatal vitamins and light exercise.'
    },
    { 
        week: 12, 
        fruit: 'Passion Fruit', 
        details: 'Your baby is as big as a passion fruit, and fingers and toes are more defined.', 
        structure: 'Height: 5.4 cm & Weight: 14.0 g',
        symptoms: 'Less nausea, more energy', 
        tips: 'Keep up with healthy eating habits and regular check-ups.'
    },
    { 
        week: 13, 
        fruit: 'Lemon', 
        details: 'Your baby is the size of a lemon, and vocal cords are developing.', 
        structure: 'Height: 7.4 cm & Weight: 23.0 g',
        symptoms: 'Slight cramping, round ligament pain', 
        tips: 'Stretch gently and maintain good posture.'
    },
    { 
        week: 14, 
        fruit: 'Peach', 
        details: 'Your baby is now the size of a peach, and facial expressions are forming.', 
        structure: 'Height: 8.7 cm & Weight: 43.0 g',
        symptoms: 'Increased energy, decreased nausea', 
        tips: 'Enjoy walks and continue with a balanced diet.'
    },
    { 
        week: 15, 
        fruit: 'Grapefruit', 
        details: 'Your baby is as big as a grapefruit, with bones starting to harden.', 
        structure: 'Height: 10.1 cm & Weight: 70.0 g',
        symptoms: 'Nasal congestion, mild swelling', 
        tips: 'Stay hydrated and elevate your feet if swelling occurs.'
    },
    { 
        week: 16, 
        fruit: 'Avocado', 
        details: 'Your baby is the size of an avocado, with eyes moving closer together.', 
        structure: 'Height: 11.6 cm & Weight: 100 g',
        symptoms: 'Possible back pain and stretch marks', 
        tips: 'Use supportive clothing and moisturize your skin.'
    },
    { 
        week: 17, 
        fruit: 'Pear', 
        details: 'Your baby is now the size of a pear, and fat stores are beginning to develop.', 
        structure: 'Height: 13 cm & Weight: 140 g',
        symptoms: 'Increased appetite, mild backaches', 
        tips: 'Eat small, nutritious meals and focus on proper posture.'
    },
    { 
        week: 18, 
        fruit: 'Sweet Potato', 
        details: 'Your baby is the size of a sweet potato, with the nervous system maturing.', 
        structure: 'Height: 14.2 cm & Weight: 190 g',
        symptoms: 'Round ligament pain, mild swelling', 
        tips: 'Engage in light stretching and stay active.'
    },
    { 
        week: 19, 
        fruit: 'Mango', 
        details: 'Your baby is now the size of a mango, with senses like hearing developing.', 
        structure: 'Height: 15.3 cm & Weight: 240 g',
        symptoms: 'Fatigue, skin changes', 
        tips: 'Moisturize skin and consider prenatal yoga.'
    },
    { 
        week: 20, 
        fruit: 'Bell Pepper', 
        details: 'Your baby is as big as a bell pepper, and they can now suck their thumb.', 
        structure: 'Height: 16.4 cm & Weight: 300 g',
        symptoms: 'Heartburn, leg cramps', 
        tips: 'Eat smaller meals and stay active to relieve cramping.'
    },
    { 
        week: 21, 
        fruit: 'Banana', 
        details: 'Your baby is the size of a banana, with strong limb movements.', 
        structure: 'Height: 26.7 cm & Weight: 360 g',
        symptoms: 'Increased weight gain, occasional dizziness', 
        tips: 'Take breaks when needed and focus on hydration.'
    },
    { 
        week: 22, 
        fruit: 'Papaya', 
        details: 'Your baby is now the size of a papaya, and hair is starting to grow.', 
        structure: 'Height: 27.8 cm & Weight: 430 g',
        symptoms: 'Stretch marks, backaches', 
        tips: 'Wear comfortable shoes and use supportive pillows when sitting or sleeping.'
    },
    { 
        week: 23, 
        fruit: 'Eggplant', 
        details: 'Your baby is the size of an eggplant, and skin is becoming less transparent.', 
        structure: 'Height: 28.9 cm & Weight: 500 g',
        symptoms: 'Swollen ankles, fatigue', 
        tips: 'Elevate your feet when sitting and drink plenty of water.'
    },
    { 
        week: 24, 
        fruit: 'Ear of Corn', 
        details: 'Your baby is now the size of an ear of corn, and their lungs are maturing.', 
        structure: 'Height: 30.0 cm & Weight: 600 g',
        symptoms: 'Braxton Hicks contractions, back pain', 
        tips: 'Practice deep breathing and light stretches for relief.'
    },
    { 
        week: 25, 
        fruit: 'Acorn Squash', 
        details: 'Your baby is as big as an acorn squash, and they are beginning to develop baby fat.', 
        structure: 'Height: 34.6 cm & Weight: 660 g',
        symptoms: 'Heartburn, swelling', 
        tips: 'Avoid spicy foods and rest with your feet elevated.'
    },
    { 
        week: 26, 
        fruit: 'Zucchini', 
        details: 'Your baby is the size of a zucchini, and their immune system is developing.', 
        structure: 'Height: 35.6 cm & Weight: 760 g',
        symptoms: 'Mild shortness of breath, increased appetite', 
        tips: 'Eat nutrient-dense meals and take deep breaths.'
    },
    { 
        week: 27, 
        fruit: 'Cauliflower', 
        details: 'Your baby is as big as a cauliflower, with regular sleep and wake cycles.', 
        structure: 'Height: 36.6 cm & Weight: 875 g',
        symptoms: 'Pelvic pressure, leg cramps', 
        tips: 'Do light stretching exercises and rest often.'
    },
    { 
        week: 28, 
        fruit: 'Head of Lettuce', 
        details: 'Your baby is the size of a head of lettuce, and their brain is growing rapidly.', 
        structure: 'Height: 37.6 cm & Weight: 1.0 kg',
        symptoms: 'Backaches, difficulty sleeping', 
        tips: 'Use pillows for support and maintain a good sleep routine.'
    },
    { 
        week: 29, 
        fruit: 'Small Pumpkin', 
        details: 'Your baby is now the size of a small pumpkin, and their muscles are strengthening.', 
        structure: 'Height: 38.6 cm & Weight: 1.15 kg',
        symptoms: 'Shortness of breath, increased fatigue', 
        tips: 'Take frequent breaks and practice good posture.'
    },
    { 
        week: 30, 
        fruit: 'Cabbage', 
        details: 'Your baby is as big as a cabbage, and they are starting to shed lanugo (fine hair).', 
        structure: 'Height: 39.9 cm & Weight: 1.3 kg',
        symptoms: 'Mild swelling, leg cramps', 
        tips: 'Stay active and stretch your legs frequently.'
    },
    { 
        week: 31, 
        fruit: 'Coconut', 
        details: 'Your baby is the size of a coconut, with brain connections continuing to develop.', 
        structure: 'Height: 41.1 cm & Weight: 1.5 kg',
        symptoms: 'Braxton Hicks contractions, back pain', 
        tips: 'Practice relaxation techniques and stay hydrated.'
    },
    { 
        week: 32, 
        fruit: 'Napa Cabbage', 
        details: 'Your baby is now the size of a napa cabbage, with nails and toenails fully formed.', 
        structure: 'Height: 42.4 cm & Weight: 1.7 kg',
        symptoms: 'Difficulty sleeping, shortness of breath', 
        tips: 'Try side sleeping and use extra pillows for support.'
    },
    { 
        week: 33, 
        fruit: 'Pineapple', 
        details: 'Your baby is as big as a pineapple, and their skin is smoothing out.', 
        structure: 'Height: 43.7 cm & Weight: 1.9 kg',
        symptoms: 'Pelvic pressure, heartburn', 
        tips: 'Eat small meals and avoid lying down immediately after eating.'
    },
    { 
        week: 34, 
        fruit: 'Cantaloupe Melon', 
        details: 'Your baby is the size of a cantaloupe melon, and they are practicing breathing.', 
        structure: 'Height: 45.0 cm & Weight: 2.15 kg',
        symptoms: 'Increased pelvic discomfort, difficulty sleeping', 
        tips: 'Do pelvic floor exercises and maintain a regular sleep routine.'
    },
    { 
        week: 35, 
        fruit: 'Honeydew Melon', 
        details: 'Your baby is now the size of a honeydew melon, with their immune system continuing to strengthen.', 
        structure: 'Height: 46.2 cm & Weight: 2.4 kg',
        symptoms: 'Fatigue, frequent urination', 
        tips: 'Rest as much as possible and stay hydrated.'
    },
    { 
        week: 36, 
        fruit: 'Romaine Lettuce', 
        details: 'Your baby is as big as romaine lettuce, with full lung development.', 
        structure: 'Height: 47.4 cm & Weight: 2.6 kg',
        symptoms: 'Braxton Hicks contractions, mild back pain', 
        tips: 'Practice breathing exercises and relax as much as possible.'
    },
    { 
        week: 37, 
        fruit: 'Swiss Chard', 
        details: 'Your baby is the size of Swiss chard, preparing for birth.', 
        structure: 'Height: 48.6 cm & Weight: 2.85 kg',
        symptoms: 'Increased pelvic pressure, backaches', 
        tips: 'Focus on relaxation and light exercises like walking.'
    },
    { 
        week: 38, 
        fruit: 'Small Watermelon', 
        details: 'Your baby is now the size of a small watermelon and is considered full-term.', 
        structure: 'Height: 49.8 cm & Weight: 3.0 kg',
        symptoms: 'Fatigue, nesting instincts', 
        tips: 'Conserve energy and make final preparations for baby\'s arrival.'
    },
    { 
        week: 39, 
        fruit: 'Pumpkin', 
        details: 'Your baby is as big as a pumpkin, with brain development continuing.', 
        structure: 'Height: 50.7 cm & Weight: 3.3 kg',
        symptoms: 'Increased contractions, pelvic discomfort', 
        tips: 'Stay relaxed and prepare for labor.'
    },
    { 
        week: 40, 
        fruit: 'Pumpkin', 
        details: 'Your baby is still the size of a pumpkin, ready for birth.', 
        structure: 'Height: 51.2 cm & Weight: 3.5 kg',
        symptoms: 'Frequent contractions, increased discomfort', 
        tips: 'Stay in touch with your healthcare provider and prepare for delivery.'
    },
    { 
        week: 41, 
        fruit: 'Pumpkin', 
        details: 'Your baby is overdue and still the size of a pumpkin, continuing to grow.', 
        structure: 'Height: 51.7 cm & Weight: 3.6 kg',
        symptoms: 'Discomfort, anxiety', 
        tips: 'Consult with your healthcare provider about possible next steps.'
    }
];


const BabyDevelopmentTracker = () => {
    const [selectedWeek, setSelectedWeek] = useState(4);
    const sliderRef = useRef(null);

    const handleWeekClick = (week) => {
        setSelectedWeek(week);
    };

    const handlePrevClick = () => {
        setSelectedWeek((prevWeek) => (prevWeek > 4 ? prevWeek - 1 : prevWeek)); // Min week 4
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: -100, // Scroll left by 100px
                behavior: 'smooth'
            });
        }
    };

    const handleNextClick = () => {
        setSelectedWeek((prevWeek) => (prevWeek < 41 ? prevWeek + 1 : prevWeek)); // Max week 41
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: 100, // Scroll right by 100px
                behavior: 'smooth'
            });
        }
    };

    const selectedData = weekData.find(data => data.week === selectedWeek);

    return (
        <div className="tracker-container">
            <header className="tracker-header">
                <div className="tracker-image">
                    <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/icons%20of%20figma%20(4)%202.png" alt="Mom-to-be illustration" />
                </div>
                <div className="tracker-text">
                    <p>Hey Mommy-To-Be<br />Want to know how your baby is growing?</p>
                </div>
            </header>

            <div className="week-slider">
                <button className="prev" onClick={handlePrevClick}>&lt;</button>
                <div className="weeks" ref={sliderRef}>
                    {weekData.map(data => (
                        <button
                            key={data.week}
                            className={`week-button ${data.week === selectedWeek ? 'active' : ''}`}
                            onClick={() => handleWeekClick(data.week)}
                        >
                            Week {data.week}
                        </button>
                    ))}
                </div>
                <button className="next" onClick={handleNextClick}>&gt;</button>
            </div>

            {selectedData ? (
                <div className="content">
                    <h2>Congratulations!!</h2>
                    <p>Your Baby Size Is A {selectedData.fruit} Now!</p>
                    <img 
                        src={`https://www.newmi.in/s/6123687a0e3882eabaee1e6e/6621fefc02af15231c48df1b/${selectedData.fruit.toLowerCase().replace(/\s/g, '-')}.png`} 
                        alt={selectedData.fruit} 
                        className="fruit-image" 
                    />
                </div>
            ) : (
                <div className="content">
                    <h2>Oops! Data not available for this week!</h2>
                </div>
            )}

            {selectedData && (
                <div className="details">
                    <h3>Baby’s Structure</h3>
                    <p>{selectedData.details}<br/>{selectedData.structure}</p>
                    <h3>Common Symptoms</h3>
                    <p>{selectedData.symptoms}</p>
                    <h3>Tips</h3>
                    <p>{selectedData.tips}</p>
                </div>
            )}
        </div>
    );
};

export default BabyDevelopmentTracker;
