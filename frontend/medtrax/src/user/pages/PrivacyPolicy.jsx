import React from 'react';
import SectionHeading from '../components/SectionHeading';
import '../css/PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-container">
            <div className="st-height-b120 st-height-lg-b50" />
            <SectionHeading
                title="Privacy Policy"
                subTitle="Your privacy and data security are our top priorities. This policy explains how we collect, use, and protect your information."
            />

            <div className="privacy-content">
                <div className="policy-section">
                    <h2>1. Information We Collect</h2>
                    <div className="policy-subsection">
                        <h3>1.1 Personal Information</h3>
                        <p>We collect information you provide directly to us, including:</p>
                        <ul>
                            <li>Name, email address, and phone number for account creation</li>
                            <li>Date of birth and gender for health tracking features</li>
                            <li>Medical history, allergies, and current medications</li>
                            <li>Appointment booking information and preferences</li>
                            <li>Health tracking data (weight, sleep, stress levels, etc.)</li>
                            <li>Medication reminder schedules and preferences</li>
                        </ul>
                    </div>

                    <div className="policy-subsection">
                        <h3>1.2 Health Data</h3>
                        <p>MedTrax collects sensitive health information to provide personalized services:</p>
                        <ul>
                            <li>Symptom information for AI prescription predictions</li>
                            <li>Health metrics and tracking data</li>
                            <li>Baby development and vaccination records</li>
                            <li>Medical appointment history and notes</li>
                            <li>Medication schedules and adherence data</li>
                        </ul>
                    </div>

                    <div className="policy-subsection">
                        <h3>1.3 Technical Information</h3>
                        <p>We automatically collect certain technical information:</p>
                        <ul>
                            <li>Device information and IP addresses</li>
                            <li>Browser type and operating system</li>
                            <li>Usage patterns and feature interactions</li>
                            <li>Location data (with your consent) for finding nearby hospitals and pharmacies</li>
                        </ul>
                    </div>
                </div>

                <div className="policy-section">
                    <h2>2. How We Use Your Information</h2>
                    <div className="policy-subsection">
                        <h3>2.1 Service Provision</h3>
                        <ul>
                            <li>Process and manage your account and profile</li>
                            <li>Facilitate hospital appointments and communications</li>
                            <li>Provide AI-powered symptom analysis and prescription recommendations</li>
                            <li>Enable health tracking and generate insights</li>
                            <li>Send medication reminders and health notifications</li>
                            <li>Connect you with nearby medical shops and pharmacies</li>
                        </ul>
                    </div>

                    <div className="policy-subsection">
                        <h3>2.2 Communication</h3>
                        <ul>
                            <li>Send appointment confirmations and updates</li>
                            <li>Provide medication reminders and health alerts</li>
                            <li>Share important health information and tips</li>
                            <li>Respond to your inquiries and support requests</li>
                        </ul>
                    </div>

                    <div className="policy-subsection">
                        <h3>2.3 Service Improvement</h3>
                        <ul>
                            <li>Analyze usage patterns to improve our services</li>
                            <li>Develop new features and functionality</li>
                            <li>Conduct research to enhance healthcare outcomes</li>
                            <li>Ensure platform security and prevent fraud</li>
                        </ul>
                    </div>
                </div>

                <div className="policy-section">
                    <h2>3. Information Sharing and Disclosure</h2>
                    <div className="policy-subsection">
                        <h3>3.1 Healthcare Providers</h3>
                        <p>We may share your information with healthcare providers when:</p>
                        <ul>
                            <li>You explicitly authorize the sharing</li>
                            <li>It's necessary for appointment scheduling and management</li>
                            <li>Required for emergency medical situations</li>
                            <li>Needed to provide coordinated care</li>
                        </ul>
                    </div>

                    <div className="policy-subsection">
                        <h3>3.2 Legal Requirements</h3>
                        <p>We may disclose your information when required by law:</p>
                        <ul>
                            <li>To comply with legal obligations and court orders</li>
                            <li>To protect public health and safety</li>
                            <li>To investigate and prevent fraud or abuse</li>
                            <li>To respond to government requests</li>
                        </ul>
                    </div>

                    <div className="policy-subsection">
                        <h3>3.3 Third-Party Services</h3>
                        <p>We work with trusted third-party services for:</p>
                        <ul>
                            <li>Cloud storage and data processing</li>
                            <li>Payment processing (if applicable)</li>
                            <li>Analytics and service improvement</li>
                            <li>Communication services (email, SMS)</li>
                        </ul>
                        <p>All third-party providers are bound by strict confidentiality agreements.</p>
                    </div>
                </div>

                <div className="policy-section">
                    <h2>4. Data Security and Protection</h2>
                    <div className="policy-subsection">
                        <h3>4.1 Security Measures</h3>
                        <p>We implement comprehensive security measures to protect your data:</p>
                        <ul>
                            <li>End-to-end encryption for all sensitive data</li>
                            <li>Secure HTTPS connections for all communications</li>
                            <li>Regular security audits and vulnerability assessments</li>
                            <li>Access controls and authentication protocols</li>
                            <li>Data backup and disaster recovery procedures</li>
                        </ul>
                    </div>

                    <div className="policy-subsection">
                        <h3>4.2 Data Retention</h3>
                        <p>We retain your information for as long as necessary to:</p>
                        <ul>
                            <li>Provide our services and maintain your account</li>
                            <li>Comply with legal and regulatory requirements</li>
                            <li>Resolve disputes and enforce agreements</li>
                            <li>Improve our services and develop new features</li>
                        </ul>
                        <p>You can request deletion of your data at any time.</p>
                    </div>
                </div>

                <div className="policy-section">
                    <h2>5. Your Rights and Choices</h2>
                    <div className="policy-subsection">
                        <h3>5.1 Access and Control</h3>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access, update, or correct your personal information</li>
                            <li>Download a copy of your health data</li>
                            <li>Delete your account and associated data</li>
                            <li>Opt out of certain communications</li>
                            <li>Control sharing preferences with healthcare providers</li>
                        </ul>
                    </div>

                    <div className="policy-subsection">
                        <h3>5.2 Consent Management</h3>
                        <p>You can manage your consent preferences:</p>
                        <ul>
                            <li>Withdraw consent for data processing</li>
                            <li>Control location sharing permissions</li>
                            <li>Manage notification preferences</li>
                            <li>Choose what health data to share with providers</li>
                        </ul>
                    </div>
                </div>

                <div className="policy-section">
                    <h2>6. Children's Privacy</h2>
                    <p>MedTrax is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>

                    <p>For users between 13-18 years, we require parental consent for certain features and data collection activities.</p>
                </div>

                <div className="policy-section">
                    <h2>7. International Data Transfers</h2>
                    <p>Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.</p>
                </div>

                <div className="policy-section">
                    <h2>8. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:</p>
                    <ul>
                        <li>Posting the updated policy on our website</li>
                        <li>Sending you an email notification</li>
                        <li>Displaying a notice in the app</li>
                    </ul>
                    <p>Your continued use of MedTrax after such changes constitutes acceptance of the updated policy.</p>
                </div>

                <div className="policy-section">
                    <h2>9. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                    <div className="contact-info">
                        <p><strong>Email:</strong> medtrax_info@gmail.com</p>
                        <p><strong>Phone:</strong> +91-9876543210</p>
                        <p><strong>Address:</strong> MedTrax Healthcare Solutions<br />
                            SRKR Engineering College<br />
                            Bhimavaram, AP, India
                        </p>
                    </div>
                </div>

                <div className="policy-footer">
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    <p>This Privacy Policy is effective as of the date listed above.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy; 