
import React, { useState } from "react";
import "../css/example.css";

const HospitalBooking = () => {
  // Dummy hospital data
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
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg", // Secondary image 2
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
          { name: "Teeth Cleaning", duration: "45 mins", price: 150 },
          { name: "Cavity Filling", duration: "1 hr", price: 300 },
          { name: "Teeth Cleaning", duration: "45 mins", price: 150 },
          { name: "Cavity Filling", duration: "1 hr", price: 300 },
        ],
      },
    ],
  };

  const [selectedService, setSelectedService] = useState(0); // Default tab
  const [reviews, setReviews] = useState([
    {
      name: "Ciara",
      location: "Los Angeles, USA",
      review: "Great way to discover new salons. Recently moved to a new city and didn't know any salons. Fresha gave me a whole new list to choose from!",
      stars: 5,
    },
    {
      name: "Jonny",
      location: "Melbourne, Australia",
      review: "Such a sleek and powerful app. I highly recommend booking your appointments on Fresha.",
      stars: 5,
    },
    {
      name: "Anton",
      location: "Los Angeles, USA",
      review: "My clients love booking appointments online with Fresha. The consultation forms and free SMS reminders are so convenient.",
      stars: 5,
    },
    {
      name: "Susan",
      location: "Brisbane, Australia",
      review: "Love this beauty booking app. There are so many great features to explore. The consultation forms and client reminder texts are great – best of all, it's free.",
      stars: 5,
    },
  ]);

  const [newReview, setNewReview] = useState({ name: "", location: "", review: "", stars: 5 });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleAddReview = () => {
    if (newReview.name && newReview.location && newReview.review) {
      setReviews([newReview, ...reviews]);
      setNewReview({ name: "", location: "", review: "", stars: 5 });
    }
  };

  return (
    <div className="hospital-ui">
      {/* Header */}
      <div className="hospital-header">
        <h1>{hospitalData.name}</h1>
        <div className="rating">⭐ {hospitalData.rating} ({hospitalData.reviewsCount})</div>
        <p className="hospital-timing">🕒 Open until {hospitalData.closingTime}</p>
        <p className="hospital-location">
          📍 {hospitalData.location}{" "}
          <a href={hospitalData.directionsLink} target="_blank" rel="noreferrer">
            Get directions
          </a>
        </p>
      </div>
  
      {/* Images Section */}
      <div className="hospital-images">
        <img src={hospitalData.images[0]} alt="Main" className="main-image" />
        <div className="image-grid">
          <img src={hospitalData.images[1]} alt="Secondary 1" />
          <img src={hospitalData.images[2]} alt="Secondary 2" />
        </div>
      </div>
  
      {/* Services Section */}
      <div className="services-booking">
        <div className="services-section">
          <h2>Services</h2>
          <div className="service-tabs">
            {hospitalData.services.map((serviceType, index) => (
              <button
                key={index}
                className={`tab ${selectedService === index ? "active" : ""}`}
                onClick={() => setSelectedService(index)}
              >
                {serviceType.category}
              </button>
            ))}
          </div>
  
            {hospitalData.services[selectedService]?.items.map((service, idx) => (
              <div key={idx} className="service-item">
                <div>
                  <h4>{service.name}</h4>
                  <p>{service.duration}</p>
                </div>
                <div className="service-book">
                  <span>AED {service.price}</span>
                  <button className="book-btn">Book</button>
                </div>
              </div>
            ))}
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
  
      {/* Reviews Section - Moved Below Services */}
      <div className="reviews-section">
        <h2>Reviews</h2>
  
        {/* Display Reviews */}
        <div className="reviews-container">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-stars">{"⭐".repeat(review.stars)}</div>
              <h4>{review.review}</h4>
              <p>{review.name}</p>
              <p>{review.location}</p>
            </div>
          ))}
        </div>
  
        {/* Add Review Section */}
        <div className="add-review">
          <h3>Add a Review</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={newReview.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Your Location"
            value={newReview.location}
            onChange={handleInputChange}
          />
          <textarea
            name="review"
            placeholder="Your Review"
            value={newReview.review}
            onChange={handleInputChange}
          />
          <button onClick={handleAddReview}>Submit Review</button>
        </div>
      </div>
    </div>
  );
}  
export default HospitalBooking;