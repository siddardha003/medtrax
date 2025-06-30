import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/HospitalDetails.css";
import "../css/Reviews.css";
import HospitalMap from "../components/Hospitalmap";
import { getPublicHospitalDetailsApi, submitReviewApi, getHospitalReviewsApi } from "../../Api";

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
                console.log('Fetching hospital details for ID:', id);

                if (!id) {
                    setError('No hospital ID provided');
                    setLoading(false);
                    return;
                }

                const { data } = await getPublicHospitalDetailsApi(id);
                console.log('Hospital data received:', data);

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
        address: hospitalData?.address || "",
        city: hospitalData?.city || "",
        state: hospitalData?.state || "",
        formattedLocation: hospitalData?.address
            ? `${hospitalData.address}, ${hospitalData.city || ''}, ${hospitalData.state || ''}`.replace(/,\s*,/g, ',').replace(/,\s*$/g, '')
            : "Location not specified",
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
    const displayData = hospitalData ? {
        ...fallbackHospitalData,
        ...hospitalData,
        formattedLocation: hospitalData.address
            ? `${hospitalData.address}, ${hospitalData.city || ''}, ${hospitalData.state || ''}`.replace(/,\s*,/g, ',').replace(/,\s*$/g, '')
            : fallbackHospitalData.formattedLocation
    } : fallbackHospitalData;

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewError, setReviewError] = useState(null);

    // Fetch reviews when hospital data is loaded
    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;

            try {
                setLoadingReviews(true);
                const response = await getHospitalReviewsApi(id);
                if (response.data.success) {
                    setReviews(response.data.data.reviews);
                } else {
                    setReviewError('Failed to load reviews');
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setReviewError('Failed to load reviews. Please try again later.');
            } finally {
                setLoadingReviews(false);
            }
        };

        if (id) {
            fetchReviews();
        }
    }, [id]);

    const [user, setUser] = useState(null);

    // Get logged in user info from localStorage
    useEffect(() => {
        try {
            const profileData = localStorage.getItem('profile');
            console.log('Profile data from localStorage:', profileData);

            if (profileData) {
                const profile = JSON.parse(profileData);
                console.log('Parsed profile:', profile);

                // Check if we have a valid profile with userInfo (Redux format)
                if (profile && profile.userInfo) {
                    setUser({
                        isLoggedIn: true,
                        id: profile.userInfo.id || '',
                        name: profile.userInfo.name || 'Anonymous User',
                        location: profile.userInfo.location || "Location not specified"
                    });
                    console.log('User is logged in as:', profile.userInfo.name);
                }
                // Backwards compatibility for other profile formats
                else if (profile && profile.user) {
                    setUser({
                        isLoggedIn: true,
                        id: profile.user.id || '',
                        name: profile.user.name || 'Anonymous User',
                        location: profile.user.location || "Location not specified"
                    });
                    console.log('User is logged in (legacy format) as:', profile.user.name);
                }
                else {
                    console.log('Profile exists but has invalid format');
                    setUser({ isLoggedIn: false });
                }
            } else {
                console.log('No profile data found in localStorage');
                setUser({ isLoggedIn: false });
            }
        } catch (error) {
            console.error('Error parsing user profile:', error);
            setUser({ isLoggedIn: false });
        }
    }, []);


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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check if token is available in localStorage - this is the most definitive check
            const profileData = localStorage.getItem('profile');
            const isAuthenticated = profileData && JSON.parse(profileData)?.token;

            // First check: if no token available, user is definitely not logged in
            if (!isAuthenticated) {
                console.log('No authentication token found. User needs to log in.');
                alert("Please log in to submit a review.");
                return;
            }

            // Second check: verify our component state is also reflecting the logged-in state
            // This is a redundant check but helps ensure UI consistency
            if (!user?.isLoggedIn) {
                console.log('Token exists but component state shows user not logged in. Refreshing state.');
                // We could refresh the user state here if needed
                alert("Please log in to submit a review.");
                return;
            }

            // Validate review
            if (!newReview.text || newReview.stars === 0) {
                alert("Please provide both a rating and a review.");
                return;
            }

            console.log('Submitting review for hospital ID:', id);
            const reviewData = {
                hospitalId: id,
                rating: newReview.stars,
                text: newReview.text
            };
            console.log('Review data being submitted:', reviewData);

            const response = await submitReviewApi(reviewData);
            console.log('Review submission response:', response);

            if (response.data.success) {
                // Add the new review to the beginning of the reviews array
                const newReviewData = response.data.data.review;
                console.log('New review added:', newReviewData);

                setReviews(prevReviews => [newReviewData, ...prevReviews]);

                // Reset the form
                setNewReview({ stars: 0, text: "" });

                // Update hospital rating in the UI
                if (hospitalData) {
                    setHospitalData(prevData => ({
                        ...prevData,
                        rating: parseFloat(response.data.data.review.rating) || prevData.rating,
                        reviewsCount: (prevData.reviewsCount || 0) + 1
                    }));
                }

                alert("Review submitted successfully!");
            } else {
                console.error('Review submission failed with error:', response.data.message);
                alert("Failed to submit review. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error submitting review. Please try again later.");
        }
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
        return (
            <div className="loading-spinner" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                padding: '20px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '24px', marginBottom: '20px' }}>Loading hospital details...</div>
                <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #008b95', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message" style={{
                padding: '30px',
                textAlign: 'center',
                backgroundColor: '#fff1f1',
                color: '#e74c3c',
                margin: '50px auto',
                maxWidth: '600px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                <h2>Error Loading Hospital Details</h2>
                <p>{error}</p>
                <p>Please try again later or contact support if the problem persists.</p>
            </div>
        );
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
                <img
                    src={displayData.images[0] || "https://via.placeholder.com/800x400?text=No+Image+Available"}
                    alt="Main"
                    className="main-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/800x400?text=Error+Loading+Image";
                    }}
                />

                {/* Image Grid */}
                <div className="image-grid">
                    <img
                        src={displayData.images[1] || displayData.images[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                        alt="Secondary 1"
                        className="thumbnail"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x300?text=Error+Loading+Image";
                        }}
                    />
                    <div className="thumbnail-container">
                        <img
                            src={displayData.images[2] || displayData.images[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                            alt="Secondary 2"
                            className="thumbnail"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x300?text=Error+Loading+Image";
                            }}
                        />
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
                                        <img
                                            src={serviceType.image}
                                            alt={serviceType.category}
                                            className="tab-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/150?text=Service";
                                            }}
                                        />
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
                                            <img
                                                src={doctor.image}
                                                alt={doctor.name}
                                                className="doctor-image"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/150?text=Doctor";
                                                }}
                                            />
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
                                {loadingReviews ? (
                                    <div className="loading-reviews">Loading reviews...</div>
                                ) : reviewError ? (
                                    <div className="review-error">{reviewError}</div>
                                ) : reviews.length === 0 ? (
                                    <div className="no-reviews">No reviews yet. Be the first to review!</div>
                                ) : (
                                    <div className="review-tabs" ref={reviewContainerRef}>
                                        {reviews.map((review, index) => (
                                            <div key={index} className="review-card">
                                                <div className="review-stars">{"⭐".repeat(review.rating || 0)}</div>
                                                <h4>{review.text || 'No review text provided'}</h4>
                                                <p>{review.userName || 'Anonymous User'}</p>
                                                <p>{review.userLocation || 'Location not specified'}</p>
                                                <p className="review-date">
                                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                        {(() => {
                            try {
                                // Most reliable way to check authentication
                                const profileData = localStorage.getItem('profile');
                                const profile = profileData ? JSON.parse(profileData) : null;
                                const isLoggedIn = !!(profile && (profile.token || (profile.userInfo && profile.userInfo.id)));

                                // Debug
                                console.log('Review form auth check:', {
                                    profileExists: !!profileData,
                                    hasToken: !!(profile && profile.token),
                                    hasUserInfo: !!(profile && profile.userInfo),
                                    isLoggedInState: user?.isLoggedIn,
                                    finalDecision: isLoggedIn
                                });

                                if (isLoggedIn) {
                                    return (
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
                                    );
                                } else {
                                    return (
                                        <div className="login-prompt">
                                            <p>Please <a href="/login" style={{ fontWeight: 'bold', color: '#008b95' }}>log in</a> to submit a review.</p>
                                        </div>
                                    );
                                }
                            } catch (error) {
                                console.error('Error rendering review form:', error);
                                return <p>An error occurred when checking login status. Please refresh the page.</p>;
                            }
                        })()}
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