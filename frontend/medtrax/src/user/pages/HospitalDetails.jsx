import React, { useState, useRef } from "react";
import "../css/HospitalDetails.css";
import HospitalMap from "../components/Hospitalmap";

const HospitalDetails = () => {
    // Dummy hospital data
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    const hospitalData = {
        name: "City Hospital - Downtown",
        rating: 4.8,
        reviewsCount: 259,
        closingTime: "10:00pm",
        location: "Downtown, Dubai",
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
                image: "https://img.freepik.com/free-vector/charity-logo-hands-supporting-heart-icon-flat-design-vector-illustration_53876-136266.jpg",
                description: "Regular health checkups",
                doctors: [
                    { id: 1, name: "Dr. Alice Smith", degree: "MBBS, MD", image: "https://via.placeholder.com/150" },
                    { id: 2, name: "Dr. John Doe", degree: "MBBS, MS", image: "https://via.placeholder.com/150" },
                ],
            },
            {
                category: "Dental Care",
                image: "https://www.carolinasmilesdentist.com/wp-content/uploads/Tooth1901.jpg",
                description: "Comprehensive dental care services",
                doctors: [
                    { id: 5, name: "Dr. Emily Brown", degree: "BDS, MDS", image: "https://via.placeholder.com/150" },
                    { id: 6, name: "Dr. David Miller", degree: "BDS", image: "https://via.placeholder.com/150" },
                ],
            },
            {
                category: "Pediatrics",
                image: "https://www.eurokidsindia.com/blog/wp-content/uploads/2024/03/observe-children-at-play-870x557.jpg",
                description: "Best child care services",
                doctors: [
                    { id: 7, name: "Dr. Arjun", degree: "BDS, MDS", image: "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*" },
                    { id: 8, name: "Dr. Smithi", degree: "BDS", image: "https://via.placeholder.com/150" },
                    { id: 9, name: "Dr. Kranthi", degree: "BDS, MDS", image: "https://via.placeholder.com/150" },
                    { id: 10, name: "Dr. Viraj", degree: "BDS", image: "https://via.placeholder.com/150" },
                    { id: 11, name: "Dr. Zara", degree: "BDS, MBBS", image: "https://via.placeholder.com/150" },
                    { id: 12, name: "Dr. Rakshitha", degree: "BDS", image: "https://via.placeholder.com/150" },
                    { id: 13, name: "Dr. Laxmi", degree: "BDS, FRCS", image: "https://via.placeholder.com/150" },
                ],
            },
            {
                category: "Orthopedics",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN10PBtPn1zNAxJ5MJZF2hDTw1o6lKXDgm3Q&s",
                description: "Bone and joint care services",
                doctors: [
                    { id: 14, name: "Dr. Henry Adams", degree: "MBBS, MS Ortho", image: "https://desunhospital.com/wp-content/uploads/2023/12/Dr.-Aditya-Varma-2-scaled.jpg" },
                    { id: 15, name: "Dr. Rachel Green", degree: "MBBS, DNB Ortho", image: "https://www.yourfreecareertest.com/wp-content/uploads/2018/01/how_to_become_a_doctor.jpg" },
                ],
            },
            {
                category: "Cardiology",
                image: "https://www.nm.org/-/media/northwestern/healthbeat/images/health%20library/nm-ten-signs-cardiologist_preview.jpg",
                description: "Heart health and care",
                doctors: [
                    { id: 16, name: "Dr. Steve Parker", degree: "MBBS, DM Cardiology", image: "https://via.placeholder.com/150" },
                    { id: 17, name: "Dr. Mia Clark", degree: "MBBS, MD Cardiology", image: "https://via.placeholder.com/150" },
                ],
            },
            {
                category: "Dermatology",
                image: "https://www.renaimedicity.org/wp-content/uploads/2021/03/dermatology-cosmetology-inn.jpg",
                description: "Skin care and treatments",
                doctors: [
                    { id: 18, name: "Dr. Ava Taylor", degree: "MBBS, MD Dermatology", image: "https://via.placeholder.com/150" },
                    { id: 19, name: "Dr. Noah Williams", degree: "MBBS, DNB Dermatology", image: "https://via.placeholder.com/150" },
                ],
            },
            {
                category: "Psychiatry",
                image: "https://tanveernaseer.com/wp-content/uploads/2022/07/Reasons-to-become-psychiatrist.jpg",
                description: "Mental health and wellness",
                doctors: [
                    { id: 20, name: "Dr. Ethan Brown", degree: "MBBS, MD Psychiatry", image: "https://via.placeholder.com/150" },
                    { id: 21, name: "Dr. Olivia Davis", degree: "MBBS, DM Psychiatry", image: "https://via.placeholder.com/150" },
                ],
            },
            {
                category: "Physiotherapy",
                image: "https://www.capitalphysiotherapy.com.au/wp-content/uploads/2017/01/Prevention-Screening-Sports.jpg",
                description: "Physical therapy and rehabilitation",
                doctors: [
                    { id: 22, name: "Dr. Liam Wilson", degree: "BPT, MPT", image: "https://via.placeholder.com/150" },
                    { id: 23, name: "Dr. Sophia Martinez", degree: "BPT", image: "https://via.placeholder.com/150" },
                ],
            },
            {
                category: "Gynecology",
                image: "https://www.khadehospital.com/wp-content/uploads/2021/03/Gynaecology.jpg",
                description: "Women's health and maternity care",
                doctors: [
                    { id: 24, name: "Dr. Emma Moore", degree: "MBBS, MD Gynecology", image: "https://via.placeholder.com/150" },
                    { id: 25, name: "Dr. Daniel Johnson", degree: "MBBS, DNB Gynecology", image: "https://via.placeholder.com/150" },
                ],
            },
        ],
    };


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
        name: 'City Hospital - Downtown',
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

    return (
        <div className="hospital-ui">
            {/* Header */}
            <div className="hospital-header">
                <h1>{hospitalData.name}</h1>
                <div className="rating">
                    ⭐⭐⭐⭐⭐ {hospitalData.rating} ({hospitalData.reviewsCount})
                </div>
                <p className="hospital-timing">
                    🕒 Open until {hospitalData.closingTime}
                </p>
                <p className="hospital-location">
                    📍 {hospitalData.location}{" "}
                    <a href={hospitalData.directionsLink} target="_blank" rel="noreferrer">
                        Get directions
                    </a>
                </p>
            </div>

            {/* Images Section */}
            <div className="hospital-images">
                {/* Main Image */}
                <img src={hospitalData.images[0]} alt="Main" className="main-image" />

                {/* Image Grid */}
                <div className="image-grid">
                    <img src={hospitalData.images[1]} alt="Secondary 1" className="thumbnail" />
                    <div className="thumbnail-container">
                        <img src={hospitalData.images[2]} alt="Secondary 2" className="thumbnail" />
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
                            {hospitalData.images.map((image, index) => (
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
                                {hospitalData.services.map((serviceType, index) => (
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
                        <div className="team-grid">
                            {hospitalData.services[selectedService]?.doctors.map((doctor) => (
                                <div className="team-card" key={doctor.id}>
                                    <div className="image-container">
                                        <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                                    </div>
                                    <h3 className="doctor-name">{doctor.name}</h3>
                                    <p className="doctor-degree">{doctor.degree}</p>
                                </div>
                            ))}
                        </div>
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
                        <h1>{hospitalData.name}</h1>
                        <div className="booking-rating">
                            ⭐ {hospitalData.rating} ({hospitalData.reviewsCount})
                        </div>
                        <button className="book-now-btn">Book now</button>
                        <p>🕒 Open until {hospitalData.closingTime}</p>
                        <p>
                            📍 {hospitalData.location}{" "}
                            <a href={hospitalData.directionsLink} target="_blank" rel="noreferrer">
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
