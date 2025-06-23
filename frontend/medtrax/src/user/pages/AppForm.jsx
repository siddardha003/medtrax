import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getPublicHospitalDetailsApi, createAppointmentApi } from '../../Api';
import { useSelector } from 'react-redux';
import '../css/AppForm.css';

export default function AppForm() {
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const location = useLocation();
    const hospitalId = id || searchParams.get('hospitalId');
    const passedHospital = location.state?.hospital;
    
    const user = useSelector(state => state.user.user);
    const [hospital, setHospital] = useState(passedHospital || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [department, setDepartment] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
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
        }
    }, [selectedDoctor]);

    const fetchTimeSlots = async () => {
        const availableTimeSlots = ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];
        setTimeSlots(availableTimeSlots);
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

        if (!hospitalId || !selectedDate || !department || !selectedDoctor || !formData.time) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const appointmentData = {
                hospitalId,
                doctorId: selectedDoctor,
                department,
                appointmentDate: selectedDate.toISOString(),
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
            setTimeSlots([]);
            
        } catch (err) {
            console.error('Error booking appointment:', err);
            setError('Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
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
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                isClearable
                                placeholderText="dd/mm/yyyy"
                                className="form-input"
                                required
                            />
                            <i className="icon">
                                <Icon icon="fa6-solid:calendar-days" />
                            </i>
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
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name} {doctor.degree && `- ${doctor.degree}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Time Slots Dropdown */}
                    {selectedDoctor && (
                        <div className="form-group">
                            <label className="form-label">Available Time Slots</label>
                            <select
                                className="form-input form-select"
                                name="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select Time Slot</option>
                                {timeSlots.map((timeSlot, index) => (
                                    <option key={index} value={timeSlot}>
                                        {timeSlot}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Notes Field */}
                    <div className="form-group full-width">
                        <label className="form-label">Additional Notes</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Any additional information or notes"
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
    );
}