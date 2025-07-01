import React, { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPublicShopDetailsApi, getShopReviewsApi, submitShopReviewApi } from "../../Api";
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

    // Modal functions
    const openModal1 = () => setIsModalOpen1(true);
    const closeModal1 = () => setIsModalOpen1(false);

    // Styles
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
        containernew: {
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            maxWidth: "400px",
        },
        title: {
            fontSize: "1.5rem",
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

    // Fallback data for medical shop
    const fallbackShopData = {
        name: "Apollo Pharmacy",
        rating: 4.4,
        reviewsCount: 259,
        closingTime: "10:00 PM",
        location: "Bhimavaram, West Godavari",
        phone: "080 4628 6939",
        directionsLink: "https://maps.google.com",
        images: [
            "https://www.apollopharmacy.in/cdn/shop/files/Store_1200x.jpg?v=1614323335",
            "https://www.apollopharmacy.in/cdn/shop/files/Store_2_1200x.jpg?v=1614323335",
            "https://www.apollopharmacy.in/cdn/shop/files/Store_3_1200x.jpg?v=1614323335",
            "https://www.apollopharmacy.in/cdn/shop/files/Store_4_1200x.jpg?v=1614323335"
        ],
        services: [
            {
                category: "Prescription Medicines",
                items: [
                    { name: "Paracetamol 500mg (10 tablets)", price: 25, availability: "In Stock" },
                    { name: "Azithromycin 500mg (5 tablets)", price: 150, availability: "In Stock" },
                    { name: "Amoxicillin 500mg (10 capsules)", price: 120, availability: "In Stock" },
                    { name: "Cetirizine 10mg (10 tablets)", price: 35, availability: "In Stock" }
                ]
            },
            {
                category: "OTC Medicines", 
                items: [
                    { name: "Vitamin C 500mg (30 tablets)", price: 150, availability: "In Stock" },
                    { name: "Calcium + Vitamin D3 (60 tablets)", price: 200, availability: "Limited Stock" },
                    { name: "Multivitamins (30 capsules)", price: 250, availability: "In Stock" },
                    { name: "Digene Antacid (10 tablets)", price: 45, availability: "In Stock" }
                ]
            },
            {
                category: "Ointments & Creams",
                items: [
                    { name: "Moov Pain Relief Cream 30g", price: 85, availability: "In Stock" },
                    { name: "Boroline Antiseptic Cream 20g", price: 45, availability: "In Stock" },
                    { name: "Betadine Ointment 20g", price: 95, availability: "In Stock" },
                    { name: "Volini Gel 30g", price: 110, availability: "In Stock" }
                ]
            },
            {
                category: "Baby Care",
                items: [
                    { name: "Himalaya Baby Powder 100g", price: 120, availability: "In Stock" },
                    { name: "Johnson's Baby Oil 100ml", price: 150, availability: "In Stock" },
                    { name: "Pampers Diapers (M, 10 pcs)", price: 350, availability: "In Stock" },
                    { name: "Dexolac Baby Formula 400g", price: 450, availability: "In Stock" }
                ]
            },
            {
                category: "Medical Devices",
                items: [
                    { name: "Digital Thermometer", price: 250, availability: "In Stock" },
                    { name: "Blood Pressure Monitor", price: 1200, availability: "In Stock" },
                    { name: "Oximeter", price: 800, availability: "Limited Stock" },
                    { name: "Nebulizer", price: 1800, availability: "In Stock" }
                ]
            }
        ]
    };

    const [selectedService, setSelectedService] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewError, setReviewError] = useState(null);

    const [user, setUser] = useState(null);

    const [newReview, setNewReview] = useState({
        stars: 0,
        text: "",
    });

    const handleStarClick = (index) => {
        setNewReview((prev) => ({
            ...prev,
            stars: index + 1,
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
            if (!user?.isLoggedIn) {
                console.log('Token exists but component state shows user not logged in. Refreshing state.');
                alert("Please log in to submit a review.");
                return;
            }

            // Validate review
            if (!newReview.text || newReview.stars === 0) {
                alert("Please provide both a rating and a review.");
                return;
            }

            console.log('Submitting review for shop ID:', shopId);
            const reviewData = {
                shopId: shopId,
                rating: newReview.stars,
                text: newReview.text
            };
            console.log('Review data being submitted:', reviewData);

            const response = await submitShopReviewApi(reviewData);
            console.log('Review submission response:', response);

            if (response.data.success) {
                // Add the new review to the beginning of the reviews array
                const newReviewData = response.data.data.review;
                console.log('New review added:', newReviewData);

                setReviews(prevReviews => [newReviewData, ...prevReviews]);

                // Reset the form
                setNewReview({ stars: 0, text: "" });

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

    const reviewContainerRef = useRef(null);
    const scrollreview = (direction) => {
        const scrollAmo = 300;
        if (reviewContainerRef.current) {
            const revcontainer = reviewContainerRef.current;
            if (direction === "left") {
                revcontainer.scrollLeft -= scrollAmo;
            } else {
                revcontainer.scrollLeft += scrollAmo;
            }
        }
    };

    const serviceContainerRef = useRef(null);
    const scrollreview1 = (direction) => {
        const scrollAmou = 150;
        if (serviceContainerRef.current) {
            const servicecontainer = serviceContainerRef.current;
            if (direction === "left") {
                servicecontainer.scrollLeft -= scrollAmou;
            } else {
                servicecontainer.scrollLeft += scrollAmou;
            }
        }
    };

    const [selectedMedicalshop, setSelectedMedicalshop] = useState({
        name: 'Apollo Pharmacy',
        latitude: 17.4065,
        longitude: 78.4772,
    });

    const openingTimes = [
        { day: "Monday", time: "8:00 AM - 10:00 PM" },
        { day: "Tuesday", time: "8:00 AM - 10:00 PM" },
        { day: "Wednesday", time: "8:00 AM - 10:00 PM" },
        { day: "Thursday", time: "8:00 AM - 10:00 PM" },
        { day: "Friday", time: "8:00 AM - 10:00 PM" },
        { day: "Saturday", time: "8:00 AM - 10:00 PM" },
        { day: "Sunday", time: "9:00 AM - 9:00 PM" },
    ];

    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const handleContactNowClick = () => setShowPhoneNumber(true);

    // Function to transform backend services data to frontend format
    const transformServices = (backendServices) => {
        if (!backendServices || !Array.isArray(backendServices)) return fallbackShopData.services;
        
        const serviceMapping = {
            'prescription_dispensing': {
                category: "Prescription Medicines",
                items: [
                    { name: "Paracetamol 500mg (10 tablets)", price: 25, availability: "In Stock" },
                    { name: "Azithromycin 500mg (5 tablets)", price: 150, availability: "In Stock" },
                    { name: "Amoxicillin 500mg (10 capsules)", price: 120, availability: "In Stock" },
                    { name: "Cetirizine 10mg (10 tablets)", price: 35, availability: "In Stock" }
                ]
            },
            'otc_medicines': {
                category: "OTC Medicines",
                items: [
                    { name: "Vitamin C 500mg (30 tablets)", price: 150, availability: "In Stock" },
                    { name: "Calcium + Vitamin D3 (60 tablets)", price: 200, availability: "Limited Stock" },
                    { name: "Multivitamins (30 capsules)", price: 250, availability: "In Stock" },
                    { name: "Digene Antacid (10 tablets)", price: 45, availability: "In Stock" }
                ]
            },
            'health_supplements': {
                category: "Health Supplements",
                items: [
                    { name: "Protein Powder 1kg", price: 2500, availability: "In Stock" },
                    { name: "Omega-3 Fish Oil (60 capsules)", price: 800, availability: "In Stock" },
                    { name: "Whey Protein 2kg", price: 3500, availability: "In Stock" },
                    { name: "BCAA Powder 300g", price: 1200, availability: "In Stock" }
                ]
            },
            'medical_devices': {
                category: "Medical Devices",
                items: [
                    { name: "Digital Thermometer", price: 250, availability: "In Stock" },
                    { name: "Blood Pressure Monitor", price: 1200, availability: "In Stock" },
                    { name: "Oximeter", price: 800, availability: "Limited Stock" },
                    { name: "Nebulizer", price: 1800, availability: "In Stock" }
                ]
            },
            'baby_care': {
                category: "Baby Care",
                items: [
                    { name: "Himalaya Baby Powder 100g", price: 120, availability: "In Stock" },
                    { name: "Johnson's Baby Oil 100ml", price: 150, availability: "In Stock" },
                    { name: "Pampers Diapers (M, 10 pcs)", price: 350, availability: "In Stock" },
                    { name: "Dexolac Baby Formula 400g", price: 450, availability: "In Stock" }
                ]
            },
            'elderly_care': {
                category: "Elderly Care",
                items: [
                    { name: "Adult Diapers (L, 10 pcs)", price: 400, availability: "In Stock" },
                    { name: "Walking Stick", price: 600, availability: "In Stock" },
                    { name: "Blood Sugar Monitor", price: 1500, availability: "In Stock" },
                    { name: "Compression Stockings", price: 800, availability: "In Stock" }
                ]
            },
            'home_delivery': {
                category: "Home Delivery",
                items: [
                    { name: "Standard Delivery (Same Day)", price: 50, availability: "Available" },
                    { name: "Express Delivery (2 Hours)", price: 100, availability: "Available" },
                    { name: "Prescription Refill Service", price: 30, availability: "Available" },
                    { name: "Emergency Medicine Delivery", price: 150, availability: "24/7 Available" }
                ]
            },
            'online_consultation': {
                category: "Online Consultation",
                items: [
                    { name: "General Physician Consultation", price: 500, availability: "Available" },
                    { name: "Specialist Doctor Consultation", price: 1000, availability: "Available" },
                    { name: "Pharmacist Consultation", price: 200, availability: "Available" },
                    { name: "Health Checkup Package", price: 2000, availability: "Available" }
                ]
            }
        };

        const transformedServices = [];
        backendServices.forEach(serviceKey => {
            if (serviceMapping[serviceKey]) {
                transformedServices.push(serviceMapping[serviceKey]);
            }
        });

        return transformedServices.length > 0 ? transformedServices : fallbackShopData.services;
    };

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

    // Fetch reviews when shop data is loaded
    useEffect(() => {
        const fetchReviews = async () => {
            if (!shopId) return;

            try {
                setLoadingReviews(true);
                const response = await getShopReviewsApi(shopId);
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

        if (shopId) {
            fetchReviews();
        }
    }, [shopId]);

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
                const shopData = response.data;
                
                // Transform the services data to match frontend expectations
                const transformedShopData = {
                    ...shopData,
                    services: transformServices(shopData.services),
                    // Add other fallback properties if missing (excluding rating/reviewsCount - handled by frontend)
                    closingTime: shopData.closingTime || '10:00 PM',
                    location: shopData.fullAddress || shopData.address ? 
                        `${shopData.address.street}, ${shopData.address.city}, ${shopData.address.state}` : 
                        'Location not available',
                    phone: shopData.phone || 'Phone not available',
                    directionsLink: shopData.directionsLink || 'https://maps.google.com',
                    images: shopData.images || fallbackShopData.images
                };
                
                setShopData(transformedShopData);
            } catch (err) {
                console.error('Error fetching shop details:', err);
                setError(err.message);
                setShopData(fallbackShopData);
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [shopId]);

    // Calculate rating and reviewsCount dynamically from reviews (frontend-only)
    const calculateRatingAndCount = () => {
        if (reviews.length === 0) {
            return { rating: 0, reviewsCount: 0 };
        }
        
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = totalRating / reviews.length;
        
        return {
            rating: parseFloat(averageRating.toFixed(1)),
            reviewsCount: reviews.length
        };
    };

    const { rating: calculatedRating, reviewsCount: calculatedReviewsCount } = calculateRatingAndCount();

    const displayData = shopData ? {
        ...shopData,
        // Override with frontend-calculated values
        rating: calculatedRating || 4.4, // fallback to 4.4 if no reviews
        reviewsCount: calculatedReviewsCount || 0
    } : {
        ...fallbackShopData,
        rating: calculatedRating || 4.4,
        reviewsCount: calculatedReviewsCount || 0
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="medicalshop-ui">
            {/* Header */}
            <div className="medicalshop-header">
                <h1>{displayData.name}</h1>                
                <div className="medicalshoprating">
                    ⭐ {displayData.rating ? displayData.rating.toFixed(1) : '4.4'} ({displayData.reviewsCount || 0} reviews)
                </div>                
                <p className="medicalshop-timing">
                    🕒 Open until {displayData.closingTime || '10:00 PM'}
                </p>
                <p className="medicalshop-location">
                    📍 {displayData.location || 'Location not available'}{" "}
                    <a href={displayData.directionsLink || '#'} target="_blank" rel="noreferrer">
                        Get directions
                    </a>
                </p>
            </div>
            
            {/* Images Section */}
            <div className="medicalshop-images">
                <img 
                    src={displayData.images && displayData.images[0] ? displayData.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt="Main" 
                    className="main-image" 
                />
                <div className="image-grid">
                    <img 
                        src={displayData.images && displayData.images[1] ? displayData.images[1] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt="Secondary 1" 
                        className="thumbnail" 
                    />
                    <div className="thumbnail-container">
                        <img 
                            src={displayData.images && displayData.images[2] ? displayData.images[2] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                            alt="Secondary 2" 
                            className="thumbnail" 
                        />
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
                            {(displayData.images || []).map((image, index) => (
                                <img key={index} src={image} alt={`Image ${index}`} className="modal-image" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Main Content */}
            <div className="med-services-booking">
                <div className="med-services-section">
                    {/* Enhanced Products & Services Section */}
                    <div className="products-services-section">
                        <h2 className="section-title">Pharmacy Products & Services</h2>
                        
                        {/* Categories Navigation */}
                        <div className="categories-nav-container">
                            <button
                                className="scroll-button left-button"
                                onClick={() => scrollreview1("left")}
                            >
                                &#9664;
                            </button>
                            <div className="categories-nav" ref={serviceContainerRef}>
                                {(displayData.services || []).map((serviceType, index) => (
                                    <button
                                        key={index}
                                        className={`category-tab ${selectedService === index ? "active" : ""}`}
                                        onClick={() => setSelectedService(index)}
                                    >
                                        <span className="category-icon">
                                            {serviceType.category === "Prescription Medicines" && "💊"}
                                            {serviceType.category === "OTC Medicines" && "🩹"}
                                            {serviceType.category === "Ointments & Creams" && "🧴"}
                                            {serviceType.category === "Baby Care" && "🍼"}
                                            {serviceType.category === "Medical Devices" && "🩺"}
                                            {serviceType.category === "Health Supplements" && "💪"}
                                            {serviceType.category === "Elderly Care" && "🧓"}
                                            {serviceType.category === "Home Delivery" && "🚚"}
                                            {serviceType.category === "Online Consultation" && "💻"}
                                        </span>
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
                        
                        {/* Products List */}
                        <div className="products-container">
                            <div className="products-header">
                                <h3 className="products-category-title">
                                    {(displayData.services && displayData.services[selectedService]?.category) || "Products"}
                                </h3>
                                <div className="products-count">
                                    {(displayData.services && displayData.services[selectedService]?.items?.length) || 0} items available
                                </div>
                            </div>
                            
                            <div className="products-grid">
                                {(displayData.services && displayData.services[selectedService]?.items || []).map((item, idx) => (
                                    <div key={idx} className="product-card">
                                        <div className="product-image-placeholder">
                                            {item.name.includes("Tablet") && "💊"}
                                            {item.name.includes("Cream") && "🧴"}
                                            {item.name.includes("Oil") && "🛢️"}
                                            {item.name.includes("Device") && "🩺"}
                                            {item.name.includes("Delivery") && "🚚"}
                                            {item.name.includes("Consultation") && "👨‍⚕️"}
                                        </div>
                                        <div className="product-details">
                                            <h4 className="product-name">{item.name}</h4>
                                            <div className="product-meta">
                                                <span className={`product-availability ${item.availability === "In Stock" ? "in-stock" : "limited-stock"}`}>
                                                    {item.availability}
                                                </span>
                                                <span className="product-price">₹{item.price}</span>
                                            </div>
                                        </div>
                                        <div className="product-actions">
                                            <button className="add-to-cart-btn">
                                                <span className="cart-icon">🛒</span> Add to Cart
                                            </button>
                                            <button className="quick-view-btn">Quick View</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <h2>Customer Reviews</h2>
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
                                    <div className="error-reviews">Error loading reviews: {reviewError}</div>
                                ) : (
                                    <div className="review-tabs" ref={reviewContainerRef}>
                                        {reviews.map((review, index) => (
                                            <div key={index} className="review-card">
                                                <div className="review-stars">{"⭐".repeat(review.rating || 0)}</div>
                                                <h4>{review.text || 'No review text provided'}</h4>
                                                <p className="review-author">{review.userName || 'Anonymous User'}</p>
                                                <p className="review-location">{review.userLocation || 'Location not specified'}</p>
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
                        <h2>Share Your Experience</h2>
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
                                            <label>Rating:</label>
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
                                            <label>Review:</label>
                                            <textarea
                                                name="text"
                                                value={newReview.text}
                                                onChange={handleReviewChange}
                                                placeholder="How was your experience with this pharmacy?"
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
                    
                    {/* Location Map */}
                    <div className="map-section">
                        <h2>Our Location</h2>
                        <MedicalshopMap
                            latitude={selectedMedicalshop.latitude}
                            longitude={selectedMedicalshop.longitude}
                            medicalshopName={selectedMedicalshop.name}
                        />
                    </div>
                    
                    {/* Opening Hours */}
                    <div style={styles1.containernew}>
                        <h2 style={styles1.title}>Opening Hours</h2>
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
                
                {/* Booking Card */}
                <div className="med-booking-card">
                    <div className="med-booking-medical-header">
                        <h2>{displayData.name || 'Medical Shop'}</h2>                        
                        <div className="med-booking-rating">
                            ⭐ {displayData.rating ? displayData.rating.toFixed(1) : '4.4'} ({displayData.reviewsCount || 0} reviews)
                        </div>
                        <button className="med-book-now-btn" onClick={handleContactNowClick}>
                            Contact now
                        </button>                        
                        {showPhoneNumber && (
                            <div className="phone-number-display">
                                <p>📞 {displayData.phone || 'Phone not available'}</p>
                                <p className="timing-note">Available 9AM-9PM</p>
                            </div>
                        )}
                        <div className="store-info">
                            <p>🏬 Store pick-up available</p>
                            <p>🚚 Home delivery option</p>
                            <p>🕒 Open until {displayData.closingTime || '10:00 PM'}</p>
                        </div>
                        <p className="location-info">
                            📍 {displayData.location || 'Location not available'}{" "}
                            <a href={displayData.directionsLink || '#'} target="_blank" rel="noreferrer">
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