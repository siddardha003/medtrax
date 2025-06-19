const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
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

const User = mongoose.model('User', userSchema);

// Seed Super Admin
const seedSuperAdmin = async () => {
    try {
        await connectDB();

        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
        
        if (existingSuperAdmin) {
            console.log('🔍 Super Admin already exists:');
            console.log(`   Email: ${existingSuperAdmin.email}`);
            console.log(`   Name: ${existingSuperAdmin.firstName} ${existingSuperAdmin.lastName}`);
            console.log('✅ No need to create a new super admin');
            return;
        }

        // Create default super admin
        const superAdminData = {
            email: 'admin@medtrax.com',
            password: 'Admin@123', // Change this in production
            role: 'super_admin',
            firstName: 'System',
            lastName: 'Administrator',
            phone: '+91-9999999999',
            isActive: true
        };

        const superAdmin = await User.create(superAdminData);

        console.log('🎉 Super Admin created successfully!');
        console.log('📧 Email:', superAdmin.email);
        console.log('🔑 Password:', 'Admin@123');
        console.log('👤 Name:', `${superAdmin.firstName} ${superAdmin.lastName}`);
        console.log('🆔 User ID:', superAdmin._id);
        console.log('');
        console.log('⚠️  IMPORTANT SECURITY NOTICE:');
        console.log('   1. Please change the default password after first login');
        console.log('   2. Update the email configuration in .env file');
        console.log('   3. This is for development purposes only');
        console.log('');
        console.log('🚀 You can now start the server and login with these credentials');

    } catch (error) {
        console.error('❌ Error creating super admin:', error.message);
        
        if (error.code === 11000) {
            console.log('📧 Email already exists. Super admin might already be created.');
        }
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Seed sample data (optional)
const seedSampleData = async () => {
    try {
        await connectDB();

        console.log('🌱 Seeding sample data...');
        
        // You can add sample hospitals, shops, etc. here if needed
        // For now, we'll just create the super admin
        
        console.log('✅ Sample data seeding completed');

    } catch (error) {
        console.error('❌ Error seeding sample data:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

// Command line interface
const command = process.argv[2];

switch (command) {
    case 'admin':
        seedSuperAdmin();
        break;
    case 'sample':
        seedSampleData();
        break;
    case 'all':
        (async () => {
            await seedSuperAdmin();
            await seedSampleData();
        })();
        break;
    default:
        console.log('📖 Usage:');
        console.log('   npm run seed admin  - Create super admin user');
        console.log('   npm run seed sample - Seed sample data');
        console.log('   npm run seed all    - Do both');
        console.log('');
        console.log('🔧 Make sure MongoDB is running and .env file is configured');
        break;
}

module.exports = {
    seedSuperAdmin,
    seedSampleData
};
