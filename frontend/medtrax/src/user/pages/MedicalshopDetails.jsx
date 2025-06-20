import React, { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPublicShopDetailsApi } from "../../Api";
import "../css/MedicalshopDetails.css";
import MedicalshopMap from "../components/Medicalshopmap";

const MedicalshopDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const shopId = id || searchParams.get('shopId');
    
    const [shopData, setShopData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isModalOpen1, setIsModalOpen1] = useState(false);

    const openModal1 = () => {
        setIsModalOpen1(true);
    };

    const closeModal1 = () => {
        setIsModalOpen1(false);
    };
    const styles1 = {
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
    const medicalshopData = {
        name: "Apollo",
        rating: 4.4,
        reviewsCount: 259,
        closingTime: "10:00pm",
        location: "Bhimavaram, Westgodavari",
        phone: "080 4628 6939",
        directionsLink: "https://maps.google.com",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg", // Main image
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg", // Secondary image 1
            "https://c8.alamy.com/comp/H1RWH2/hospital-building-and-department-with-doctors-working-office-surgery-H1RWH2.jpg", // Secondary image 2
            "https://data1.ibtimes.co.in/en/full/761597/jammu-500-bedded-hospital.jpg?h=450&l=50&t=40", // Secondary image 2
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg", // Main image
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg", // Secondary image 1
            "https://c8.alamy.com/comp/H1RWH2/hospital-building-and-department-with-doctors-working-office-surgery-H1RWH2.jpg", // Secondary image 2
            "https://data1.ibtimes.co.in/en/full/761597/jammu-500-bedded-hospital.jpg?h=450&l=50&t=40", // Secondary image 2
        ],
        services: [
            {
                category: "General Checkup",
                items: [
                    { name: "Consultation", duration: "30 mins", price: 100 },
                    { name: "Full Body Checkup", duration: "1 hr", price: 500 },
                ],
            },
            {
                category: "Special Treatments",
                items: [
                    { name: "Physiotherapy", duration: "45 mins", price: 200 },
                    { name: "Dermatology Consultation", duration: "1 hr", price: 400 },
                ],
            },
            {
                category: "Dental Care",
                items: [
                    { name: "Teeth Cleaning", duration: "45 mins", price: 150 },
                    { name: "Cavity Filling", duration: "1 hr", price: 300 },
                ],
            },
            {
                category: "General Checkup",
                items: [
                    { name: "Consultation", duration: "30 mins", price: 100 },
                    { name: "Full Body Checkup", duration: "1 hr", price: 500 },
                ],
            },
            {
                category: "Special Treatments",
                items: [
                    { name: "Physiotherapy", duration: "45 mins", price: 200 },
                    { name: "Dermatology Consultation", duration: "1 hr", price: 400 },
                ],
            },
            {
                category: "Dental Care",
                items: [
                    { name: "Teeth Cleaning", duration: "45 mins", price: 150 },
                    { name: "Cavity Filling", duration: "1 hr", price: 300 },
                    { name: "Teeth Cleaning", duration: "45 mins", price: 150 },
                    { name: "Cavity Filling", duration: "1 hr", price: 300 },
                    { name: "Teeth Cleaning", duration: "45 mins", price: 150 },
                    { name: "Cavity Filling", duration: "1 hr", price: 300 },
                    { name: "Teeth Cleaning", duration: "45 mins", price: 150 },
                    { name: "Cavity Filling", duration: "1 hr", price: 300 },
                ],
            },
            {
                category: "Special Treatments",
                items: [
                    { name: "Physiotherapy", duration: "45 mins", price: 200 },
                    { name: "Dermatology Consultation", duration: "1 hr", price: 400 },
                ],
            },
            {
                category: "Special Treatments",
                items: [
                    { name: "Physiotherapy", duration: "45 mins", price: 200 },
                    { name: "Dermatology Consultation", duration: "1 hr", price: 400 },
                ],
            },

        ],
    };
    const [selectedService, setSelectedService] = useState(0);
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

    const serviceContainerRef = useRef(null);

    const scrollreview1 = (direction) => {
        const scrollAmou = 150; // Adjust scroll amount

        if (serviceContainerRef.current) {
            const servicecontainer = serviceContainerRef.current;

            // Adjust for smooth scrolling in horizontal direction
            if (direction === "left") {
                servicecontainer.scrollLeft -= scrollAmou;
            } else {
                servicecontainer.scrollLeft += scrollAmou;
            }
        }
    };

    const [selectedMedicalshop, setSelectedMedicalshop] = useState({
        name: 'Apollo',
        latitude: 17.4065,
        longitude: 78.4772,
    });

    const openingTimes = [
        { day: "Monday", time: "12:00 pm - 11:00 pm" },
        { day: "Tuesday", time: "12:00 pm - 11:00 pm" },
        { day: "Wednesday", time: "12:00 pm - 11:00 pm" },
        { day: "Thursday", time: "12:00 pm - 11:00 pm" },
        { day: "Friday", time: "12:00 pm - 11:00 pm" },
        { day: "Saturday", time: "12:00 pm - 11:00 pm" },
        { day: "Sunday", time: "12:00 pm - 11:00 pm" },
    ];

    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    const [showPhoneNumber, setShowPhoneNumber] = useState(false);

    const handleContactNowClick = () => {
        setShowPhoneNumber(true);
    };

    // Static fallback data
    const fallbackShopData = {
        name: "Apollo Pharmacy",
        rating: 4.4,
        reviewsCount: 259,
        closingTime: "10:00pm",
        location: "Bhimavaram, Westgodavari",
        phone: "080 4628 6939",
        directionsLink: "https://maps.google.com",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg",
            "https://c8.alamy.com/comp/H1RWH2/hospital-building-and-department-with-doctors-working-office-surgery-H1RWH2.jpg"
        ],
        categories: [
            {
                name: "Prescription Medicines",
                items: [
                    { name: "Paracetamol", price: 25, availability: "In Stock" },
                    { name: "Aspirin", price: 30, availability: "In Stock" }
                ]
            },
            {
                name: "OTC Medicines", 
                items: [
                    { name: "Vitamin C", price: 150, availability: "In Stock" },
                    { name: "Calcium Tablets", price: 200, availability: "Limited Stock" }
                ]
            }
        ]
    };

    // Use effect to fetch shop data
    useEffect(() => {
        const fetchShopDetails = async () => {
            if (!shopId) {
                setShopData(fallbackShopData);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getPublicShopDetailsApi(shopId);
                setShopData(response.data);
            } catch (err) {
                console.error('Error fetching shop details:', err);
                setError(err.message);
                // Fallback to static data if API fails
                setShopData(fallbackShopData);
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [shopId]);

    // Display the current shop data or fallback
    const displayData = shopData || fallbackShopData;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="medicalshop-ui">
            {/* Header */}
            <div className="medicalshop-header">
                <h1>{shopData.name}</h1>
                <div className="medicalshoprating">
                    ⭐⭐⭐⭐⭐ {shopData.rating} ({shopData.reviewsCount})
                </div>
                <p className="medicalshop-timing">
                    🕒 Open until {shopData.closingTime}
                </p>
                <p className="medicalshop-location">
                    📍 {shopData.location}{" "}
                    <a href={shopData.directionsLink} target="_blank" rel="noreferrer">
                        Get directions
                    </a>
                </p>
            </div>

            {/* Images Section */}
            <div className="medicalshop-images">
                {/* Main Image */}
                <img src={shopData.images[0]} alt="Main" className="main-image" />

                {/* Image Grid */}
                <div className="image-grid">
                    <img src={shopData.images[1]} alt="Secondary 1" className="thumbnail" />
                    <div className="thumbnail-container">
                        <img src={shopData.images[2]} alt="Secondary 2" className="thumbnail" />
                        <button className="see-all-btn" onClick={openModal1}>
                            See All
                        </button>
                    </div>
                </div>
                {isModalOpen1 && (
                    <div className="modal-overlay" onClick={closeModal1}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={closeModal1}>
                                &times;
                            </button>
                            {shopData.images.map((image, index) => (
                                <img key={index} src={image} alt={`Image ${index}`} className="modal-image" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="med-services-booking">
                <div className="med-services-section">
                    <h2>Categories</h2>
                    <div className="scroll-container">
                        <button
                            className="scroll-button left-button"
                            onClick={() => scrollreview1("left")}
                        >
                            &#9664;
                        </button>
                        <div className="med-service-tabs" ref={serviceContainerRef}>
                            {shopData.services.map((serviceType, index) => (
                                <button
                                    key={index}
                                    className={`medtab ${selectedService === index ? "active" : ""}`}
                                    onClick={() => setSelectedService(index)}
                                >
                                    {serviceType.category}
                                </button>
                            ))}
                        </div>
                        <button
                            className="scroll-button right-button"
                            onClick={() => scrollreview1("right")}
                        >
                            &#9654;
                        </button>
                    </div>
                    <div className="med-service-list">
                        {shopData.services[selectedService]?.items.map((service, idx) => (
                            <div key={idx} className="med-service-item">
                                <div>
                                    <h4>{service.name}</h4>
                                    <p>{service.duration}</p>
                                </div>
                                <div className="med-service-book">
                                    <span>AED {service.price}</span>
                                    <button className="book-btn">Book</button>
                                </div>
                            </div>
                        ))}
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
                        <h2>{selectedMedicalshop.name}</h2>
                        <MedicalshopMap
                            latitude={selectedMedicalshop.latitude}
                            longitude={selectedMedicalshop.longitude}
                            medicalshopName={selectedMedicalshop.name}
                        />
                    </div>
                    <div style={styles1.containernew}>
                        <h2 style={styles1.title}>Opening times</h2>
                        <ul style={styles1.list}>
                            {openingTimes.map(({ day, time }) => (
                                <li
                                    key={day}
                                    style={{
                                        ...styles1.listItem,
                                        ...(day === today ? styles1.highlight : {}),
                                    }}
                                >
                                    <span style={styles1.dayContainer}>
                                        <span style={styles1.dot}></span>
                                        <span style={styles1.day}>{day}</span>
                                    </span>
                                    <span style={{
                                        ...styles1.time,
                                        ...(day === today ? styles1.highlight : {}),
                                    }}>
                                        {time}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div className="med-booking-card">
                    <div className="med-booking-medical-header">
                        <h1>{shopData.name}</h1>
                        <div className="med-booking-rating">
                            ⭐ {shopData.rating} ({shopData.reviewsCount})
                        </div>
                        <button className="med-book-now-btn" onClick={handleContactNowClick}>
                            Contact now
                        </button>
                        {showPhoneNumber && <p>📞 Phone - {shopData.phone}</p>}
                        <p>🏬 Store pick-up</p>
                        <p>🕒 Open until {shopData.closingTime}</p>
                        <p>
                            📍 {shopData.location}{" "}
                            <a href={shopData.directionsLink} target="_blank" rel="noreferrer">
                                Get directions
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalshopDetails;