const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Verify JWT Token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate random password
const generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required type
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Generate confirmation code
const generateConfirmationCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Generate unique ID with prefix
const generateUniqueId = (prefix = '', length = 8) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, length);
    return `${prefix}${timestamp}${random}`.toUpperCase();
};

// Format currency
const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};

// Format date
const formatDate = (date, format = 'short', locale = 'en-IN') => {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    const options = {
        short: { day: '2-digit', month: '2-digit', year: 'numeric' },
        long: { day: 'numeric', month: 'long', year: 'numeric' },
        datetime: { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    };
    
    return new Intl.DateTimeFormat(locale, options[format] || options.short).format(dateObj);
};

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (Indian format)
const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
};

// Sanitize string (remove HTML tags, trim, etc.)
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    return str
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>]/g, '') // Remove angle brackets
        .trim();
};

// Generate pagination info
const getPaginationInfo = (page = 1, limit = 10, total = 0) => {
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const totalPages = Math.ceil(total / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, total);
    
    return {
        currentPage,
        itemsPerPage,
        totalItems: total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        startIndex,
        endIndex,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null
    };
};

// Convert string to slug
const slugify = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Deep clone object
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Remove sensitive data from user object
const sanitizeUser = (user) => {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordExpire;
    return userObj;
};

// Check if date is in the past
const isPastDate = (date) => {
    return new Date(date) < new Date();
};

// Check if date is in the future
const isFutureDate = (date) => {
    return new Date(date) > new Date();
};

// Get date range for reports
const getDateRange = (period = 'month') => {
    const now = new Date();
    const startDate = new Date();
    const endDate = new Date();
    
    switch (period) {
        case 'today':
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        default:
            startDate.setMonth(now.getMonth() - 1);
    }
    
    return { startDate, endDate };
};

// Generate hash for sensitive data
const generateHash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

// Generate random string
const generateRandomString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

// Validate GST number
const isValidGSTNumber = (gstNumber) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
};

// Format phone number
const formatPhoneNumber = (phone) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
        return `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('091')) {
        return `+${cleaned.slice(1)}`;
    }
    
    return phone; // Return original if can't format
};

// Check if business hours
const isBusinessHours = (operatingHours) => {
    const now = new Date();
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert to HHMM format
    
    const dayHours = operatingHours[currentDay];
    if (!dayHours || dayHours.isClosed) {
        return false;
    }
    
    if (dayHours.is24Hours) {
        return true;
    }
    
    const startTime = parseInt(dayHours.start.replace(':', ''));
    const endTime = parseInt(dayHours.end.replace(':', ''));
    
    return currentTime >= startTime && currentTime <= endTime;
};

module.exports = {
    generateToken,
    verifyToken,
    generateRandomPassword,
    generateConfirmationCode,
    generateUniqueId,
    formatCurrency,
    formatDate,
    calculateAge,
    isValidEmail,
    isValidPhone,
    sanitizeString,
    getPaginationInfo,
    slugify,
    deepClone,
    sanitizeUser,
    isPastDate,
    isFutureDate,
    getDateRange,
    generateHash,
    generateRandomString,
    isValidGSTNumber,
    formatPhoneNumber,
    isBusinessHours
};
