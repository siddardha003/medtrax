import User from '../models/User.js'; // Import the User model
import nodemailer from 'nodemailer'; // Import nodemailer
import schedule from 'node-schedule';

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to fetch user email by ID
export const getUserEmailById = async (userId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            throw new Error('User not found');
        }

        // Return the user's email
        return user.email;
    } catch (error) {
        console.error('Error fetching user email:', error.message);
        throw error; // Re-throw error for further handling if needed
    }
};

// Send Email function
export const sendEmail = async (userId, weight) => {
    try {
        // Fetch the user's email using their ID
        const userEmail = await getUserEmailById(userId);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail, // Use the fetched email
            subject: 'Abnormal Weight Change Alert',
            text: `Dear User, your recent weight entry of ${weight} kg indicates an abnormal change. Please consult a doctor for further assistance.`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully'); // Log email sending success
    } catch (error) {
        console.log('Error sending email:', error); // Log any error
    }
};

// Function to send email alert for headaches
export const sendHeadacheAlertEmail = async (userId, painLevel) => {
    try {
        const user = await User.findById(userId);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Headache Alert',
            text: `Dear ${user.name}, you've experienced continuous ${painLevel} headaches. Please consult a doctor.`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending email:', error);
    }
};



// Function to send reminder emails
const sendReminderEmail = async (userEmail, medicineName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Medicine Reminder',
        text: `This is a reminder to take your medicine: ${medicineName}.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent for medicine: ${medicineName}`);
    } catch (error) {
        console.error('Error sending reminder email:', error);
    }
};

// Schedule email reminders for a given medicine
export const scheduleReminders = async (userId, medicineName, timesPerDay, days) => {
    const user = await User.findById(userId);
    const email = user.email;

    const scheduleTimes = {
        earlyMorning: '8:00',
        morning: '9:00',
        afternoon: '13:00',
        night: '20:00',
    };

    timesPerDay.forEach((time) => {
        const reminderTime = scheduleTimes[time];

        for (let i = 0; i < days; i++) {
            const reminderDate = new Date();
            reminderDate.setDate(reminderDate.getDate() + i);

            const job = schedule.scheduleJob(
                { hour: reminderTime.split(':')[0], minute: reminderTime.split(':')[1], date: reminderDate.getDate() },
                () => {
                    sendReminderEmail(email, medicineName);
                }
            );

            console.log(`Scheduled reminder for ${medicineName} at ${reminderTime} on ${reminderDate}`);
        }
    });
};