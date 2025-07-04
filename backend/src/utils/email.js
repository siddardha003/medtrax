const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        secure: true,
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Send email function
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `${options.fromName || 'MedTrax'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
            text: options.text
        };

        const info = await transporter.sendMail(mailOptions);
        
        
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

// Email templates
const emailTemplates = {
    // Welcome email for new users
    welcomeUser: (user, password) => ({
        subject: 'Welcome to MedTrax - Your Account Credentials',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Welcome to MedTrax</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f8f9fa; }
                    .credentials { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to MedTrax</h1>
                        <p>Centralized Hospital Management System</p>
                    </div>
                    <div class="content">
                        <h2>Hello ${user.firstName} ${user.lastName},</h2>
                        <p>Welcome to MedTrax! Your account has been successfully created. Below are your login credentials:</p>
                        
                        <div class="credentials">
                            <h3>Login Credentials:</h3>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Password:</strong> ${password}</p>
                            <p><strong>Role:</strong> ${user.role.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        
                        <p><strong>Important Security Notice:</strong></p>
                        <ul>
                            <li>Please change your password after your first login</li>
                            <li>Keep your credentials secure and confidential</li>
                            <li>Do not share your login details with anyone</li>
                        </ul>
                        
                        <p>You can now access the MedTrax system using these credentials.</p>
                        
                        <p>If you have any questions or need assistance, please contact our support team.</p>
                        
                        <p>Best regards,<br>The MedTrax Team</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent from MedTrax System. Please do not reply to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} MedTrax. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Welcome to MedTrax!

Hello ${user.firstName} ${user.lastName},

Your account has been successfully created. Here are your login credentials:

Email: ${user.email}
Password: ${password}
Role: ${user.role.replace('_', ' ').toUpperCase()}

Important: Please change your password after your first login for security purposes.

Best regards,
The MedTrax Team
        `
    }),

    // Appointment confirmation email
    appointmentConfirmation: (appointment) => ({
        subject: `Appointment Confirmation - ${appointment.confirmationCode}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f8f9fa; }
                    .appointment-details { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    .confirmation-code { font-size: 24px; font-weight: bold; text-align: center; background-color: #007bff; color: white; padding: 15px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Appointment Confirmed</h1>
                    </div>
                    <div class="content">
                        <h2>Dear ${appointment.patient.firstName} ${appointment.patient.lastName},</h2>
                        <p>Your appointment has been successfully booked. Please find the details below:</p>
                        
                        <div class="confirmation-code">
                            Confirmation Code: ${appointment.confirmationCode}
                        </div>
                        
                        <div class="appointment-details">
                            <h3>Appointment Details:</h3>
                            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
                            <p><strong>Department:</strong> ${appointment.department.toUpperCase()}</p>
                            <p><strong>Visit Type:</strong> ${appointment.visitType.replace('_', ' ').toUpperCase()}</p>
                            <p><strong>Reason:</strong> ${appointment.reasonForVisit}</p>
                        </div>
                        
                        <h3>Important Instructions:</h3>
                        <ul>
                            <li>Please arrive 15 minutes before your appointment time</li>
                            <li>Bring a valid ID and any relevant medical documents</li>
                            <li>Bring your confirmation code: <strong>${appointment.confirmationCode}</strong></li>
                        </ul>
                        
                        <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
                        
                        <p>Thank you for choosing our services.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    // Order confirmation email
    orderConfirmation: (order) => ({
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .order-summary { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    .item { border-bottom: 1px solid #dee2e6; padding: 10px 0; }
                    .total { font-weight: bold; font-size: 18px; text-align: right; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Order Confirmed</h1>
                        <p>Order #${order.orderNumber}</p>
                    </div>
                    <div class="content">
                        <h2>Dear ${order.customer.firstName} ${order.customer.lastName},</h2>
                        <p>Thank you for your order. Your order has been confirmed and is being processed.</p>
                        
                        <div class="order-summary">
                            <h3>Order Summary:</h3>
                            ${order.items.map(item => `
                                <div class="item">
                                    <p><strong>${item.name}</strong></p>
                                    <p>Quantity: ${item.quantity} | Price: ₹${item.pricing.unitPrice} | Total: ₹${item.pricing.totalAmount}</p>
                                </div>
                            `).join('')}
                            
                            <div class="total">
                                <p>Total Amount: ₹${order.totals.finalAmount}</p>
                            </div>
                        </div>
                        
                        <p><strong>Payment Method:</strong> ${order.payment.method.toUpperCase()}</p>
                        <p><strong>Order Status:</strong> ${order.status.toUpperCase()}</p>
                        
                        ${order.fulfillmentType === 'delivery' ? `
                            <p><strong>Delivery Address:</strong><br>
                            ${order.delivery.address.street}<br>
                            ${order.delivery.address.city}, ${order.delivery.address.state} ${order.delivery.address.zipCode}</p>
                        ` : '<p><strong>Pickup:</strong> Please collect your order from our store.</p>'}
                        
                        <p>We will notify you once your order is ready for ${order.fulfillmentType}.</p>
                        
                        <p>Thank you for choosing our pharmacy!</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),    // Password reset email
    passwordReset: (user, resetToken) => ({
        subject: 'Password Reset Request - MedTrax',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .reset-link { background-color: #dc3545; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
                    .reset-link a { color: white; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${user.firstName},</h2>
                        <p>You have requested to reset your password for your MedTrax account.</p>
                        
                        <div class="reset-link">
                            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Reset Your Password</a>
                        </div>
                        
                        <p>This link will expire in 10 minutes for security purposes.</p>
                        
                        <p>If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
                        
                        <p>For security reasons, please do not share this email with anyone.</p>
                        
                        <p>Best regards,<br>The MedTrax Team</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    // OTP verification email
    otpVerification: (user, otp) => ({
        subject: 'Email Verification - MedTrax OTP',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f8f9fa; }
                    .otp-code { font-size: 32px; font-weight: bold; text-align: center; background-color: #007bff; color: white; padding: 20px; border-radius: 10px; margin: 20px 0; letter-spacing: 8px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Email Verification</h1>
                        <p>MedTrax Account Security</p>
                    </div>
                    <div class="content">
                        <h2>Hello ${user.firstName},</h2>
                        <p>To complete your sign-in process, please use the verification code below:</p>
                        
                        <div class="otp-code">
                            ${otp}
                        </div>
                        
                        <div class="warning">
                            <h3>⚠️ Important Security Information:</h3>
                            <ul>
                                <li>This code will expire in <strong>5 minutes</strong></li>
                                <li>Do not share this code with anyone</li>
                                <li>If you didn't request this code, please ignore this email</li>
                                <li>For your security, never provide this code over phone or email</li>
                            </ul>
                        </div>
                        
                        <p>If you're having trouble with verification, you can request a new code from the sign-in page.</p>
                        
                        <p>Thank you for keeping your MedTrax account secure!</p>
                        
                        <p>Best regards,<br>The MedTrax Security Team</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent from MedTrax System. Please do not reply to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} MedTrax. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
MedTrax Email Verification

Hello ${user.firstName},

Your verification code is: ${otp}

This code will expire in 5 minutes. Do not share this code with anyone.

If you didn't request this code, please ignore this email.

Best regards,
The MedTrax Team
        `
    })
};

// Send welcome email to new user
const sendWelcomeEmail = async (user, password) => {
    const template = emailTemplates.welcomeUser(user, password);
    return await sendEmail({
        email: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text
    });
};

// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointment) => {
    const template = emailTemplates.appointmentConfirmation(appointment);
    return await sendEmail({
        email: appointment.patient.email,
        subject: template.subject,
        html: template.html
    });
};

// Send order confirmation email
const sendOrderConfirmation = async (order) => {
    if (!order.customer.email) return null;
    
    const template = emailTemplates.orderConfirmation(order);
    return await sendEmail({
        email: order.customer.email,
        subject: template.subject,
        html: template.html
    });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
    const template = emailTemplates.passwordReset(user, resetToken);
    return await sendEmail({
        email: user.email,
        subject: template.subject,
        html: template.html
    });
};

// Send OTP verification email
const sendOTPEmail = async (user, otp) => {
    const template = emailTemplates.otpVerification(user, otp);
    return await sendEmail({
        email: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text
    });
};

// Test email configuration
const testEmailConfig = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        
        return true;
    } catch (error) {
        console.error('❌ Email configuration error:', error.message);
        return false;
    }
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendAppointmentConfirmation,
    sendOrderConfirmation,
    sendPasswordResetEmail,
    sendOTPEmail,
    testEmailConfig,
    emailTemplates
};
