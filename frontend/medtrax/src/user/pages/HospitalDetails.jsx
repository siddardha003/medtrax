import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/HospitalDetails.css";
import HospitalMap from "../components/Hospitalmap";
import { getPublicHospitalDetailsApi } from "../../Api";

const HospitalDetails = () => {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hospitalData, setHospitalData] = useState(null);

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            try {
                setLoading(true);
                const { data } = await getPublicHospitalDetailsApi(id);
                if (data.success) {
                    setHospitalData(data.data.hospital);
                } else {
                    setError('Failed to load hospital details');
                }
            } catch (err) {
                console.error('Error fetching hospital details:', err);
                setError('Failed to load hospital details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHospitalDetails();
        }
    }, [id]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const styles = {
        container: {
            maxWidth: "500px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ccc", 
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
        header: {
            textAlign: "center",
            color: "#333",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            gap: "15px",
        },
        starContainer: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
        },
        star: {
            fontSize: "24px",
        },
        inputContainer: {
            display: "flex",
            flexDirection: "column",
        },
        label: {
            fontSize: "16px",
            marginBottom: "5px",
            color: "#333",
        },
        textarea: {
            width: "100%",
            height: "100px",
            borderRadius: "4px",
            padding: "10px",
            border: "1px solid #ccc",
            resize: "none",
            backgroundColor: "#fff",
            color: "#333",
        },
        button: {
            padding: "10px 20px",
            borderRadius: "4px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
        },
        result: {
            textAlign: "center",
        },


        containernew: {
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            maxWidth: "400px",
        },
        title: {
            fontSize: "3 rem ",
            fontWeight: "bold",
            marginBottom: "10px",
        },
        list: {
            listStyle: "none",
            padding: 0,
            margin: 0,
        },
        listItem: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 0",
        },
        dayContainer: {
            display: "flex",
            alignItems: "center",
        },
        dot: {
            width: "10px",
            height: "10px",
            backgroundColor: "#6fcf97",
            borderRadius: "50%",
            marginRight: "10px",
        },
        day: {
            fontWeight: "light",
        },
        time: {
            fontWeight: "normal",
        },
        highlight: {
            fontWeight: "bold",
            color: "#000",
        },
    };
    // Fallback data if the hospital hasn't completed their profile
    const fallbackHospitalData = {
        name: hospitalData?.name || "Hospital",
        rating: hospitalData?.rating || 0,
        reviewsCount: hospitalData?.reviewsCount || 0,
        closingTime: hospitalData?.closingTime || "Not specified",
        location: `${hospitalData?.address}, ${hospitalData?.city}, ${hospitalData?.state}` || "Location not specified",
        directionsLink: "https://maps.google.com",
        images: hospitalData?.images?.length > 0 ? hospitalData.images : [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg"
        ],
        services: hospitalData?.services?.length > 0 ? hospitalData.services : [
            {
                category: "General Services",
                image: "https://via.placeholder.com/150?text=General+Services",
                description: "General hospital services",
                doctors: []
            }
        ]
    };

    // Use real data if available, otherwise use fallback data
    const displayData = hospitalData?.profileComplete ? hospitalData : fallbackHospitalData;

    const [reviews, setReviews] = useState([
        {
            name: "Ciara",
            location: "Los Angeles, USA",
            text: "Great way to discover new salons. Recently moved to a new city and didn't know any salons. Fresha gave me a whole new list to choose from!",
            stars: 5,
        },
        {
            name: "Jonny",
            location: "Melbourne, Australia",
            text: "Such a sleek and powerful app. I highly recommend booking your appointments on Fresha.",
            stars: 3,
        },
        {
            name: "Anton",
            location: "Los Angeles, USA",
            text: "My clients love booking appointments online with Fresha. The consultation forms and free SMS reminders are so convenient.",
            stars: 4,
        },
        {
            name: "Susan",
            location: "Brisbane, Australia",
            text: "Love this beauty booking app. There are so many great features to explore. The consultation forms and client reminder texts are great – best of all, it's free.",
            stars: 5,
        },
        {
            name: "Ciara",
            location: "Los Angeles, USA",
            text: "Great way to discover new salons. Recently moved to a new city and didn't know any salons. Fresha gave me a whole new list to choose from!",
            stars: 5,
        },
        {
            name: "Jonny",
            location: "Melbourne, Australia",
            text: "Such a sleek and powerful app. I highly recommend booking your appointments on Fresha.",
            stars: 5,
        },
        {
            name: "Anton",
            location: "Los Angeles, USA",
            text: "My clients love booking appointments online with Fresha. The consultation forms and free SMS reminders are so convenient.",
            stars: 5,
        },
        {
            name: "Susan",
            location: "Brisbane, Australia",
            text: "Love this beauty booking app. There are so many great features to explore. The consultation forms and client reminder texts are great – best of all, it's free.",
            stars: 5,
        },

    ]);

    const [user, setUser] = useState({
        isLoggedIn: true,
        name: "John Doe",
        location: "New York, USA",
    });


    const [newReview, setNewReview] = useState({
        stars: 0,
        text: "",
    });

    const handleStarClick = (index) => {
        setNewReview((prev) => ({
            ...prev,
            stars: index + 1, // Set stars based on the clicked star index
        }));
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!newReview.text || newReview.stars === 0) {
            alert("Please provide both a rating and a review.");
            return;
        }

        const review = {
            ...newReview,
            name: user.name,
            location: user.location,
        };

        setReviews((prev) => [review, ...prev]);
        setNewReview({ stars: 0, text: "" });
        alert("Review submitted successfully!");
    };



    const tabsContainerRef = useRef(null);

    const scrollTabs = (direction) => {
        const scrollAmount = 230; // Adjust scroll amount

        if (tabsContainerRef.current) {
            const container = tabsContainerRef.current;

            // Adjust for smooth scrolling in horizontal direction
            if (direction === "left") {
                container.scrollLeft -= scrollAmount;
            } else {
                container.scrollLeft += scrollAmount;
            }
        }
    };

    const reviewContainerRef = useRef(null);

    const scrollreview = (direction) => {
        const scrollAmo = 300; // Adjust scroll amount

        if (reviewContainerRef.current) {
            const revcontainer = reviewContainerRef.current;

            // Adjust for smooth scrolling in horizontal direction
            if (direction === "left") {
                revcontainer.scrollLeft -= scrollAmo;
            } else {
                revcontainer.scrollLeft += scrollAmo;
            }
        }
    };

    const [selectedService, setSelectedService] = useState(0); // Default tab

    const [selectedHospital, setSelectedHospital] = useState({
        name: displayData.name,
        latitude: hospitalData?.location?.latitude || 17.4065,
        longitude: hospitalData?.location?.longitude || 78.4772,
    });

    const openingTimes = hospitalData?.openingTimes?.length > 0 ? hospitalData.openingTimes : [
        { day: "Monday", time: "9:00 AM - 5:00 PM" },
        { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
        { day: "Wednesday", time: "9:00 AM - 5:00 PM" },
        { day: "Thursday", time: "9:00 AM - 5:00 PM" },
        { day: "Friday", time: "9:00 AM - 5:00 PM" },
        { day: "Saturday", time: "9:00 AM - 5:00 PM" },
        { day: "Sunday", time: "Closed" },
    ];

    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    if (loading) {
        return <div className="loading-spinner">Loading hospital details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Show profile incomplete message if needed
    const profileIncompleteMessage = !hospitalData?.profileComplete && (
        <div className="profile-incomplete-message">
            <p>This hospital has not completed their profile yet. Some information may be missing or incomplete.</p>
        </div>
    );

    return (
        <div className="hospital-ui">
            {/* Profile incomplete message */}
            {profileIncompleteMessage}
            
            {/* Header */}
            <div className="hospital-header">
                <h1>{displayData.name}</h1>
                <div className="rating">
                    ⭐⭐⭐⭐⭐ {displayData.rating} ({displayData.reviewsCount})
                </div>
                <p className="hospital-timing">
                    🕒 Open until {displayData.closingTime}
                </p>
                <p className="hospital-location">
                    📍 {displayData.location}{" "}
                    <a href={displayData.directionsLink} target="_blank" rel="noreferrer">
                        Get directions
                    </a>
                </p>
            </div>

            {/* Images Section */}
            <div className="hospital-images">
                {/* Main Image */}
                <img src={displayData.images[0] || "https://via.placeholder.com/800x400?text=No+Image+Available"} alt="Main" className="main-image" />

                {/* Image Grid */}
                <div className="image-grid">
                    <img src={displayData.images[1] || displayData.images[0] || "https://via.placeholder.com/400x300?text=No+Image"} alt="Secondary 1" className="thumbnail" />
                    <div className="thumbnail-container">
                        <img src={displayData.images[2] || displayData.images[0] || "https://via.placeholder.com/400x300?text=No+Image"} alt="Secondary 2" className="thumbnail" />
                        <button className="see-all-btn" onClick={openModal}>
                            See All
                        </button>
                    </div>
                </div>
                {isModalOpen && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={closeModal}>
                                &times;
                            </button>
                            {displayData.images.map((image, index) => (
                                <img key={index} src={image} alt={`Image ${index}`} className="modal-image" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Services Section */}
            <div className="services-booking">
                <div className="services-section">
                    <h2>Departments</h2>
                    {/* Horizontal Scrollable Tabs with Buttons */}
                    <div className="scroll-container">
                        <button
                            className="scroll-button left-button"
                            onClick={() => scrollTabs("left")}
                        >
                            &#9664;
                        </button>
                        <div className="service-tabs-container">
                            <div className="service-tabs" ref={tabsContainerRef}>
                                {displayData.services.map((serviceType, index) => (
                                    <div
                                        key={index}
                                        className={`tab-card ${selectedService === index ? "active" : ""}`}
                                        onClick={() => setSelectedService(index)}
                                    >
                                        <img src={serviceType.image} alt={serviceType.category} className="tab-image" />
                                        <h4 className="tab-name">{serviceType.category}</h4>
                                        <p className="tab-description">{serviceType.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            className="scroll-button right-button"
                            onClick={() => scrollTabs("right")}
                        >
                            &#9654;
                        </button>
                    </div>


                    {/* Doctors Display */}
                    <div className="team-container">
                        <h2>Meet our Experts</h2>
                        {displayData.services[selectedService]?.doctors?.length > 0 ? (
                            <div className="team-grid">
                                {displayData.services[selectedService].doctors.map((doctor, index) => (
                                    <div className="team-card" key={index}>
                                        <div className="image-container">
                                            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                                        </div>
                                        <h3 className="doctor-name">{doctor.name}</h3>
                                        <p className="doctor-degree">{doctor.degree}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-doctors-message">No doctors listed for this department yet.</p>
                        )}
                    </div>

                    {/* Reviews Section - Moved Below Services */}
                    <div className="reviews-section">
                        <h2>Reviews</h2>
                        {/* Display Reviews */}
                        <div className="scroll-container">
                            <button
                                className="scroll-button left-button"
                                onClick={() => scrollreview("left")}
                            >
                                &#9664;
                            </button>
                            <div className="reviews-container">
                                <div className="review-tabs" ref={reviewContainerRef}>
                                    {reviews.map((review, index) => (
                                        <div key={index} className="review-card">
                                            <div className="review-stars">{"⭐".repeat(review.stars)}</div>
                                            <h4>{review.text}</h4>
                                            <p>{review.name}</p>
                                            <p>{review.location}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                className="scroll-button right-button"
                                onClick={() => scrollreview("right")}
                            >
                                &#9654;
                            </button>
                        </div>

                        {/* Add Review Section */}
                        <h2>Submit Your Review</h2>
                        {user.isLoggedIn ? (
                            <form className="review-form" onSubmit={handleReviewSubmit}>
                                <label>
                                    Rating:
                                </label>

                                <div className="star-rating">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <span
                                            key={index}
                                            className={`star ${index < newReview.stars ? "filled" : ""}`}
                                            onClick={() => handleStarClick(index)}
                                        >
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                                <label>
                                    Review:
                                </label>
                                <textarea
                                    name="text"
                                    value={newReview.text}
                                    onChange={handleReviewChange}
                                    placeholder="Write your review here..."
                                    required
                                ></textarea>
                                <button type="submit">Submit Review</button>
                            </form>
                        ) : (
                            <p>Please log in to submit a review.</p>
                        )}
                    </div>
                    <div style={{ margin: '10px' }}>
                        <h2>{selectedHospital.name}</h2>
                        <HospitalMap
                            latitude={selectedHospital.latitude}
                            longitude={selectedHospital.longitude}
                            hospitalName={selectedHospital.name}
                        />
                    </div>
                    <div style={styles.containernew}>
                        <h2 style={styles.title}>Opening times</h2>
                        <ul style={styles.list}>
                            {openingTimes.map(({ day, time }) => (
                                <li
                                    key={day}
                                    style={{
                                        ...styles.listItem,
                                        ...(day === today ? styles.highlight : {}),
                                    }}
                                >
                                    <span style={styles.dayContainer}>
                                        <span style={styles.dot}></span>
                                        <span style={styles.day}>{day}</span>
                                    </span>
                                    <span style={{
                                        ...styles.time,
                                        ...(day === today ? styles.highlight : {}),
                                    }}>
                                        {time}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
                {/* Booking Section */}
                <div className="booking-card">
                    <div className="booking-hospital-header">
                        <h1>{displayData.name}</h1>
                        <div className="booking-rating">
                            ⭐ {displayData.rating} ({displayData.reviewsCount})
                        </div>
                        <button className="book-now-btn">Book now</button>
                        <p>🕒 Open until {displayData.closingTime}</p>
                        <p>
                            📍 {displayData.location}{" "}
                            <a href={displayData.directionsLink} target="_blank" rel="noreferrer">
                                Get directions
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default HospitalDetails;