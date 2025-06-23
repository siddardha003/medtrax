const mongoose = require('mongoose');
const Shop = require('./src/models/Shop');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medtrax');

const shopsData = [
    {
        name: 'Apollo Pharmacy',
        licenseNumber: 'DL001234567890',
        email: 'apollo.bhimavaram@apollopharmacy.in',
        phone: '+919876543210',
        address: {
            street: '123 Main Street, Bhimavaram',
            city: 'Bhimavaram',
            state: 'Andhra Pradesh',
            zipCode: '534201',
            country: 'India'
        },
        type: 'pharmacy',
        establishedYear: 2010,
        operatingHours: {
            monday: { start: '08:00', end: '22:00', isClosed: false },
            tuesday: { start: '08:00', end: '22:00', isClosed: false },
            wednesday: { start: '08:00', end: '22:00', isClosed: false },
            thursday: { start: '08:00', end: '22:00', isClosed: false },
            friday: { start: '08:00', end: '22:00', isClosed: false },
            saturday: { start: '08:00', end: '22:00', isClosed: false },
            sunday: { start: '09:00', end: '21:00', isClosed: false }
        },
        services: [
            'prescription_dispensing',
            'otc_medicines',
            'health_supplements',
            'medical_devices',
            'home_delivery'
        ],
        license: {
            number: 'DL001234567890',
            type: 'drug_license',
            issueDate: new Date('2020-01-01'),
            expiryDate: new Date('2025-12-31'),
            issuingAuthority: 'Andhra Pradesh Drug Control Authority'
        },
        gstNumber: '37ABCDE1234F1Z5',
        owner: {
            name: 'Dr. Ramesh Kumar',
            qualification: 'B.Pharm, M.Pharm',
            phone: '+919876543210',
            email: 'ramesh.kumar@apollopharmacy.in',
            pharmacistLicense: 'PL001234'
        },
        website: 'https://www.apollopharmacy.in',
        description: 'Leading pharmacy chain providing quality medicines and healthcare products',
        paymentMethods: ['cash', 'card', 'upi', 'net_banking'],
        isActive: true,
        isVerified: true,
        // Additional fields for frontend display
        rating: 4.4,
        reviewsCount: 259,
        closingTime: '10:00 PM',
        location: 'Bhimavaram, West Godavari',
        directionsLink: 'https://maps.google.com',
        images: [
            'https://www.apollopharmacy.in/cdn/shop/files/Store_1200x.jpg?v=1614323335',
            'https://www.apollopharmacy.in/cdn/shop/files/Store_2_1200x.jpg?v=1614323335',
            'https://www.apollopharmacy.in/cdn/shop/files/Store_3_1200x.jpg?v=1614323335',
            'https://www.apollopharmacy.in/cdn/shop/files/Store_4_1200x.jpg?v=1614323335'
        ]
    },
    {
        name: 'MedPlus Pharmacy',
        licenseNumber: 'DL001234567891',
        email: 'medplus.hyderabad@medplus.in',
        phone: '+919876543211',
        address: {
            street: '456 Banjara Hills Road',
            city: 'Hyderabad',
            state: 'Telangana',
            zipCode: '500034',
            country: 'India'
        },
        type: 'pharmacy',
        establishedYear: 2012,
        operatingHours: {
            monday: { start: '08:00', end: '23:00', isClosed: false },
            tuesday: { start: '08:00', end: '23:00', isClosed: false },
            wednesday: { start: '08:00', end: '23:00', isClosed: false },
            thursday: { start: '08:00', end: '23:00', isClosed: false },
            friday: { start: '08:00', end: '23:00', isClosed: false },
            saturday: { start: '08:00', end: '23:00', isClosed: false },
            sunday: { start: '09:00', end: '22:00', isClosed: false }
        },
        services: [
            'prescription_dispensing',
            'otc_medicines',
            'health_supplements',
            'baby_care',
            'home_delivery'
        ],
        license: {
            number: 'DL001234567891',
            type: 'drug_license',
            issueDate: new Date('2020-02-01'),
            expiryDate: new Date('2025-12-31'),
            issuingAuthority: 'Telangana Drug Control Authority'
        },
        gstNumber: '36ABCDE1234F1Z6',
        owner: {
            name: 'Dr. Priya Sharma',
            qualification: 'B.Pharm',
            phone: '+919876543211',
            email: 'priya.sharma@medplus.in',
            pharmacistLicense: 'PL001235'
        },
        website: 'https://www.medplus.in',
        description: 'Trusted pharmacy chain with wide range of medicines and healthcare products',
        paymentMethods: ['cash', 'card', 'upi', 'digital_wallet'],
        isActive: true,
        isVerified: true,
        // Additional fields for frontend display
        rating: 4.2,
        reviewsCount: 189,
        closingTime: '11:00 PM',
        location: 'Hyderabad, Telangana',
        directionsLink: 'https://maps.google.com',
        images: [
            'https://images.livemint.com/img/2021/07/22/600x338/medplus_1626947532076_1626947532292.jpg',
            'https://content.jdmagicbox.com/comp/hyderabad/c7/040pxx40.xx40.180122131051.t7c7/catalogue/medplus-pharmacy-ameerpet-hyderabad-chemists-2o4g2m9ue9.jpg'
        ]
    },
    {
        name: 'Guardian Pharmacy',
        licenseNumber: 'DL001234567892',
        email: 'guardian.mumbai@guardian.in',
        phone: '+919876543212',
        address: {
            street: '789 Linking Road, Bandra',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400050',
            country: 'India'
        },
        type: 'pharmacy',
        establishedYear: 2008,
        operatingHours: {
            monday: { start: '08:00', end: '21:00', isClosed: false },
            tuesday: { start: '08:00', end: '21:00', isClosed: false },
            wednesday: { start: '08:00', end: '21:00', isClosed: false },
            thursday: { start: '08:00', end: '21:00', isClosed: false },
            friday: { start: '08:00', end: '21:00', isClosed: false },
            saturday: { start: '08:00', end: '21:00', isClosed: false },
            sunday: { start: '09:00', end: '20:00', isClosed: false }
        },
        services: [
            'prescription_dispensing',
            'otc_medicines',
            'medical_devices',
            'home_delivery'
        ],
        license: {
            number: 'DL001234567892',
            type: 'drug_license',
            issueDate: new Date('2020-03-01'),
            expiryDate: new Date('2025-12-31'),
            issuingAuthority: 'Maharashtra Drug Control Authority'
        },
        gstNumber: '27ABCDE1234F1Z7',
        owner: {
            name: 'Dr. Amit Patel',
            qualification: 'B.Pharm, MBA',
            phone: '+919876543212',
            email: 'amit.patel@guardian.in',
            pharmacistLicense: 'PL001236'
        },
        website: 'https://www.guardian.in',
        description: 'Premium pharmacy with focus on quality and customer service',
        paymentMethods: ['cash', 'card', 'upi'],
        isActive: true,
        isVerified: true,
        // Additional fields for frontend display
        rating: 4.1,
        reviewsCount: 156,
        closingTime: '9:00 PM',
        location: 'Mumbai, Maharashtra',
        directionsLink: 'https://maps.google.com',
        images: [
            'https://via.placeholder.com/400x300?text=Guardian+Pharmacy'
        ]
    },
    {
        name: 'Wellness Forever',
        licenseNumber: 'DL001234567893',
        email: 'wellness.pune@wellnessforever.in',
        phone: '+919876543213',
        address: {
            street: '321 FC Road, Pune',
            city: 'Pune',
            state: 'Maharashtra',
            zipCode: '411005',
            country: 'India'
        },
        type: 'pharmacy',
        establishedYear: 2015,
        operatingHours: {
            monday: { start: '08:00', end: '22:30', isClosed: false },
            tuesday: { start: '08:00', end: '22:30', isClosed: false },
            wednesday: { start: '08:00', end: '22:30', isClosed: false },
            thursday: { start: '08:00', end: '22:30', isClosed: false },
            friday: { start: '08:00', end: '22:30', isClosed: false },
            saturday: { start: '08:00', end: '22:30', isClosed: false },
            sunday: { start: '09:00', end: '21:30', isClosed: false }
        },
        services: [
            'prescription_dispensing',
            'otc_medicines',
            'health_supplements',
            'baby_care',
            'elderly_care',
            'home_delivery'
        ],
        license: {
            number: 'DL001234567893',
            type: 'drug_license',
            issueDate: new Date('2020-04-01'),
            expiryDate: new Date('2025-12-31'),
            issuingAuthority: 'Maharashtra Drug Control Authority'
        },
        gstNumber: '27ABCDE1234F1Z8',
        owner: {
            name: 'Dr. Sunita Reddy',
            qualification: 'B.Pharm, D.Pharm',
            phone: '+919876543213',
            email: 'sunita.reddy@wellnessforever.in',
            pharmacistLicense: 'PL001237'
        },
        website: 'https://www.wellnessforever.in',
        description: 'Complete wellness solution with medicines, supplements and health products',
        paymentMethods: ['cash', 'card', 'upi', 'net_banking', 'digital_wallet'],
        isActive: true,
        isVerified: true,
        // Additional fields for frontend display
        rating: 4.3,
        reviewsCount: 203,
        closingTime: '10:30 PM',
        location: 'Pune, Maharashtra',
        directionsLink: 'https://maps.google.com',
        images: [
            'https://via.placeholder.com/400x300?text=Wellness+Forever'
        ]
    },
    {
        name: 'Netmeds Pharmacy',
        licenseNumber: 'DL001234567894',
        email: 'netmeds.chennai@netmeds.in',
        phone: '+919876543214',
        address: {
            street: '654 Anna Salai, T.Nagar',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600017',
            country: 'India'
        },
        type: 'pharmacy',
        establishedYear: 2018,
        operatingHours: {
            monday: { start: '08:00', end: '20:00', isClosed: false },
            tuesday: { start: '08:00', end: '20:00', isClosed: false },
            wednesday: { start: '08:00', end: '20:00', isClosed: false },
            thursday: { start: '08:00', end: '20:00', isClosed: false },
            friday: { start: '08:00', end: '20:00', isClosed: false },
            saturday: { start: '08:00', end: '20:00', isClosed: false },
            sunday: { start: '09:00', end: '19:00', isClosed: false }
        },
        services: [
            'prescription_dispensing',
            'otc_medicines',
            'health_supplements',
            'online_consultation',
            'home_delivery'
        ],
        license: {
            number: 'DL001234567894',
            type: 'drug_license',
            issueDate: new Date('2020-05-01'),
            expiryDate: new Date('2025-12-31'),
            issuingAuthority: 'Tamil Nadu Drug Control Authority'
        },
        gstNumber: '33ABCDE1234F1Z9',
        owner: {
            name: 'Dr. Rajesh Kumar',
            qualification: 'B.Pharm, M.Pharm',
            phone: '+919876543214',
            email: 'rajesh.kumar@netmeds.in',
            pharmacistLicense: 'PL001238'
        },
        website: 'https://www.netmeds.in',
        description: 'Digital-first pharmacy with online consultation and home delivery services',
        paymentMethods: ['cash', 'card', 'upi', 'net_banking', 'digital_wallet'],
        isActive: true,
        isVerified: true,
        // Additional fields for frontend display
        rating: 4.0,
        reviewsCount: 134,
        closingTime: '8:00 PM',
        location: 'Chennai, Tamil Nadu',
        directionsLink: 'https://maps.google.com',
        images: [
            'https://via.placeholder.com/400x300?text=Netmeds+Pharmacy'
        ]
    }
];

async function populateShopsData() {
    try {
        console.log('🏥 Starting to populate medical shops data...');
        
        // Clear existing shop data
        await Shop.deleteMany({});
        console.log('🗑️ Cleared existing shop data');        // Create a super admin user to use as createdBy
        const superAdminData = {
            firstName: 'Super',
            lastName: 'Admin',
            email: 'super.admin@medtrax.com',
            password: await bcrypt.hash('SuperAdmin123!', 10),
            role: 'super_admin',
            phone: '+919999999999',
            isActive: true,
            isEmailVerified: true
        };

        let superAdmin = await User.findOne({ email: superAdminData.email });
        if (!superAdmin) {
            superAdmin = await User.create(superAdminData);
            console.log('👤 Created super admin user');
        }

        // Create shops and their admin users
        for (const shopData of shopsData) {            // Create shop admin user
            const adminUserData = {
                firstName: shopData.owner.name.split(' ')[0] || 'Shop',
                lastName: shopData.owner.name.split(' ').slice(1).join(' ') || 'Admin',
                email: shopData.email,
                password: await bcrypt.hash('ShopAdmin123!', 10),
                role: 'shop_admin',
                phone: shopData.phone,
                isActive: true,
                isEmailVerified: true
            };

            let adminUser = await User.findOne({ email: adminUserData.email });
            if (!adminUser) {
                adminUser = await User.create(adminUserData);
                console.log(`👤 Created admin user for ${shopData.name}`);
            }

            // Create shop with createdBy reference
            const shop = await Shop.create({
                ...shopData,
                createdBy: superAdmin._id,
                adminId: adminUser._id
            });

            console.log(`🏪 Created shop: ${shop.name}`);
        }

        console.log('✅ Successfully populated shops data');

    } catch (error) {
        console.error('❌ Error populating shops data:', error);
    } finally {
        console.log('🔐 Database connection closed');
        mongoose.connection.close();
    }
}

// Run the script
populateShopsData();
