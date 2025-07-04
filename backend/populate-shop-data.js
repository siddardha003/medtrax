const mongoose = require('mongoose');
const Shop = require('./src/models/Shop');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medtrax');

const medicalShopsData = [
    {
        name: "Apollo Pharmacy",
        description: "Your trusted neighborhood pharmacy with 24/7 service and home delivery. We stock all types of medicines, health supplements, and medical devices.",
        ownerName: "Dr. Rajesh Kumar",
        phone: "+919876543210",
        contactEmail: "apollo@medtrax.com",
        address: {
            street: "123 Health Street",
            city: "Hyderabad",
            state: "Telangana",
            zipCode: "500001",
            country: "India"
        },
        services: [
            "Prescription Medicines",
            "OTC Medicines",
            "Health Supplements",
            "Medical Devices",
            "Home Delivery",
            "24/7 Service"
        ],
        specialties: [
            "Prescription Drugs",
            "Over-the-Counter Medicines",
            "Ayurvedic Products",
            "Homeopathic Medicines",
            "Baby Care Products",
            "Elderly Care"
        ],
        facilities: [
            "Air Conditioned",
            "Wheelchair Accessible",
            "Parking Available",
            "Online Ordering",
            "Home Delivery",
            "Insurance Accepted"
        ],
        operatingHours: {
            monday: "8:00 AM - 10:00 PM",
            tuesday: "8:00 AM - 10:00 PM",
            wednesday: "8:00 AM - 10:00 PM",
            thursday: "8:00 AM - 10:00 PM",
            friday: "8:00 AM - 10:00 PM",
            saturday: "8:00 AM - 10:00 PM",
            sunday: "9:00 AM - 9:00 PM"
        },
        rating: 4.4,
        totalReviews: 259,
        website: "https://apollopharmacy.in",
        licenseNumber: "AP-PH-2024-001",
        establishedYear: 2015,
        images: [
            "https://www.apollopharmacy.in/cdn/shop/files/Store_1200x.jpg",
            "https://www.apollopharmacy.in/cdn/shop/files/Store_2_1200x.jpg",
            "https://www.apollopharmacy.in/cdn/shop/files/Store_3_1200x.jpg"
        ],
        isActive: true,
        adminEmail: "apollo.admin@medtrax.com"
    },
    {
        name: "MedPlus Pharmacy",
        description: "Quality medicines at affordable prices. Your health is our priority with experienced pharmacists and genuine products.",
        ownerName: "Dr. Priya Sharma",
        phone: "+919876543211",
        contactEmail: "medplus@medtrax.com",
        address: {
            street: "456 Medical Avenue",
            city: "Bangalore",
            state: "Karnataka",
            zipCode: "560001",
            country: "India"
        },
        services: [
            "Prescription Medicines",
            "Generic Medicines",
            "Health Checkups",
            "Vaccination",
            "Medicine Delivery",
            "Health Consultation"
        ],
        specialties: [
            "Generic Medicines",
            "Diabetic Care",
            "Cardiac Care",
            "Respiratory Care",
            "Pain Management",
            "Skin Care"
        ],
        facilities: [
            "Air Conditioned",
            "Digital Payment",
            "Medicine Reminder Service",
            "Health Monitoring",
            "Free Consultation",
            "Emergency Service"
        ],
        operatingHours: {
            monday: "7:00 AM - 11:00 PM",
            tuesday: "7:00 AM - 11:00 PM",
            wednesday: "7:00 AM - 11:00 PM",
            thursday: "7:00 AM - 11:00 PM",
            friday: "7:00 AM - 11:00 PM",
            saturday: "7:00 AM - 11:00 PM",
            sunday: "8:00 AM - 10:00 PM"
        },
        rating: 4.2,
        totalReviews: 189,
        website: "https://medplusmart.com",
        licenseNumber: "KA-PH-2024-002",
        establishedYear: 2018,
        images: [
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop"
        ],
        isActive: true,
        adminEmail: "medplus.admin@medtrax.com"
    },
    {
        name: "HealthFirst Pharmacy",
        description: "Modern pharmacy with latest medical equipment and comprehensive healthcare solutions. Serving the community since 2010.",
        ownerName: "Dr. Amit Patel",
        phone: "+919876543212",
        contactEmail: "healthfirst@medtrax.com",
        address: {
            street: "789 Wellness Road",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India"
        },
        services: [
            "All Medicines",
            "Medical Equipment",
            "Health Supplements",
            "Baby Products",
            "Elderly Care",
            "Surgical Items"
        ],
        specialties: [
            "Medical Equipment",
            "Surgical Supplies",
            "Physiotherapy Products",
            "Orthopedic Care",
            "Women's Health",
            "Child Care"
        ],
        facilities: [
            "Latest Equipment",
            "Trained Staff",
            "Quality Assurance",
            "Fast Service",
            "Competitive Prices",
            "Customer Support"
        ],
        operatingHours: {
            monday: "8:30 AM - 9:30 PM",
            tuesday: "8:30 AM - 9:30 PM",
            wednesday: "8:30 AM - 9:30 PM",
            thursday: "8:30 AM - 9:30 PM",
            friday: "8:30 AM - 9:30 PM",
            saturday: "8:30 AM - 9:30 PM",
            sunday: "9:00 AM - 8:00 PM"
        },
        rating: 4.6,
        totalReviews: 342,
        website: "https://healthfirstpharmacy.com",
        licenseNumber: "MH-PH-2024-003",
        establishedYear: 2010,
        images: [
            "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1582560475093-ba66acc2aace?w=400&h=300&fit=crop"
        ],
        isActive: true,
        adminEmail: "healthfirst.admin@medtrax.com"
    },
    {
        name: "Care Plus Pharmacy",
        description: "Dedicated to providing quality healthcare products and services with a personal touch. Expert advice from qualified pharmacists.",
        ownerName: "Dr. Sunita Reddy",
        phone: "+919876543213",
        contactEmail: "careplus@medtrax.com",
        address: {
            street: "321 Care Street",
            city: "Chennai",
            state: "Tamil Nadu",
            zipCode: "600001",
            country: "India"
        },
        services: [
            "Prescription Filling",
            "Health Screening",
            "Immunization",
            "Medicine Counseling",
            "Chronic Care",
            "Wellness Programs"
        ],
        specialties: [
            "Chronic Disease Management",
            "Immunization Services",
            "Health Screening",
            "Nutrition Counseling",
            "Medication Therapy",
            "Wellness Coaching"
        ],
        facilities: [
            "Private Consultation",
            "Health Monitoring",
            "Medication Sync",
            "Refill Reminders",
            "Insurance Billing",
            "Loyalty Program"
        ],
        operatingHours: {
            monday: "8:00 AM - 10:00 PM",
            tuesday: "8:00 AM - 10:00 PM",
            wednesday: "8:00 AM - 10:00 PM",
            thursday: "8:00 AM - 10:00 PM",
            friday: "8:00 AM - 10:00 PM",
            saturday: "8:00 AM - 10:00 PM",
            sunday: "9:00 AM - 8:00 PM"
        },
        rating: 4.3,
        totalReviews: 156,
        website: "https://carepluspharmacy.com",
        licenseNumber: "TN-PH-2024-004",
        establishedYear: 2016,
        images: [
            "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        ],
        isActive: true,
        adminEmail: "careplus.admin@medtrax.com"
    },
    {
        name: "MediCare Pharmacy",
        description: "Comprehensive pharmacy services with focus on patient care and medication management. Your trusted healthcare partner.",
        ownerName: "Dr. Vikram Singh",
        phone: "+919876543214",
        contactEmail: "medicare@medtrax.com",
        address: {
            street: "567 Health Plaza",
            city: "Delhi",
            state: "Delhi",
            zipCode: "110001",
            country: "India"
        },
        services: [
            "Full Pharmacy Services",
            "Compounding",
            "Medical Supplies",
            "Health Products",
            "Delivery Service",
            "Insurance Support"
        ],
        specialties: [
            "Compounding Services",
            "Specialty Medications",
            "Bio-identical Hormones",
            "Veterinary Medicines",
            "Travel Medicine",
            "Clinical Services"
        ],
        facilities: [
            "Compounding Lab",
            "Sterile Preparation",
            "Clinical Consultation",
            "Medication Reviews",
            "Adherence Programs",
            "Specialized Storage"
        ],
        operatingHours: {
            monday: "7:30 AM - 10:30 PM",
            tuesday: "7:30 AM - 10:30 PM",
            wednesday: "7:30 AM - 10:30 PM",
            thursday: "7:30 AM - 10:30 PM",
            friday: "7:30 AM - 10:30 PM",
            saturday: "7:30 AM - 10:30 PM",
            sunday: "8:30 AM - 9:30 PM"
        },
        rating: 4.5,
        totalReviews: 278,
        website: "https://medicarepharmacy.com",
        licenseNumber: "DL-PH-2024-005",
        establishedYear: 2012,
        images: [
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop"
        ],
        isActive: true,
        adminEmail: "medicare.admin@medtrax.com"
    }
];

async function populateShopsData() {
    try {
        

        // Clear existing shop data
        await Shop.deleteMany({});
        

        // Create shops and their admin users
        for (let i = 0; i < medicalShopsData.length; i++) {
            const shopData = medicalShopsData[i];
            
            // Create shop admin user
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            const adminUser = new User({
                firstName: shopData.ownerName.split(' ')[1] || shopData.ownerName,
                lastName: shopData.ownerName.split(' ')[0] || 'Admin',
                email: shopData.adminEmail,
                password: hashedPassword,
                role: 'shop_admin',
                phone: shopData.phone,
                isActive: true
            });

            const savedUser = await adminUser.save();
            

            // Create shop with admin reference
            const shop = new Shop({
                name: shopData.name,
                description: shopData.description,
                ownerName: shopData.ownerName,
                phone: shopData.phone,
                contactEmail: shopData.contactEmail,
                address: shopData.address,
                services: shopData.services,
                specialties: shopData.specialties,
                facilities: shopData.facilities,
                operatingHours: shopData.operatingHours,
                rating: shopData.rating,
                totalReviews: shopData.totalReviews,
                website: shopData.website,
                licenseNumber: shopData.licenseNumber,
                establishedYear: shopData.establishedYear,
                images: shopData.images,
                isActive: shopData.isActive,
                adminId: savedUser._id,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const savedShop = await shop.save();
            

            // Update user with shopId
            savedUser.shopId = savedShop._id;
            await savedUser.save();
            
        }

        
        
        
        
        // Display summary
        const shops = await Shop.find({}).populate('adminId', 'firstName lastName email');
        
        

    } catch (error) {
        console.error('❌ Error populating shops data:', error);
    } finally {
        mongoose.connection.close();
        
    }
}

populateShopsData();
