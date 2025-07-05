import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { getPublicHospitalDetailsApi, createAppointmentApi } from '../../Api';
import { useSelector } from 'react-redux';
import '../css/AppForm.css';
import useAuth from '../../hooks/useAuth';

export default function AppForm() {
    const { isAuthenticated, user } = useAuth();
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const location = useLocation();
    const hospitalId = id || searchParams.get('hospitalId');
    const passedHospital = location.state?.hospital;

    // const user = useSelector(state => state.user.user);
    const [hospital, setHospital] = useState(passedHospital || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [department, setDepartment] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        time: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHospital = async () => {
            if (hospitalId && !hospital) {
                try {
                    const response = await getPublicHospitalDetailsApi(hospitalId);
                    setHospital(response.data);
                } catch (err) {
                    console.error('Error fetching hospital:', err);
                    setError('Failed to load hospital details');
                }
            }
        };

        fetchHospital();
    }, [hospitalId, hospital]);

    useEffect(() => {
        if (department && selectedDate && hospital) {
            fetchDoctors();
        }
    }, [department, selectedDate, hospital]);

    const fetchDoctors = async () => {
        try {
            const serviceData = hospital.services?.find(service =>
                service.category.toLowerCase() === department.toLowerCase()
            );

            if (serviceData && serviceData.doctors) {
                setDoctors(serviceData.doctors);
            } else {
                const availableDoctors = [
                    { id: 'doctor1', name: 'Dr. Sarayu' },
                    { id: 'doctor2', name: 'Dr. Siddhu' },
                    { id: 'doctor3', name: 'Dr. Rishitha' },
                ];
                setDoctors(availableDoctors);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setDoctors([]);
        }
    };

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchTimeSlots();
            setFormData(prev => ({ ...prev, time: '' }));
        }
    }, [selectedDoctor, selectedDate]);

    useEffect(() => {
        setSelectedDoctor('');
        setFormData(prev => ({ ...prev, time: '' }));
    }, [department]);

    const fetchTimeSlots = async () => {
        try {
            // Convert selectedDate (string) to Date object for formatting
            const dateObj = new Date(selectedDate);
            const formattedDate = !isNaN(dateObj) ? dateObj.toISOString().split('T')[0] : selectedDate; // fallback if invalid
            const fetchUrl = `/api/public/hospital/${hospitalId}/doctor/${selectedDoctor}/available-slots?date=${formattedDate}`;
            console.log('Fetching time slots from:', fetchUrl); // Debugging
            // Get the doctor's available slots for the selected date
            const response = await fetch(fetchUrl);
            const data = await response.json();
            if (data.success) {
                setTimeSlots(data.slots || []);
                setBookedSlots(data.bookedSlots || []);
            } else {
                // Fallback to default slots if API fails
                const availableTimeSlots = ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];
                setTimeSlots(availableTimeSlots);
                setBookedSlots([]);
            }
        } catch (error) {
            console.error('Error fetching time slots:', error);
            // Fallback to default slots
            const availableTimeSlots = ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];
            setTimeSlots(availableTimeSlots);
            setBookedSlots([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('Please login to book an appointment');
            return;
        }

        if (!hospitalId || !selectedDate || !department || !selectedDoctor) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const dateObj = new Date(selectedDate);
            if (isNaN(dateObj.getTime())) {
                setError('Please select a valid date');
                setLoading(false);
                return;
            }
            const appointmentData = {
                hospitalId,
                doctorId: selectedDoctor,
                department,
                appointmentDate: dateObj.toISOString(),
                appointmentTime: formData.time,
                patientName: formData.name,
                patientPhone: formData.phone,
                patientEmail: formData.email,
                notes: formData.notes,
                status: 'pending'
            };

            await createAppointmentApi(appointmentData);
            alert('Appointment booked successfully!');

            setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                time: '',
                notes: ''
            });
            setSelectedDate(null);
            setDepartment('');
            setSelectedDoctor('');

        } catch (err) {
            console.error('Error booking appointment:', err);
            if (err.response?.status === 409) {
                setError('This time slot is already booked. Please select a different time.');
                // Refresh available slots
                fetchTimeSlots();
            } else {
                setError('Failed to book appointment. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* User Status Indicator */}
            <div className="container">
                <div className="user-status-indicator" style={{
                    textAlign: 'center',
                    padding: '10px',
                    marginBottom: '20px',
                    backgroundColor: isAuthenticated ? '#e8f5e8' : '#fff3cd',
                    border: `1px solid ${isAuthenticated ? '#d4edda' : '#ffeaa7'}`,
                    borderRadius: '5px',
                    fontSize: '14px'
                }}>
                    {isAuthenticated ? (
                        <span style={{ color: '#155724' }}>
                            ✓ Logged in as {user?.name || 'User'} - Your health data will be saved permanently
                        </span>
                    ) : (
                        <span style={{ color: '#856404' }}>
                            ⚠️ You're browsing as a guest - Please log in to save your health data permanently
                        </span>
                    )}
                </div>
            </div>
            <div className="appointment-form-container">
                <div className="form-header">
                    <h1 className="form-main-heading">Book an</h1>
                    <h2 className="form-sub-heading">Appointment</h2>
                </div>

                <form onSubmit={handleSubmit} className="form-card">
                    <div className="form-grid">
                        {/* Name Field */}
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="David John"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="(123) 456 - 789"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-group">
                            <label className="form-label">E-Mail</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Hospital Field */}
                        <div className="form-group">
                            <label className="form-label">Hospital</label>
                            <input
                                type="text"
                                className="form-input"
                                value={hospital ? hospital.name : 'Loading...'}
                                disabled={true}
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#666',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </div>

                        {/* Preferred Date Field */}
                        <div className="form-group">
                            <label className="form-label">Preferred Date</label>
                            <div className="date-picker-container">
                                <input
                                    type="date"
                                    value={selectedDate || ''}
                                    onChange={e => setSelectedDate(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Department Dropdown */}
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select
                                className="form-input form-select"
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Department</option>
                                {hospital?.services?.map((service, index) => (
                                    <option key={index} value={service.category}>{service.category}</option>
                                )) || (
                                        <>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Neurology">Neurology</option>
                                        </>
                                    )}
                            </select>
                        </div>

                        {/* Doctor Dropdown */}
                        {department && (
                            <div className="form-group">
                                <label className="form-label">Choose a Doctor</label>
                                <select
                                    className="form-input form-select"
                                    name="doctor"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Doctor</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                                            {doctor.name} {doctor.degree && `- ${doctor.degree}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Time Slot Dropdown */}
                        {(selectedDoctor && selectedDate) && (
                            <div className="form-group">
                                <label className="form-label">Choose a Time Slot</label>
                                {/* Compute all slots to render (union of available and booked, no duplicates) */}
                                {timeSlots.length === 0 && bookedSlots.length === 0 && (
                                    <div className="error-message">This doctor doesn't have any slots on that day, try for another doctor.</div>
                                )}
                                {(timeSlots.length > 0 || bookedSlots.length > 0) && (
                                    (() => {
                                        const allSlots = timeSlots.concat(bookedSlots.filter(slot => !timeSlots.includes(slot)));
                                        const allBooked = allSlots.length > 0 && allSlots.every(slot => bookedSlots.includes(slot));
                                        return (
                                            <>
                                                <select
                                                    className="form-input form-select"
                                                    name="time"
                                                    value={formData.time}
                                                    onChange={e => {
                                                        const selectedSlot = e.target.value;
                                                        setFormData({ ...formData, time: selectedSlot });
                                                        // Show error if slot is booked
                                                        if (timeSlots.includes(selectedSlot)) {
                                                            setError('');
                                                        } else if (bookedSlots.includes(selectedSlot)) {
                                                            setError('This slot is already booked. Please select a different time.');
                                                        } else {
                                                            setError('This slot is not available. Please select a different time.');
                                                        }
                                                    }}
                                                    required
                                                >
                                                    <option value="" disabled>Select Time Slot</option>
                                                    {allSlots.map((slot, idx, arr) => {
                                                        if (arr.indexOf(slot) !== idx) return null; // remove duplicates
                                                        const isBooked = bookedSlots.includes(slot);
                                                        return (
                                                            <option key={slot + idx} value={slot} disabled={isBooked} style={isBooked ? { color: 'gray' } : {}}>
                                                                {slot} {isBooked ? '(already booked)' : ''}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                {allBooked && (
                                                    <div className="error-message">All slots are booked for this day. Please select another date or doctor.</div>
                                                )}
                                            </>
                                        );
                                    })()
                                )}
                            </div>
                        )}

                        {/* Notes Field */}
                        <div className="form-group full-width">
                            <label className="form-label">Additional Notes</label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Any additional information"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="form-group full-width">
                                <div className="error-message">{error}</div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="form-group full-width">
                            <button className="submit-button" type="submit" disabled={loading}>
                                <span>{loading ? 'Booking...' : 'Submit Appointment'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
}