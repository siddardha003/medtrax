import React, { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPublicHospitalDetailsApi } from "../../Api";
import "../css/HospitalDetails.css";
import HospitalMap from "../components/Hospitalmap";

const HospitalDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const hospitalId = id || searchParams.get('id');
    
    const [hospitalData, setHospitalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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

    // Static fallback data
    const fallbackHospitalData = {
        name: "City Hospital - Downtown",
        rating: 4.8,
        reviewsCount: 259,
        closingTime: "10:00pm",
        location: "Downtown, Dubai",
        directionsLink: "https://maps.google.com",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg",
            "https://c8.alamy.com/comp/H1RWH2/hospital-building-and-department-with-doctors-working-office-surgery-H1RWH2.jpg",
            "https://data1.ibtimes.co.in/en/full/761597/jammu-500-bedded-hospital.jpg?h=450&l=50&t=40"
        ],
        services: [
            {
                category: "General Checkup",
                image: "https://img.freepik.com/free-vector/charity-logo-hands-supporting-heart-icon-flat-design-vector-illustration_53876-136266.jpg",
                description: "Regular health checkups",
                doctors: [
                    { id: 1, name: "Dr. Alice Smith", degree: "MBBS, MD", image: "https://via.placeholder.com/150" },
                    { id: 2, name: "Dr. John Doe", degree: "MBBS, MS", image: "https://via.placeholder.com/150" }
                ]
            },
            {
                category: "Dental Care",
                image: "https://www.carolinasmilesdentist.com/wp-content/uploads/Tooth1901.jpg",
                description: "Comprehensive dental care services",
                doctors: [
                    { id: 5, name: "Dr. Emily Brown", degree: "BDS, MDS", image: "https://via.placeholder.com/150" },
                    { id: 6, name: "Dr. David Miller", degree: "BDS", image: "https://via.placeholder.com/150" }
                ]
            },
            {
                category: "Pediatrics",
                image: "https://www.eurokidsindia.com/blog/wp-content/uploads/2024/03/observe-children-at-play-870x557.jpg",
                description: "Best child care services",
                doctors: [
                    { id: 7, name: "Dr. Arjun", degree: "BDS, MDS", image: "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*" },
                    { id: 8, name: "Dr. Smithi", degree: "BDS", image: "https://via.placeholder.com/150" }
                ]
            }
        ]
    };    // Use effect to fetch hospital data
    useEffect(() => {
        const fetchHospitalDetails = async () => {
            if (!hospitalId) {
                setHospitalData(fallbackHospitalData);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await getPublicHospitalDetailsApi(hospitalId);
                console.log('Hospital Details API Response:', response.data); // Debug log
                
                if (response.data && response.data.success) {
                    const hospitalInfo = response.data.data.hospital;
                    // Transform API data to match component expectations
                    const transformedData = {
                        name: hospitalInfo.name,
                        rating: hospitalInfo.rating || 4.5,
                        reviewsCount: hospitalInfo.reviewsCount || 259,
                        closingTime: hospitalInfo.closingTime || "10:00pm",
                        location: hospitalInfo.address 
                            ? `${hospitalInfo.address.city || ''}, ${hospitalInfo.address.state || ''}`.trim().replace(/^,|,$/, '')
                            : 'Location not available',
                        directionsLink: hospitalInfo.directionsLink || "https://maps.google.com",
                        phone: hospitalInfo.phone,
                        images: hospitalInfo.images || [
                            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg",
                            "https://c8.alamy.com/comp/H1RWH2/hospital-building-and-department-with-doctors-working-office-surgery-H1RWH2.jpg"
                        ],
                        services: hospitalInfo.services || fallbackHospitalData.services
                    };
                    setHospitalData(transformedData);
                } else {
                    throw new Error('Invalid API response structure');
                }
            } catch (err) {
                console.error('Error fetching hospital details:', err);
                setError(err.message);
                // Fallback to static data if API fails
                setHospitalData(fallbackHospitalData);
            } finally {
                setLoading(false);
            }
        };

        fetchHospitalDetails();
    }, [hospitalId]);

    // Display the current hospital data or fallback
    const displayData = hospitalData || fallbackHospitalData;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!hospitalData) return null;

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
