import React from 'react';
import SectionHeading from '../components/SectionHeading';
import Accordion from '../components/Accordion'

const faqData = {
    title: 'Frequently Asked Questions',
    img: 'images/faq-img.png',
    bgImg: 'shape/faq-bg.svg',
    faqItems: [
        {
            title: 'What is MedTrax and how does it work?',
            content: `MedTrax is a comprehensive healthcare management platform that integrates hospitals, medical shops, and health tracking tools into a single platform. It provides online/offline doctor interactions, AI-assisted prescription predictions, health tracking features, and medication reminders. Users can book appointments, find nearby medical shops, track their health metrics, and receive smart medication recommendations based on symptoms.`,
        },
        {
            title: 'How do I book an appointment with a hospital?',
            content: `To book an appointment, first browse the hospital listings on our platform. Select your preferred hospital and department (Cardiology, Neurology, Pediatrics, etc.). Choose an available doctor and time slot. Fill in your personal details including name, email, phone number, and any additional notes. Once submitted, you'll receive a confirmation with a unique booking code. You can also call the hospital directly to confirm your appointment.`,
        },
        {
            title: 'How does the AI prescription prediction work?',
            content: `Our AI-powered symptom checker analyzes your symptoms, age, duration of illness, and severity level to provide medication recommendations. Simply select your symptoms from our comprehensive database, enter your age and how long you've been experiencing symptoms, and choose the severity level. The AI model will then suggest appropriate medications and precautions. However, these are recommendations only - always consult a healthcare professional before taking any medication.`,
        },
        {
            title: 'What health tracking features are available?',
            content: `MedTrax offers comprehensive health tracking including weight monitoring, hormonal level tracking, sleep cycle analysis, stress level assessment, and stomach health monitoring. You can record daily measurements, view historical trends, and track your progress over time. The system provides visual charts and insights to help you understand your health patterns and make informed decisions about your wellness journey.`,
        },
        {
            title: 'How do I set up medication reminders?',
            content: `Navigate to the Medical Reminder section and click "Add New Reminder." Enter your medication name, upload an image if needed, set the start and end dates, specify the times you need to take the medication, and select the days of the week. The system will send you timely notifications on your mobile device to ensure you never miss a dose. You can also edit or delete reminders as needed.`,
        },
        {
            title: 'Can I find medical shops and check medicine availability?',
            content: `Yes! Browse our medical shop listings to find pharmacies near you. Each shop displays their available medicines, prices, and stock status. You can search by location, shop name, or specific medicines. The platform shows real-time availability including "In Stock," "Limited Stock," or "Out of Stock" status. Contact the shop directly to confirm availability and place orders.`,
        },
        {
            title: 'What if I need emergency medical care?',
            content: `For medical emergencies, please call emergency services (108 in India) immediately. MedTrax is designed for non-emergency healthcare management. While we provide symptom checking and health tracking tools, these should not replace professional medical care in emergency situations. Always prioritize contacting emergency services for urgent medical needs.`,
        },
        {
            title: 'Can I track my baby\'s development and vaccination schedule?',
            content: `Yes! MedTrax includes specialized baby development tracking features. You can monitor your baby's weekly development progress, track vaccination schedules, and receive reminders for important milestones. The platform provides detailed information about each developmental stage, including size comparisons, symptoms to expect, and helpful tips for parents.`,
        },
    ],
};

const Faq = () => {

    return (
        <div className='blog-container'>
            <SectionHeading title="Help Center & FAQs"
             subTitle="Explore detailed explanations to common concerns and how-tos"/>
            <Accordion data={faqData} />
        </div>
    );
};

export default Faq;
