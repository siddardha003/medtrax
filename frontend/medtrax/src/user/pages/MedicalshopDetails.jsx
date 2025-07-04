import React, { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPublicShopDetailsApi, getShopReviewsApi, submitShopReviewApi } from "../../Api";
import "../css/MedicalshopDetails.css";
import "../css/Reviews.css";
import MedicalshopMap from "../components/Medicalshopmap";

// Helper function to ensure valid image URLs
const getValidImageUrl = (url) => {
    if (!url) return null;

    // If URL already has a protocol, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // If it's a relative URL, add the base URL
    if (url.startsWith('/')) {
        return `${window.location.origin}${url}`;
    }

    // If it's just a path without leading slash
    return `${window.location.origin}/${url}`;
};

const MedicalshopDetails = () => {
    // Get id from URL params - unified approach
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const shopId = id || searchParams.get('shopId');

    console.log('=== MEDICALSHOP DETAILS DEBUG ===');
    console.log('URL id param:', id);
    console.log('Search param shopId:', searchParams.get('shopId'));
    console.log('Final shopId used:', shopId);
    console.log('Current URL:', window.location.href);
    console.log('=== END URL DEBUG ===');

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

    // Pure fallback data for when no shop data is available
    const pureFallbackShopData = {
        name: "Apollo Pharmacy",
        rating: 4.4,
        reviewsCount: 156,
        closingTime: "10:00 PM",
        address: "Main Street, Bhimavaram",
        city: "Bhimavaram",
        state: "West Godavari",
        formattedLocation: "Main Street, Bhimavaram, West Godavari",
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

    // Use real shop data if available, otherwise use pure fallback data
    const displayData = shopData ? {
        // Use backend data directly - NO FALLBACKS except for missing fields
        name: shopData.name,
        rating: shopData.rating,
        reviewsCount: shopData.reviewsCount,
        closingTime: shopData.closingTime || '10:00 PM',
        address: shopData.address,
        city: shopData.city,
        state: shopData.state,
        phone: shopData.phone,
        directionsLink: shopData.directionsLink || 'https://maps.google.com',
        images: shopData.images || [],
        services: shopData.services || [],
        // Include owner fields from backend
        ownerName: shopData.ownerName,
        ownerPhone: shopData.ownerPhone,
        ownerEmail: shopData.ownerEmail,
        // Include coordinate fields
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        // Formatted location
        formattedLocation: shopData.location ||
            (shopData.address && shopData.city && shopData.state
                ? `${shopData.address}, ${shopData.city}, ${shopData.state}`
                : 'Location not available'),
        // Pass through all other fields
        ...shopData
    } : pureFallbackShopData;

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
        name: 'Loading...',
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
        console.log('=== TRANSFORM SERVICES DEBUG ===');
        console.log('Input backendServices:', backendServices);
        console.log('Type of backendServices:', typeof backendServices);
        console.log('Is array:', Array.isArray(backendServices));

        // Handle case where services is already in the correct format (array of objects with category and items)
        if (backendServices && Array.isArray(backendServices) && backendServices.length > 0) {
            // Check if it's already in the frontend format
            if (backendServices[0].category && backendServices[0].items) {
                console.log('Services already in frontend format');
                return backendServices;
            }

            // Check if it's an array of service keys (strings)
            if (typeof backendServices[0] === 'string') {
                console.log('Services in string array format, transforming...');

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
                    } else {
                        console.log(`Unknown service key: ${serviceKey}`);
                    }
                });

                console.log('Transformed services:', transformedServices);
                return transformedServices.length > 0 ? transformedServices : pureFallbackShopData.services;
            }
        }

        console.log('No backend services found or invalid format, using fallback data');
        console.log('=== END TRANSFORM SERVICES DEBUG ===');
        return pureFallbackShopData.services;
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
            console.log('=== FETCH SHOP DETAILS START ===');
            console.log('shopId parameter:', shopId);

            if (!shopId) {
                console.log('No shopId provided - using fallback data');
                setShopData(null); // No shop ID means use pure fallback
                setSelectedMedicalshop({
                    name: pureFallbackShopData.name,
                    latitude: 17.4065,
                    longitude: 78.4772,
                });
                setLoading(false);
                return;
            }

            console.log('Fetching shop details for ID:', shopId);
            setLoading(true);
            setError(null); // Clear any previous errors
            setShopData(null); // Clear previous shop data to prevent display issues

            try {
                console.log('Making API call to:', `/api/public/shops/${shopId}`);
                const response = await getPublicShopDetailsApi(shopId);
                console.log('API Response received:', response);
                console.log('Response structure:', response.data);

                // Extract the actual shop data from the nested response
                const shopData = response.data.data;  // Backend returns { success: true, data: shopData }

                console.log('=== BACKEND DATA DEBUG ===');
                console.log('Raw shop data from backend:', shopData);
                console.log('Backend name:', shopData.name);
                console.log('Backend images:', shopData.images);
                console.log('Backend services:', shopData.services);
                console.log('Backend location:', shopData.location);
                console.log('Backend address:', shopData.address);
                console.log('Backend fullAddress:', shopData.fullAddress);
                console.log('Backend ownerName:', shopData.ownerName);
                console.log('Backend ownerPhone:', shopData.ownerPhone);
                console.log('Backend ownerEmail:', shopData.ownerEmail);
                console.log('Backend phone:', shopData.phone);
                console.log('Backend latitude:', shopData.latitude);
                console.log('Backend longitude:', shopData.longitude);
                console.log('=== END DEBUG ===');

                // Extract coordinates from backend data
                let latitude = 17.4065; // fallback
                let longitude = 78.4772; // fallback

                if (shopData.location && shopData.location.coordinates && Array.isArray(shopData.location.coordinates)) {
                    // GeoJSON format: [longitude, latitude]
                    longitude = shopData.location.coordinates[0];
                    latitude = shopData.location.coordinates[1];
                } else if (shopData.latitude && shopData.longitude) {
                    // Direct lat/lng fields
                    latitude = shopData.latitude;
                    longitude = shopData.longitude;
                }

                // Update map state with backend data
                setSelectedMedicalshop({
                    name: shopData.name || 'Medical Shop',
                    latitude: latitude,
                    longitude: longitude,
                });

                // Transform the services data to match frontend expectations
                const transformedShopData = {
                    ...shopData,
                    services: transformServices(shopData.services),
                    // Add other fallback properties if missing (excluding rating/reviewsCount - handled by frontend)
                    closingTime: shopData.closingTime || '10:00 PM',
                    // Handle different location formats from backend
                    location: shopData.fullAddress ||
                        (shopData.address && shopData.city && shopData.state ?
                            `${shopData.address}, ${shopData.city}, ${shopData.state}` :
                            (shopData.address || 'Location not available')),
                    // Handle phone field mapping
                    phone: shopData.phone || shopData.contactPhone || 'Phone not available',
                    directionsLink: shopData.directionsLink || 'https://maps.google.com',
                    // Use backend images if available, otherwise use empty array (placeholders will be shown)
                    images: shopData.images && shopData.images.length > 0 ? shopData.images : [],
                    // Include owner fields from backend
                    ownerName: shopData.ownerName || '',
                    ownerPhone: shopData.ownerPhone || shopData.contactPhone || '',
                    ownerEmail: shopData.ownerEmail || shopData.contactEmail || ''
                };

                console.log('=== TRANSFORMED DATA DEBUG ===');
                console.log('Transformed shop data:', transformedShopData);
                console.log('Final name:', transformedShopData.name);
                console.log('Final images:', transformedShopData.images);
                console.log('Final services:', transformedShopData.services);
                console.log('Final location:', transformedShopData.location);
                console.log('Final ownerName:', transformedShopData.ownerName);
                console.log('Final ownerPhone:', transformedShopData.ownerPhone);
                console.log('Final ownerEmail:', transformedShopData.ownerEmail);
                console.log('=== END TRANSFORMED DEBUG ===');

                console.log('Setting shopData state with:', transformedShopData);
                setShopData(transformedShopData);
                console.log('shopData state has been set');
            } catch (err) {
                console.error('Error fetching shop details:', err);
                console.error('Error details:', err.message);
                console.error('Stack trace:', err.stack);
                setError(err.message);
                setShopData(null); // Use pure fallback on error
                setSelectedMedicalshop({
                    name: pureFallbackShopData.name,
                    latitude: 17.4065,
                    longitude: 78.4772,
                });
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

    // Update displayData to include calculated ratings
    const finalDisplayData = {
        ...displayData,
        // Override with frontend-calculated values
        rating: calculatedRating || displayData.rating || 4.4,
        reviewsCount: calculatedReviewsCount || displayData.reviewsCount || 0
    };

    // Debug displayData
    console.log('=== DISPLAY DATA DEBUG ===');
    console.log('Current shopData state:', shopData);
    console.log('shopData.name:', shopData?.name);
    console.log('displayData:', displayData);
    console.log('displayData.name:', displayData?.name);
    console.log('Final displayData:', finalDisplayData);
    console.log('finalDisplayData.name:', finalDisplayData?.name);
    console.log('DisplayData images:', finalDisplayData.images);
    console.log('DisplayData services:', finalDisplayData.services);
    console.log('DisplayData ownerName:', finalDisplayData.ownerName);
    console.log('DisplayData ownerPhone:', finalDisplayData.ownerPhone);
    console.log('DisplayData ownerEmail:', finalDisplayData.ownerEmail);
    console.log('=== END DISPLAY DATA DEBUG ===');

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
                <div style={{ fontSize: '24px', marginBottom: '20px' }}>Loading shop details...</div>
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
                <h2>Error Loading Shop Details</h2>
                <p>{error}</p>
                <p>Please try again later or contact support if the problem persists.</p>
            </div>
        );
    }

    // Show profile incomplete message if needed
    const profileIncompleteMessage = !shopData?.profileComplete && (
        <div className="profile-incomplete-message">
            <p>This pharmacy has not completed their profile yet. Some information may be missing or incomplete.</p>
        </div>
    );

    return (
        <div className="medicalshop-ui">
            {/* Profile incomplete message */}
            {profileIncompleteMessage}

            {/* Header */}
            <div className="medicalshop-header">
                <h1>{finalDisplayData.name}</h1>
                <div className="medicalshoprating">
                    ⭐ {finalDisplayData.rating ? finalDisplayData.rating.toFixed(1) : '4.4'} ({finalDisplayData.reviewsCount || 0} reviews)
                </div>
                <p className="medicalshop-timing">
                    🕒 Open until {finalDisplayData.closingTime || '10:00 PM'}
                </p>
                <p className="medicalshop-location">
                    📍 {finalDisplayData.formattedLocation || finalDisplayData.location || 'Location not available'}{" "}
                    <a style={{ color: "#008b95" }} href={finalDisplayData.directionsLink || '#'} target="_blank" rel="noreferrer">
                        Get directions
                    </a>
                </p>
                {/* Owner/Admin Contact Info */}
                {/* {(finalDisplayData.ownerName || finalDisplayData.ownerPhone || finalDisplayData.ownerEmail) && (
                    <div className="medicalshop-owner-info" style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Owner/Manager Contact</h4>
                        {finalDisplayData.ownerName && <p style={{ margin: '5px 0' }}>👤 {finalDisplayData.ownerName}</p>}
                        {finalDisplayData.ownerPhone && <p style={{ margin: '5px 0' }}>📞 {finalDisplayData.ownerPhone}</p>}
                        {finalDisplayData.ownerEmail && <p style={{ margin: '5px 0' }}>✉️ {finalDisplayData.ownerEmail}</p>}
                    </div>
                )} */}
            </div>

            {/* Images Section - Improved with better error handling */}
            <div className="medicalshop-images">
                {/* Main Image */}
                <img
                    src={getValidImageUrl(finalDisplayData.images?.[0]) || "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18bb8f38116%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18bb8f38116%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.4296875%22%20y%3D%22217.76%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"}
                    alt="Main"
                    className="main-image"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18bb8f38116%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18bb8f38116%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EE5555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.4296875%22%20y%3D%22217.76%22%3EImage%20Error%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                    }}
                />

                {/* Image Grid */}
                <div className="image-grid">
                    <img
                        src={getValidImageUrl(finalDisplayData.images?.[1] || finalDisplayData.images?.[0]) || "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18bb8f38116%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18bb8f38116%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22145.4296875%22%20y%3D%22157.76%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"}
                        alt="Secondary 1"
                        className="thumbnail"
                        onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18bb8f38116%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18bb8f38116%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23EE5555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22135.4296875%22%20y%3D%22157.76%22%3EImage%20Error%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                        }}
                    />
                    <div className="thumbnail-container">
                        <img
                            src={getValidImageUrl(finalDisplayData.images?.[2] || finalDisplayData.images?.[0]) || "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18bb8f38116%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18bb8f38116%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22145.4296875%22%20y%3D%22157.76%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"}
                            alt="Secondary 2"
                            className="thumbnail"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18bb8f38116%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18bb8f38116%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23EE5555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22135.4296875%22%20y%3D%22157.76%22%3EImage%20Error%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                            }}
                        />
                        <button className="see-all-btn" onClick={openModal1}>
                            See All ({finalDisplayData.images ? finalDisplayData.images.length : 0})
                        </button>
                    </div>
                </div>
                {isModalOpen1 && (
                    <div className="modal-overlay" onClick={closeModal1}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={closeModal1}>
                                &times;
                            </button>
                            <h3>Shop Images ({finalDisplayData.images ? finalDisplayData.images.length : 0} total)</h3>
                            {(finalDisplayData.images && finalDisplayData.images.length > 0) ? (
                                finalDisplayData.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={getValidImageUrl(image)}
                                        alt={`Shop Image ${index + 1}`}
                                        className="modal-image"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18bb8f38116%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18bb8f38116%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23EE5555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22135.4296875%22%20y%3D%22157.76%22%3EImage%20Error%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                                        }}
                                    />
                                ))
                            ) : (
                                <p>No images available for this shop.</p>
                            )}
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
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="product-image" />
                                            ) : (
                                                <>
                                                    {item.name.includes("Tablet") && "💊"}
                                                    {item.name.includes("Cream") && "🧴"}
                                                    {item.name.includes("Oil") && "🛢️"}
                                                    {item.name.includes("Device") && "🩺"}
                                                    {item.name.includes("Delivery") && "🚚"}
                                                    {item.name.includes("Consultation") && "👨‍⚕️"}
                                                </>
                                            )}
                                        </div>
                                        <div className="product-details">
                                            <h4 className="product-name">{item.name}</h4>
                                            <div className="product-meta">
                                                <span className={`product-availability ${item.availability === "In Stock" ? "in-stock" : item.availability === "Limited Stock" ? "limited-stock" : "out-of-stock"}`}>
                                                    {item.availability === "In Stock" && "✅ "}
                                                    {item.availability === "Limited Stock" && "⚠️ "}
                                                    {item.availability === "Out of Stock" && "❌ "}
                                                    {item.availability}
                                                </span>
                                                <span className="product-price">₹{item.price}</span>
                                            </div>
                                            {/* Show stock information instead of cart */}
                                            {/* <div className="stock-info">
                                                {item.stockCount && (
                                                    <span className="stock-count">
                                                        📦 {item.stockCount} units available
                                                    </span>
                                                )}
                                                {item.expiryDate && (
                                                    <span className="expiry-info">
                                                        📅 Exp: {new Date(item.expiryDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div> */}
                                        </div>
                                        <div className="product-info-actions">
                                            {/* <div className="availability-badge">
                                                {item.availability === "In Stock" && <span className="badge in-stock">Available</span>}
                                                {item.availability === "Limited Stock" && <span className="badge limited-stock">Limited</span>}
                                                {item.availability === "Out of Stock" && <span className="badge out-of-stock">Out of Stock</span>}
                                                {item.availability === "24/7 Available" && <span className="badge always-available">24/7</span>}
                                            </div> */}
                                            <div className="contact-info">
                                                <small>📞 Call to confirm availability</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <h2>Reviews</h2>
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
                                ) : reviews.length === 0 ? (
                                    <div className="no-reviews">No reviews yet. Be the first to review!</div>
                                ) : (
                                    <div className="review-tabs" ref={reviewContainerRef}>
                                        {reviews.map((review, index) => (
                                            <div key={index} className="review-card">
                                                <div className="review-stars">{"⭐".repeat(review.rating || 0)}</div>
                                                <h4>{review.text || 'No review text provided'}</h4>
                                                <div>
                                                    <p>{review.userName || 'Anonymous User'}</p>
                                                    <p className="review-date">
                                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available'}
                                                    </p>
                                                </div>
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
                        {/* Show coordinates if available from backend */}
                        {(selectedMedicalshop.latitude && selectedMedicalshop.longitude) && (
                            <div className="shop-coordinates" style={{ marginTop: '10px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
                                <small>Coordinates: {selectedMedicalshop.latitude.toFixed(6)}, {selectedMedicalshop.longitude.toFixed(6)}</small>
                            </div>
                        )}
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
                                <p>📞 {displayData.phone || displayData.ownerPhone || 'Phone not available'}</p>
                            </div>
                        )}
                        <div className="store-info">
                            <p>🏬 Store pick-up available</p>
                            <p>🕒 Open until {displayData.closingTime || '10:00 PM'}</p>
                        </div>
                        <p className="location-info">
                            📍 {displayData.location || 'Location not available'}{" "}
                            <a style={{ color: "#008b95", marginLeft: "1%" }} href={displayData.directionsLink || '#'} target="_blank" rel="noreferrer">
                                Get directions
                            </a>
                        </p>
                        {/* Owner/Admin Info in booking card */}
                        {(displayData.ownerName || displayData.ownerPhone || displayData.ownerEmail) && (
                            <div className="medicalshop-owner-info" style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #ddd', borderRadius: '5px' }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Owner/Manager Contact</h4>
                                {displayData.ownerName && <p style={{ margin: '5px 0', fontSize: '13px' }}>👤 {displayData.ownerName}</p>}
                                {displayData.ownerPhone && <p style={{ margin: '5px 0', fontSize: '13px' }}>📞 {displayData.ownerPhone}</p>}
                                {displayData.ownerEmail && <p style={{ margin: '5px 0', fontSize: '13px' }}>✉️ {displayData.ownerEmail}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalshopDetails;