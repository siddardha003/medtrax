const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Hospital = require('../src/models/Hospital');
const Shop = require('../src/models/Shop');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

// User Schema (inline for seeding)
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['super_admin', 'hospital_admin', 'shop_admin'],
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        default: null
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Seed Super Admin
const seedSuperAdmin = async () => {
    try {
        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
        
        if (existingSuperAdmin) {
            
            
            
            
            return existingSuperAdmin;
        }        // Create default super admin
        const superAdminData = {
            email: 'admin@medtrax.com',
            password: 'Admin@123', // Change this in production
            role: 'super_admin',
            firstName: 'System',
            lastName: 'Administrator',
            phone: '919999999999', // Fixed phone format
            isActive: true
        };

        const superAdmin = await User.create(superAdminData);

        
        
        
        
        
        return superAdmin;

    } catch (error) {
        console.error('❌ Error creating super admin:', error.message);
        
        if (error.code === 11000) {
            
        }
        return null;
    }
};

// Seed sample data (optional)
const seedSampleData = async () => {
    try {
        
        
        // First create super admin to use as createdBy
        const superAdmin = await seedSuperAdmin();
        if (!superAdmin) {
            const existingAdmin = await User.findOne({ role: 'super_admin' });
            if (!existingAdmin) {
                throw new Error('Could not find or create super admin');
            }
        }
        const adminUser = await User.findOne({ role: 'super_admin' });
        
        // Sample Hospitals Data
        const hospitalsData = [
            {
                name: "City General Hospital",
                registrationNumber: "CGH001",
                email: "admin@citygeneral.com",
                phone: "919876543210", // Fixed phone format
                address: {
                    street: "123 Main Street",
                    city: "Mumbai",
                    state: "Maharashtra",
                    zipCode: "400001",
                    country: "India"
                },
                type: "multispecialty", // Required field
                establishedYear: 2010,
                bedCapacity: 200,
                departments: ["cardiology", "neurology", "pediatrics", "emergency"],
                contactPerson: {
                    name: "Dr. Rajesh Kumar", // Required field
                    designation: "Chief Medical Officer",
                    phone: "919876543211",
                    email: "cmo@citygeneral.com"
                },
                operatingHours: {
                    monday: { start: "08:00", end: "20:00", is24Hours: false },
                    tuesday: { start: "08:00", end: "20:00", is24Hours: false },
                    wednesday: { start: "08:00", end: "20:00", is24Hours: false },
                    thursday: { start: "08:00", end: "20:00", is24Hours: false },
                    friday: { start: "08:00", end: "20:00", is24Hours: false },
                    saturday: { start: "09:00", end: "18:00", is24Hours: false },
                    sunday: { start: "10:00", end: "16:00", is24Hours: false }
                },
                website: "https://citygeneral.com",
                description: "Premier healthcare facility with state-of-the-art equipment and experienced medical professionals.",
                isActive: true,
                isVerified: true,
                createdBy: adminUser._id // Required field
            },
            {
                name: "Apollo Health Center",
                registrationNumber: "AHC002",
                email: "info@apollohealth.com",
                phone: "919876543220",
                address: {
                    street: "456 Medical Plaza",
                    city: "Delhi",
                    state: "Delhi",
                    zipCode: "110001",
                    country: "India"
                },
                type: "general",
                establishedYear: 2005,
                bedCapacity: 150,
                departments: ["orthopedics", "gynecology", "dermatology", "general_medicine"],
                contactPerson: {
                    name: "Dr. Priya Sharma",
                    designation: "Medical Director",
                    phone: "919876543221",
                    email: "director@apollohealth.com"
                },
                operatingHours: {
                    monday: { start: "07:00", end: "21:00", is24Hours: false },
                    tuesday: { start: "07:00", end: "21:00", is24Hours: false },
                    wednesday: { start: "07:00", end: "21:00", is24Hours: false },
                    thursday: { start: "07:00", end: "21:00", is24Hours: false },
                    friday: { start: "07:00", end: "21:00", is24Hours: false },
                    saturday: { start: "08:00", end: "19:00", is24Hours: false },
                    sunday: { start: "09:00", end: "17:00", is24Hours: false }
                },
                website: "https://apollohealth.com",
                description: "Comprehensive healthcare services with modern technology and compassionate care.",
                isActive: true,
                isVerified: true,
                createdBy: adminUser._id
            },
            {
                name: "Sunshine Medical Center",
                registrationNumber: "SMC003",
                email: "contact@sunshine.com",
                phone: "919876543230",
                address: {
                    street: "789 Health Avenue",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "560001",
                    country: "India"
                },
                type: "specialty",
                establishedYear: 2015,
                bedCapacity: 75,
                departments: ["psychiatry", "dentistry", "ophthalmology", "ent"],
                contactPerson: {
                    name: "Dr. Amit Gupta",
                    designation: "Administrator",
                    phone: "919876543231",
                    email: "admin@sunshine.com"
                },
                operatingHours: {
                    monday: { start: "09:00", end: "18:00", is24Hours: false },
                    tuesday: { start: "09:00", end: "18:00", is24Hours: false },
                    wednesday: { start: "09:00", end: "18:00", is24Hours: false },
                    thursday: { start: "09:00", end: "18:00", is24Hours: false },
                    friday: { start: "09:00", end: "18:00", is24Hours: false },
                    saturday: { start: "10:00", end: "16:00", is24Hours: false },
                    sunday: { start: "", end: "", is24Hours: false }
                },
                website: "https://sunshine.com",
                description: "Specialized care for mental health, dental care, and rehabilitation services.",
                isActive: true,
                isVerified: true,
                createdBy: adminUser._id
            }
        ];        // Sample Medical Shops Data
        const shopsData = [
            {
                name: "HealthPlus Pharmacy",
                licenseNumber: "HP001LIC",
                email: "admin@healthplus.com",
                phone: "919876543240",
                address: {
                    street: "101 Pharmacy Street",
                    city: "Mumbai",
                    state: "Maharashtra",
                    zipCode: "400002",
                    country: "India"
                },
                shopType: "retail",
                establishedYear: 2018,
                operatingHours: {
                    monday: { start: "08:00", end: "22:00", is24Hours: false },
                    tuesday: { start: "08:00", end: "22:00", is24Hours: false },
                    wednesday: { start: "08:00", end: "22:00", is24Hours: false },
                    thursday: { start: "08:00", end: "22:00", is24Hours: false },
                    friday: { start: "08:00", end: "22:00", is24Hours: false },
                    saturday: { start: "09:00", end: "21:00", is24Hours: false },
                    sunday: { start: "10:00", end: "20:00", is24Hours: false }
                },
                license: {
                    number: "DL001HP2024",
                    type: "drug_license",
                    issueDate: new Date("2024-01-01"),
                    expiryDate: new Date("2026-12-31"),
                    issuingAuthority: "Maharashtra Drug Control Authority"
                },
                owner: {
                    name: "Mr. Ramesh Patel",
                    qualification: "B.Pharm",
                    phone: "919876543241",
                    email: "ramesh@healthplus.com",
                    pharmacistLicense: "PH001RP"
                },
                website: "https://healthplus.com",
                description: "Your trusted neighborhood pharmacy with 24/7 service and home delivery.",
                paymentMethods: ["cash", "card", "upi", "digital_wallet"],
                isActive: true,
                isVerified: true,
                createdBy: adminUser._id
            },
            {
                name: "MediCare Pharmacy",
                licenseNumber: "MP002LIC",
                email: "info@medicare.com",
                phone: "919876543250",
                address: {
                    street: "202 Medical Complex",
                    city: "Delhi",
                    state: "Delhi",
                    zipCode: "110002",
                    country: "India"
                },
                shopType: "retail",
                establishedYear: 2015,
                operatingHours: {
                    monday: { start: "08:00", end: "22:00", is24Hours: false },
                    tuesday: { start: "08:00", end: "22:00", is24Hours: false },
                    wednesday: { start: "08:00", end: "22:00", is24Hours: false },
                    thursday: { start: "08:00", end: "22:00", is24Hours: false },
                    friday: { start: "08:00", end: "22:00", is24Hours: false },
                    saturday: { start: "09:00", end: "21:00", is24Hours: false },
                    sunday: { start: "10:00", end: "20:00", is24Hours: false }
                },
                license: {
                    number: "DL002MP2024",
                    type: "pharmacy_license",
                    issueDate: new Date("2024-01-01"),
                    expiryDate: new Date("2026-12-31"),
                    issuingAuthority: "Delhi Drug Control Department"
                },
                owner: {
                    name: "Dr. Priya Sharma",
                    qualification: "PharmD",
                    phone: "919876543251",
                    email: "priya@medicare.com",
                    pharmacistLicense: "PH002PS"
                },
                website: "https://medicare.com",
                description: "Comprehensive pharmacy services with specialized care products and expert consultation.",
                paymentMethods: ["cash", "card", "upi", "net_banking"],
                isActive: true,
                isVerified: true,
                createdBy: adminUser._id
            },
            {
                name: "QuickMeds Pharmacy",
                licenseNumber: "QM003LIC",
                email: "support@quickmeds.com",
                phone: "919876543260",
                address: {
                    street: "303 Quick Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "560002",
                    country: "India"
                },
                shopType: "retail",
                establishedYear: 2020,
                operatingHours: {
                    monday: { start: "07:00", end: "23:00", is24Hours: false },
                    tuesday: { start: "07:00", end: "23:00", is24Hours: false },
                    wednesday: { start: "07:00", end: "23:00", is24Hours: false },
                    thursday: { start: "07:00", end: "23:00", is24Hours: false },
                    friday: { start: "07:00", end: "23:00", is24Hours: false },
                    saturday: { start: "08:00", end: "22:00", is24Hours: false },
                    sunday: { start: "09:00", end: "21:00", is24Hours: false }
                },
                license: {
                    number: "DL003QM2024",
                    type: "drug_license",
                    issueDate: new Date("2024-01-01"),
                    expiryDate: new Date("2026-12-31"),
                    issuingAuthority: "Karnataka State Pharmacy Council"
                },
                owner: {
                    name: "Mr. Suresh Kumar",
                    qualification: "M.Pharm",
                    phone: "919876543261",
                    email: "suresh@quickmeds.com",
                    pharmacistLicense: "PH003SK"
                },
                website: "https://quickmeds.com",
                description: "Fast and reliable pharmacy service with online ordering and quick delivery options.",
                paymentMethods: ["cash", "card", "upi", "net_banking", "digital_wallet"],
                isActive: true,
                isVerified: true,
                createdBy: adminUser._id
            }
        ];

        // Clear existing data (for fresh seeding)
        await Hospital.deleteMany({});
        await Shop.deleteMany({});
        

        // Create hospitals
        const createdHospitals = await Hospital.insertMany(hospitalsData);
        

        // Create shops
        const createdShops = await Shop.insertMany(shopsData);
        

        // Create admin users for hospitals and shops
        const hospitalAdmins = [];
        const shopAdmins = [];        for (let i = 0; i < createdHospitals.length; i++) {
            const hospital = createdHospitals[i];
            const adminData = {
                email: `hospital${i + 1}@medtrax.com`,
                password: 'Hospital@123',
                role: 'hospital_admin',
                firstName: `Hospital${i + 1}`,
                lastName: 'Admin',
                phone: `9876543${270 + i}0`, // Fixed phone format
                hospitalId: hospital._id,
                isActive: true
            };
            
            try {
                const admin = await User.create(adminData);
                hospitalAdmins.push(admin);
                
            } catch (error) {
                if (error.code !== 11000) { // Skip duplicate email errors
                    console.error(`Error creating hospital admin: ${error.message}`);
                }
            }
        }

        for (let i = 0; i < createdShops.length; i++) {
            const shop = createdShops[i];
            const adminData = {
                email: `shop${i + 1}@medtrax.com`,
                password: 'Shop@123',
                role: 'shop_admin',
                firstName: `Shop${i + 1}`,
                lastName: 'Admin',
                phone: `9876543${280 + i}0`, // Fixed phone format
                shopId: shop._id,
                isActive: true
            };
            
            try {
                const admin = await User.create(adminData);
                shopAdmins.push(admin);
                
            } catch (error) {
                if (error.code !== 11000) { // Skip duplicate email errors
                    console.error(`Error creating shop admin: ${error.message}`);
                }
            }
        }

        
        
        
        
        
        
        
        
        
        
        hospitalAdmins.forEach((admin, index) => {
            
        });
        
        
        shopAdmins.forEach((admin, index) => {
            
        });
        
        
        
        
        
        
        

    } catch (error) {
        console.error('❌ Error seeding sample data:', error.message);
        console.error(error.stack);
    }
};

// Command line interface
const command = process.argv[2];

const runSeeder = async (seedFunction, name) => {
    try {
        await connectDB();
        await seedFunction();
        
    } catch (error) {
        console.error(`❌ Error in ${name}:`, error.message);
    } finally {
        await mongoose.connection.close();
        
    }
};

switch (command) {
    case 'admin':
        runSeeder(seedSuperAdmin, 'Super Admin creation');
        break;
    case 'sample':
        runSeeder(seedSampleData, 'Sample data seeding');
        break;
    case 'all':
        (async () => {
            try {
                await connectDB();
                await seedSuperAdmin();
                await seedSampleData();
                
            } catch (error) {
                console.error('❌ Error in complete seeding:', error.message);
            } finally {
                await mongoose.connection.close();
                
            }
        })();
        break;
    default:
        
        
        
        
        
        
        
        break;
}

module.exports = {
    seedSuperAdmin,
    seedSampleData
};
